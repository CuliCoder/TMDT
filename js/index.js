import axiosInstance from "./configAxios.js";
document.addEventListener("DOMContentLoaded", async () => {
  const getProductList = async (idcategory) => {
    try {
      const response = await axiosInstance.get(
        `/product/product_item_by_categoryID/${idcategory}`
      );
      console.log("📌 Dữ liệu sản phẩm:", response.data);
      return response.data.data;
    } catch (error) {
      console.error("Error fetching product list:", error);
      return [];
    }
  };
  const rederProductList = async () => {
    try {
      const smartphoneList = await getProductList(1);
      const earphoneList = await getProductList(2);
      const charging_cableList = await getProductList(3);
      const power_bankList = await getProductList(4);
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
          smartphoneList[i].DiscountRate != null &&
          smartphoneList[i].DiscountRate != 0
            ? (smartphoneList[i].price * smartphoneList[i].DiscountRate) / 100
            : 0;
        const discountPrice = smartphoneList[i].price - discountAmount;
        if (smartphoneList[i]) {
          const productHTML = `<div class="product-card">
        ${
          smartphoneList[i].DiscountRate != 0 &&
          smartphoneList[i].DiscountRate != null
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
            <a href="products/smartphone-detail.html?ProductItemID=${
              smartphoneList[i].product_id
            }">
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
                  smartphoneList[i].DiscountRate != 0 &&
                  smartphoneList[i].DiscountRate != null
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
      if (earphoneList.length !== 0) {
        const earphoneContainer = document.querySelector(
          ".earphone-products .container .product-grid"
        );
        earphoneContainer.innerHTML = "";
        for (let i = 0; i < (earphoneList.length < 5 ? earphoneList.length : 5); i++) {
          console.log(earphoneList[i]);
          const discountAmount =
            earphoneList[i].DiscountRate != null &&
            earphoneList[i].DiscountRate != 0
              ? (earphoneList[i].price * earphoneList[i].DiscountRate) / 100
              : 0;
          const discountPrice = earphoneList[i].price - discountAmount;
          if (earphoneList[i]) {
            const productHTML = `<div class="product-card">
        ${
          earphoneList[i].DiscountRate != 0 &&
          earphoneList[i].DiscountRate != null
            ? `<span class="badge">Giảm ${Number(discountAmount).toLocaleString(
                "Vi-VN"
              )}₫</span>`
            : ""
        }
            ${
              earphoneList[i].qty_in_stock > 10
                ? ""
                : earphoneList[i].qty_in_stock > 0
                ? `<span class='limited-badge'>Còn ${earphoneList[i].qty_in_stock} sản phẩm</span>`
                : "<div class='out-of-stock'>Hết hàng</div>"
            }
            <a href="products/smartphone-detail.html?ProductItemID=${
              earphoneList[i].product_id
            }">
              <div class="product-img">
                <img src="http://localhost:3000${
                  earphoneList[i].product_image
                }" alt="${earphoneList[i].ProductName}" />
              </div>
              <div class="product-info">
                <h3>${earphoneList[i].ProductName} 
        </h3>
                <div class="price">
                ${
                  earphoneList[i].DiscountRate != 0 &&
                  earphoneList[i].DiscountRate != null
                    ? `<span class="current">${Number(
                        discountPrice
                      ).toLocaleString("vi-VN")}₫</span>
                  <span class="original">${Number(
                    earphoneList[i].price
                  ).toLocaleString("vi-VN")}₫</span>`
                    : `<span class="current">${Number(
                        earphoneList[i].price
                      ).toLocaleString("vi-VN")}₫</span>`
                }
                  
                </div>
                
              </div>
            </a>
          </div>`;
            earphoneContainer.innerHTML += productHTML;
          }
        }
      }

      if (charging_cableList.length !== 0) {
        const charging_cableContainer = document.querySelector(
          ".charging-cable-products .container .product-grid"
        );
        charging_cableContainer.innerHTML = "";
        for (
          let i = 0;
          i < (charging_cableList.length < 5 ? charging_cableList.length : 5);
          i++
        ) {
          const discountAmount =
            charging_cableList[i].DiscountRate != null &&
            charging_cableList[i].DiscountRate != 0
              ? (charging_cableList[i].price *
                  charging_cableList[i].DiscountRate) /
                100
              : 0;
          const discountPrice = charging_cableList[i].price - discountAmount;
          if (charging_cableList[i]) {
            const productHTML = `<div class="product-card">
        ${
          charging_cableList[i].DiscountRate != 0 &&
          charging_cableList[i].DiscountRate != null
            ? `<span class="badge">Giảm ${Number(discountAmount).toLocaleString(
                "Vi-VN"
              )}₫</span>`
            : ""
        }
            ${
              charging_cableList[i].qty_in_stock > 10
                ? ""
                : charging_cableList[i].qty_in_stock > 0
                ? `<span class='limited-badge'>Còn ${charging_cableList[i].qty_in_stock} sản phẩm</span>`
                : "<div class='out-of-stock'>Hết hàng</div>"
            }
            <a href="products/smartphone-detail.html?ProductItemID=${
              charging_cableList[i].product_id
            }">
              <div class="product-img">
                <img src="http://localhost:3000${
                  charging_cableList[i].product_image
                }" alt="${charging_cableList[i].ProductName}" />
              </div>
              <div class="product-info">
                <h3>${charging_cableList[i].ProductName} 
        </h3>
                <div class="price">
                ${
                  charging_cableList[i].DiscountRate != 0 &&
                  charging_cableList[i].DiscountRate != null
                    ? `<span class="current">${Number(
                        discountPrice
                      ).toLocaleString("vi-VN")}₫</span>
                  <span class="original">${Number(
                    charging_cableList[i].price
                  ).toLocaleString("vi-VN")}₫</span>`
                    : `<span class="current">${Number(
                        charging_cableList[i].price
                      ).toLocaleString("vi-VN")}₫</span>`
                }
                  
                </div>
                
              </div>
            </a>
          </div>`;
            charging_cableContainer.innerHTML += productHTML;
          }
        }
      }
      if (power_bankList.length !== 0) {
        const power_bankContainer = document.querySelector(
          ".power-bank-products .container .product-grid"
        );
        console.log(power_bankContainer);
        power_bankContainer.innerHTML = "";
        for (
          let i = 0;
          i < (power_bankList.length < 5 ? power_bankList.length : 5);
          i++
        ) {
          const discountAmount =
            power_bankList[i].DiscountRate != null &&
            power_bankList[i].DiscountRate != 0
              ? (power_bankList[i].price * power_bankList[i].DiscountRate) / 100
              : 0;
          const discountPrice = power_bankList[i].price - discountAmount;
          if (power_bankList[i]) {
            const productHTML = `<div class="product-card">
        ${
          power_bankList[i].DiscountRate != 0 &&
          power_bankList[i].DiscountRate != null
            ? `<span class="badge">Giảm ${Number(discountAmount).toLocaleString(
                "Vi-VN"
              )}₫</span>`
            : ""
        }
            ${
              power_bankList[i].qty_in_stock > 10
                ? ""
                : power_bankList[i].qty_in_stock > 0
                ? `<span class='limited-badge'>Còn ${power_bankList[i].qty_in_stock} sản phẩm</span>`
                : "<div class='out-of-stock'>Hết hàng</div>"
            }
            <a href="products/smartphone-detail.html?ProductItemID=${
              power_bankList[i].product_id
            }">
              <div class="product-img">
                <img src="http://localhost:3000${
                  power_bankList[i].product_image
                }" alt="${power_bankList[i].ProductName}" />
              </div>
              <div class="product-info">
                <h3>${power_bankList[i].ProductName} 
        </h3>
                <div class="price">
                ${
                  power_bankList[i].DiscountRate != 0 &&
                  power_bankList[i].DiscountRate != null
                    ? `<span class="current">${Number(
                        discountPrice
                      ).toLocaleString("vi-VN")}₫</span>
                  <span class="original">${Number(
                    power_bankList[i].price
                  ).toLocaleString("vi-VN")}₫</span>`
                    : `<span class="current">${Number(
                        power_bankList[i].price
                      ).toLocaleString("vi-VN")}₫</span>`
                }
                  
                </div>
                
              </div>
            </a>
          </div>`;
            power_bankContainer.innerHTML += productHTML;
          }
        }
      }
    } catch (error) {
      console.log("Error rendering product list:", error);
    }
  };
  await rederProductList();
});
