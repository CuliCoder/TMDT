import axiosInstance from "./configAxios.js";
// let ProductID = new URL(window.location.href).searchParams.get("id"); 
let ProductID = 61; // Chỉ để test, sau này sẽ lấy từ URL    
//B1: Lấy sản phẩm dựa theo id product
// B2: có bao nhiêu sản phẩm thì sẽ có bấy nhiêu sản phẩm liên quan
//
let list = []; // danh sách các sản phẩm liên quan
let product_item_ID_to_cart = null; // id sản phẩm trong giỏ hàng
const colorMap = {
  "Đỏ": "#FF0000",         // Red
  "Xanh": "#008000",       // Green
  "Xanh lá": "#008000",    // Green
  "Xanh dương": "#0000FF", // Blue
  "Vàng": "#FFFF00",       // Yellow
  "Đen": "#000000",        // Black
  "Trắng": "#FFFFFF",      // White
  "Hồng": "#FFC0CB",       // Pink
  "Tím": "#800080",        // Purple
  "Cam": "#FFA500",        // Orange
  "Nâu": "#A52A2A",        // Brown
  "Xám": "#808080",        // Gray
  "Bạc": "#C0C0C0"
}
showProductDetail();
async function showProductDetail() {
  try {
    await Phan_Loai_Product_Item(); // phân loại sản phẩm
    // const list_product_item = await axiosInstance.get(`/products/product_item_by_productID/${ProductID}`);
    const infor_product = await axiosInstance.get(`/products/get_product_by_productID/${ProductID}`);
    let percent  = await axiosInstance.get(`/api/promotions/${ProductID}/percent`)
    let html_bo_nho = ``;
    document.querySelector(".product-title").innerHTML = `${infor_product.data.ProductName}`;

    document.querySelector(".product-thumbnails").innerHTML = ``;
    document.querySelector(".variants").innerHTML = ``;
    for(let i = 0; i < list.length; i++){
      html_bo_nho += `<a href="#" class="variant-option" onclick="clickVariantOption(event, ${i})">${list[i].ram+"-"+list[i].gb}</a>`;
      list[i].in_for.forEach((item) => {
        document.querySelector(".product-thumbnails").innerHTML += `<div class="thumbnail" onclick="click_img(event)">
                                                                    <img class="img_prd" src="../img/imgs${item.img}" alt="Ảnh sản phẩm">
                                                                    </div>`;
      })
    }
    document.querySelector(".variants").innerHTML += html_bo_nho;
    default_variantOption(list[0].in_for); // mặc định là sản phẩm đầu tiên
  } catch (error) {
    console.error("Error fetching product details:", error);
  }
}
async function default_variantOption(data) {
  document.querySelector(".variant-option").classList.add("active");
  document.querySelector(".thumbnail").classList.add("active");
  document.querySelector(".product-main-image").innerHTML = 
  `<img src="../img/imgs${data[0].img}" alt="Ảnh sản phẩm">`;
  default_Price_color(data); // mặc định là sản phẩm đầu tiên
}
async function default_Price_color(data){
  let percent  = await axiosInstance.get(`/api/promotions/${ProductID}/percent`)
  document.querySelector(".price").innerHTML = `
                             <span class="current">${(data[0].price - data[0].price*percent.data).toLocaleString("vi-VN")}₫</span>
                             <span class="original">${(data[0].price*1).toLocaleString("vi-VN")}₫</span>
                             <span class="discount">Giảm ${percent.data*100}%</span>`;
  let html = ``;
  document.querySelector(".bodytable_infor_product").innerHTML = html;
  document.querySelector(".colors").innerHTML = ``;
  for(let i = 0; i < data.length; i++){
    if(data[i].color !== null && data[i].color !== "") {
    document.querySelector(".colors").innerHTML += `
     <a href="#" class="variant-option color-option" onclick="click_color_option(event, ${data[i].price+","+data[i].id})" style="background-color: ${colorMap[data[i].color]};">
     <span>${data[i].color}</span>
     </a>`;
  } 
    const product_item = await axiosInstance.get(`/products/product_item_by_ID/${data[0].id}`);
    let html_chitiet = ``;
    product_item.data.data.attributes.forEach((attribute) => {
    if (attribute.variantName !== "Màu") {
        html_chitiet += `<tr>
        <td>${attribute.variantName}</td>
        <td>${attribute.values}</td>
        </tr>`
    }
    });
    document.querySelector(".bodytable_infor_product").innerHTML = html_chitiet;
  document.querySelector(".color-option")?.classList.add("active");
  product_item_ID_to_cart = data[0].id; // lấy id sản phẩm để thêm vào giỏ hàng
}
window.default_Price_color = default_Price_color;
}
async function clickVariantOption(event, id_list) {
  document.querySelectorAll(".variant-option").forEach(el => {
        el.classList.remove("active");
  });
  event.target.classList.add("active");
  document.querySelector(".colors").innerHTML = ``;
  for(let i = 0; i < list[id_list].in_for.length; i++){
    if(list[id_list].in_for[i].color !== null && list[id_list].in_for[i].color !== "") {
    document.querySelector(".colors").innerHTML += `
     <a href="#" class="variant-option color-option" onclick="click_color_option(event, ${list[id_list].in_for[i].price+","+list[id_list].in_for[i].id})" style="background-color: ${colorMap[list[id_list].in_for[i].color]};">
     <span>${list[id_list].in_for[i].color}</span>
     </a>`;
    }
  }
  default_Price_color(list[id_list].in_for); // mặc định là sản phẩm đầu tiên
}
window.clickVariantOption = clickVariantOption;
async function click_color_option(event, price, product_item_ID) {
  let percent  = await axiosInstance.get(`/api/promotions/${ProductID}/percent`)
  document.querySelectorAll(".color-option").forEach(el => {
    el.classList.remove("active");
  });
  event.target.closest(".color-option").classList.add("active");
  document.querySelector(".price").innerHTML = `
                             <span class="current">${(price - price*percent.data).toLocaleString("vi-VN")}₫</span>
                             <span class="original">${(price*1).toLocaleString("vi-VN")}₫</span>
                             <span class="discount">Giảm ${percent.data*100}%</span>`;

  const product_item = await axiosInstance.get(`/products/product_item_by_ID/${product_item_ID}`);
  let html_chitiet = ``;
  product_item.data.data.attributes.forEach((attribute) => {
  if (attribute.variantName !== "Màu") {
      html_chitiet += `<tr>
      <td>${attribute.variantName}</td>
      <td>${attribute.values}</td>
      </tr>`
  }
  });
  document.querySelector(".bodytable_infor_product").innerHTML = html_chitiet;
  product_item_ID_to_cart = product_item_ID; // lấy id sản phẩm để thêm vào giỏ hàng
}
window.click_color_option = click_color_option;
function click_img(event){
  document.querySelectorAll(".thumbnail").forEach(el => {
    el.classList.remove("active");
  });
  event.target.closest(".thumbnail").classList.add("active");
  let src_img = event.target.src;
  document.querySelector(".product-main-image").innerHTML = 
  `<img src="${src_img}" alt="Ảnh sản phẩm">`;
}
window.click_img = click_img;
async function Phan_Loai_Product_Item() {
  let data = await axiosInstance.get(`/products/product_item_by_productID/${ProductID}`);
  for(let i= 0; i<data.data.data.length; i++)
  {
    let attributes = {
      "Dung lượng RAM" : null,
      "Bộ nhớ trong"  : null,
      "Màu" : null,
    }
    let attributesData = JSON.parse(data.data.data[i].attributes || "[]");
    if (Array.isArray(attributesData)) {
      attributesData.forEach((attribute) => {
      if (attributes.hasOwnProperty(attribute.variantName)) {
          attributes[attribute.variantName] = attribute.values;
      }
      });
    } // tìm các giá trị value
    let {
      "Dung lượng RAM": ram,
      "Màu": color,
      "Bộ nhớ trong": gb,
    } = attributes; // gán các giá trị để sử dụng
    let check = list.find((item) => item.ram === ram && item.gb === gb);
    if(!check)
    {
      list.push({
        ram: ram,
        gb: gb,
        in_for: [{
          price: data.data.data[i].price,
          id: data.data.data[i].id,
          color: color,
          img: data.data.data[i].product_image,
        }]
      })
    }
    else{
      let check_color = check.in_for.find((item) => item.color === color);
      if(!check_color)
      {
        check.in_for.push({
          price: data.data.data[i].price,
          id: data.data.data[i].id,
          color: color,
          img: data.data.data[i].product_image,
        })
      }
    }
  }
}
document.querySelector(".btn-buy-now").addEventListener("click", async () => {
  await axiosInstance.post("/cart", {
    userID: 4,// đưa thằng đăng nhập vào
    Product_Item_ID: product_item_ID_to_cart,
    quantity: 1,
  })
  window.location.href = "http://127.0.0.1:5500/TMDT/cart.html"; // chuyển đến trang thanh toán
})
document.querySelector(".btn-add-cart").addEventListener("click", async () => {
  await axiosInstance.post("/cart", {
    userID: 4,// đưa thằng đăng nhập vào
    Product_Item_ID: product_item_ID_to_cart,
    quantity: 1,
  })
})