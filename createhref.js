createForBrand();
function createForBrand() {
  let listBrand = ["apple", "samsung", "xiaomi", "oppo", "realme"];
  let betweenHeader = document.getElementsByClassName("brand");
  for (let i = 0; i < listBrand.length; i++) {
    betweenHeader[i].innerHTML =
      '<a href="index.html?' +
      listBrand[i] +
      '">' +
      listBrand[i].toUpperCase() +
      "</a>";
  }
  showProductBrand();
}

function showProductBrand() {
  let tmp = location.href.split("?");
  if (tmp.length == 2) {
    document.querySelector(".video").innerHTML = "";
    document.querySelector(".all-products").innerHTML = "";
    let list_json = JSON.parse(localStorage.getItem("json-products"));
    for (let i = 0; i < list_json.length; i++) {
      if (tmp[1].toUpperCase() == list_json[i].brand)
        document.querySelector(".all-products").innerHTML += show(list_json[i]);
    }
  }
}
function show(item) {
  return `<div class="product col l-3 m-4 c-6">
<div class="product-box" onclick="showProductInfo(${item.productId})">
  <div class="product-img">
    <img
      src="${item.img}"  alt="lỗi ảnh"
    />
  </div>
  <div class="product-info">
    <h3 class="product-title">${item.title}</h3>
    <div class="product-price">
      <p class="product-price-show">${price_format(item.price_show)}</p>
      <p class="product-price-origin">${price_format(item.price_origin)}</p>
    </div>
    <a href="chitietsanpham.html" class="product-btn">Chi tiết</a>
  </div>
</div>
</div>`;
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
