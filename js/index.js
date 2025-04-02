import axiosInstance from "./configAxios.js";
const getProductList = async (idcategory) => {
  try {
    const response = await axiosInstance.get(`/product/product_item_by_categoryID/${idcategory}`);
    console.log("📌 Dữ liệu sản phẩm:", response.data);
    return response.data.data;
  } catch (error) {
    console.error("Error fetching product list:", error);
    return [];
  }
};
getProductList();
const rederProductList = async () => {
  try {
    const smartphoneList = await getProductList(1);
    const smartphoneContainer = document.querySelector(
      ".featured-products .container .product-grid"
    );
    smartphoneContainer.innerHTML = "";
    for (let i = 0; i < 5; i++) {
      let attributes = {
        "Dung lượng RAM": null,
        Chipset: null,
        "Bộ nhớ trong": null,
      };
      smartphoneList[i].attributes.forEach((attribute) => {
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
        smartphoneList[i].DiscountRate != null && smartphoneList[i].DiscountRate != 0
          ? (smartphoneList[i].price * smartphoneList[i].DiscountRate) / 100
          : 0;
      const discountPrice = smartphoneList[i].price - discountAmount;
      if (smartphoneList[i]) {
        const productHTML = `<div class="product-card">
        ${
          smartphoneList[i].DiscountRate != 0 && smartphoneList[i].DiscountRate != null
            ? `<span class="badge">Giảm ${Number(discountAmount).toLocaleString(
                "Vi-VN"
              )}₫</span>`
            : ""
        }
            ${
              smartphoneList[i].qty_in_stock > 10
                ? ""
                : smartphoneList[i].qty_in_stock > 0
                ? `<span class='limited-badge'>Còn ${smartphoneList[i].qty_in_stock} sản phẩm</span>`
                : "<div class='out-of-stock'>Hết hàng</div>"
            }
            <a href="products/smartphone-detail.html?id=${smartphoneList[i].id}">
              <div class="product-img">
                <img src="http://localhost:3000${
                  smartphoneList[i].product_image
                }" alt="${smartphoneList[i].ProductName}" />
              </div>
              <div class="product-info">
                <h3>${smartphoneList[i].ProductName} ${ram ? ram : ""} ${
          gb ? gb : ""
        }</h3>
                <div class="price">
                ${
                  smartphoneList[i].DiscountRate != 0 && smartphoneList[i].DiscountRate != null
                    ? `<span class="current">${Number(
                        discountPrice
                      ).toLocaleString("vi-VN")}₫</span>
                  <span class="original">${Number(
                    smartphoneList[i].price
                  ).toLocaleString("vi-VN")}₫</span>`
                    : `<span class="current">${Number(
                        smartphoneList[i].price
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
        smartphoneContainer.innerHTML += productHTML;
      }
    }
  } catch (error) {
    console.log("Error rendering product list:", error);
  }
};
rederProductList();
