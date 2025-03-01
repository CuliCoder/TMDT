import axiosInstance from "./configAxios.js";
//----------------tạo đường dẫn------------------
//tạo đường dẫn cho mỗi hãng
opt_brand();
function opt_brand() {
  let listBrand = ["apple", "samsung", "xiaomi", "oppo", "realme"];
  let betweenHeader = document.getElementsByClassName("brand");
  for (let i = 0; i < listBrand.length; i++) {
    //các thẻ a nằm trên thanh header
    betweenHeader[i].innerHTML = `<a href="index.html?brand=${
      listBrand[i]
    }">${listBrand[i].toUpperCase()}
      </a>`;
    //các thẻ a nằm trong menu
    betweenHeader[i + 5].innerHTML = `<a href="index.html?brand=${
      listBrand[i]
    }">${listBrand[i].toUpperCase()}
      </a>`;
  }
}
//--------Menu các hãng ----------
//show phần menu khi ấn vào icon menu
document.querySelector(".header .menu").addEventListener("click", () => {
  document.querySelector(".menu-drop").style.transform = "rotateX(0deg)";
  document.body.style.overflow = "hidden";
});
//đóng menu
document.querySelector(".menu-drop .close").addEventListener("click", () => {
  document.querySelector(".menu-drop").style.transform = "rotateX(90deg)";
  document.body.style.overflow = "auto";
});
//khi thay đổi kích thước cửa sổ trình duyệt
window.addEventListener("resize", () => {
  let width = window.innerWidth;
  if (width >= 834) {
    document.querySelector(".menu-drop").style.transform = "rotateX(90deg)"; //ẩn menu khi nó đang hiện
    document.body.style.overflow = "auto";
  }
});
//--------tìm kiếm sản phẩm--------
//khai báo biến phân trang
let thisPage_search = 1; //trang hiện tại
let limit_search = 6; //số sản phẩm hiển thị trong 1 trang
let list_search; //danh sách các element được hiển thị
let icon_search = document.querySelector(".header .search ");
let search_box = document.querySelector(".search-bg");
//show phần tìm kiếm
icon_search.addEventListener("click", () => {
  search_box.classList.remove("hide");
  document.querySelector(".search-bg input").focus();
  document.body.style.overflow = "hidden"; //ẩn thanh scroll phần body
});
//đóng box tìm kiếm
close_search_box();
function close_search_box() {
  //đóng bằng cách ấn bên ngoài box
  document.querySelector(".search-bg").addEventListener("click", (e) => {
    if (e.target == e.currentTarget) {
      document.querySelector(".search-bg").classList.toggle("hide");
      document.body.style.overflow = "auto"; //sau khi đóng box tìm kiếm thì body sẽ được cuộn
    }
  });
  //đóng bằng cách ấn dấu x (đối với max-width qui định sẽ xuất hiện dấu x)
  document.querySelector(".search-bg .close").addEventListener("click", () => {
    document.querySelector(".search-bg").classList.add("hide");
    document.body.style.overflow = "auto";
  });
}
//thực hiện tìm kiếm
search();
async function search() {
  let search_box = document.querySelector("#search"); // Ô input tìm kiếm

  search_box.addEventListener("input", async (e) => {
    let txt_search = e.target.value.trim().toLowerCase(); // Chuẩn hóa từ khóa tìm kiếm
    document.querySelector(".search-bg .products").innerHTML = ""; // Reset kết quả tìm kiếm

    try {
      // Gọi API lấy danh sách sản phẩm
      let response = await axiosInstance.get("/products");
      let products = response.data; // Danh sách sản phẩm từ API

      // Gọi API lấy danh sách hình ảnh
      let imageRes = await axiosInstance.get("/images");
      let images = imageRes.data;

      // Gán ảnh vào từng sản phẩm
      products.forEach((item) => {
        let imageItem = images.find((img) => img.ProductID === item.ProductID);
        item.imageURL = imageItem
          ? `http://localhost:3000/${imageItem.ImageURL}.jpg`
          : "default-image.jpg";
      });

      // Lọc sản phẩm theo từ khóa tìm kiếm
      let filteredProducts = products.filter((item) =>
        item.ProductName.toLowerCase().includes(txt_search)
      );

      // Hiển thị danh sách sản phẩm tìm được
      filteredProducts.forEach((item) => {
        document.querySelector(".search-bg .products").innerHTML += `
          <div class="item-product" onclick="showProductInfo(${
            item.ProductID
          })">
            <img src="${item.imageURL}" alt="${item.ProductName}" />
            <div class="info">
              <div class="title">${item.ProductName}</div>
              <div class="price-show">${price_format(item.Price_show)}</div>
            </div>
          </div>
        `;
      });

      // Cập nhật danh sách tìm kiếm
      list_search = document.querySelectorAll(
        ".search-bg .products .item-product"
      );
      loadItem_search(); // Phân trang nếu cần
    } catch (error) {
      console.error("Lỗi khi tìm kiếm sản phẩm:", error);
      document.querySelector(".search-bg .products").innerHTML =
        "<p>Không thể tải danh sách sản phẩm.</p>";
    }
  });
}

//chuyển qua chi tiết của sản phẩm khi ấn vào 1 sp
function showProductInfo(id_product) {
  window.location.href = `chitietsanpham.html?id=${id_product}`;
}

//---------Phân trang----------
function loadItem_search() {
  let beginIndex = limit_search * (thisPage_search - 1); //vị trí bắt đầu của trang hiện tại
  let endIndex = limit_search * thisPage_search - 1; //vị trí kết thúc của trang hiện tại
  for (let i = 0; i < list_search.length; i++) {
    //nếu nằm trong khoảng của 2 vị trí thì hiển thị
    if (i >= beginIndex && i <= endIndex) list_search[i].style.display = "flex";
    else list_search[i].style.display = "none";
  }
  listPage_search();
}
//hiển thị nút chuyển trang
function listPage_search() {
  let count = Math.ceil(list_search.length / limit_search); // Tổng số trang cần có
  let listPageContainer = document.querySelector(
    ".search-bg .list-page-search"
  );
  listPageContainer.innerHTML = ""; // Reset phần hiển thị các nút

  // Tạo nút "Trước" nếu không ở trang đầu
  if (thisPage_search > 1) {
    let prev = document.createElement("li");
    prev.innerText = "Trước";
    prev.addEventListener("click", () =>
      changePage_search(thisPage_search - 1)
    );
    listPageContainer.appendChild(prev);
  }

  // Hiển thị các nút số trang
  for (let i = 1; i <= count; i++) {
    let newPage = document.createElement("li");
    newPage.innerText = i;
    if (i === thisPage_search) newPage.classList.add("page-current");
    newPage.addEventListener("click", () => changePage_search(i));
    listPageContainer.appendChild(newPage);
  }

  // Tạo nút "Sau" nếu không ở trang cuối
  if (thisPage_search < count) {
    let next = document.createElement("li");
    next.innerText = "Sau";
    next.addEventListener("click", () =>
      changePage_search(thisPage_search + 1)
    );
    listPageContainer.appendChild(next);
  }
}

//cập nhật lại trang hiện tại
function changePage_search(i) {
  thisPage_search = i;
  loadItem_search();
}
//định dạng giá hiển thị
function price_format(price) {
  if (price == "") return "";
  let price_str = "";
  let tmp = price;
  for (let i = price.length; i > 3; i -= 3) {
    price_str = "." + tmp.slice(-3) + price_str;
    tmp = tmp.substr(0, i - 3);
  }
  tmp = tmp.slice(0);
  return tmp + price_str + "₫";
}
//chuyển đến trang giỏ hàng nếu đã đăng nhập hoặc tài khoản không bị khóa
document.querySelector(".header .cart").addEventListener("click", () => {
  let userLogin = JSON.parse(localStorage.getItem("userLogin"));
  if (userLogin == null) {
    alert("Vui lòng đăng nhập!");
  } else {
    location.href = "giohang.html";
  }
});
//------Đăng ký------
//khai báo các ô input
let fullname = document.querySelector("#fullname");
let phone_number = document.querySelector("#phone-number");
let address = document.querySelector("#address");
let username = document.querySelector("#username");
let password = document.querySelector("#password");
let confirm_password = document.querySelector("#confirm-password");
let signup = document.querySelector(".validateform-bg .signup form");
let login = document.querySelector(".validateform-bg .login form");
let login_username = document.querySelector("#login-username");
let login_password = document.querySelector("#login-password");
//show ra phần thông báo lỗi
function showError(input, message) {
  let parent = input.parentElement;
  let small = parent.querySelector("small");
  parent.classList.add("error");
  small.innerText = message;
}
//show ra thông báo thành công
function showSuccess(input) {
  let parent = input.parentElement;
  let small = parent.querySelector("small");
  parent.classList.remove("error");
  small.innerText = "";
}
//check các ô input có rỗng hay không
function checkEmpty(listInput) {
  let isEmpty = false;
  listInput.forEach((input) => {
    input.value = input.value.trim();
    if (input.value == "") {
      isEmpty = true;
      showError(input, "Không được để trống");
    } else showSuccess(input);
  });
  return isEmpty;
}
//check số điện thoại
function checkPhoneNumber(phonenumber) {
  for (i = 0; i < phone_number.value.length; i++) {
    if (isNaN(phone_number.value[i])) {
      showError(phonenumber, "Số điện thoại không hợp lệ");
      return false;
    }
  }
  if (phonenumber.value[0] != 0 || phonenumber.value.length != 10) {
    showError(phonenumber, "Số điện thoại không hợp lệ");
    return false;
  } else {
    showSuccess(phonenumber);
    return true;
  }
}
//check độ dài
function checkLength(input, min, max) {
  if (input.value.length < min) {
    showError(input, "Phải có ít nhất " + min + " ký tự");
    return false;
  }
  if (input.value.length > max) {
    showError(input, "Không được quá " + max + " ký tự");
    return false;
  } else {
    showSuccess(input);
    return true;
  }
}
//check trùng password khi đăng ký
function checkMatchPassword(password, confirm_password) {
  if (password.value == "") {
    return false;
  } else if (password.value != confirm_password.value) {
    showError(confirm_password, "Mật khẩu không trùng khớp");
    return false;
  } else {
    showSuccess(confirm_password);
    return true;
  }
}
//check trùng tài khoản
function checkSameUserName(username) {
  let users = JSON.parse(localStorage.getItem("users"));
  for (i = 0; i < users.length; i++) {
    if (username.value == users[i].user) {
      showError(username, "Tên đăng nhập đã tồn tại");
      return true;
    }
  }
  showSuccess(username);
  return false;
}
//check có khoảng cách
function checkIsSpace(input) {
  for (let i = 0; i < input.value.length; i++) {
    if (input.value[i] == " " || input.value[i] == "\t") {
      showError(input, "Không được có khoảng trống");
      return true;
    }
  }
  return false;
}
//trả về 1 chuỗi thời gian hiện tại theo định dạng ISO
function formatDate() {
  let d = new Date();
  return d.toISOString();
}
//khi ấn nút đăng ký
signup.addEventListener("submit", (e) => {
  e.preventDefault();
  let isEmpty = checkEmpty([
    fullname,
    address,
    phone_number,
    username,
    password,
    confirm_password,
  ]);
  let isphonenumber = checkPhoneNumber(phone_number);
  let isusernameLength = checkLength(username, 7, 20);
  let ispasswordLength = checkLength(password, 8, 20);
  let ismatchPassword = checkMatchPassword(password, confirm_password);
  let isSameUserName;
  if (isusernameLength) {
    isSameUserName = checkSameUserName(username);
  }
  let isspace = checkIsSpace(username);
  if (
    isEmpty == false &&
    isusernameLength &&
    isphonenumber &&
    ispasswordLength &&
    ismatchPassword &&
    isSameUserName == false &&
    isspace == false
  ) {
    //nếu thỏa tất cả điều kiện
    let users = JSON.parse(localStorage.getItem("users"));
    let DateSignUp = formatDate();
    let newUser = {
      FullName: fullname.value,
      Address: address.value,
      PhoneNumber: phone_number.value,
      user: username.value,
      password: password.value,
      cart: [],
      order: [],
      DateSignUp: DateSignUp,
      status: "Hoạt động",
    };
    //thêm vào danh sách người dùng
    users.push(newUser);
    //up lên localStorage
    localStorage.setItem("users", JSON.stringify(users));
    alert("Đăng ký thành công!");
    //đăng ký thành công sẽ chuyển qua form đăng nhập
    document.querySelector(".validateform-bg .signup").classList.toggle("hide");
    document.querySelector(".validateform-bg .login").classList.toggle("hide");
  }
});
//nút trở lại form đăng nhập
document
  .querySelector(".validateform-bg .bx-left-arrow-alt")
  .addEventListener("click", () => {
    document.querySelector(".validateform-bg .signup").classList.toggle("hide");
    document.querySelector(".validateform-bg .login").classList.toggle("hide");
  });
//chuyển qua form đăng ký
document
  .querySelector(".validateform-bg .signup-link")
  .addEventListener("click", () => {
    document.querySelector(".validateform-bg .signup").classList.toggle("hide");
    document.querySelector(".validateform-bg .login").classList.toggle("hide");
  });
//đóng form đăng nhập
document
  .querySelector(".validateform-bg .login .bx-x")
  .addEventListener("click", () => {
    document.querySelector(".validateform-bg").classList.toggle("hide");
  });
//đóng form đăng ký
document
  .querySelector(".validateform-bg .signup .bx-x")
  .addEventListener("click", () => {
    document.querySelector(".validateform-bg").classList.toggle("hide");
  });
//đóng form khi ấn bên ngoài (cả 2 form)
document.querySelector(".validateform-bg").addEventListener("click", (e) => {
  if (e.target == e.currentTarget)
    document.querySelector(".validateform-bg").classList.toggle("hide");
});
//------------Đăng nhập---------------
let userLogin;
//check sai mật khẩu
// async function checkWrongAccount(login_username, login_password) {
// let users = JSON.parse(localStorage.getItem("users"));
// for (i = 0; i < users.length; i++) {
//   if (login_username.value == users[i].user) {
//     if (login_password.value == users[i].password) {
//       //đúng mật khẩu sẽ lưu lại
//       userLogin = users[i];
//       showSuccess(login_password);
//       return false;
//     } else {
//       showError(login_password, "Sai mật khẩu");
//       return true;
//     }
//   }
// }
// if (login_username.value != "") {
//   showError(login_username, "Tài khoản chưa đăng ký");
// }
// return true;
async function checkWrongAccount(login_username, login_password) {
  try {
    const res = await axiosInstance.post("/auth/login", {
      username: login_username.value,
      password: login_password.value,
    });

    if (res.data.error !== 0) {
      showError(login_username, res.data.message);
      return true;
    } else {
      console.log(res.data.data);
      userLogin = res.data.data;
      showSuccess(login_password);
      return false;
    }
  } catch (err) {
    showError(login_password, err.message);
    return true;
  }
}
//ấn nút đăng nhập
login.addEventListener("submit", async (e) => {
  e.preventDefault();
  let isEmpty = checkEmpty([login_username, login_password]);
  let isWrongAccount = await checkWrongAccount(login_username, login_password);
  if (!isEmpty && !isWrongAccount) {
    //thỏa điều kiện sẽ up tài khoản đang đăng nhập lên localStorage
    localStorage.setItem("userLogin", JSON.stringify(userLogin));
    document.querySelector(".validateform-bg").classList.toggle("hide");
  }
});
//show menu người dùng
document.querySelector(".header .user").addEventListener("click", () => {
  let userLogin = JSON.parse(localStorage.getItem("userLogin")); //lấy người dùng hiện tại
  if (userLogin != null) {
    //đã đăng nhập sẽ hiển thị menu
    document.querySelector(".user-drop-down").classList.toggle("hide");
    document.querySelector(".user-drop-down .fullname-user p").innerHTML =
      userLogin.fullname;
    if (userLogin.role != "admin")
      //không phải admin sẽ không có phần quản lý
      document.querySelector(".user-drop-down .manage").classList.add("hide");
    else
      document
        .querySelector(".user-drop-down .manage")
        .classList.remove("hide");
  } else document.querySelector(".validateform-bg").classList.toggle("hide"); //chưa đăng nhập sẽ hiển thị form đăng nhập
});
//đăng xuất
document.querySelector(".log-out").addEventListener("click", () => {
  document.querySelector(".user-drop-down").classList.add("hide");
  localStorage.removeItem("userLogin");
});
//chuyển sang page quản lý
document
  .querySelector(".user-drop-down .manage")
  .addEventListener("click", () => {
    location.href = "product_page.html";
  });
//chuyển sang trang lịch sử mua hàng
document
  .querySelector(".user-drop-down .history-purchase")
  .addEventListener("click", () => {
    location.href = "purchase_history.html";
  });
//sự kiện click ngoài vùng menu sẽ ấn menu
document.querySelector(".container").addEventListener("click", (e) => {
  if (
    !document.querySelector(".user-drop-down").classList.contains("hide") &&
    !document.querySelector(".user-drop-down").contains(e.target) &&
    !document.querySelector(".header .user").contains(e.target)
  ) {
    document.querySelector(".user-drop-down").classList.add("hide");
  }
});
//khi đăng xuất sẽ chuyển về trang chính
function log_out() {
  localStorage.removeItem("userLogin");
  location.href = "index.html";
}
