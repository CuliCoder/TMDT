let userList = []; // Danh sách khách hàng sẽ lưu vào đây 
let limit = 12; // Số lượng sản phẩm trên mỗi trang
let thispage = 1; // Trang hiện tại
//thông báo thành công
function showSuccess(message) {
  let notification = document.querySelector(".notification");
  if (!notification) {
    console.error("Không tìm thấy phần tử `.notification`");
    return;
  }

  // Xóa nội dung cũ trước khi thêm mới
  notification.innerHTML = "";

  let ntf_complete = document.createElement("div");
  ntf_complete.innerHTML = '<i class="bx bx-check"></i> ' + message;
  ntf_complete.classList.add("complete");

  notification.appendChild(ntf_complete);

  // Hiển thị thông báo
  notification.style.opacity = "1";

  // Ẩn thông báo sau 3s
  setTimeout(() => {
    notification.style.opacity = "0";
    ntf_complete.remove();
  }, 3000);
}


//----xóa khách hàng------
async function delete_customer(id) {
  let listUsers = JSON.parse(localStorage.getItem("users"));
  for (let i = 0; i < listUsers.length; i++) {
    if (listUsers[i].UserID == id) {
      let result = confirm(
        "Bạn có chắc muốn xóa tài khoản " + listUsers[i].Username + "?"
      );
      if (result) {
        // listUsers.splice(i, 1);
        // localStorage.setItem("users", JSON.stringify(listUsers));
        try {
          const response = await fetch("http://localhost:3000/api/customers/" + id, {
            method: "DELETE",
          });
          console.log(response);
          loadPage();
          showSuccess("Xóa tài khoản thành công");
        } catch (error) {
          console.log(error);
        }
      }
      break;
    }
  }
}
//hiển thị thông tin khách hàng
function info_customer(id) {
  document.querySelector(".info-customer-bg").classList.toggle("hide");
  for (let i = 0; i < userList.length; i++) {
    if (userList[i].UserID == id) {
      console.log(userList[i].CreatedAt);
      let newDate = new Date(userList[i].CreatedAt).toLocaleString();
      document.querySelector(
        ".info-customer-bg"
      ).innerHTML = `<div class="info-customer-box">
      <i class="bx bx-x"></i>
      <p>Thông tin khách hàng</p>
      <div class="infor">
        <span>Họ tên:</span>
        <span>${userList[i].FullName}</span>
      </div>
      <div class="infor">
        <span>Số điện thoại:</span>
        <span>${userList[i].PhoneNumber}</span>
      </div>
      <div class="infor">
        <span>Tài khoản:</span>
        <span>${userList[i].Username}</span>
      </div>
      <div class="infor">
        <span>Ngày tạo:</span>
        <span>${newDate}</span>
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
async function lock_customer(id, st) {
  console.log("Kiểu dữ liệu id, status:", typeof id, typeof st);
  console.log("ID, status:", id, st);

  let newStatus = parseInt(st) === 1 ? 0 : 1; // Chuyển status thành số

  try {
    let response = await fetch(`http://localhost:3000/api/customers/status/${id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ status: newStatus }),
    });

    console.log("Response status:", response.status);
    let data = await response.json();
    console.log("Response data:", data);
    loadPage();
    if (response.ok) {
      showSuccess(newStatus === 0 ? "Khóa tài khoản thành công" : "Mở khóa tài khoản thành công");
    } else {
      console.log("Lỗi xử lý API:", data);
      showSuccess("Khóa tài khoản thất bại");
    }
  } catch (error) {
    console.error("Lỗi fetch API:", error);
    showSuccess("Khóa tài khoản thất bại");
  }
}

//show khách hàng
function show(stt, user) {
  document.querySelector(
    ".list-customers .customers"
  ).innerHTML += `<li class="customer">
  <ul>
    <li>${stt}</li>
    <li>${user.FullName}</li>
    <li>${user.Username}</li>
    <li>${user.PhoneNumber}</li>
    <li>${user.status === "1" ? "đang hoạt động" : "đang khóa" }</li>
    <li>
            <div class="btn">
              <button
                type="submit"
                class="lock-customer"
                onclick="lock_customer('${user.UserID}','${user.status}')"
              >
                <i class="bx bx-lock"></i>
              </button>
              <span>Khóa</span>
            </div>
            <div class="btn">
              <button
                type="submit"
                class="delete-customer"
                onclick="delete_customer('${user.UserID}')"
              >
                <i class="bx bx-x"></i>
              </button>
              <span>Xóa</span>
            </div>
            <div class="btn">
              <button
                type="submit"
                class="info-customer"
                onclick="info_customer('${user.UserID}')"
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
async function loadPage() {
  document.querySelector(".customers").innerHTML =
    '<li class="top-list"><ul><li>STT</li><li>HỌ TÊN</li><li>TÊN ĐĂNG NHẬP</li><li>SỐ ĐIỆN THOẠI</li><li>TRẠNG THÁI</li><li></li></ul></li>';

  try {
    let response = await fetch("http://localhost:3000/api/customers/");
    userList = await response.json(); // Lưu dữ liệu vào mảng userList

    // Xóa dữ liệu cũ trước khi hiển thị danh sách mới
    document.querySelector(".list-customers .customers").innerHTML = "";

    for (let i = 0; i < userList.length; i++) {
      show(i, userList[i]);
    }
    list = document.querySelectorAll(".list-customers .customer"); 
    loaditem();
  } catch (error) {
    console.error(error);
  }
}

function loaditem() {
  let beginIndex = limit * (thispage - 1);
  let endIndex = limit * thispage - 1;

  if (list.length === 0) {
    document.querySelector(".customers").classList.add("hide");
    document.querySelector(".not-found").classList.remove("hide");
    document.querySelector(".list-page").classList.add("hide");
  } else {
    document.querySelector(".customers").classList.remove("hide");
    document.querySelector(".not-found").classList.add("hide");
    document.querySelector(".list-page").classList.remove("hide");

    for (let i = 0; i < list.length; i++) {
      if (i >= beginIndex && i <= endIndex) list[i].style.display = "block";
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
//tùy chọn tìm kiếm

let option;
check_option();
function check_option() {
  option = document.querySelector("#opt").value;
  let search_status = document.querySelector("#search-status");
  let search_txt = document.querySelector("#search-txt");
  switch (option) {
    case "user":
      search_txt.classList.remove("hide");
      search_txt.placeholder = "Thông tin khách hàng";
      search_status.classList.add("hide");
      loadPage();
      break;
    case "status":
      search_txt.classList.add("hide");
      search_status.classList.remove("hide");
      fn_search_status("Hoạt động");
      break;
  }
}
//--------tìm kiếm khách hàng--------

function search() {
  let text = document.querySelector("#search-txt").value.trim().toLowerCase();
  let lua_chon = document.querySelector("#search-status").value;
  let date_from = document.querySelector("#date-begin").value;
  let date_to = document.querySelector("#date-end").value;

  let new_date_from = date_from ? new Date(date_from).toISOString().split("T")[0] : null;
  let new_date_to = date_to ? new Date(date_to).toISOString().split("T")[0] : null;

  console.log("Date from:", new_date_from, "Date to:", new_date_to);

  let filteredUsers = userList.filter((user) => {
    let matchText = !text || 
      user.FullName.toLowerCase().includes(text) ||
      user.Username.toLowerCase().includes(text) ||
      user.PhoneNumber.includes(text);

    let matchStatus = !lua_chon || 
      (user.status === "1" ? "Hoạt động" : "Bị khóa") === lua_chon;

    let newdate = user.CreatedAt ? new Date(user.CreatedAt).toISOString().split("T")[0] : null;
    let matchDate = (!new_date_from && !new_date_to) || 
      (newdate && new_date_from && newdate >= new_date_from) &&
      (newdate && new_date_to && newdate <= new_date_to);

    return matchText && matchStatus && matchDate;
  });

  // Cập nhật danh sách hiển thị
  document.querySelector(".customers").innerHTML =
    '<li class="top-list"><ul><li>STT</li><li>HỌ TÊN</li><li>TÊN ĐĂNG NHẬP</li><li>SỐ ĐIỆN THOẠI</li><li>TRẠNG THÁI</li><li></li></ul></li>';
  
  for (let i = 0; i < filteredUsers.length; i++) {
    show(i, filteredUsers[i]);
  }

  list = document.querySelectorAll(".list-customers .customer");
  loaditem();
}

// Lắng nghe sự kiện thay đổi trong các ô nhập để tự động tìm kiếm
document.querySelector("#search-txt").addEventListener("input", search);
document.querySelector("#search-status").addEventListener("change", search);
document.querySelector("#btn-search").addEventListener("click",search);

