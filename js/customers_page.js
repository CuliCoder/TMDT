let list;
let limit = 12; //limit products a page
let thispage = 1; //current page
//thông báo thành công
function showSuccess(message) {
  let notification = document.querySelector(".notification");
  notification.innerHTML = "";
  let ntf_complete = document.createElement("div");
  ntf_complete.innerHTML = '<i class="bx bx-check"></i>' + message;
  ntf_complete.classList.add("complete");
  notification.appendChild(ntf_complete);
  ntf_complete.style.animation = "showNotification 3s linear";
}
//----xóa khách hàng------
function delete_customer(user) {
  let listUsers = JSON.parse(localStorage.getItem("users"));
  for (let i = 0; i < listUsers.length; i++) {
    if (listUsers[i].user == user) {
      let result = confirm(
        "Bạn có chắc muốn xóa tài khoản " + listUsers[i].user + "?"
      );
      if (result) {
        listUsers.splice(i, 1);
        localStorage.setItem("users", JSON.stringify(listUsers));
        loadPage();
        showSuccess("Xóa tài khoản thành công");
      }
      break;
    }
  }
}
//hiển thị thông tin khách hàng
function info_customer(user) {
  let listUsers = JSON.parse(localStorage.getItem("users"));
  document.querySelector(".info-customer-bg").classList.toggle("hide");
  for (let i = 0; i < listUsers.length; i++) {
    if (listUsers[i].user == user) {
      document.querySelector(
        ".info-customer-bg"
      ).innerHTML = `<div class="info-customer-box">
      <i class="bx bx-x"></i>
      <p>Thông tin khách hàng</p>
      <div class="infor">
        <span>Họ tên:</span>
        <span>${listUsers[i].FullName}</span>
      </div>
      <div class="infor">
        <span>Địa chỉ:</span>
        <span
          >${listUsers[i].Address}</span
        >
      </div>
      <div class="infor">
        <span>Số điện thoại:</span>
        <span>${listUsers[i].PhoneNumber}</span>
      </div>
      <div class="infor">
        <span>Tài khoản:</span>
        <span>${listUsers[i].user}</span>
      </div>
      <div class="infor">
        <span>Mật khẩu:</span>
        <span>${listUsers[i].password}</span>
      </div>
      <div class="infor">
        <span>Tình trạng tài khoản:</span>
        <span>${listUsers[i].status}</span>
      </div>
    </div>`;
    }
  }
  //đóng box thông tin
  document.querySelector(".info-customer-bg").addEventListener("click", (e) => {
    if (e.target == e.currentTarget) {
      document.querySelector(".info-customer-bg").classList.add("hide");
    }
  });
  document
    .querySelector(".info-customer-bg .info-customer-box i")
    .addEventListener("click", () => {
      document.querySelector(".info-customer-bg").classList.add("hide");
    });
}
//-----khóa tài khoản khách hàng------
function lock_customer(username) {
  let users = JSON.parse(localStorage.getItem("users"));
  let userLogin = JSON.parse(localStorage.getItem("userLogin"));
  for (let i = 0; i < users.length; i++) {
    if (users[i].user == username) {
      if (users[i].status == "Bị khóa") {
        let result = confirm("Mở khóa tài khoản " + users[i].user + " ?");
        if (result) {
          users[i].status = "Hoạt động";
          localStorage.setItem("users", JSON.stringify(users));
          loadPage();
        }
      } else {
        let result = confirm("Khóa tài khoản " + users[i].user + " ?");
        if (result) {
          users[i].status = "Bị khóa";
          localStorage.setItem("users", JSON.stringify(users));
          loadPage();
        }
      }
      if (users[i].user == userLogin.user) {
        userLogin = users[i];
        localStorage.setItem("userLogin", JSON.stringify(userLogin));
      }
      break;
    }
  }
}
//show khách hàng
function show(stt, user, date) {
  document.querySelector(
    ".list-customers .customers"
  ).innerHTML += `<li class="customer">
  <ul>
    <li>${stt}</li>
    <li>${user.FullName}</li>
    <li>${user.user}</li>
    <li>${date}</li>
    <li>${user.status}</li>
    <li>
            <div class="btn">
              <button
                type="submit"
                class="lock-customer"
                onclick="lock_customer('${user.user}')"
              >
                <i class="bx bx-lock"></i>
              </button>
              <span>Khóa</span>
            </div>
            <div class="btn">
              <button
                type="submit"
                class="delete-customer"
                onclick="delete_customer('${user.user}')"
              >
                <i class="bx bx-x"></i>
              </button>
              <span>Xóa</span>
            </div>
            <div class="btn">
              <button
                type="submit"
                class="info-customer"
                onclick="info_customer('${user.user}')"
              >
                <i class="bx bx-search"></i>
              </button>
              <span>Thông tin</span>
            </div>
          </li>
  </ul>
</li>`;
}
//danh sách khách hàng
loadPage();
function loadPage() {
  document.querySelector(".list-customers .customers").innerHTML =
    '<li class="top-list"><ul><li>STT</li><li>HỌ TÊN</li><li>TÊN ĐĂNG NHẬP</li><li>NGÀY ĐĂNG KÝ</li><li>TRẠNG THÁI</li><li></li></ul></li>';
  let listUsers = JSON.parse(localStorage.getItem("users"));
  for (let i = 1; i < listUsers.length; i++) {
    let date = new Date(listUsers[i].DateSignUp).toLocaleString();
    show(i, listUsers[i], date);
  }
  list = document.querySelectorAll(".list-customers .customer"); //array customer div
  loaditem();
}
function loaditem() {
  let beginget = limit * (thispage - 1); //index start
  let endget = limit * thispage - 1; //index end
  if (list.length == 0) {
    //không có khách hàng sẽ hiển thị "Không tìm thấy"
    document.querySelector(".customers").classList.add("hide");
    document.querySelector(".not-found").classList.remove("hide");
    document.querySelector(".list-page").classList.add("hide");
  } else {
    document.querySelector(".customers").classList.remove("hide");
    document.querySelector(".not-found").classList.add("hide");
    document.querySelector(".list-page").classList.remove("hide");
    for (let i = 0; i < list.length; i++) {
      if (i >= beginget && i <= endget) list[i].style.display = "block";
      else list[i].style.display = "none";
    }
    listPage();
  }
}
function listPage() {
  let count = Math.ceil(list.length / limit); //page total
  document.querySelector(".list-page").innerHTML = "";
  if (thispage != 1) {
    //prev page
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
    //next page
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
//--------tìm kiếm khách hàng--------
function search(txt, from, to) {
  let users = JSON.parse(localStorage.getItem("users"));
  document.querySelector(".list-customers .customers").innerHTML =
    '<li class="top-list"><ul><li>STT</li><li>HỌ TÊN</li><li>TÊN ĐĂNG NHẬP</li><li>NGÀY ĐĂNG KÝ</li><li>TRẠNG THÁI</li><li></li></ul></li>';
  for (let i = 1; i < users.length; i++) {
    if (check_search(txt, i, from, to)) {
      let date = new Date(users[i].DateSignUp).toLocaleString();
      show(i, users[i], date);
    }
  }
  list = document.querySelectorAll(".list-customers .customers .customer");
  loaditem();
}
//tùy chọn tìm kiếm
let option;
check_option();
function check_option() {
  option = document.querySelector("#opt").value;
  let search_status = document.querySelector("#search-status");
  let search_txt = document.querySelector("#search-txt");
  switch (option) {
    case "fullname":
      search_txt.classList.remove("hide");
      search_txt.placeholder = "Họ tên khách hàng";
      search_status.classList.add("hide");
      break;
    case "user":
      search_txt.classList.remove("hide");
      search_txt.placeholder = "Tên đăng nhập";
      search_status.classList.add("hide");
      break;
    case "status":
      search_txt.classList.add("hide");
      search_status.classList.remove("hide");
      search(search_status.value, "", "");
      break;
  }
}
//tìm theo ô input text
document.querySelector("#search-txt").addEventListener("input", (e) => {
  search(e.target.value, "", "");
});
//tìm theo tùy chọn trạng thái
document.querySelector("#search-status").addEventListener("change", (e) => {
  search(e.target.value, "", "");
});
//lọc
function check_search(input, i, from, to) {
  let users = JSON.parse(localStorage.getItem("users"));
  if (from != "" && to != "" && input == "") {
    //tìm theo khoảng thời gian
    let begin = new Date(from);
    let end = new Date(to);
    let order = new Date(users[i].DateSignUp);
    if (begin <= order && order <= end) return true;
    return false;
  } else {
    //tìm kiếm bằng input text hoặc tùy chọn trạng thái
    switch (option) {
      case "fullname":
        if (users[i].FullName.trim().toLowerCase().includes(input)) return true;
        return false;
      case "user":
        if (users[i].user.trim().toLowerCase().includes(input)) return true;
        return false;
      case "status":
        if (users[i].status == input) return true;
        return false;
    }
  }
}
//ấn nút sẽ tìm theo khoảng tg
document.querySelector(".search-date button").addEventListener("click", () => {
  let from = document.getElementById("date-begin").valueAsDate;
  let to = document.getElementById("date-end").valueAsDate;
  search("", from, to);
});
