let list;
let limit = 12; //limit products a page
let thispage = 1; //current page
show_orders();
function show_orders() {
  let userLogin = JSON.parse(localStorage.getItem("userLogin"));
  document.querySelector(
    ".list-orders .orders"
  ).innerHTML = `<li class="top-list">
  <ul>
    <li>Mã đơn hàng</li>
    <li>Sản phẩm</li>
    <li>Tổng tiền</li>
    <li>Ngày giờ</li>
    <li>Trạng thái</li>
    <li>Hành động</li>
  </ul>
</li>`;
  for (let i = 0; i < userLogin.order.length; i++) {
    let products = "";
    let d = new Date(userLogin.order[i].date_purchase);
    for (let j = 0; j < userLogin.order[i].products.length; j++) {
      if (j == userLogin.order[i].products.length - 1) {
        products +=
          userLogin.order[i].products[j].name +
          "-" +
          userLogin.order[i].products[j].color +
          " [" +
          userLogin.order[i].products[j].quantity +
          "]";
      } else {
        products +=
          userLogin.order[i].products[j].name +
          "-" +
          userLogin.order[i].products[j].color +
          " [" +
          userLogin.order[i].products[j].quantity +
          "], ";
      }
    }
    document.querySelector(
      ".list-orders .orders"
    ).innerHTML += `<li class="order">
    <ul>
      <li>${userLogin.order[i].orderId}</li>
      <li>${products}</li>
      <li>${price_format("" + userLogin.order[i].total_price)}</li>
      <li>${d.toLocaleString()}</li>
      <li>${userLogin.order[i].status}</li>
      <li>
        <button type="submit" class="cancel-order-active" onclick="cancel_order('${
          userLogin.order[i].orderId
        }')">Hủy đơn hàng</button>
      </li>
    </ul>
  </li>`;
  }
  list = document.querySelectorAll(".list-orders .orders .order");
  loaditem();
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
//search
document
  .querySelector(".search-order-bg form")
  .addEventListener("submit", (e) => {
    e.preventDefault();
    search();
  });
function search() {
  let userLogin = JSON.parse(localStorage.getItem("userLogin"));
  document.querySelector(
    ".list-orders .orders"
  ).innerHTML = `<li class="top-list">
  <ul>
    <li>Mã đơn hàng</li>
    <li>Sản phẩm</li>
    <li>Tổng tiền</li>
    <li>Ngày giờ</li>
    <li>Trạng thái</li>
    <li>Hành động</li>
  </ul>
</li>`;
  for (let i = 0; i < userLogin.order.length; i++) {
    if (
      check_search(
        userLogin.order[i].orderId.trim().toLowerCase(),
        userLogin.order[i].date_purchase
      )
    ) {
      let products = "";
      let d = new Date(userLogin.order[i].date_purchase);
      for (let j = 0; j < userLogin.order[i].products.length; j++) {
        if (j == userLogin.order[i].products.length - 1) {
          products +=
            userLogin.order[i].products[j].name +
            "-" +
            userLogin.order[i].products[j].color +
            " [" +
            userLogin.order[i].products[j].quantity +
            "]";
        } else {
          products +=
            userLogin.order[i].products[j].name +
            "-" +
            userLogin.order[i].products[j].color +
            " [" +
            userLogin.order[i].products[j].quantity +
            "], ";
        }
      }
      document.querySelector(
        ".list-orders .orders"
      ).innerHTML += `<li class="order">
        <ul>
          <li>${userLogin.order[i].orderId}</li>
          <li>${products}</li>
          <li>${price_format("" + userLogin.order[i].total_price)}</li>
          <li>${d.toLocaleString()}</li>
          <li>${userLogin.order[i].status}</li>
          <li>
            <button type="submit" class="cancel-order-active" onclick="cancel_order('${
              userLogin.order[i].orderId
            }')">Hủy đơn hàng</button>
          </li>
        </ul>
      </li>`;
    }
  }
  list = document.querySelectorAll(".list-orders .orders .order");
  loaditem();
}
function check_search(id, date_order) {
  let from = document.getElementById("date-begin").valueAsDate;
  let to = document.getElementById("date-end").valueAsDate;
  let orderId = document.getElementById("orderId").value.trim().toLowerCase();
  if ((from == null || to == null) && orderId != null) {
    if (id.includes(orderId)) return true;
    return false;
  } else if (from != null && to != null && orderId == null) {
    let begin = new Date(from);
    let end = new Date(to);
    let order = new Date(date_order);
    if (order >= begin && order <= end) return true;
    return false;
  } else if (from != null && to != null && orderId != null) {
    let begin = new Date(from);
    let end = new Date(to);
    let order = new Date(date_order);
    if (order >= begin && order <= end && id.includes(orderId)) return true;
    return false;
  }
}
//btn cancel order
function cancel_order(orderId) {
  let users = JSON.parse(localStorage.getItem("users"));
  let userLogin = JSON.parse(localStorage.getItem("userLogin"));

  for (let i = 0; i < userLogin.order.length; i++) {
    if (userLogin.order[i].orderId == orderId) {
      if (userLogin.order[i].status == "Đơn hàng đã bị hủy") {
        alert("Đơn hàng đã bị hủy!");
      } else if (userLogin.order[i].status == "Đơn hàng đã được xác nhận")
        alert("Không thể hủy đơn hàng đã được xác nhận!");
      else {
        let result = confirm(
          "Bạn có chắc muốn hủy đơn hàng này. Hành động này sẽ không thể khôi phục lại !"
        );
        if (result) {
          userLogin.order[i].status = "Đơn hàng đã bị hủy";
          localStorage.setItem("userLogin", JSON.stringify(userLogin));
        }
        for (let j = 0; j < users.length; j++)
          if (userLogin.user == users[j].user) {
            users[j] = userLogin;
            localStorage.setItem("users", JSON.stringify(users));
          }
      }
      break;
    }
  }

  show_orders();
}
