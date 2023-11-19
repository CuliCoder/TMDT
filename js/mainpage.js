//định dạng giá hiển thị
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
let limit = 12; //số sản phẩm trong 1 trang
let thispage = 1; //trang hiện tại
let list; //danh sách các sản phẩm đã được hiển thị
//hiển thị 1 sản phẩm
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
//show sản phẩm
showProductMainPage();
function showProductMainPage() {
  if (location.href.includes("price") && !location.href.includes("brand"))
    //lọc theo giá
    show_filter_price();
  else if (location.href.includes("brand")) show_filter_brand(); //lọc theo hãng
  else {
    //show tất cả
    let products = JSON.parse(localStorage.getItem("json-products"));
    document.querySelector(".all-products").innerHTML = "";
    for (let i = 0; i < products.length; i++)
      document.querySelector(".all-products").innerHTML += show(products[i]);
    list = document.querySelectorAll(".all-products .product");
    loaditem(); //bắt đầu phân trang
  }
}
//lọc theo hãng
function show_filter_brand() {
  let tmp = location.href.split(/[?,=,&,-]/); //tách đường dẫn
  document.querySelector(".video").innerHTML = ""; //xóa video
  document.querySelector(".slide-show").classList.remove("hide"); //hiển thị slide show
  document.querySelector(".all-products").innerHTML = ""; //reset chứa các  sản phẩm
  let list_json = JSON.parse(localStorage.getItem("json-products")); //lấy dữ liệu từ localStorage
  for (let i = 0; i < list_json.length; i++) {
    if (location.href.includes("price")) {
      if (
        tmp[2].toUpperCase() == list_json[i].brand &&
        parseInt(list_json[i].price_show) >= parseInt(tmp[4]) &&
        parseInt(list_json[i].price_show) <= parseInt(tmp[5])
      )
        //lọc theo hãng và giá
        document.querySelector(".all-products").innerHTML += show(list_json[i]);
    } else if (tmp[2].toUpperCase() == list_json[i].brand) {
      //lọc theo hãng
      document.querySelector(".all-products").innerHTML += show(list_json[i]);
    }
  }
  list = document.querySelectorAll(".all-products .product");
  loaditem(); //phân trang
}
//lọc theo giá
function show_filter_price() {
  let tmp = location.href.split(/[?,=,-]/);
  let products = JSON.parse(localStorage.getItem("json-products"));
  document.querySelector(".all-products").innerHTML = "";
  for (let i = 0; i < products.length; i++) {
    if (
      parseInt(products[i].price_show) >= parseInt(tmp[2]) &&
      parseInt(products[i].price_show) <= parseInt(tmp[3])
    ) {
      document.querySelector(".all-products").innerHTML += show(products[i]);
    }
  }
  list = document.querySelectorAll(".all-products .product");
  loaditem(); //phân trang
}
function loaditem() {
  let beginget = limit * (thispage - 1); //index start
  let endget = limit * thispage - 1; //index end
  for (let i = 0; i < list.length; i++) {
    if (i >= beginget && i <= endget) list[i].style.display = "block";
    else list[i].style.display = "none";
  }
  listPage();
}
loaditem();
function listPage() {
  let count = Math.ceil(list.length / limit); //tổng số trang cần có
  document.querySelector(".list-page").innerHTML = "";
  if (thispage != 1) {
    let prev = document.createElement("li");
    prev.innerText = "Trước";
    prev.setAttribute("onclick", "changePage(" + (thispage - 1) + ")");
    document.querySelector(".list-page").appendChild(prev);
  }
  for (i = 1; i <= count; i++) {
    let newPage = document.createElement("li");
    newPage.innerText = i;
    if (i == thispage) newPage.classList.add("page-current");
    newPage.setAttribute("onclick", "changePage(" + i + ")");
    document.querySelector(".list-page").appendChild(newPage);
  }
  if (thispage != count) {
    let next = document.createElement("li");
    next.innerText = "Sau";
    next.setAttribute("onclick", "changePage(" + (thispage + 1) + ")");
    document.querySelector(".list-page").appendChild(next);
  }
}
function changePage(i) {
  thispage = i;
  loaditem();
}
