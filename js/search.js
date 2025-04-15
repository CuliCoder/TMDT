import axiosInstance from "./configAxios.js";
document.addEventListener("DOMContentLoaded", async function () {
  const getProductList = async () => {
    try {
      const response = await axiosInstance.get("/product/product_display");
      console.log("📌 Dữ liệu sản phẩm:", response.data);
      return response.data.data;
    } catch (error) {
      console.error("Error fetching product list:", error);
      return [];
    }
  };
  const products = await getProductList();
  const searchInput = document.getElementById("search-input");
  const suggestionsContainer = document.getElementById("search-suggestions");
  const resultsCount = document.getElementById("results-count");
  const viewAllButton = document.querySelector(".view-all-results");

  // Event listeners
  if (searchInput) {
    searchInput.addEventListener("input", handleSearchInput);
    searchInput.addEventListener("focus", function () {
      if (searchInput.value.trim().length > 0) {
        suggestionsContainer.style.display = "block";
      }
    });

    document.addEventListener("click", function (event) {
      if (
        !suggestionsContainer.contains(event.target) &&
        event.target !== searchInput
      ) {
        suggestionsContainer.style.display = "none";
      }
    });

    if (viewAllButton) {
      viewAllButton.addEventListener("click", function () {
        // This would normally redirect to search results page
        alert("Xem tất cả kết quả cho: " + searchInput.value);
      });
    }
  }

  function handleSearchInput() {
    const query = searchInput.value.trim().toLowerCase();

    if (query.length < 2) {
      suggestionsContainer.style.display = "none";
      return;
    }

    const matchedProducts = products.filter(
      (product) =>
        product.ProductName.toLowerCase().includes(query) ||
        product.attributes.some((spec) =>
          spec.values.toLowerCase().includes(query)
        )
    );

    if (matchedProducts.length > 0) {
      renderSuggestions(matchedProducts, query);
      resultsCount.textContent = `${matchedProducts.length} kết quả`;
      suggestionsContainer.style.display = "block";
    } else {
      suggestionsContainer.style.display = "none";
    }
  }

  function renderSuggestions(products, query) {
    // Remove all previous suggestions but keep the footer
    const suggestionFooter =
      suggestionsContainer.querySelector(".suggestion-footer");
    suggestionsContainer.innerHTML = "";

    // Add matched products
    products.slice(0, 5).forEach((product) => {
      let attributes = {
        "Dung lượng RAM": null,
        "Bộ nhớ trong": null,
      };
      product.attributes.forEach((attribute) => {
        if (attributes.hasOwnProperty(attribute.variantName)) {
          attributes[attribute.variantName] = attribute.values;
        }
      });
      let { "Dung lượng RAM": ram, "Bộ nhớ trong": gb } = attributes;
      const name =
        product.ProductName + " " + (ram ? ram : "") + " " + (gb ? gb : "");
      const suggestionItem = document.createElement("div");
      suggestionItem.className = "suggestion-item";
      suggestionItem.innerHTML = `
                <div class="suggestion-image">
                    <img src="http://localhost:3000${
                      product.product_image
                    }" alt="${product.ProductName}" />
                </div>
                <div class="suggestion-info">
                    <div class="suggestion-name">${highlightMatch(
                      name,
                      query
                    )}</div>
                    <div class="suggestion-price">${Number(
                      product.price
                    ).toLocaleString("Vi-VN")}₫</div>
                </div>
            `;

      suggestionItem.addEventListener("click", function () {
        const urls = [
          "smartphone-detail.html",
          "accessories-detail.html",
          "smartphones.html",
          "accessories.html",
        ];
        const currentUrl = window.location.pathname.split("/").pop();
        const isSmartphonePage = urls.includes(currentUrl);
        const url =
          product.category_id === 1
            ? `${isSmartphonePage?'..':'.'}/products/smartphone-detail.html?ProductItemID=${product.id}`
            : `${isSmartphonePage?'..':'.'}/products/phukien-detail.html?ProductItemID=${product.product_id}`;
        window.location.href = url;
      });

      suggestionsContainer.appendChild(suggestionItem);
    });

    // Re-add the footer
    suggestionsContainer.appendChild(suggestionFooter);
  }

  function highlightMatch(text, query) {
    if (!query) return text;

    const regex = new RegExp(`(${query})`, "gi");
    return text.replace(regex, '<span class="highlight">$1</span>');
  }
});
