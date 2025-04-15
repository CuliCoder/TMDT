import axiosInstance from "./configAxios.js";
let UserID = 4;
let list_hisory_order = []
// <------ format day ------>
function formatDate(dateString) {
    const date = new Date(dateString); // Chuyển chuỗi thành đối tượng Date
    const day = String(date.getDate()).padStart(2, "0"); // Lấy ngày (dd)
    const month = String(date.getMonth() + 1).padStart(2, "0"); // Lấy tháng (mm)
    const year = date.getFullYear(); // Lấy năm (yyyy)
    const hours = String(date.getHours()).padStart(2, "0"); // Lấy giờ (HH)
    const minutes = String(date.getMinutes()).padStart(2, "0"); // Lấy phút (mm)
  
    return `${day}/${month}/${year} ${hours}:${minutes}`; // Định dạng dd/MM/yyyy HH:mm
  }
// <------ show order history ------>
async function show_Order_History() {
  try {
    let list_order = await axiosInstance.get(`/orders/user/${UserID}`);
    list_order = list_order.data;
    list_hisory_order = list_order;
    let html_box_order = "";
    for (let i = 0; i < list_order.length; i++) {
      html_box_order +=`
        <a class="invoice-card" onclick = "popup_status(${list_order[i].OrderID})">
            <div class="invoice-header">
                <div class="shop-info"> 
                    <div class="shop-details">
                        <h3 class="shop-name">#${list_order[i].OrderID}</h3>
                        <p class="invoice-date">${formatDate(list_order[i].OrderDate)}</p>
                    </div>
                </div>
                <div>
                ${showStatus(list_order[i].Status)}
                ${list_order[i].payment_status === "Đã thanh toán" && list_order[i].Status != "Hủy" && list_order[i].Status != "Quá hạn thanh toán"? `<span class="invoice-status paid">Đã thanh toán</span>` : ""}
                </div>
            </div>
            <div class="invoice-products">
                ${await show_Product_Detail(list_order[i].OrderID)}
            </div>
            <div class="invoice-footer">
                <div class="invoice-total">
                <span class="total-label">Tổng thanh toán:</span>
                <span class="total-amount">${(list_order[i].TotalAmount*1).toLocaleString("vi-VN")}₫</span>
                </div>
                ${list_order[i].Status === "Chờ duyệt" && list_order[i].payment_status === "Chưa thanh toán" ? `<button class="action-button" onclick="event_btn_cancel(${list_order[i].OrderID})">Hủy</button>` : ""}
            </div>
      </a>`;
    }
    document.querySelector(".invoice-feed").innerHTML = html_box_order;
  } catch (error) {
    console.error("Lỗi khi lấy danh sách đơn hàng:", error);
  }
}
show_Order_History();
// <------ các trạng thái ------>
function showStatus(status) {
    //'Chờ duyệt','Chuẩn bị hàng','Đang vận chuyển','Đã giao','Hủy','Quá hạn thanh toán'
  if(status === "Chờ duyệt")
    return `<span class="invoice-status pending">${status}</span>`;
  else if(status === "Hủy" || status === "Quá hạn thanh toán")
    return `<span class="invoice-status canceled">${status}</span>`;
  else if(status === "Đã giao")
    return `<span class="invoice-status paid">${status}</span>`;
  else
    return `<span class="invoice-status loading">${status}</span>`;
}
// <------ các sản phẩm trong chi tiết hóa đơn ------>
async function show_Product_Detail(id_order) {
    try {
        let list_product = await axiosInstance.get(`/orderdetail/${id_order}`);
        list_product = list_product.data[0];
        let html_box_detail_product = "";
        for (let i = 0; i<list_product.length; i++)
        {
            let attributes = {
                "Dung lượng RAM": null,
                "Bộ nhớ trong": null,
                "Màu": null,
              };
            let data = await axiosInstance.get(`/products/product_item_by_ID/${list_product[i].Product_Item_ID}`);
            data = data.data.data;
            data?.attributes?.forEach((attribute) => {
                if (attributes.hasOwnProperty(attribute.variantName)) {
                  attributes[attribute.variantName] = attribute.values;
                }});
            let { "Dung lượng RAM": ram, "Màu": color, "Bộ nhớ trong": gb } = attributes; // gán các giá trị để sử dụng
            html_box_detail_product +=`
              <div class="product-item">
                    <div class="product-image">
                        <img class="img_prd" src="http://localhost:3000${data.product_image}" alt="Ảnh sản phẩm">
                    </div>
                    <div class="product-details">
                        <p class="product-name">${data.name + " "}${ram && gb?ram.replace(" ", "")+"/"+gb.replace(" ", "")+" ": ""}${color?color:""}</p>
                        <p class="product-price">${(data.price*1).toLocaleString("vi-VN")}₫<span class="quantity"> x${list_product[i].Quantity}</span></p>
                    </div>
                </div>`

        }
        return html_box_detail_product;
    } catch (error) {
        console.error("Lỗi khi lấy danh sách chi tiết đơn hàng:", error);
    }
}
//--------- event cancel --------//
async function event_btn_cancel(OrderID){
  try {
    await axiosInstance.post(`/cart/cancelOrder/${OrderID}`)
    window.location.reload();
  } catch (error) {
    console.error("Lỗi khi hủy đơn hàng:", error);
  }
}
window.event_btn_cancel = event_btn_cancel
//---------- Tim kiem ----------//
document.querySelector(".findOrder").addEventListener("input", async (event) => {
  try {
    const inputValue = event.target.value;
    const filteredOrders = list_hisory_order.filter((order) =>
    order.OrderID.toString().includes(inputValue) // Lọc đơn hàng theo OrderID
    );
    let html_box_order = ``
    for (let i = 0; i < filteredOrders.length; i++) {
      html_box_order +=`
        <a class="invoice-card" onclick = "popup_status(${filteredOrders[i].OrderID})">
            <div class="invoice-header">
                <div class="shop-info">
                    <div class="shop-details">
                        <h3 class="shop-name">#${filteredOrders[i].OrderID}</h3>
                        <p class="invoice-date">${formatDate(filteredOrders[i].OrderDate)}</p>
                    </div>
                </div>
                <div>
                ${showStatus(filteredOrders[i].Status)}
                ${filteredOrders[i].payment_status === "Đã thanh toán" && filteredOrders[i].Status != "Hủy" && filteredOrders[i].Status != "Quá hạn thanh toán"? `<span class="invoice-status paid">Đã thanh toán</span>` : ""}
                </div>
            </div>
            <div class="invoice-products">
                ${await show_Product_Detail(filteredOrders[i].OrderID)}
            </div>
            <div class="invoice-footer">
                <div class="invoice-total">
                <span class="total-label">Tổng thanh toán:</span>
                <span class="total-amount">${(filteredOrders[i].TotalAmount*1).toLocaleString("vi-VN")}₫</span>
                </div>
                ${filteredOrders[i].Status === "Chờ duyệt" && filteredOrders[i].payment_status === "Chưa thanh toán" ? `<button class="action-button" onclick="event_btn_cancel(${filteredOrders[i].OrderID})">Hủy</button>` : ""}
            </div>
      </a>`;
    }
    document.querySelector(".invoice-feed").innerHTML = html_box_order;
  } catch (error) {
    console.error("Lỗi khi lấy danh sách đơn hàng:", error);
  }
})
// ------------------------  handleFiletStatus ---------------------------//
async function handleFiletStatus(Status){
  try {
    let filteredOrders = []
    if(Status == "tatca"){
      filteredOrders = list_hisory_order; 
    }
    else if(Status == "Hủy"){
      filteredOrders = list_hisory_order.filter((order) =>
        order.Status.toString().includes("Hủy") || order.Status.toString().includes("Quá hạn thanh toán")
        );
    }
    else{
      filteredOrders = list_hisory_order.filter((order) =>
        order.Status.toString().includes(Status) || order.payment_status.toString().includes(Status)
        );
    }
      let html_box_order = ``
      for (let i = 0; i < filteredOrders.length; i++) {
        html_box_order +=`
          <a class="invoice-card" onclick = "popup_status(${filteredOrders[i].OrderID})">
              <div class="invoice-header">
                  <div class="shop-info">
                      <div class="shop-details">
                          <h3 class="shop-name">#${filteredOrders[i].OrderID}</h3>
                          <p class="invoice-date">${formatDate(filteredOrders[i].OrderDate)}</p>
                      </div>
                  </div>
                  <div>
                  ${showStatus(filteredOrders[i].Status)}
                  ${filteredOrders[i].payment_status === "Đã thanh toán" && filteredOrders[i].Status != "Hủy" && filteredOrders[i].Status != "Quá hạn thanh toán"? `<span class="invoice-status paid">Đã thanh toán</span>` : ""}
                  </div>
              </div>
              <div class="invoice-products">
                  ${await show_Product_Detail(filteredOrders[i].OrderID)}
              </div>
              <div class="invoice-footer">
                  <div class="invoice-total">
                  <span class="total-label">Tổng thanh toán:</span>
                  <span class="total-amount">${(filteredOrders[i].TotalAmount*1).toLocaleString("vi-VN")}₫</span>
                  </div>
                  ${filteredOrders[i].Status === "Chờ duyệt" && filteredOrders[i].payment_status === "Chưa thanh toán" ? `<button class="action-button" onclick="event_btn_cancel(${filteredOrders[i].OrderID})">Hủy</button>` : ""}
              </div>
        </a>`;
      }
      document.querySelector(".invoice-feed").innerHTML = html_box_order;
  } catch (error) {
    console.error("Lỗi khi lấy danh sách đơn hàng:", error);
  }
}
document.querySelector(".tatca").addEventListener("click", () => {
  handleFiletStatus("tatca");
  document.querySelectorAll(".filter-button").forEach((btn) => btn.classList.remove("active")); // Xóa class "active" khỏi tất cả các nút
  document.querySelector(".tatca").classList.add("active"); // Thêm class "active" cho nút hiện tại
});

document.querySelector(".dathanhtoan").addEventListener("click", () => {
  handleFiletStatus("Đã thanh toán");
  document.querySelectorAll(".filter-button").forEach((btn) => btn.classList.remove("active"));
  document.querySelector(".dathanhtoan").classList.add("active");
});

document.querySelector(".chuathanhtoan").addEventListener("click", () => {
  handleFiletStatus("Chưa thanh toán");
  document.querySelectorAll(".filter-button").forEach((btn) => btn.classList.remove("active"));
  document.querySelector(".chuathanhtoan").classList.add("active");
});

document.querySelector(".dahuy").addEventListener("click", () => {
  handleFiletStatus("Hủy");
  document.querySelectorAll(".filter-button").forEach((btn) => btn.classList.remove("active"));
  document.querySelector(".dahuy").classList.add("active");
});
async function popup_status(OrderID){
  try {
    document.querySelector(".popup_status").classList.remove("hide")
    document.querySelector(".overlay").classList.remove("hide")
    let status_order = await axiosInstance.get(`/orders/time_status/${OrderID}`);
    let html_status = ""
    status_order = status_order.data
    for(let i = 0; i<status_order.length; i++)
    {
      const updatedDate = new Date(status_order[i].UpdatedAt);
      html_status += `
     <div class="tracking-item completed">
          <div class="tracking-date">
              <span class="date">${updatedDate.getDate()} tháng ${updatedDate.getMonth() + 1} năm ${updatedDate.getFullYear()} </span>
              <span class="time">${updatedDate.getHours() + ":" + updatedDate.getMinutes()}</span>
          </div>
          <div class="tracking-marker">
              <div class="marker-circle">
                  <i class="fas fa-check"></i>
              </div>
              <div class="marker-line"></div>
          </div>
          <div class="tracking-content">
              <div class="status">${status_order[i].status}</div>
          </div>
      </div>`
    } 
    document.querySelector(".popup_status").innerHTML = html_status;
  } catch (error) {
    console.error("Lỗi khi lấy danh sách trạng thái đơn hàng:", error);
  }
}
window.popup_status = popup_status
document.querySelector(".overlay").addEventListener("click", () => {
  document.querySelector(".popup_status").classList.add("hide")
  document.querySelector(".overlay").classList.add("hide")
})
document.querySelector(".back-button").addEventListener("click", (event) => {
  event.preventDefault(); // Ngăn chặn hành vi mặc định của thẻ `<a>`
  window.location.href = "index.html"; // Đường dẫn đến trang chủ
});