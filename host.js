//create
//add product
let product_title = document.getElementById("product-title");
let product_brand = document.getElementById("brand");
let choose_img = document.getElementById("choose-img");
let product_price_show = document.getElementById("product-price-show");
let product_price_origin = document.getElementById("product-price-origin");
let img_add = document.querySelector(".img-add");
let info = document.querySelectorAll(
  ".add-product form > div:nth-child(2) input"
);
let limit = 12;
let thisPage = 1;
let list;
let notification = document.querySelector(".notification");
//edit
let img_edit = document.querySelector(".img-edit");
let edit_product_bg = document.querySelector(".editproduct-bg");
let edit_title = document.getElementById("edit-title");
let edit_brand = document.getElementById("edit-brand");
let edit_price_show = document.getElementById("ed-product-price-show");
let edit_price_origin = document.getElementById("ed-product-price-origin");
let info_edit = document.querySelectorAll(
  ".editproduct-box form > div:nth-child(2) input"
);
//search
let search_text = document.querySelector("#search-product");
let search_brand = document.querySelector("#search-brand");
search_brand.addEventListener("change", (e) => {
  document.querySelector(".products").innerHTML = `<li class="top-list">
  <ul>
    <li>#ID</li>
    <li>ẢNH</li>
    <li>TÊN SẢN PHẨM</li>
    <li>HÃNG ĐIỆN THOẠI</li>
    <li>GIÁ</li>
    <li></li>
  </ul>
</li>`;
  let products = JSON.parse(localStorage.getItem("json-products"));
  if (e.target.value == "")
    for (let i = 0; i < products.length; i++) {
      if (
        products[i].title
          .toLowerCase()
          .includes(search_text.value.trim().toLowerCase())
      )
        document.querySelector(".products").innerHTML += showProducts(
          products[i]
        );
    }
  else
    for (let i = 0; i < products.length; i++) {
      if (
        products[i].title
          .toLowerCase()
          .includes(search_text.value.trim().toLowerCase()) &&
        e.target.value == products[i].brand
      )
        document.querySelector(".products").innerHTML += showProducts(
          products[i]
        );
    }
  list = document.querySelectorAll(".products .item");

  loadItem();
});
search_text.addEventListener("input", (e) => {
  let txt = e.target.value.trim().toLowerCase();
  document.querySelector(".products").innerHTML = `<li class="top-list">
  <ul>
    <li>#ID</li>
    <li>ẢNH</li>
    <li>TÊN SẢN PHẨM</li>
    <li>HÃNG ĐIỆN THOẠI</li>
    <li>GIÁ</li>
    <li></li>
  </ul>
</li>`;
  let products = JSON.parse(localStorage.getItem("json-products"));
  if (search_brand.value == "")
    for (let i = 0; i < products.length; i++) {
      if (products[i].title.toLowerCase().includes(txt))
        document.querySelector(".products").innerHTML += showProducts(
          products[i]
        );
    }
  else
    for (let i = 0; i < products.length; i++) {
      if (
        products[i].title.toLowerCase().includes(txt) &&
        search_brand.value == products[i].brand
      )
        document.querySelector(".products").innerHTML += showProducts(
          products[i]
        );
    }
  list = document.querySelectorAll(".products .item");

  loadItem();
});
//delete && edit
let index_edit;
function btn_edit(id_product) {
  let products = JSON.parse(localStorage.getItem("json-products"));
  for (let i = 0; i < products.length; i++) {
    if (id_product == products[i].productId) {
      index_edit = i;
      edit_product_bg.classList.toggle("hide");
      img_edit.src = products[i].img;
      edit_brand.value = products[i].brand;
      edit_title.value = products[i].title;
      edit_price_show.value = products[i].price_show;
      edit_price_origin.value = products[i].price_origin;
      info_edit[0].value = products[i].screen_size;
      info_edit[1].value = products[i].screen_technology;
      info_edit[2].value = products[i].rear_camera;
      info_edit[3].value = products[i].front_camera;
      info_edit[4].value = products[i].Chipset;
      info_edit[5].value = products[i].RAM_capacit;
      info_edit[6].value = products[i].internal_storage;
      info_edit[7].value = products[i].Pin;
      info_edit[8].value = products[i].SIM_card;
      info_edit[9].value = products[i].OS;
      info_edit[10].value = products[i].screen_resolution;
      info_edit[11].value = products[i].screen_features;
    }
  }
}
function edit(indexCurrent) {
  let products = JSON.parse(localStorage.getItem("json-products"));
  products[indexCurrent].img = img_edit.src;
  products[indexCurrent].title = edit_title.value;
  products[indexCurrent].brand = edit_brand.value;
  products[indexCurrent].price_show = edit_price_show.value;
  products[indexCurrent].price_origin = edit_price_origin.value;
  products[indexCurrent].screen_size = info_edit[0].value;
  products[indexCurrent].screen_technology = info_edit[1].value;
  products[indexCurrent].rear_camera = info_edit[2].value;
  products[indexCurrent].front_camera = info_edit[3].value;
  products[indexCurrent].Chipset = info_edit[4].value;
  products[indexCurrent].RAM_capacit = info_edit[5].value;
  products[indexCurrent].internal_storage = info_edit[6].value;
  products[indexCurrent].Pin = info_edit[7].value;
  products[indexCurrent].SIM_card = info_edit[8].value;
  products[indexCurrent].OS = info_edit[9].value;
  products[indexCurrent].screen_resolution = info_edit[10].value;
  products[indexCurrent].screen_features = info_edit[11].value;
  localStorage.setItem("json-products", JSON.stringify(products));
}
close_edit_box();
function close_edit_box() {
  let btn_close = document.querySelector(".close-edit-box");
  btn_close.addEventListener("click", () => {
    edit_product_bg.classList.toggle("hide");
  });
  edit_product_bg.addEventListener("click", (e) => {
    if (e.target == e.currentTarget) edit_product_bg.classList.toggle("hide");
  });
}
function btn_delete(id_product) {
  let result = confirm(
    "Bạn có chắc muốn xóa sản phẩm với id " + id_product + "?"
  );
  let products = JSON.parse(localStorage.getItem("json-products"));
  for (let i = 0; i < products.length; i++) {
    if (id_product == products[i].productId)
      if (result) {
        products.splice(i, 1);
        localStorage.setItem("json-products", JSON.stringify(products));
        loadPage();
        showSuccess("Xóa sản phẩm thành công");
      }
  }
}
//notification
function showError(message) {
  notification.innerHTML = "";
  let ntf_error = document.createElement("div");
  ntf_error.innerHTML = '<i class="bx bx-x"></i>' + message;
  ntf_error.classList.add("error");
  notification.appendChild(ntf_error);
  ntf_error.style.animation = "showNotification 3s linear";
}
function showSuccess(message) {
  notification.innerHTML = "";
  let ntf_complete = document.createElement("div");
  ntf_complete.innerHTML = '<i class="bx bx-check"></i>' + message;
  ntf_complete.classList.add("complete");
  notification.appendChild(ntf_complete);
  ntf_complete.style.animation = "showNotification 3s linear";
}
function checkInputForForm() {
  if (!edit_product_bg.classList.contains("hide")) {
    if (edit_title.value == "" || edit_price_show.value == "") {
      showError("Vui lòng nhập đầy đủ thông tin");
    } else if (isNaN(edit_price_show.value) || isNaN(edit_price_origin.value)) {
      showError("Giá không hợp lệ");
    } else if (
      parseInt(edit_price_origin.value) < parseInt(edit_price_show.value)
    ) {
      showError("Giá hiển thị phải thấp hơn giá gốc");
    } else {
      showSuccess("Sửa sản phẩm thành công");
      edit(index_edit);
    }
  } else {
    if (product_title.value == "" || product_price_show.value == "") {
      showError("Vui lòng nhập đầy đủ thông tin");
    } else if (
      isNaN(product_price_show.value) ||
      isNaN(product_price_origin.value)
    ) {
      showError("Giá không hợp lệ");
    } else if (
      parseInt(product_price_origin.value) < parseInt(product_price_show.value)
    ) {
      showError("Giá hiển thị phải thấp hơn giá gốc");
    } else {
      showSuccess("Thêm sản phẩm thành công");
      addProduct();
    }
  }
}
//img
function changeImg(file) {
  const reader = new FileReader();
  reader.onload = (evt) => {
    console.log(evt.target.result);
    if (!edit_product_bg.classList.contains("hide"))
      img_edit.src = evt.target.result;
    else img_add.src = evt.target.result;
  };
  reader.readAsDataURL(file.files[0]);
}
//add product
function addProduct() {
  let products = JSON.parse(localStorage.getItem("json-products"));
  let new_product = {
    img: img_add.src,
    title: product_title.value,
    brand: product_brand.value,
    price_show: product_price_show.value,
    price_origin: product_price_origin.value,
    screen_size: info[0].value,
    screen_technology: info[1].value,
    rear_camera: info[2].value,
    front_camera: info[3].value,
    Chipset: info[4].value,
    RAM_capacit: info[5].value,
    internal_storage: info[6].value,
    Pin: info[7].value,
    SIM_card: info[8].value,
    OS: info[9].value,
    screen_resolution: info[10].value,
    screen_features: info[11].value,
  };
  products.unshift(new_product);
  products[0].productId = products[1].productId + 1;
  let json_products = JSON.stringify(products);
  localStorage.setItem("json-products", json_products);
  loadPage();
}
//load page
loadPage();
function loadPage() {
  let products = JSON.parse(localStorage.getItem("json-products"));
  document.querySelector(".products").innerHTML = `<li class="top-list">
  <ul>
    <li>#ID</li>
    <li>ẢNH</li>
    <li>TÊN SẢN PHẨM</li>
    <li>HÃNG ĐIỆN THOẠI</li>
    <li>GIÁ</li>
    <li></li>
  </ul>
</li>`;
  for (let i = 0; i < products.length; i++) {
    document.querySelector(".products").innerHTML += showProducts(products[i]);
  }
  list = document.querySelectorAll(".products .item");

  loadItem();
}
function showProducts(item) {
  return `<li class="item">
          <ul>
            <li>${item.productId}</li>
            <li>
              <img
                src="${item.img}"
                alt=""
              />
            </li>
            <li>${item.title}</li>
            <li>${item.brand}</li>
            <li>
              <p class="price-show">${price_format(item.price_show)}</p>
              <p class="price-origin">${price_format(item.price_origin)}</p>
            </li>
            <li>
              <button type="submit" class="delete-product" onclick="btn_delete(${
                item.productId
              })">X</button>
              <button type="submit" class="edit-product" onclick="btn_edit(${
                item.productId
              })">SỬA</button>
            </li>
          </ul>
        </li>`;
}

function loadItem() {
  let beginIndex = limit * (thisPage - 1);
  let endIndex = limit * thisPage - 1;
  for (let i = 0; i < list.length; i++) {
    if (i >= beginIndex && i <= endIndex) list[i].style.display = "block";
    else list[i].style.display = "none";
  }
  listPage();
}
function listPage() {
  let count = Math.ceil(list.length / limit);
  document.querySelector(".list-page").innerHTML = "";
  if (thisPage != 1) {
    let prev = document.createElement("li");
    prev.innerText = "Trước";
    prev.setAttribute("onclick", "changePage(" + (thisPage - 1) + ")");
    document.querySelector(".list-page").appendChild(prev);
  }
  for (let i = 1; i <= count; i++) {
    let newPage = document.createElement("li");
    newPage.innerText = i;
    if (i == thisPage) {
      newPage.classList.add("page-current");
    }
    newPage.setAttribute("onclick", "changePage(" + i + ")");
    document.querySelector(".list-page").appendChild(newPage);
  }
  if (thisPage != count) {
    let next = document.createElement("li");
    next.innerText = "Sau";
    next.setAttribute("onclick", "changePage(" + (thisPage + 1) + ")");
    document.querySelector(".list-page").appendChild(next);
  }
}
function changePage(i) {
  thisPage = i;
  loadItem();
}
function price_format(price) {
  if (price == "") return "";
  let price_str = "";
  let tmp = price;
  for (i = price.length; i > 3; i -= 3) {
    price_str = "." + tmp.slice(-3) + price_str;
    tmp = tmp.substr(0, i - 3);
  }
  tmp = tmp.slice(0);
  return tmp + price_str + "₫";
}
//header
let header_bar = document.querySelector(".header>div").children;
let arr_href = [
  "index.html",
  "product_page.html",
  "order_page.html",
  "customers_page.html",
  "statistics_page.html",
];
for (let i = 1; i < header_bar.length - 1; i++) {
  header_bar[i].addEventListener("click", () => {
    location.href = arr_href[i - 1];
  });
}
let userLogin = JSON.parse(localStorage.getItem("userLogin"));
header_bar[6].children[1].innerHTML = userLogin.FullName;
header_bar[6].addEventListener("click", () => {
  localStorage.removeItem("userLogin");
  location.href = "index.html";
});
