import axiosInstance from "./configAxios.js";
//định dạng giá hiển thị
function price_format(price) {
  if (price == "") return "";
  let price_str = "";
  price = price.slice(0, -3);
  let tmp = price;
  for (let i = price.length; i > 3; i -= 3) {
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
  return `
  <div class="product col l-3 m-4 c-6">
    <div class="product-box" onclick="showProductInfo(${item.ProductID})">
      <div class="product-img">
        <img src="${item.imageURL}"  alt="lỗi ảnh"/>
      </div>
      <div class="product-info">
        <h3 class="product-title">${item.ProductName}</h3>
        <div class="product-price">
          <p class="product-price-show">${price_format(item.Price)}</p>
          <p class="product-price-origin">${price_format(item.Price)}</p>
        </div>
        <a href="chitietsanpham.html?id=${
          item.ProductID
        }" class="product-btn">Chi tiết</a>
      </div>
    </div>
  </div>`;
}

//show sản phẩm
async function showProductMainPage() {
  if (location.href.includes("price") && !location.href.includes("brand")) {
    show_filter_price();
  } else if (location.href.includes("brand")) {
    show_filter_brand();
  } else {
    try {
      let res = await axiosInstance.get("/products");
      let products = res.data;

      let imageRes = await axiosInstance.get("/images");
      let images = imageRes.data;

      // Gán ảnh cho từng sản phẩm
      products.forEach((item) => {
        let imageItem = images.find((img) => img.ProductID === item.ProductID);
        item.imageURL =
          imageItem && imageItem.ImageURL
            ? `http://localhost:3000/${imageItem.ImageURL}.jpg`
            : "default-image.jpg";
      });

      // Hiển thị danh sách sản phẩm
      let html = "";
      products.forEach((item) => {
        html += show(item);
      });

      document.querySelector(".all-products").innerHTML = html;
      list = document.querySelectorAll(".all-products .product");
      loaditem();
    } catch (err) {
      console.error("Lỗi tải dữ liệu sản phẩm: ", err);
    }
  }
}
showProductMainPage();

//lọc theo hãng
async function show_filter_brand() {
  let tmp = location.href.split(/[?,=,&,-]/); // Tách đường dẫn
  let brandFilter = tmp[2].toUpperCase(); // Lấy tên hãng từ URL

  document.querySelector(".video").innerHTML = ""; // Xóa video
  document.querySelector(".slide-show").classList.remove("hide"); // Hiển thị slide show
  document.querySelector(".all-products").innerHTML = ""; // Reset danh sách sản phẩm

  try {
    let res = await axiosInstance.get("/products");
    let products = res.data;

    let imageRes = await axiosInstance.get("/images");
    let images = imageRes.data;

    let brandFilter = tmp[2].toUpperCase(); // Hãng cần lọc
    let minPrice = parseInt(tmp[4]); // Giá thấp nhất
    let maxPrice = parseInt(tmp[5]); // Giá cao nhất

    let filteredProducts = products.filter((product) => {
      let matchesBrand = product.Brand.toUpperCase() === brandFilter; // Kiểm tra hãng
      let price = parseInt(product.Price_show);

      if (location.href.includes("price")) {
        return matchesBrand && price >= minPrice && price <= maxPrice; // Lọc cả hãng & giá
      }
      return matchesBrand; // Chỉ lọc theo hãng
    });

    // Gán URL ảnh cho sản phẩm
    filteredProducts.forEach((item) => {
      let imageItem = images.find((img) => img.ProductID === item.ProductID);
      item.imageURL = imageItem
        ? `http://localhost:3000/${imageItem.ImageURL}.jpg`
        : "default-image.jpg";
    });

    filteredProducts.forEach((item) => {
      document.querySelector(".all-products").innerHTML += show(item);
    });

    list = document.querySelectorAll(".all-products .product");
    loaditem();
  } catch (error) {
    console.error("Lỗi khi lấy dữ liệu từ API:", error);
  }
}

// lọc theo giá
async function show_filter_price() {
  let tmp = location.href.split(/[?,=,-]/);
  let minPrice = parseInt(tmp[2]);
  let maxPrice = parseInt(tmp[3]);
  document.querySelector(".all-products").innerHTML = "";

  try {
    let res = await axiosInstance.get("/products");
    let products = res.data;

    let imageRes = await axiosInstance.get("/images");
    let images = imageRes.data;

    let filteredProducts = products;

    // Lọc sản phẩm theo khoảng giá
    filteredProducts = products.filter((product) => {
      let price = parseInt(product.Price_show);
      return price >= minPrice && price <= maxPrice;
    });

    // Gán ảnh sản phẩm
    filteredProducts.forEach((item) => {
      let imageItem = images.find((img) => img.ProductID === item.ProductID);
      item.imageURL = imageItem
        ? `http://localhost:3000/${imageItem.ImageURL}.jpg`
        : "default-image.jpg";
    });

    document.querySelector(".all-products").innerHTML = "";
    filteredProducts.forEach((item) => {
      document.querySelector(".all-products").innerHTML += show(item);
    });

    list = document.querySelectorAll(".all-products .product");
    loaditem();
  } catch (err) {
    console.error("Lỗi khi lọc sản phẩm theo giá: ", err);
  }
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
function listPage() {
  let count = Math.ceil(list.length / limit);
  let pagination = document.querySelector(".list-page");
  pagination.innerHTML = "";

  if (thispage > 1) {
    let prev = document.createElement("li");
    prev.innerText = "Trước";
    prev.addEventListener("click", () => changePage(thispage - 1));
    pagination.appendChild(prev);
  }

  for (let i = 1; i <= count; i++) {
    let newPage = document.createElement("li");
    newPage.innerText = i;
    if (i == thispage) newPage.classList.add("page-current");
    newPage.addEventListener("click", () => changePage(i));
    pagination.appendChild(newPage);
  }

  if (thispage < count) {
    let next = document.createElement("li");
    next.innerText = "Sau";
    next.addEventListener("click", () => changePage(thispage + 1));
    pagination.appendChild(next);
  }
}

function changePage(i) {
  thispage = i;
  loaditem();
}
