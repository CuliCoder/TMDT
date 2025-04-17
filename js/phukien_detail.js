import axiosInstance from "./configAxios.js";
let ProductID = new URL(window.location.href).searchParams.get("ProductItemID");
const userID = localStorage.getItem("Myid");
let list = [];
let product_item_ID_to_cart = null;
const colorMap = {
  Đỏ: "#FF0000", // Red
  Xanh: "#008000", // Green
  "Xanh lá": "#008000", // Green
  "Xanh dương": "#0000FF", // Blue
  Vàng: "#FFFF00", // Yellow
  Đen: "#000000", // Black
  Trắng: "#FFFFFF", // White
  Hồng: "#FFC0CB", // Pink
  Tím: "#800080", // Purple
  Cam: "#FFA500", // Orange
  Nâu: "#A52A2A", // Brown
  Xám: "#808080", // Gray
  Bạc: "#C0C0C0",
};
async function Phan_Loai_Product_Item() {
  let data = await axiosInstance.get(
    `/products/product_item_by_productID/${ProductID}`
  );
  const product_item_data = data.data.data.data;
  for (let i = 0; i < product_item_data.length; i++) {
    let attributes = {
      Màu: null,
    };
    // lấy các thuộc tính của sản phẩm
    product_item_data[i].attributes.forEach((attribute) => {
      if (attributes.hasOwnProperty(attribute.variantName)) {
        attributes[attribute.variantName] = attribute.values;
      }
    });
    let { Màu: color } = attributes; // gán các giá trị để sử dụng
    let check = list.find((item) => item.color === color);
    if (!check) {
      list.push({
        color: color,
        price: product_item_data[i].price,
        id: product_item_data[i].id,
        img: product_item_data[i].product_image,
      });
    }
  }
}
async function showProductDetail() {
  try {
    await Phan_Loai_Product_Item(); // phân loại sản phẩm
    // const list_product_item = await axiosInstance.get(`/products/product_item_by_productID/${ProductID}`);
    const infor_product = await axiosInstance.get(
      `/products/get_product_by_productID/${ProductID}`
    );
    let html_bo_nho = ``;
    document.title = infor_product.data.ProductName;
    console.log(infor_product.data.ProductName);
    document.getElementById(
      "nameProduct"
    ).innerHTML = `${infor_product.data.ProductName}`;
    document.querySelector(".colors").innerHTML = ``;
    document.querySelector(".product-thumbnails").innerHTML = ``;
    console.log(list);
    console.log(list.length);
    for (let i = 0; i < list.length; i++) {
      if (list[i].color !== null && list[i].color !== "") {
        console.log(list[i].color);
        document.querySelector(".colors").innerHTML += `
           <a href="#" class="variant-option color-option" onclick="click_color_option(event, ${
             list[i].price + "," + list[i].id
           })" style="background-color: ${colorMap[list[i].color]};">
           <span>${list[i].color}</span>
           </a>`;
      }

      document.querySelector(
        ".product-thumbnails"
      ).innerHTML += `<div class="thumbnail">
                            <img class="img_prd" onclick="click_img(event)" src="http://localhost:3000${list[i].img}" alt="Ảnh sản phẩm">
                            </div>`;
    }
    document.querySelector(".variants").innerHTML += html_bo_nho;
    default_Price_color();
  } catch (error) {
    console.error("Error fetching product details:", error);
  }
}
showProductDetail();
async function default_Price_color() {
  const infor_product = await axiosInstance.get(
    `/products/get_product_by_productID/${ProductID}`
  );
  document.querySelector(
    ".product-main-image"
  ).innerHTML = `<img src="http://localhost:3000${list[0]?.img}" alt="Ảnh sản phẩm">`;
  document.querySelector(
    ".product-title"
  ).innerHTML = `${infor_product.data.ProductName}`;
  let percent = await axiosInstance.get(`/api/promotions/${ProductID}/percent`);
  if (percent.data > 0) {
    document.querySelector(".price").innerHTML = `
                               <span class="current">${(
                                 list[0]?.price -
                                 list[0]?.price * (percent.data / 100)
                               ).toLocaleString("vi-VN")}₫</span>
                               <span class="original">${(
                                 list[0]?.price * 1
                               ).toLocaleString("vi-VN")}₫</span>
                               <span class="discount">Giảm ${
                                 percent.data * 1
                               }%</span>`;
  } else {
    document.querySelector(".price").innerHTML = `
                               <span class="current">${(
                                 list[0]?.price * 1
                               ).toLocaleString("vi-VN")}₫</span>`;
  }
  document.querySelector(".bodytable_infor_product").innerHTML = ``;
  const product_item = await axiosInstance.get(
    `/products/product_item_by_ID/${list[0]?.id}`
  );
  let html_chitiet = ``;
  product_item.data.data.attributes?.forEach((attribute) => {
    if (attribute.variantName !== "Màu") {
      html_chitiet += `<tr>
          <td>${attribute.variantName}</td>
          <td>${attribute.values}</td>
          </tr>`;
    }
  });
  document.querySelector(".bodytable_infor_product").innerHTML = html_chitiet;
  document.querySelector(".color-option")?.classList.add("active");
  product_item_ID_to_cart = list[0]?.id; // lấy id sản phẩm để thêm vào giỏ hàng
}
async function click_color_option(event, price, product_item_ID) {
  let percent = await axiosInstance.get(`/api/promotions/${ProductID}/percent`);
  document.querySelectorAll(".color-option").forEach((el) => {
    el.classList.remove("active");
  });
  event.target.closest(".color-option").classList.add("active");
  if (percent.data > 0) {
    document.querySelector(".price").innerHTML = `
                                 <span class="current">${(
                                   price -
                                   price * (percent.data / 100)
                                 ).toLocaleString("vi-VN")}₫</span>
                                 <span class="original">${(
                                   price * 1
                                 ).toLocaleString("vi-VN")}₫</span>
                                 <span class="discount">Giảm ${
                                   percent.data * 1
                                 }%</span>`;
  } else {
    document.querySelector(".price").innerHTML = `
                                 <span class="current">${price.toLocaleString(
                                   "vi-VN"
                                 )}₫</span>`;
  }

  const product_item = await axiosInstance.get(
    `/products/product_item_by_ID/${product_item_ID}`
  );
  let html_chitiet = ``;
  product_item.data.data.attributes.forEach((attribute) => {
    if (attribute.variantName !== "Màu") {
      html_chitiet += `<tr>
        <td>${attribute.variantName}</td>
        <td>${attribute.values}</td>
        </tr>`;
    }
  });
  document.querySelector(".bodytable_infor_product").innerHTML = html_chitiet;
  product_item_ID_to_cart = product_item_ID; // lấy id sản phẩm để thêm vào giỏ hàng
}
window.click_color_option = click_color_option;
function click_img(event) {
  document.querySelectorAll(".thumbnail").forEach((el) => {
    el.classList.remove("active");
  });
  event.target.closest(".thumbnail").classList.add("active");
  let src_img = event.target.src;
  document.querySelector(
    ".product-main-image"
  ).innerHTML = `<img src="${src_img}" alt="Ảnh sản phẩm">`;
}
window.click_img = click_img;
document.querySelector(".btn-buy-now").addEventListener("click", async () => {
  const res = await axiosInstance.post("/cart", {
    userID, // đưa thằng đăng nhập vào
    Product_Item_ID: product_item_ID_to_cart,
    quantity: 1,
  });
  if (res.data.error == 0) {
    window.location.href = "../cart.html"; // chuyển đến trang thanh toán
  }
});
document.querySelector(".btn-add-cart").addEventListener("click", async () => {
  const res = await axiosInstance.post("/cart", {
    userID, // đưa thằng đăng nhập vào
    Product_Item_ID: product_item_ID_to_cart,
    quantity: 1,
  });
  alert(res.data.message);
});
async function product_random() {
  try {
    let id_categori = await axiosInstance.get(
      `/products/get_product_by_productID/${ProductID}`
    );
    id_categori = id_categori.data.category_id;
    console.log(id_categori);
    let list_product_random = await axiosInstance.get(
      `/products/product_item_by_categoryID/${id_categori}`
    );
    console.log(list_product_random)
    list_product_random = list_product_random.data.data;
    let list_product_random_show = [];
    for (let i = 0; i < 3; i++) {
      if (list_product_random.length < 3) {
        list_product_random_show = list_product_random;
        break;
      }
      const randomIndex = Math.floor(
        Math.random() * list_product_random.length
      );
      const randomProduct = list_product_random[randomIndex];

      // Kiểm tra trùng lặp id
      const isDuplicate = list_product_random_show.find(
        (item) => item.id === randomProduct.id
      );

      if (!isDuplicate) {
        list_product_random_show.push(randomProduct);
      } else {
        i--; // Nếu trùng lặp, giảm i để thử lại
      }
    }
    let html = ``;
    for (let i = 0; i < list_product_random_show.length; i++) {
      let percent = await axiosInstance.get(
        `/api/promotions/${list_product_random_show[i].product_id}/percent`
      );
      let attributes = {
        "Dung lượng RAM": null,
        "Bộ nhớ trong": null,
      };
      list_product_random_show[i].attributes.forEach((attribute) => {
        if (attributes.hasOwnProperty(attribute.variantName)) {
          attributes[attribute.variantName] = attribute.values;
        }
      });
      let { "Dung lượng RAM": ram, "Bộ nhớ trong": gb } = attributes; // gán các giá trị để sử dụng
      html += `<div class="product-card">
              <span class="badge list_badge">${
                percent.data > 0
                  ? "Giảm " +
                    (
                      list_product_random_show[i].price *
                      (percent.data / 100)
                    ).toLocaleString("vi-VN") +
                    "₫"
                  : ""
              }</span>
              <a href="phukien-detail.html?ProductItemID=${
                list_product_random_show[i].product_id
              }">
                <div class="product-img">
                  <img class="img_prd" src="http://localhost:3000${
                    list_product_random_show[i].product_image
                  }" alt="Ảnh sản phẩm">
                </div>
                <div class="product-info">
                  <h3>${list_product_random_show[i].ProductName}</h3>
                  <div class="price">
                    <span class="current">${
                      percent.data > 0
                        ? (
                            list_product_random_show[i].price -
                            list_product_random_show[i].price *
                              (percent.data / 100)
                          ).toLocaleString("vi-VN") + "₫"
                        : (
                            list_product_random_show[i].price * 1
                          ).toLocaleString("vi-VN") + "₫"
                    }</span>
                    <span class="original">${
                      percent.data > 0
                        ? (
                            list_product_random_show[i].price * 1
                          ).toLocaleString("vi-VN") + "₫"
                        : ""
                    }</span>
                  </div>
                  <div class="specs">
                    <span>${ram?.replace(" ", "")} RAM</span>
                    <span>${gb?.replace(" ", "")}</span>
                  </div>
                </div>
              </a>
            </div>`;
    }
    document.querySelector(".product-grid").innerHTML = html;
    document.querySelectorAll(".list_badge").forEach((el) => {
      if (el.textContent.trim() === "") el.classList.remove("badge");
    });
  } catch (error) {
    console.error(error);
  }
}
product_random();
