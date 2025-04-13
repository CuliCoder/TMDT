import axiosInstance from "./configAxios.js";
let filter = {
  brand: "all",
//   price: 0,
  category: 2,
  sort: 1,
};
// const priceFilterArr = [
//   { value: 0, text: "Tất cả" },
//   { value: 2000000, text: "Dưới 2 triệu" },
//   { value: 4000000, text: "2 - 4 triệu" },
//   { value: 7000000, text: "4 - 7 triệu" },
//   { value: 13000000, text: "7 - 13 triệu" },
//   { value: 13000000, text: "Trên 13 triệu" },
// ];
document
  .querySelector(".sort .filter-options")
  .addEventListener("click", (e) => {
    e.preventDefault();
    document.querySelectorAll(".sort .filter-option").forEach((option) => {
      option.classList.remove("active");
    });
    const sortValue = e.target.getAttribute("data-id");
    filter.sort = parseInt(sortValue);
    renderProducts();
    e.target.classList.add("active");
  });
const loadMoreBtn = document.getElementById("load-more-btn");
let pageSize = 20; // Số lượng sản phẩm mỗi lần tải thêm
let products = []; // Mảng chứa tất cả sản phẩm
let brands = []; // Mảng chứa tất cả thương hiệu
let categories = []; // Mảng chứa tất cả danh mục sản phẩm
if (loadMoreBtn) {
  loadMoreBtn.addEventListener("click", () => {
    pageSize += pageSize; // Tăng số lượng sản phẩm mỗi lần tải thêm
    renderProducts(); // Gọi hàm render lại sản phẩm
    if (pageSize >= products.length) {
      loadMoreBtn.style.display = "none"; // Ẩn nút nếu đã tải hết sản phẩm
    }
  });
}
const getCategoryList = async () => {
  try {
    const response = await axiosInstance.get("/categories");
    return response.data;
  } catch (error) {
    console.error("Error fetching category list:", error);
    return [];
  }
};
categories = await getCategoryList();
console.log("📌 Dữ liệu danh mục:", categories);
const renderCategories = async (categories) => {
  const categorySelect = document.querySelector(".category .filter-options");
  categorySelect.innerHTML = ""; // Xóa nội dung hiện tại
  categories.forEach((category, index) => {
    if (index !== 0) {
      let categoryHTML = `<a href="#" class="filter-option ${
        index == 1 ? "active" : ""
      }" data-id=${category.CategoryID} >${category.CategoryName}</a>`;
      categorySelect.innerHTML += categoryHTML;
    }
  });
  document.querySelectorAll(".category .filter-option").forEach((option) => {
    option.addEventListener("click", (e) => {
      e.preventDefault();
      document
        .querySelectorAll(".category .filter-option")
        .forEach((option) => {
          option.classList.remove("active");
        });
      option.classList.add("active");
      const categoryId = option.getAttribute("data-id");
      filter.category = categoryId === "null" ? null : categoryId;
      console.log("categoryId", categoryId);
      renderProducts();
    });
  });
};
renderCategories(categories);
const getProductList = async () => {
  try {
    const response = await axiosInstance.get(
      `/product/product_item_by_categoryID/${filter.category}`
    );
    console.log("📌 Dữ liệu sản phẩm:", response.data);
    return response.data.data;
  } catch (error) {
    console.error("Error fetching product list:", error);
    return [];
  }
};
const filterProducts = () => {
  const filteredProducts = products.filter((product) => {
    let attributes = {
      Hãng: null,
    };
    product.attributes.forEach((attribute) => {
      if (attributes.hasOwnProperty(attribute.variantName)) {
        attributes[attribute.variantName] = attribute.values;
      }
    });
    let { Hãng: brand } = attributes;
    if (filter.brand !== "all" && brand !== filter.brand) {
      return false;
    }
    // if (
    //   (filter.price !== 0 &&
    //     filter.price < priceFilterArr.length - 1 &&
    //     (priceFilterArr[filter.price].value < product.price ||
    //       priceFilterArr[filter.price - 1].value > product.price)) ||
    //   (filter.price !== 0 &&
    //     filter.price == priceFilterArr.length - 1 &&
    //     priceFilterArr[filter.price].value > product.price)
    // ) {
    //   return false;
    // }
    return true;
  });
  filteredProducts.sort((a, b) => {
    if (filter.sort == 1) {
      return a.price - b.price;
    }
    return b.price - a.price;
  });
  return filteredProducts;
};
const renderProducts = async () => {
  const productContainer = document.querySelector(
    ".category-products .product-grid"
  );
  products = await getProductList(); // Lấy danh sách sản phẩm từ API
  productContainer.innerHTML = ""; // Xóa nội dung hiện tại
  if (products.length === 0) return; // Nếu không có sản phẩm, không làm gì cả
  const product_display = filterProducts().slice(0, pageSize);
  product_display.forEach((product) => {
    let attributes = {
      "Dung lượng RAM": null,
      Chipset: null,
      "Bộ nhớ trong": null,
    };
    product.attributes.forEach((attribute) => {
      if (attributes.hasOwnProperty(attribute.variantName)) {
        attributes[attribute.variantName] = attribute.values;
      }
    });
    let {
      "Dung lượng RAM": ram,
      Chipset: chipset,
      "Bộ nhớ trong": gb,
    } = attributes;

    const discountAmount =
      product.DiscountRate != null && product.DiscountRate != 0
        ? (product.price * product.DiscountRate) / 100
        : 0;
    const discountPrice = product.price - discountAmount;
    if (product) {
      const productHTML = `<div class="product-card">
            ${
              product.DiscountRate != 0 && product.DiscountRate != null
                ? `<span class="badge">Giảm ${Number(
                    discountAmount
                  ).toLocaleString("Vi-VN")}₫</span>`
                : ""
            }
                ${
                  product.qty_in_stock > 10
                    ? ""
                    : product.qty_in_stock > 0
                    ? `<span class='limited-badge'>Còn ${product.qty_in_stock} sản phẩm</span>`
                    : "<div class='out-of-stock'>Hết hàng</div>"
                }
                <a href="../products/smartphone-detail.html?ProductItemID=${
                  product.product_id
                }">
                  <div class="product-img">
                    <img src="http://localhost:3000${
                      product.product_image
                    }" alt="${product.ProductName}" />
                  </div>
                  <div class="product-info">
                    <h3>${product.ProductName} ${ram ? ram : ""} ${
        gb ? gb : ""
      }</h3>
                    <div class="price">
                    ${
                      product.DiscountRate != 0 && product.DiscountRate != null
                        ? `<span class="current">${Number(
                            discountPrice
                          ).toLocaleString("vi-VN")}₫</span>
                      <span class="original">${Number(
                        product.price
                      ).toLocaleString("vi-VN")}₫</span>`
                        : `<span class="current">${Number(
                            product.price
                          ).toLocaleString("vi-VN")}₫</span>`
                    }
                      
                    </div>
                    <div class="specs">
                        ${chipset ? `<span>${chipset}</span>` : ""} ${
        ram ? `<span>${ram}</span>` : ""
      } ${gb ? `<span>${gb}</span>` : ""}
                    </div>
                  </div>
                </a>
              </div>`;
      productContainer.innerHTML += productHTML;
    }
  });
};
renderProducts();
if (products.length <= pageSize) {
  loadMoreBtn.style.display = "none";
}
const getBrands = async () => {
  try {
    const response = await axiosInstance.get("/product/brands");
    return response.data.data;
  } catch (error) {
    console.error(error);
    return null;
  }
};
brands = await getBrands();
console.log("📌 Dữ liệu thương hiệu:", brands);
const renderBrands = async (brands) => {
  const brandSelect = document.querySelector(".brand .filter-options");
  brandSelect.innerHTML = ""; // Xóa nội dung hiện tại
  console.log(brands);
  brands.forEach((brand) => {
    let brandHTML = `<a href="#" class="filter-option" data-id=${brand.name} >${brand.name}</a>`;
    brandSelect.innerHTML += brandHTML;
  });
  const allBrandsHTML = `<a href="#" class="filter-option active" data-id="all" >Tất cả</a>`;
  brandSelect.innerHTML = allBrandsHTML + brandSelect.innerHTML;
  document.querySelectorAll(".brand .filter-option").forEach((option) => {
    option.addEventListener("click", (e) => {
      e.preventDefault();
      document.querySelectorAll(".brand .filter-option").forEach((option) => {
        option.classList.remove("active");
      });
      option.classList.add("active");
      const brandname = option.getAttribute("data-id");
      filter.brand = brandname === "null" ? null : brandname;
      renderProducts();
    });
  });
};
// const renderPrice = () => {
//   const priceSelect = document.querySelector(".price .filter-options");
//   priceSelect.innerHTML = ""; // Xóa nội dung hiện tại
//   priceFilterArr.forEach((price, index) => {
//     let priceHTML = `<a href="#" class="filter-option ${
//       index == 0 ? "active" : ""
//     }" data-id=${index} >${price.text}</a>`;
//     priceSelect.innerHTML += priceHTML;
//   });
//   document.querySelectorAll(".price .filter-option").forEach((option) => {
//     option.addEventListener("click", (e) => {
//       e.preventDefault();
//       document.querySelectorAll(".price .filter-option").forEach((option) => {
//         option.classList.remove("active");
//       });
//       option.classList.add("active");
//       const index = option.getAttribute("data-id");
//       filter.price = parseInt(index);
//       renderProducts();
//     });
//   });
// };
renderBrands(brands);
// renderPrice();
