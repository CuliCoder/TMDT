import axiosInstance from "./configAxios.js";
document.addEventListener("DOMContentLoaded", function () {
// let ProductID = new URL(window.location.href).searchParams.get("id");
let ProductID = new URL(window.location.href).searchParams.get("ProductItemID");
//B1: Lấy sản phẩm dựa theo id product
// B2: có bao nhiêu sản phẩm thì sẽ có bấy nhiêu sản phẩm liên quan
//
let list = []; // danh sách các sản phẩm liên quan
let product_item_ID_to_cart = null; // id sản phẩm thêm vào giỏ hàng
let list_img = []
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
showProductDetail();
async function showProductDetail() {
  try {
    await Phan_Loai_Product_Item(); // phân loại sản phẩm
    // const list_product_item = await axiosInstance.get(`/products/product_item_by_productID/${ProductID}`);
    const infor_product = await axiosInstance.get(
      `/products/get_product_by_productID/${ProductID}`
    );
    let html_bo_nho = ``;
    document.getElementById("nameProduct").innerHTML = `${infor_product.data.ProductName}`;
    document.querySelector(".product-thumbnails").innerHTML = ``;
    document.querySelector(".variants").innerHTML = ``;
    for (let i = 0; i < list.length; i++) {
      html_bo_nho += `<a href="#" class="variant-option" onclick="clickVariantOption(event, ${i})">${
        list[i].ram + "-" + list[i].gb
      }</a>`;
      list[i].in_for.forEach((item) => {
      let check = list_img.find((img) => img === item.color)
      if (!check) {
        list_img.push(item.color)
        document.querySelector(
          ".product-thumbnails"
        ).innerHTML += `<div class="thumbnail" onclick="click_img(event)">
                                                                    <img class="img_prd" src="http://localhost:3000${item.img}" alt="Ảnh sản phẩm">
                                                                    </div>`;
      }
      });
    }
    document.querySelector(".variants").innerHTML += html_bo_nho;
    default_variantOption(list[0].in_for); // mặc định là sản phẩm đầu tiên
  } catch (error) {
    console.error("Error fetching product details:", error);
  }
}
async function default_variantOption(data) {
  const infor_product = await axiosInstance.get(
    `/products/get_product_by_productID/${ProductID}`
  );
  let html_bo_nho = ``;
  document.querySelector(
    ".product-title"
  ).innerHTML = `${infor_product.data.ProductName + " " + 
  (list[0].ram || list[0].gb ? list[0].ram + "/" + list[0].gb : "")}`;
  document.querySelector(".variant-option").classList.add("active");
  document.querySelector(".thumbnail").classList.add("active");
  document.querySelector(
    ".product-main-image"
  ).innerHTML = `<img src="http://localhost:3000${data[0].img}" alt="Ảnh sản phẩm">`;
  default_Price_color(data); // mặc định là sản phẩm đầu tiên
}
async function default_Price_color(data) {
  let percent = await axiosInstance.get(`/api/promotions/${ProductID}/percent`);
  if(percent.data > 0){
  document.querySelector(".price").innerHTML = `
                             <span class="current">${(
                               data[0].price -
                               data[0].price * (percent.data/100)
                             ).toLocaleString("vi-VN")}₫</span>
                             <span class="original">${(
                               data[0].price * 1
                             ).toLocaleString("vi-VN")}₫</span>
                             <span class="discount">Giảm ${
                               percent.data * 1
                             }%</span>`;
  }
  else{
    document.querySelector(".price").innerHTML = `
                             <span class="current">${(data[0].price).toLocaleString("vi-VN")}₫</span>`;
  }
  let html = ``;
  document.querySelector(".bodytable_infor_product").innerHTML = html;
  document.querySelector(".colors").innerHTML = ``;
  for (let i = 0; i < data.length; i++) {
    if (data[i].color !== null && data[i].color !== "") {
      document.querySelector(".colors").innerHTML += `
     <a href="#" class="variant-option color-option" onclick="click_color_option(event, ${
       data[i].price + "," + data[i].id
     })" style="background-color: ${colorMap[data[i].color]};">
     <span>${data[i].color}</span>
     </a>`;
    }
  }
    const product_item = await axiosInstance.get(
      `/products/product_item_by_ID/${data[0].id}`
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
    document.querySelector(".color-option")?.classList.add("active");
    product_item_ID_to_cart = data[0].id; // lấy id sản phẩm để thêm vào giỏ hàng
  }
  window.default_Price_color = default_Price_color;
async function clickVariantOption(event, id_list) {
  const infor_product = await axiosInstance.get(
    `/products/get_product_by_productID/${ProductID}`
  );
  let html_bo_nho = ``;
  document.querySelector(
    ".product-title"
  ).innerHTML = `${infor_product.data.ProductName + " " + 
  (list[id_list].ram && list[id_list].gb ? list[id_list].ram?.replace(" ", "") + "/" + list[id_list].gb?.replace(" ", "") : "")}`;
  document.querySelectorAll(".variant-option").forEach((el) => {
    el.classList.remove("active");
  });
  event.target.classList.add("active");
  document.querySelector(".colors").innerHTML = ``;
  for (let i = 0; i < list[id_list].in_for.length; i++) {
    if (
      list[id_list].in_for[i].color !== null &&
      list[id_list].in_for[i].color !== ""
    ) {
      document.querySelector(".colors").innerHTML += `
     <a href="#" class="variant-option color-option" onclick="click_color_option(event, ${
       list[id_list].in_for[i].price + "," + list[id_list].in_for[i].id
     })" style="background-color: ${colorMap[list[id_list].in_for[i].color]};">
     <span>${list[id_list].in_for[i].color}</span>
     </a>`;
    }
  }
  default_Price_color(list[id_list].in_for); // mặc định là sản phẩm đầu tiên
}
window.clickVariantOption = clickVariantOption;
async function click_color_option(event, price, product_item_ID) {
  let percent = await axiosInstance.get(`/api/promotions/${ProductID}/percent`);
  document.querySelectorAll(".color-option").forEach((el) => {
    el.classList.remove("active");
  });
  event.target.closest(".color-option").classList.add("active");
  if(percent.data > 0){
    document.querySelector(".price").innerHTML = `
                               <span class="current">${(
                                 price -
                                 price * (percent.data/100)
                               ).toLocaleString("vi-VN")}₫</span>
                               <span class="original">${(
                                 price * 1
                               ).toLocaleString("vi-VN")}₫</span>
                               <span class="discount">Giảm ${
                                 percent.data * 1
                               }%</span>`;
    }
    else{
      document.querySelector(".price").innerHTML = `
                               <span class="current">${(price).toLocaleString("vi-VN")}₫</span>`;
    }

  const product_item = await axiosInstance.get(
    `/products/product_item_by_ID/${product_item_ID}`
  );
  let html_chitiet = ``;
  console.log( "test",product_item.data);
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
async function Phan_Loai_Product_Item() {
  let data = await axiosInstance.get(
    `/products/product_item_by_productID/${ProductID}`
  );
  console.log(data);
  const product_item_data = data.data.data.data;
  for (let i = 0; i < product_item_data.length; i++) {
    let attributes = {
      "Dung lượng RAM": null,
      "Bộ nhớ trong": null,
      Màu: null,
    };
    // lấy các thuộc tính của sản phẩm
    product_item_data[i].attributes.forEach((attribute) => {
      if (attributes.hasOwnProperty(attribute.variantName)) {
        attributes[attribute.variantName] = attribute.values;
      }
    });
    let { "Dung lượng RAM": ram, Màu: color, "Bộ nhớ trong": gb } = attributes; // gán các giá trị để sử dụng
    let check = list.find((item) => item.ram === ram && item.gb === gb);
    if (!check) {
      list.push({
        ram: ram,
        gb: gb,
        in_for: [
          {
            price: product_item_data[i].price,
            id: product_item_data[i].id,
            color: color,
            img: product_item_data[i].product_image,
          },
        ],
      });
    } else {
      let check_color = check.in_for.find((item) => item.color === color);
      if (!check_color) {
        check.in_for.push({
          price: product_item_data[i].price,
          id: product_item_data[i].id,
          color: color,
          img: product_item_data[i].product_image,
        });
      }
    }
  }
}
document.querySelector(".btn-buy-now").addEventListener("click", async () => {
  await axiosInstance.post("/cart", {
    userID: 4, // đưa thằng đăng nhập vào
    Product_Item_ID: product_item_ID_to_cart,
    quantity: 1,
  });
  window.location.href = `../cart.html`; // chuyển đến trang thanh toán
});
document.querySelector(".btn-add-cart").addEventListener("click", async () => {
  await axiosInstance.post("/cart", {
    userID: 4, // đưa thằng đăng nhập vào
    Product_Item_ID: product_item_ID_to_cart,
    quantity: 1,
  });
});
async function product_random(){
  try {
  let id_categori = await axiosInstance.get(`/products/get_product_by_productID/${ProductID}`)
  id_categori = id_categori.data.category_id
  console.log(id_categori)
  let list_product_random = await axiosInstance.get(`/products/product_item_by_categoryID/${id_categori}`)
  list_product_random = list_product_random.data.data;
  let list_product_random_show = [];
  for (let i = 0; i < 3; i++) {
    if(list_product_random.length < 3){
      list_product_random_show = list_product_random
      break;
    }
    const randomIndex = Math.floor(Math.random() * list_product_random.length);
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
  let html= ``
  for(let i = 0; i< list_product_random_show.length; i++){
    let percent = await axiosInstance.get(`/api/promotions/${list_product_random_show[i].product_id}/percent`);
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
            <span class="badge list_badge">${percent.data > 0? "Giảm " + (list_product_random_show[i].price*(percent.data/100)).toLocaleString("vi-VN") +"₫":""}</span>
            <a href="products/phukien-detail.html?ProductItemID=${list_product_random_show[i].product_id}">
              <div class="product-img">
                <img class="img_prd" src="http://localhost:3000${list_product_random_show[i].product_image}" alt="Ảnh sản phẩm">
              </div>
              <div class="product-info">
                <h3>${list_product_random_show[i].Name}</h3>
                <div class="price">
                  <span class="current">${percent.data > 0? (list_product_random_show[i].price - list_product_random_show[i].price*(percent.data/100)).toLocaleString("vi-VN") +"₫" : (list_product_random_show[i].price).toLocaleString("vi-VN") +"₫"}</span>
                  <span class="original">${percent.data > 0? (list_product_random_show[i].price).toLocaleString("vi-VN") +"₫" : ""}</span>
                </div>
                <div class="specs">
                  <span>${ram?.replace(" ", "")} RAM</span>
                  <span>${gb?.replace(" ", "")}</span>
                </div>
              </div>
            </a>
          </div>`
  }
  document.querySelector(".product-grid").innerHTML = html
  document.querySelectorAll(".list_badge").forEach((el) => {
    if(el.textContent.trim() === "") el.classList.remove("badge")
  });      
  } catch (error) {
    console.error(error);
  }
}
product_random()
})