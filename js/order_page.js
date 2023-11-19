let list;
let limit = 12; //limit products a page
let thispage = 1; //current page
//show đơn hàng
function show(order, user, products, date) {
  document.querySelector(
    ".list-orders .orders"
  ).innerHTML += `<li class="order">
  <ul>
    <li>${order.orderId}</li>
    <li>${user}</li>
    <li>${products}</li>
    <li>${price_format("" + order.total_price)}</li>
    <li>${date}</li>
    <li>${order.status}</li>
    <li>
      <div class="btn">
        <button type="submit" class="confirm-order" onclick="confirm_order('${
          order.orderId
        }')">
          <i class="bx bx-check"></i>
        </button>
        <span>Xác nhận</span>
      </div>
      <div class="btn">
        <button type="submit" class="cancel-order" onclick="cancel_order('${
          order.orderId
        }')">
          <i class="bx bx-x"></i>
        </button>
        <span>Hủy</span>
      </div>
      <div class="btn">
        <button type="submit" class="info-order" onclick="info_order('${
          order.orderId
        }')">
          <i class="bx bx-info-circle"></i>
        </button>
        <span>Thông tin</span>
      </div>
    </li>
  </ul>
</li>`;
}
//danh sách đơn hàng
show_orders();
function show_orders() {
  let users = JSON.parse(localStorage.getItem("users"));
  document.querySelector(
    ".list-orders .orders"
  ).innerHTML = `<li class="top-list">
  <ul>
    <li>Mã đơn hàng</li>
    <li>Khách hàng</li>
    <li>Sản phẩm</li>
    <li>Tổng tiền</li>
    <li>Ngày giờ</li>
    <li>Trạng thái</li>
    <li>Hành động</li>
  </ul>
</li>`;
  for (let i = 0; i < users.length; i++) {
    for (let j = 0; j < users[i].order.length; j++) {
      let products = "";
      let d = new Date(users[i].order[j].date_purchase);
      for (let v = 0; v < users[i].order[j].products.length; v++) {
        if (v == users[i].order[j].products.length - 1) {
          products +=
            users[i].order[j].products[v].name +
            "-" +
            users[i].order[j].products[v].color +
            " [" +
            users[i].order[j].products[v].quantity +
            "]";
        } else {
          products +=
            users[i].order[j].products[v].name +
            "-" +
            users[i].order[j].products[v].color +
            " [" +
            users[i].order[j].products[v].quantity +
            "], ";
        }
      }
      show(users[i].order[j], users[i].user, products, d.toLocaleString());
    }
  }
  list = document.querySelectorAll(".list-orders .orders .order");
  loaditem();
}
//định dạng giá
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
function loaditem() {
  let beginget = limit * (thispage - 1); //index start
  let endget = limit * thispage - 1; //index end
  if (list.length == 0) {
    document.querySelector(".orders").classList.add("hide");
    document.querySelector(".not-found").classList.remove("hide");
    document.querySelector(".list-page").classList.add("hide");
  } else {
    document.querySelector(".orders").classList.remove("hide");
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
//------tìm kiếm đơn hàng------
function search(txt, from, to) {
  let users = JSON.parse(localStorage.getItem("users"));
  document.querySelector(
    ".list-orders .orders"
  ).innerHTML = `<li class="top-list">
  <ul>
    <li>Mã đơn hàng</li>
    <li>Khách hàng</li>
    <li>Sản phẩm</li>
    <li>Tổng tiền</li>
    <li>Ngày giờ</li>
    <li>Trạng thái</li>
    <li>Hành động</li>
  </ul>
</li>`;
  for (let i = 0; i < users.length; i++) {
    for (let j = 0; j < users[i].order.length; j++) {
      if (check_search(txt, i, j, from, to)) {
        let products = "";
        let d = new Date(users[i].order[j].date_purchase);
        for (let v = 0; v < users[i].order[j].products.length; v++) {
          if (v == users[i].order[j].products.length - 1) {
            products +=
              users[i].order[j].products[v].name +
              "-" +
              users[i].order[j].products[v].color +
              " [" +
              users[i].order[j].products[v].quantity +
              "]";
          } else {
            products +=
              users[i].order[j].products[v].name +
              "-" +
              users[i].order[j].products[v].color +
              " [" +
              users[i].order[j].products[v].quantity +
              "], ";
          }
        }
        show(users[i].order[j], users[i].user, products, d.toLocaleString());
      }
    }
  }
  list = document.querySelectorAll(".list-orders .orders .order");
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
    case "orderId":
      search_txt.classList.remove("hide");
      search_txt.placeholder = "Mã đơn hàng";
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
//tìm kiếm bằng ô input text
document.querySelector("#search-txt").addEventListener("input", (e) => {
  search(e.target.value, "", "");
});
//tìm kiếm bằng tùy chọn trạng thái
document.querySelector("#search-status").addEventListener("change", (e) => {
  search(e.target.value, "", "");
});
//lọc
function check_search(input, i, j, from, to) {
  let users = JSON.parse(localStorage.getItem("users"));
  if (from != "" && to != "" && input == "") {
    //tìm kiếm theo khoảng thời gian
    let begin = new Date(from);
    let end = new Date(to);
    let order = new Date(users[i].order[j].date_purchase);
    if (begin <= order && order <= end) return true;
    return false;
  } else {
    //tìm kiếm bằng input text hoặc tùy chọn trạng thái
    switch (option) {
      case "orderId":
        if (users[i].order[j].orderId.trim().toLowerCase().includes(input))
          return true;
        return false;
      case "user":
        if (users[i].user.trim().toLowerCase().includes(input)) return true;
        return false;
      case "status":
        if (users[i].order[j].status == input) return true;
        return false;
    }
  }
}
//ấn nút sẽ tìm kiếm theo khoảng thời gian
document.querySelector(".search-date button").addEventListener("click", () => {
  let from = document.getElementById("date-begin").valueAsDate;
  let to = document.getElementById("date-end").valueAsDate;
  search("", from, to);
});
//xác nhận đơn hàng
function confirm_order(orderId) {
  let users = JSON.parse(localStorage.getItem("users"));
  let userLogin = JSON.parse(localStorage.getItem("userLogin"));
  for (let i = 0; i < users.length; i++) {
    for (let j = 0; j < users[i].order.length; j++) {
      if (users[i].order[j].orderId == orderId) {
        if (users[i].order[j].status == "Đơn hàng đã bị hủy") {
          alert("Không thể duyệt đơn hàng đã hủy!");
        } else if (users[i].order[j].status == "Đơn hàng đã được xác nhận")
          alert("Đơn hàng đã được xác nhận!");
        else {
          users[i].order[j].status = "Đơn hàng đã được xác nhận";
          localStorage.setItem("users", JSON.stringify(users));
          if (userLogin.user == users[i].user) {
            userLogin = users[i];
            localStorage.setItem("userLogin", JSON.stringify(userLogin));
          }
          alert("Xác nhận đơn hàng thành công!");
        }
        break;
      }
    }
  }
  show_orders();
}
//hủy đơn
function cancel_order(orderId) {
  let users = JSON.parse(localStorage.getItem("users"));
  let userLogin = JSON.parse(localStorage.getItem("userLogin"));
  for (let i = 0; i < users.length; i++) {
    for (let j = 0; j < users[i].order.length; j++) {
      if (users[i].order[j].orderId == orderId) {
        if (users[i].order[j].status == "Đơn hàng đã bị hủy") {
          alert("Đơn hàng đã bị hủy!");
        } else if (users[i].order[j].status == "Đơn hàng đã được xác nhận")
          alert("Không thể hủy đơn hàng đã được xác nhận!");
        else {
          let result = confirm(
            "Bạn có chắc muốn hủy đơn hàng này. Hành động này sẽ không thể khôi phục lại !"
          );
          if (result) {
            users[i].order[j].status = "Đơn hàng đã bị hủy";
            localStorage.setItem("users", JSON.stringify(users));
          }
          if (userLogin.user == users[i].user) {
            userLogin = users[i];
            localStorage.setItem("userLogin", JSON.stringify(userLogin));
          }
        }
        break;
      }
    }
  }
  show_orders();
}
//thông tin đơn
function info_order(orderId) {
  document.querySelector(".info-order-bg").classList.remove("hide");
  let users = JSON.parse(localStorage.getItem("users"));
  for (let i = 0; i < users.length; i++) {
    for (let j = 0; j < users[i].order.length; j++) {
      if (users[i].order[j].orderId == orderId) {
        let products = "";
        let d = new Date(users[i].order[j].date_purchase);
        for (let v = 0; v < users[i].order[j].products.length; v++) {
          if (v == users[i].order[j].products.length - 1) {
            products +=
              users[i].order[j].products[v].name +
              "-" +
              users[i].order[j].products[v].color +
              " [" +
              users[i].order[j].products[v].quantity +
              "]";
          } else {
            products +=
              users[i].order[j].products[v].name +
              "-" +
              users[i].order[j].products[v].color +
              " [" +
              users[i].order[j].products[v].quantity +
              "], ";
          }
        }
        document.querySelector(
          ".info-order-bg"
        ).innerHTML = `<div class="info-order-box">
        <i class="bx bx-x"></i>
        <p>Thông tin đơn hàng</p>
        <div class="infor">
          <span>Sản phẩm:</span>
          <span>${products}</span>
        </div>
        <div class="infor">
          <span>Ngày tạo đơn:</span>
          <span>${d.toLocaleString()}</span>
        </div>
        <div class="infor">
          <span>Tên khách hàng:</span>
          <span>${users[i].FullName}</span>
        </div>
        <div class="infor">
          <span>Địa chỉ:</span>
          <span>${users[i].Address}</span>
        </div>
        <div class="infor">
          <span>Số điện thoại:</span>
          <span>${users[i].PhoneNumber}</span>
        </div>
        <div class="infor">
          <span>Tổng tiền:</span>
          <span>${price_format("" + users[i].order[j].total_price)}</span>
        </div>
        <div class="infor">
          <span>Tình trạng:</span>
          <span>${users[i].order[j].status}</span>
        </div>
      </div>`;
      }
    }
  }
  //đóng box thông tin
  document.querySelector(".info-order-bg").addEventListener("click", (e) => {
    if (e.target == e.currentTarget)
      document.querySelector(".info-order-bg").classList.add("hide");
  });
  document
    .querySelector(".info-order-bg .info-order-box i")
    .addEventListener("click", () => {
      document.querySelector(".info-order-bg").classList.add("hide");
    });
}
