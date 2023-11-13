let thisPage_search = 1;
let limit_search = 6;
let list_search;
close_search_box();
function close_search_box() {
  document.querySelector(".search-bg").addEventListener("click", (e) => {
    if (e.target == e.currentTarget)
      document.querySelector(".search-bg").classList.toggle("hide");
  });
}
search();
function search() {
  let search_box = document.querySelector("#search");
  search_box.addEventListener("input", (e) => {
    let txt_search = e.target.value.trim().toLowerCase();
    document.querySelector(".search-bg .products").innerHTML = "";
    let json_product = JSON.parse(localStorage.getItem("json-products"));
    for (let i = 0; i < json_product.length; i++)
      if (json_product[i].title.toLowerCase().includes(txt_search))
        document.querySelector(
          ".search-bg .products"
        ).innerHTML += `<div class="item-product" onclick="showProductInfo(${
          json_product[i].productId
        })"><img src="${
          json_product[i].img
        }" alt="" /><div class="info"><div class="title">${
          json_product[i].title
        }</div><div class="price-show">${price_format(
          json_product[i].price_show
        )}</div></div></div>`;
    list_search = document.querySelectorAll(
      ".search-bg .products .item-product"
    );
    loadItem_search();
  });
}
function loadItem_search() {
  let beginIndex = limit_search * (thisPage_search - 1);
  let endIndex = limit_search * thisPage_search - 1;
  for (let i = 0; i < list_search.length; i++) {
    if (i >= beginIndex && i <= endIndex) list_search[i].style.display = "flex";
    else list_search[i].style.display = "none";
  }
  listPage_search();
}

function listPage_search() {
  let count = Math.ceil(list_search.length / limit_search);
  document.querySelector(".search-bg .list-page-search").innerHTML = "";
  if (thisPage_search != 1) {
    let prev = document.createElement("li");
    prev.innerText = "Trước";
    prev.setAttribute(
      "onclick",
      "changePage_search(" + (thisPage_search - 1) + ")"
    );
    document.querySelector(".search-bg .list-page-search").appendChild(prev);
  }
  for (let i = 1; i <= count; i++) {
    let newPage = document.createElement("li");
    newPage.innerText = i;
    if (i == thisPage_search) newPage.classList.add("page-current");
    newPage.setAttribute("onclick");
    document.querySelector(".search-bg .list-page-search").appendChild(newPage);
  }
  if (thisPage_search != count) {
    let next = document.createElement("li");
    next.innerText = "Sau";
    next.setAttribute(
      "onclick",
      "changePage_search(" + (thisPage_search + 1) + ")"
    );
    document.querySelector(".search-bg .list-page-search").appendChild(next);
  }
}
function changePage_search(i) {
  thisPage_search = i;
  loadItem_search();
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
function showProductInfo(id_product) {
  let products = JSON.parse(localStorage.getItem("json-products"));
  for (let i = 0; i < products.length; i++) {
    if (products[i].productId == id_product) {
      localStorage.setItem("ProductInfo", JSON.stringify(products[i]));
    }
  }
  location.href = "chitietsanpham.html";
}
document.querySelector(".header .cart").addEventListener("click", () => {
  let userLogin = JSON.parse(localStorage.getItem("userLogin"));
  if (userLogin == null) {
    alert("Vui lòng đăng nhập!");
  } else if (userLogin != null && userLogin.status != "Hoạt động") {
    alert("Tài khoản bị khóa không thể vào giỏ hàng!");
  } else {
    location.href = "giohang.html";
  }
});
