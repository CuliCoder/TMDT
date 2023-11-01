let users = [
  {
    FullName: "Nguyễn Công Trung",
    Address: "273 An Dương Vương, P3, Quận 5, TPHCM",
    PhoneNumber: "0966421165",
    user: "admin",
    password: "admin",
    DateSignUp: "28-10-2023",
  },
];
if (localStorage.getItem("users") == null)
  localStorage.setItem("users", JSON.stringify(users));
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
function showError(input, message) {
  let parent = input.parentElement;
  let small = parent.querySelector("small");
  parent.classList.add("error");
  small.innerText = message;
}
function showSuccess(input) {
  let parent = input.parentElement;
  let small = parent.querySelector("small");
  parent.classList.remove("error");
  small.innerText = "";
}
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
function checkMatchPassword(password, confirm_password) {
  if (password.value == "") {
    // showError(confirm_password, "Không được để trống");
    return false;
  } else if (password.value != confirm_password.value) {
    showError(confirm_password, "Mật khẩu không trùng khớp");
    return false;
  } else {
    showSuccess(confirm_password);
    return true;
  }
}
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
  if (
    isEmpty == false &&
    isusernameLength &&
    isphonenumber &&
    ispasswordLength &&
    ismatchPassword &&
    isSameUserName == false
  ) {
    let users = JSON.parse(localStorage.getItem("users"));
    let d = new Date();
    let DateSignUp =
      d.getDate() + "-" + (d.getMonth() + 1) + "-" + d.getFullYear();
    let newUser = {
      FullName: fullname.value,
      Address: address.value,
      PhoneNumber: phone_number.value,
      user: username.value,
      password: password.value,
      DateSignUp: DateSignUp,
    };
    users.push(newUser);
    localStorage.setItem("users", JSON.stringify(users));
    document.querySelector(".validateform-bg .signup").classList.toggle("hide");
    document.querySelector(".validateform-bg .login").classList.toggle("hide");
  }
});
document
  .querySelector(".validateform-bg .bx-left-arrow-alt")
  .addEventListener("click", () => {
    document.querySelector(".validateform-bg .signup").classList.toggle("hide");
    document.querySelector(".validateform-bg .login").classList.toggle("hide");
  });
document
  .querySelector(".validateform-bg .signup-link")
  .addEventListener("click", () => {
    document.querySelector(".validateform-bg .signup").classList.toggle("hide");
    document.querySelector(".validateform-bg .login").classList.toggle("hide");
  });
document
  .querySelector(".validateform-bg .login .bx-x")
  .addEventListener("click", () => {
    document.querySelector(".validateform-bg").classList.toggle("hide");
  });
document
  .querySelector(".validateform-bg .signup .bx-x")
  .addEventListener("click", () => {
    document.querySelector(".validateform-bg").classList.toggle("hide");
  });
document.querySelector(".validateform-bg").addEventListener("click", (e) => {
  if (e.target == e.currentTarget)
    document.querySelector(".validateform-bg").classList.toggle("hide");
});

let userLogin;
function checkWrongAccount(login_username, login_password) {
  let users = JSON.parse(localStorage.getItem("users"));
  for (i = 0; i < users.length; i++) {
    if (login_username.value == users[i].user) {
      if (login_password.value == users[i].password) {
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
login.addEventListener("submit", (e) => {
  e.preventDefault();
  let isEmpty = checkEmpty([login_username, login_password]);
  let isWrongAccount = checkWrongAccount(login_username, login_password);
  if (!isEmpty && !isWrongAccount) {
    localStorage.setItem("userLogin", JSON.stringify(userLogin));
    document.querySelector(".validateform-bg").classList.toggle("hide");
  }
});
document.querySelector(".header .user").addEventListener("click", () => {
  let userLogin = JSON.parse(localStorage.getItem("userLogin"));
  if (userLogin != null) {
    document.querySelector(".user-drop-down").classList.toggle("hide");
    document.querySelector(".user-drop-down .fullname-user p").innerHTML =
      userLogin.FullName;
    if (userLogin.user != "admin")
      document.querySelector(".user-drop-down .manage").classList.add("hide");
    else
      document
        .querySelector(".user-drop-down .manage")
        .classList.remove("hide");
  } else document.querySelector(".validateform-bg").classList.toggle("hide");
});
document.querySelector(".log-out").addEventListener("click", () => {
  document.querySelector(".user-drop-down").classList.toggle("hide");
  localStorage.removeItem("userLogin");
});
document
  .querySelector(".user-drop-down .manage")
  .addEventListener("click", () => {
    location.href = "product_page.html";
  });
