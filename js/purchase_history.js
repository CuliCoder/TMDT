import axiosInstance from "./configAxios.js";
let list; //danh sách các đơn được hiển thị
let limit = 12; //số đơn trong 1 trang
let thispage = 1; //trang hiện tại
//show đơn hàng
function show(order) {
  const ordersElement = document.querySelector(".list-orders .orders");
  if (!ordersElement) {
    console.error("Phần tử .list-orders .orders không tồn tại");
    return;
  }
  let orderDate = new Date(order.OrderDate);
  let formattedDate = orderDate.toLocaleDateString('vi-VN', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric'
    });
  document.querySelector(
    ".list-orders .orders"
  ).innerHTML += `<li class="order" onclick = "detail_order('${order.OrderID}')">
  <ul>
    <li>${order.OrderID}</li>
    <li>${order.UserID}</li>
    <li>${order.TotalAmount}</li>
    <li>${formattedDate}</li>
    <li>${order.Status}</li>
    <li>
      <button type="submit" class="cancel-order-active" onclick="cancel_order('${
        order.OrderID
      }')">Hủy đơn hàng</button>
    </li>
  </ul>
</li>`;
}
{/* <li>
<button type="submit" class="cancel-order-active" onclick="cancel_order('${
  order.orderId
}')">Hủy đơn hàng</button>
</li> */}
//<li>${price_format("" + order.TotalAmount)}</li>
//danh sách đơn hàn
async function dataOrder() {
  try {
    let userLoginID = JSON.parse(localStorage.getItem("userLogin")).id;
    let res = await axiosInstance.get(`/orders/user/${userLoginID}`);
    return res;
  } catch (error) {
    return null;
  }
}
async function show_orders() {
  let data = await dataOrder(); 
  data = data.data;// Đợi kết quả của hàm dataOrder
  if (!data) {
    console.error("Không thể lấy dữ liệu đơn hàng");
    return;
  }
  document.querySelector(
    ".list-orders .orders"
  ).innerHTML = `<li class="top-list">
  <ul>
    <li>Mã đơn hàng</li>
    <li>UserID</li>
    <li>Tổng tiền</li>
    <li>Ngày giờ</li>
    <li>Trạng thái</li>
    <li>Hành động</li>
  </ul>
</li>`;
  for (let i = 0; i < data.length; i++) {
    if (data[i].Status == "cancelled") continue
    show(data[i]); // Hiển thị đơn hàng
  }
  list = document.querySelectorAll(".list-orders .orders .order"); // Danh sách đơn hàng được hiển thị
  loaditem(); // Phân trang
}
show_orders();
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
  for (let i = 0; i < list.length; i++) {
    if (i >= beginget && i <= endget) list[i].style.display = "block";
    else list[i].style.display = "none";
  }
  listPage();
}
function listPage() {
  let count = Math.ceil(list.length / limit);
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
//------Tìm kiếm đơn hàng--------
document
  .querySelector(".search-order-bg form")
  .addEventListener("submit", (e) => {
    e.preventDefault();
    search();
  });
//-------tìm kiếm------
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
      show(userLogin.order[i], products, d.toLocaleString()); //show đơn hàng
    }
  }
  list = document.querySelectorAll(".list-orders .orders .order");
  loaditem();
}
//kiểm tra lọc ra các đơn hàng thỏa đk
function check_search(id, date_order) {
  let from = document.getElementById("date-begin").valueAsDate; //lấy ngày bắt đầu
  let to = document.getElementById("date-end").valueAsDate; //lấy ngày kết thúc
  let orderId = document.getElementById("orderId").value.trim().toLowerCase();
  if ((from == null || to == null) && orderId != null) {
    //tìm theo id
    if (id.includes(orderId)) return true;
    return false;
  } else if (from != null && to != null && orderId == null) {
    //tìm theo khoảng thời gian
    let begin = new Date(from);
    let end = new Date(to);
    let order = new Date(date_order);
    if (order >= begin && order <= end) return true;
    return false;
  } else if (from != null && to != null && orderId != null) {
    //tìm theo khoảng tg và id
    let begin = new Date(from);
    let end = new Date(to);
    let order = new Date(date_order);
    if (order >= begin && order <= end && id.includes(orderId)) return true;
    return false;
  }
}
//hủy đơn hàng
async function cancel_order(orderId) {
try {
  let res = await axiosInstance.get(`/orders/${orderId}`);
  console.log("alo: ",res.data);
  if (!res.data || res.data[0].Status != "pending")
    return alert("Không thể hủy đơn hàng này!");
// lấy hóa đơn cần đổi status
  let update_order = {
    OrderID: orderId,
    Status: "cancelled",
  };
  let res_update = await axiosInstance.put(`/orders`, update_order);
  return alert("Hủy đơn hàng thành công!");
  show_orders();
} catch (error) {
  return alert("Lỗi cơ sở dữ liệu!");
}
}
window.cancel_order = cancel_order;
window.detail_order = detail_order;
async function detail_order(orderID) {
  try {
    let res = await axiosInstance.get(`/orderdetail/${orderID}`);
    let res_od = await axiosInstance.get(`/orders/${orderID}`)
    let res_customer = await axiosInstance.get(`/api/customers/${res_od.data[0].UserID}`)
    let orderDate = new Date(res_od.data[0].OrderDate);
    let formattedDate = orderDate.toLocaleDateString('vi-VN', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric'
    });
    // viết 1 đoạn html khi click vào hiện lên chi tiết đơn hàng
    let detailOrder_HTML = "";
    detailOrder_HTML += `<ul class="detail_orders">
        <h3>CHI TIẾT HÓA ĐƠN</h3>
        <p>Ngày lập: ${formattedDate}</p>
        <p>Khách Hàng: ${res_customer.data[0].FullName}</p>
        <table class="table_detail">
          <tr>
            <th style="width: 30%;">Sản phẩm</th>
            <th style="width: 10%;">Số lượng</th>
            <th style="width: 30%;">Đơn giá</th>
            <th style="width: 30%;">Thành tiền</th>
          </tr>
        </table>
      </ul>`
      //console.log(detailOrder_HTML)
    document.querySelector(".overlay").classList.remove('hide');
    document.querySelector(".box_detailOrder").classList.remove('hide');
    document.querySelector(".box_detailOrder").innerHTML += detailOrder_HTML;
      let table = document.querySelector('.table_detail');
      for (let i = 0; i < res.data[0].length; i++) {
        let row = document.createElement('tr');
        let res_product = await axiosInstance.get(`/products/${res.data[0][i].ProductID}`)
        console.log("test", res_product.data.data.ProductName)
        row.innerHTML = `
          <td>${res_product.data.data.ProductName}</td>
          <td>${res.data[0][i].Quantity}</td>
          <td>${res.data[0][i].Price}</td>
          <td>${Number(res.data[0][i].Quantity) * Number(res.data[0][i].Price)}</td>
        `;
        table.appendChild(row);
        }
        document.querySelector(".detail_orders").innerHTML += `<div class="totalAmout">Tổng tiền: ${res_od.data[0].TotalAmount}</div>`
  }
  catch (error) {
    return null;
  }
}

document.querySelector('.overlay').onclick = function() {
  document.querySelector('.overlay').classList.add('hide');
  document.querySelector('.box_detailOrder').classList.add('hide');
  document.querySelector('.box_detailOrder').innerHTML = '';
}
// `<li class="order">
//   <ul>
//     <li>${order.OrderID}</li>
//     <li>${order.UserID}</li>
//     <li>${order.TotalAmount}</li>
//     <li>${order.OrderDate}</li>
//     <li>${order.Status}</li>
//     <li>
//       <button type="submit" class="cancel-order-active" onclick="cancel_order('${
//         order.OrderID
//       }')">Hủy đơn hàng</button>
//     </li>
//   </ul>
// </li>`;