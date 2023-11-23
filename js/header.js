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
function search() {
  let search_box = document.querySelector("#search"); //ô input
  search_box.addEventListener("input", (e) => {
    let txt_search = e.target.value.trim().toLowerCase(); //lấy giá trị của ô input
    document.querySelector(".search-bg .products").innerHTML = ""; //reset lại phần hiển thị sản phẩm
    let json_product = JSON.parse(localStorage.getItem("json-products")); //lấy dữ liệu trên localStorage sau đó chuyển về lại dạng đối tượng
    for (let i = 0; i < json_product.length; i++)
      if (json_product[i].title.toLowerCase().includes(txt_search))
        //nếu tên của sản phẩm có chứa giá trị ô input thì show sản phẩm đó
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
    //cập nhật lại danh sách các sản phẩm được hiển thị
    list_search = document.querySelectorAll(
      ".search-bg .products .item-product"
    );
    loadItem_search(); //bắt đầu phân trang
  });
}
//chuyển qua chi tiết của sản phẩm khi ấn vào 1 sp
function showProductInfo(id_product) {
  let products = JSON.parse(localStorage.getItem("json-products"));
  for (let i = 0; i < products.length; i++) {
    if (products[i].productId == id_product) {
      localStorage.setItem("ProductInfo", JSON.stringify(products[i]));
    }
  }
  location.href = "chitietsanpham.html";
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
  let count = Math.ceil(list_search.length / limit_search); //tổng số trang cần có
  document.querySelector(".search-bg .list-page-search").innerHTML = ""; //reset phần hiển thị các nút
  //nếu trang hiện tại khác 1 thì sẽ xuất hiện nút "Trước"
  if (thisPage_search != 1) {
    let prev = document.createElement("li");
    prev.innerText = "Trước";
    prev.setAttribute(
      "onclick",
      "changePage_search(" + (thisPage_search - 1) + ")"
    );
    document.querySelector(".search-bg .list-page-search").appendChild(prev); //thêm vào phần hiển thị nút
  }
  //hiển thị các nút tương ứng với số trang
  for (let i = 1; i <= count; i++) {
    let newPage = document.createElement("li");
    newPage.innerText = i;
    if (i == thisPage_search) newPage.classList.add("page-current");
    newPage.setAttribute("onclick", "changePage_search(" + i + ")");
    document.querySelector(".search-bg .list-page-search").appendChild(newPage); //thêm vào phần hiển thị nút
  }
  //nếu khác trang cuối cùng thì xuất hiện nút "Sau"
  if (thisPage_search != count) {
    let next = document.createElement("li");
    next.innerText = "Sau";
    next.setAttribute(
      "onclick",
      "changePage_search(" + (thisPage_search + 1) + ")"
    );
    document.querySelector(".search-bg .list-page-search").appendChild(next); //thêm vào phần hiển thị nút
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
  for (i = price.length; i > 3; i -= 3) {
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
  } else if (userLogin != null && userLogin.status != "Hoạt động") {
    alert("Tài khoản bị khóa không thể vào giỏ hàng!");
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
function checkWrongAccount(login_username, login_password) {
  let users = JSON.parse(localStorage.getItem("users"));
  for (i = 0; i < users.length; i++) {
    if (login_username.value == users[i].user) {
      if (login_password.value == users[i].password) {
        //đúng mật khẩu sẽ lưu lại
        userLogin = users[i];
        showSuccess(login_password);
        return false;
      } else {
        showError(login_password, "Sai mật khẩu");
        return true;
      }
    }
  }
  if (login_username.value != "") {
    showError(login_username, "Tài khoản chưa đăng ký");
  }
  return true;
}
//ấn nút đăng nhập
login.addEventListener("submit", (e) => {
  e.preventDefault();
  let isEmpty = checkEmpty([login_username, login_password]);
  let isWrongAccount = checkWrongAccount(login_username, login_password);
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
      userLogin.FullName;
    if (userLogin.user != "admin")
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
