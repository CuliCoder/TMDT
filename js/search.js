import axiosInstance from "./configAxios.js";
document.addEventListener("DOMContentLoaded", async function () {
  // Sample product data - in a real application, this would come from a database
  // const products = [
  //     {
  //         id: 1,
  //         name: 'Samsung Galaxy S23 Ultra',
  //         price: '26.990.000₫',
  //         originalPrice: '28.990.000₫',
  //         category: 'smartphone',
  //         image: 'fa-mobile-alt',
  //         specs: ['Snapdragon 8 Gen 2', '8GB RAM', '256GB']
  //     },
  //     {
  //         id: 2,
  //         name: 'iPhone 14 Pro Max',
  //         price: '28.990.000₫',
  //         originalPrice: '29.990.000₫',
  //         category: 'smartphone',
  //         image: 'fa-mobile-alt',
  //         specs: ['A16 Bionic', '6GB RAM', '128GB']
  //     },
  //     {
  //         id: 3,
  //         name: 'Xiaomi Redmi Note 12',
  //         price: '4.190.000₫',
  //         originalPrice: '4.990.000₫',
  //         category: 'smartphone',
  //         image: 'fa-mobile-alt',
  //         specs: ['Snapdragon 685', '4GB RAM', '128GB']
  //     },
  //     {
  //         id: 4,
  //         name: 'OPPO Reno8 T',
  //         price: '7.490.000₫',
  //         originalPrice: '8.990.000₫',
  //         category: 'smartphone',
  //         image: 'fa-mobile-alt',
  //         specs: ['Helio G99', '8GB RAM', '256GB']
  //     },
  //     {
  //         id: 5,
  //         name: 'Vivo V25 Pro',
  //         price: '12.790.000₫',
  //         originalPrice: '13.990.000₫',
  //         category: 'smartphone',
  //         image: 'fa-mobile-alt',
  //         specs: ['Dimensity 1300', '8GB RAM', '128GB']
  //     },
  //     {
  //         id: 6,
  //         name: 'MacBook Air M2',
  //         price: '29.990.000₫',
  //         originalPrice: '32.990.000₫',
  //         category: 'laptop',
  //         image: 'fa-laptop',
  //         specs: ['Apple M2', '8GB RAM', '256GB SSD']
  //     },
  //     {
  //         id: 7,
  //         name: 'Dell XPS 13',
  //         price: '33.490.000₫',
  //         originalPrice: '35.990.000₫',
  //         category: 'laptop',
  //         image: 'fa-laptop',
  //         specs: ['Intel Core i7', '16GB RAM', '512GB SSD']
  //     },
  //     {
  //         id: 8,
  //         name: 'ASUS TUF Gaming F15',
  //         price: '19.990.000₫',
  //         originalPrice: '21.990.000₫',
  //         category: 'laptop',
  //         image: 'fa-laptop',
  //         specs: ['Intel Core i5', '8GB RAM', 'RTX 3050']
  //     },
  //     {
  //         id: 9,
  //         name: 'Acer Nitro 5',
  //         price: '22.490.000₫',
  //         originalPrice: '25.990.000₫',
  //         category: 'laptop',
  //         image: 'fa-laptop',
  //         specs: ['AMD Ryzen 7', '16GB RAM', 'RTX 3060']
  //     },
  //     {
  //         id: 10,
  //         name: 'HP Pavilion 15',
  //         price: '16.990.000₫',
  //         originalPrice: '19.990.000₫',
  //         category: 'laptop',
  //         image: 'fa-laptop',
  //         specs: ['Intel Core i5', '8GB RAM', '512GB SSD']
  //     }
  // ];
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
        const url =
          product.category === "smartphone"
            ? "products/smartphone-detail.html"
            : "products/laptop-detail.html";
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
