import axiosInstance from "./configAxios.js";
async function dataOrder() {
    try {
        let res = await axiosInstance.get("/orders");
        return res;
    }
    catch (error) {
        console.log("test")
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
    document.querySelector(".body_table").innerHTML = "";
    for (let i = 0; i < data.length; i++) {
        let orderDate = new Date(data[i].OrderDate);
        let formattedDate = orderDate.toLocaleDateString('vi-VN', {
            day: '2-digit',
            month: '2-digit',
            year: 'numeric'
        });
        let formatMoney = parseInt(data[i].TotalAmount)

        document.querySelector(".body_table").innerHTML += `
        <tr class="row_table">
            <th scope="row" onclick="detail_order(${data[i].OrderID})">${data[i].OrderID}</th>
            <td onclick="detail_order(${data[i].OrderID})">${data[i].UserID}</td>
            <td onclick="detail_order(${data[i].OrderID})">${formattedDate}</td>
            <td onclick="detail_order(${data[i].OrderID})">${formatMoney.toLocaleString("vi-VN")} VNĐ</td>
            <td onclick="detail_order(${data[i].OrderID})">${data[i].Status}</td>
            <td class="actionTable">${action(data[i].Status, data[i].OrderID)}</td>
        </tr>`
    } 
}
show_orders();
async function searchOrder() {
    let data = await dataOrder();
    data = data.data;
    let search = document.querySelector(".valueFind").value.toLowerCase().trim();
    let result = data.filter((item) => {
        let Dated = new Date(item.OrderDate).toLocaleDateString('vi-VN', {
            day: '2-digit',
            month: '2-digit',
            year: 'numeric'
        });
        return String(item.OrderID).toLowerCase().includes(search) 
        || String(item.UserID).toLowerCase().includes(search) 
        || String(Dated).toLowerCase().includes(search) 
        || String(item.Status).toLowerCase().includes(search);
    });
    if (search.trim() == "") {
        result = data;
    }
    else if (result == null)
    {
        document.querySelector(".body_table").innerHTML = "";
    }
    else {
        document.querySelector(".body_table").innerHTML = "";
        for (let i = 0; i < result.length; i++) {
            let orderDate = new Date(result[i].OrderDate);
            let formattedDate = orderDate.toLocaleDateString('vi-VN', {
                day: '2-digit',
                month: '2-digit',
                year: 'numeric'
            });
            let formatMoney = parseInt(result[i].TotalAmount)
            document.querySelector(".body_table").innerHTML += `
            <tr class="row_table">
                <th scope="row">${result[i].OrderID}</th>
                <td onclick="detail_order(${result[i].OrderID})">${result[i].UserID}</td>
                <td onclick="detail_order(${result[i].OrderID})">${formattedDate}</td>
                <td onclick="detail_order(${result[i].OrderID})">${formatMoney.toLocaleString("vi-VN")} VNĐ</td>
                <td onclick="detail_order(${result[i].OrderID})">${result[i].Status}</td>
                <td class="actionTable">${action(result[i].Status, result[i].OrderID)}</td>
            </tr>`
        }
    }
}
document.querySelector(".valueFind").addEventListener("input", searchOrder); // tìm kiếm đơn hàng
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
          <p>Mã hóa đơn: ${res_od.data[0].OrderID}</p>
          <p>Ngày lập: ${formattedDate}</p>
          <p>Khách Hàng: ${res_customer.data[0].UserID} - ${res_customer.data[0].FullName}</p>
          <table class="table_detail">
            <tr>
              <th>Sản phẩm</th>
              <th>Số lượng</th>
              <th>Đơn giá</th>
              <th>Thành tiền</th>
            </tr>
          </table>
        </ul>`
        //console.log(res.data[0][0].Product_Item_ID)
        //console.log(detailOrder_HTML)
      document.querySelector(".overlay").classList.remove('hide');
      document.querySelector(".box_detailOrder").classList.remove('hide');
      document.querySelector(".box_detailOrder").innerHTML += detailOrder_HTML;
        let table = document.querySelector('.table_detail');
        for (let i = 0; i < res.data[0].length; i++) { 
          let row = document.createElement('tr');
          let res_product_item = await axiosInstance.get(`/product/product_item_by_ID/${res.data[0][i].Product_Item_ID}`)// lấy product_item thông qua chi tiết order
          let res_product = await axiosInstance.get(`/product/get_product_by_productID/${res_product_item.data.data[0].product_id}`) // lấy product thông qua id_product của product_item
          row.innerHTML = `
            <td>${res_product.data.data.ProductName}</td> 
            <td>${res.data[0][i].Quantity}</td>
            <td>${parseInt(res.data[0][i].Price).toLocaleString("vi-VN")} VNĐ</td>
            <td>${Number(res.data[0][i].Quantity) * Number(res.data[0][i].Price).toLocaleString("vi-VN")} VNĐ</td>
          `;
          table.appendChild(row);
          }
          document.querySelector(".detail_orders").innerHTML += 
          `<div class="totalAmout">Tổng tiền: ${parseInt(res_od.data[0].TotalAmount).toLocaleString("vi-VN")} VNĐ</div>`
    }
    catch (error) {
      return null;
    }
}
window.detail_order = detail_order;
document.querySelector('.overlay').onclick = function() { // click ra ngoài sẽ ẩn chi tiết đơn hàng
    document.querySelector('.overlay').classList.add('hide');
    document.querySelector('.box_detailOrder').classList.add('hide');
    document.querySelector('.box_detailOrder').innerHTML = '';
}
function action(status, orderID){
    if(status === "Đang xử lý")
        return `<div class="box_action">
                    <button type="button" class="btn btn-success btnY" onclick="event_Action('DongY',${orderID})">Đồng Ý</button>
                    <button type="button" class="btn btn-danger btnN" onclick="event_Action('Huy',${orderID})">Hủy</button>
                </div>`
    else if(status === "Đang giao hàng")
        return `<div class="box_action">
                    <button type="button" class="btn btn-success danggiaohang" onclick="event_Action('Giaohangthanhcong',${orderID})">Giao hàng thành công</button>
                </div>`
    else 
        return `<p></p>`
}
window.action = action;
async function event_Action(action, orderID){
    try {
        if(action === "Huy")
        {
            let body_infor = {
                id: orderID,
                Status: "Đã hủy"
            }
            await axiosInstance.put(`/orders`, body_infor)
            console.log("loi")
        }
        else if(action === "DongY")
        {
            let body_infor = {
                id: orderID,
                Status: "Đang giao hàng"
            }
            await axiosInstance.put(`/orders`, body_infor)
        }
        else if(action === "Giaohangthanhcong")
        {
            let body_infor = {
                id: orderID,
                Status: "Giao thành công"
            }
            await axiosInstance.put(`/orders`, body_infor)
        }
        location.reload()
    } catch (error) {
        console.error("Không thể thực hiện hành động")
    }
}
window.event_Action = event_Action