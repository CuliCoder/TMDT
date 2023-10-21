let product_title = document.getElementById("product-title");
let product_brand = document.getElementById("brand");
let choose_img = document.getElementById("choose-img");
let product_price_show = document.getElementById("product-price-show");
let product_price_origin = document.getElementById("product-price-origin");
let products = JSON.parse(localStorage.getItem("json-products"));
let img_add = document.querySelector(".img-add");
let limit = 12;
let thisPage = 1;
let list;
let notification = document.querySelector(".notification");
function checkInputForAddproductForm() {
  notification.innerHTML = "";
  if (product_title.value == "" || product_price_show.value == "") {
    let ntf_error = document.createElement("div");
    ntf_error.innerHTML =
      '<i class="bx bx-x"></i>Vui lòng nhập đầy đủ thông tin';
    ntf_error.classList.add("error");
    notification.appendChild(ntf_error);
    ntf_error.style.animation = "showNotification 3s linear";
  } else if (
    isNaN(product_price_show.value) ||
    isNaN(product_price_origin.value)
  ) {
    let ntf_error = document.createElement("div");
    ntf_error.innerHTML = '<i class="bx bx-x"></i>Giá không hợp lệ';
    ntf_error.classList.add("error");
    notification.appendChild(ntf_error);
    ntf_error.style.animation = "showNotification 3s linear";
  } else {
    let ntf_complete = document.createElement("div");
    ntf_complete.innerHTML =
      '<i class="bx bx-check"></i>Thêm sản phẩm thành công';
    ntf_complete.classList.add("complete");
    notification.appendChild(ntf_complete);
    ntf_complete.style.animation = "showNotification 3s linear";
    addProduct();
  }
}
function changeImg(file) {
  const reader = new FileReader();
  reader.onload = (evt) => {
    console.log(evt.target.result);
    img_add.src = evt.target.result;
  };
  reader.readAsDataURL(file.files[0]);
}

function addProduct() {
  let new_product = {
    img: img_add.src,
    title: product_title.value,
    brand: product_brand.value,
    price_show: product_price_show.value,
    price_origin: product_price_origin.value,
  };
  products.unshift(new_product);
  products[0].productId = products[1].productId + 1;
  let json_products = JSON.stringify(products);
  localStorage.setItem("json-products", json_products);
  //localStorage.setItem("add-product", "true");
  // localStorage.setItem("product-title", product_title.value);
  // localStorage.setItem("product-img", product_img.value);
  // localStorage.setItem("product-price-show", product_price_show.value);
  // localStorage.setItem("product-price-origin", product_price_origin.value);
  // console.log(product_title.value);
  loadPage();
}
loadPage();
function loadPage() {
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
              <button type="submit" class="delete-product">X</button>
              <button type="submit" class="edit-product">SỬA</button>
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
