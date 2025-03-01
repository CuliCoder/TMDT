import axiosInstance from "./configAxios.js";

let limit = 12;
let thisPage = 1;
let list;
let notification = document.querySelector(".notification"); //phần thông báo
//danh sách sản phẩm
async function loadPage() {
  try {
    let productRes = await axiosInstance.get("/products");
    let product = productRes.data;

    let imageRes = await axiosInstance.get("/images");
    let images = imageRes.data;

    product.forEach((item) => {
      let imageItem = images.find((img) => img.ProductID === item.ProductID);
      item.imageURL =
        imageItem && imageItem.ImageURL
          ? `http://localhost:3000/${imageItem.ImageURL}.jpg`
          : "default-image.jpg";
    });

    let html = `
      <li class="top-list">
        <ul>
          <li>#ID</li>
          <li>ẢNH</li>
          <li>TÊN SẢN PHẨM</li>
          <li>HÃNG ĐIỆN THOẠI</li>
          <li>GIÁ</li>
          <li></li>
        </ul>
      </li>`;

    product.forEach((item) => {
      html += showProducts(item);
    });

    // Cập nhật toàn bộ danh sách sản phẩm một lần duy nhất
    document.querySelector(".products").innerHTML = html;
    list = document.querySelectorAll(".products .item");
    loadItem();
  } catch (error) {
    console.error("Lỗi khi tải danh sách sản phẩm từ API:", error);
    document.querySelector(".products").innerHTML =
      "<p>Không thể tải danh sách sản phẩm.</p>";
  }
}
loadPage();
//show sản phẩm
function showProducts(item) {
  return `<li class="item">
          <ul>
            <li>${item.ProductID}</li>
            <li>
              <img
                src="${item.imageURL}"
                alt=""
              />
            </li>
            <li>${item.ProductName}</li>
            <li>${item.Brand}</li>
            <li>
              <p class="price-show">${price_format(item.Price)}</p>
              <p class="price-origin">${price_format(item.Price)}</p>
            </li>
            <li>
              <button type="submit" class="delete-product" data-id="${
                item.ProductID
              }">X</button>
              <button type="submit" class="edit-product" data-id="${
                item.ProductID
              }">SỬA</button>
            </li>
          </ul>
        </li>`;
}
//--------thêm sản phẩm-------
let product_title = document.getElementById("product-title");
let product_brand = document.getElementById("brand");
let product_price_show = document.getElementById("product-price-show");
let product_price_origin = document.getElementById("product-price-origin");
let img_add = document.querySelector(".img-add");
let info = document.querySelectorAll(
  ".add-product form > div:nth-child(2) input"
);
//thêm sản phẩm
async function addProduct() {
  try {
    // Tạo dữ liệu sản phẩm
    let new_product = {
      ProductName: product_title.value,
      Brand: product_brand.value,
      Price_origin: parseFloat(product_price_origin.value),
      Price_show: parseFloat(product_price_show.value),
      StockQuantity: 10,
      screen_size: info[0]?.value,
      screen_technology: info[1]?.value,
      rear_camera: info[2]?.value,
      front_camera: info[3]?.value,
      Chipset: info[4]?.value,
      RAM_capacity: info[5]?.value,
      internal_storage: info[6]?.value,
      pin: info[7]?.value,
      SIM_card: info[8]?.value,
      OS: info[9]?.value,
      screen_resolution: info[10]?.value,
      screen_features: info[11]?.value,
    };

    console.log("Dữ liệu gửi đi:", new_product);

    // Gửi sản phẩm lên server trước
    let productRes = await axiosInstance.post("/products", new_product);

    if (productRes.data.success) {
      let productId = productRes.data.product.ProductID; // Lấy ID sản phẩm vừa tạo

      // Kiểm tra xem có ảnh không
      let file = document.getElementById("choose-img").files[0];
      if (file) {
        let imageRes = await axiosInstance.post("/images", newImage);

        if (imageRes.data.success) {
          let ImageID = imageRes.data.data.ImageID; // Lấy imageId từ server
          let imageURL = `/products/${100000 + ImageID}`; // Tạo đường dẫn đúng

          // 4️⃣ Cập nhật lại ImageURL và đảm bảo ProductID khớp
          await axiosInstance.post("/images/update", {
            ProductID: productId, // Đảm bảo ProductID đúng
            ImageID: imageURL,
          });

          console.log("✅ Ảnh đã upload:", ImageID);
        }
      }

      // Cập nhật danh sách sản phẩm ngay sau khi thêm
      await showProductMainPage();
    }
  } catch (error) {
    console.error("Lỗi khi thêm sản phẩm:", error);
  }
}

//--------chỉnh sửa sản phẩm--------
let img_edit = document.querySelector(".img-edit");
let edit_product_bg = document.querySelector(".editproduct-bg");
let edit_title = document.getElementById("edit-title");
let edit_brand = document.getElementById("edit-brand");
let edit_price_show = document.getElementById("ed-product-price-show");
let edit_price_origin = document.getElementById("ed-product-price-origin");
let info_edit = document.querySelectorAll(
  ".editproduct-box form > div:nth-child(2) input"
);
let current_product_id; // Biến lưu ID sản phẩm đang chỉnh sửa

document.addEventListener("click", function (event) {
  if (event.target.classList.contains("edit-product")) {
    let productID = event.target.getAttribute("data-id");
    btn_edit(productID);
  }
});

//nút sửa
async function btn_edit(id_product) {
  // Hiển thị box chỉnh sửa
  edit_product_bg.classList.remove("hide");
  try {
    let response = await axiosInstance.get(`/products/${id_product}`);
    let product = response.data;

    // Lưu ID sản phẩm hiện tại
    current_product_id = id_product;

    // Điền dữ liệu vào form, khớp với tên thuộc tính từ showProducts
    img_edit.src = product.imageURL || ""; // Dùng imageURL từ showProducts
    edit_title.value = product.ProductName || "";
    edit_brand.value = product.Brand || ""; // Giá trị phải khớp với các option trong select
    edit_price_show.value = product.Price_show || "";
    edit_price_origin.value = product.Price_origin || "";
    info_edit[0].value = product.screen_size || "";
    info_edit[1].value = product.screen_technology || "";
    info_edit[2].value = product.rear_camera || "";
    info_edit[3].value = product.front_camera || "";
    info_edit[4].value = product.Chipset || "";
    info_edit[5].value = product.RAM_capacit || "";
    info_edit[6].value = product.internal_storage || "";
    info_edit[7].value = product.pin || "";
    info_edit[8].value = product.SIM_card || "";
    info_edit[9].value = product.OS || "";
    info_edit[10].value = product.screen_resolution || "";
    info_edit[11].value = product.screen_features || "";
  } catch (error) {
    console.error("Lỗi khi lấy dữ liệu sản phẩm:", error);
  }
}
// thực hiện sửa
async function edit(id_product) {
  try {
    let updatedProduct = {
      img: img_edit.src, // Ảnh sản phẩm
      ProductName: edit_title.value, // Tiêu đề sản phẩm
      Brand: edit_brand.value, // Thương hiệu
      Price_show: edit_price_show.value, // Giá hiển thị
      Price_origin: edit_price_origin.value, // Giá gốc
      screen_size: info_edit[0].value, // Kích thước màn hình
      screen_technology: info_edit[1].value, // Công nghệ màn hình
      rear_camera: info_edit[2].value, // Camera sau
      front_camera: info_edit[3].value, // Camera trước
      Chipset: info_edit[4].value, // Chip xử lý
      RAM_capacit: info_edit[5].value, // Dung lượng RAM
      internal_storage: info_edit[6].value, // Bộ nhớ trong
      pin: info_edit[7].value, // Dung lượng pin
      SIM_card: info_edit[8].value, // Thẻ SIM
      OS: info_edit[9].value, // Hệ điều hành
      screen_resolution: info_edit[10].value, // Độ phân giải màn hình
      screen_features: info_edit[11].value, // Tính năng màn hình
    };

    let response = await axiosInstance.put(
      `/products/${id_product}`,
      updatedProduct
    );

    // Dữ liệu trả về từ server (đã được axios tự động phân tích)
    let updatedData = response.data;

    // Xử lý khi cập nhật thành công
    console.log("Sản phẩm đã được cập nhật thành công:", updatedData);
  } catch (error) {
    console.error("Lỗi khi cập nhật sản phẩm:", error);
  }
}

//đọc file ảnh
window.changeImg = changeImg;
function changeImg(input) {
  let file = input.files[0]; // Lấy file ảnh
  if (file) {
    let reader = new FileReader();
    reader.onload = function (e) {
      document.querySelector(".img-add").src = e.target.result; // Hiển thị ảnh
    };
    reader.readAsDataURL(file);
  }
}

//đóng box chỉnh sửa
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
// gắn sự kiện nút xóa
document.addEventListener("click", function (event) {
  if (event.target.classList.contains("delete-product")) {
    let productID = event.target.getAttribute("data-id");
    btn_delete(productID);
  }
});

//----xóa sản phẩm------
async function btn_delete(id_product) {
  let result = confirm("Bạn có chắc muốn xóa sản phẩm ID " + id_product + "?");

  if (result) {
    try {
      // Gọi API xóa sản phẩm trên server
      let response = await axiosInstance.delete(`/products/${id_product}`);

      if (response.data.success) {
        showSuccess("Xóa sản phẩm thành công");
        loadPage(); // Tải lại danh sách sau khi xóa
      } else {
        showError("Lỗi khi xóa sản phẩm!");
      }
    } catch (error) {
      console.error("❌ Lỗi khi xóa sản phẩm:", error);
      showError("Lỗi kết nối đến server!");
    }
  }
}

//search
let search_text = document.querySelector("#search-product"); //ô input
let search_brand = document.querySelector("#search-brand"); //tùy chọn brand
//tìm theo hãng
search_brand.addEventListener("change", async (e) => {
  try {
    let productRes = await axiosInstance.get("/products");
    let products = productRes.data;

    let imageRes = await axiosInstance.get("/images");
    let images = imageRes.data;

    products.forEach((item) => {
      let imageItem = images.find((img) => img.ProductID === item.ProductID);
      item.imageURL = `http://localhost:3000/${imageItem.ImageURL}.jpg`;
    });

    // Reset nội dung .products
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

    // Lọc sản phẩm
    let filteredProducts = products.filter((item) => {
      const matchesName = item.ProductName.toLowerCase().includes(
        search_text.value.trim().toLowerCase()
      );
      const matchesBrand =
        e.target.value === "" || e.target.value === item.Brand; // Nếu không chọn hãng, hiển thị tất cả
      return matchesName && matchesBrand;
    });

    // Hiển thị sản phẩm đã lọc
    filteredProducts.forEach((item) => {
      document.querySelector(".products").innerHTML += showProducts(item);
    });

    // Cập nhật list và gọi loadItem (nếu có)
    list = document.querySelectorAll(".products .item");
    if (typeof loadItem === "function") loadItem();
  } catch (error) {
    console.error("Lỗi khi tìm kiếm theo hãng:", error);
    document.querySelector(".products").innerHTML =
      "<p>Không thể tải danh sách sản phẩm.</p>";
  }
});

// Sự kiện nhập văn bản (search_text)
search_text.addEventListener("input", async (e) => {
  try {
    let txt = e.target.value.trim().toLowerCase();

    let productRes = await axiosInstance.get("/products");
    let products = productRes.data;

    let imageRes = await axiosInstance.get("/images");
    let images = imageRes.data;

    products.forEach((item) => {
      let imageItem = images.find((img) => img.ProductID === item.ProductID);
      item.imageURL = imageItem
        ? `http://localhost:3000/${imageItem.ImageURL}.jpg`
        : "default-image.jpg";
    });

    // Reset nội dung .products
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

    // Lọc sản phẩm
    let filteredProducts = products.filter((item) => {
      const matchesName = item.ProductName.toLowerCase().includes(txt);
      const matchesBrand =
        search_brand.value === "" || search_brand.value === item.Brand;
      return matchesName && matchesBrand;
    });

    // Hiển thị sản phẩm đã lọc
    filteredProducts.forEach((item) => {
      document.querySelector(".products").innerHTML += showProducts(item);
    });

    // Cập nhật list và gọi loadItem (nếu có)
    list = document.querySelectorAll(".products .item");
    if (typeof loadItem === "function") loadItem();
  } catch (error) {
    console.error("Lỗi khi tìm kiếm theo tên:", error);
    document.querySelector(".products").innerHTML =
      "<p>Không thể tải danh sách sản phẩm.</p>";
  }
});

//in thông báo
//thông báo lỗi
function showError(message) {
  notification.innerHTML = "";
  let ntf_error = document.createElement("div");
  ntf_error.innerHTML = '<i class="bx bx-x"></i>' + message;
  ntf_error.classList.add("error");
  notification.appendChild(ntf_error);
  ntf_error.style.animation = "showNotification 3s linear";
}
//thông báo thành công
function showSuccess(message) {
  notification.innerHTML = "";
  let ntf_complete = document.createElement("div");
  ntf_complete.innerHTML = '<i class="bx bx-check"></i>' + message;
  ntf_complete.classList.add("complete");
  notification.appendChild(ntf_complete);
  ntf_complete.style.animation = "showNotification 3s linear";
}

// Đảm bảo hàm có thể gọi từ HTML
window.checkInputForForm = checkInputForForm;
//check input cả 2 box thêm và sửa
function validateInput(ProductName, Price_show, Price_origin) {
  if (!ProductName || !Price_show || !Price_origin) {
    showError("Vui lòng nhập đầy đủ thông tin");
    return false;
  }
  if (
    isNaN(Price_show) ||
    isNaN(Price_origin) ||
    parseFloat(Price_show) < 0 ||
    parseFloat(Price_origin) < 0
  ) {
    showError("Giá không hợp lệ");
    return false;
  }
  if (parseFloat(Price_origin) < parseFloat(Price_show)) {
    showError("Giá hiển thị phải thấp hơn giá gốc");
    return false;
  }
  return true;
}

function checkInputForForm() {
  if (!edit_product_bg.classList.contains("hide")) {
    // Kiểm tra form chỉnh sửa
    if (
      validateInput(
        edit_title.value,
        edit_price_show.value,
        edit_price_origin.value
      )
    ) {
      showSuccess("Sửa sản phẩm thành công");
      edit(current_product_id);
    }
  } else {
    // Kiểm tra form thêm sản phẩm
    if (
      validateInput(
        product_title.value,
        product_price_show.value,
        product_price_origin.value
      )
    ) {
      showSuccess("Thêm sản phẩm thành công");
      addProduct();
    }
  }
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
    prev.addEventListener("click", () => changePage(thisPage - 1));
    document.querySelector(".list-page").appendChild(prev);
  }
  for (let i = 1; i <= count; i++) {
    let newPage = document.createElement("li");
    newPage.innerText = i;
    if (i == thisPage) {
      newPage.classList.add("page-current");
    }
    newPage.addEventListener("click", () => changePage(i));
    document.querySelector(".list-page").appendChild(newPage);
  }
  if (thisPage != count) {
    let next = document.createElement("li");
    next.innerText = "Sau";
    next.addEventListener("click", () => changePage(thisPage + 1));
    document.querySelector(".list-page").appendChild(next);
  }
}

function changePage(i) {
  thisPage = i;
  loadItem();
}
//định dạng giá
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
