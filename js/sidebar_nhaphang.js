import axiosInstance from "./configAxios.js";
let orderImport = {
    detailImport: [],
    idNhanVien: null, // khi log quăng lên local để lấy id người nhập
    idNcc: null,
    TongTien: null,
    // NgayNhap: xuống dưới be làm ngày nhập
}
async function show_list_product() {
    try {
        let listProductImport = []
        let Html = ""
        // lấy tất cả product item
        let res_product_item = 
        await axiosInstance.get(`/product/product_item_all`)
        for(let i= 0; i<res_product_item.data.data.length; i++)
        {
            let res_product = await axiosInstance.get(`/product/get_product_by_productID/${res_product_item.data.data[0].product_id}`)
            document.querySelector(".list_product_import").innerHTML += 
            `<div class = "box_product_import">
                <img src="img/imgs${res_product_item.data.data[i].product_image}" alt="">
                <div class = "box_infor_product_import">
                    <p>${res_product_item.data.data[i].id}</p>
                    <p>${res_product.data.ProductName}</p>
                    <p>Dung lượng: 128GB</p>
                    <p>Ram: 6GB</p>
                    <p>Màu sắc: Vàng</p>
                    <div class="box_quantity">
                        <button type="button" class="btn btn-secondary value_quantity" onclick="show_popup(${res_product_item.data.data[i].id})">Nhập hàng</button>
                    </div>
                </div>
            <div>`;
        }
    } catch (error) {
        return null;       
    }
}
function show_popup(id){

    let html = `
        <lable>Số lượng:</lable>
         <input class="form-control mr-sm-2 value_Quantity" type="search" placeholder="Số lượng" aria-label="Search">
         <lable>Giá nhập:</lable>
         <input class="form-control mr-sm-2 value_Price_import" type="search" placeholder="Giá nhập" aria-label="Search">
         <div class="box_button">
            <button type="button" class="btn btn-primary btn-ok" onclick="event_xacnhan(${id})">Xác nhận</button>
         </div>
    `
    document.querySelector(".box_sl_gianhap").innerHTML = html
    document.querySelector(".box_sl_gianhap").classList.remove('hide');
    document.querySelector(".overlay").classList.remove('hide');
}
window.show_popup = show_popup
function event_xacnhan(id){
    const regex = /^[1-9]\d*$/;
    let value_Quantity = document.querySelector(".value_Quantity").value
    let value_Price_import = document.querySelector(".value_Price_import").value
    if (!regex.test(value_Quantity) || !regex.test(value_Price_import)) {
        alert("Giá trị của giá nhập phải là số nguyên dương và lớn hơn 0");
        return null;
    }
    // let orderImport = {
    //     detailImport: [],
    //     idNhanVien: null, // khi log quăng lên local để lấy id người nhập
    //     idNcc: null,
    //     TongTien: null,
    //     // NgayNhap: xuống dưới be làm ngày nhập
    // }
    let existingItem = orderImport.detailImport.find(item => item.id_item_product === id);
    if (existingItem) {
        existingItem.qty = Number(value_Quantity); // Cập nhật số lượng nếu phần tử đã tồn tại
        existingItem.price = Number(value_Price_import);
    } else {
        orderImport.detailImport.push({
            id_item_product: id,
            qty: Number(value_Quantity),
            price: Number(value_Price_import)
        }); // Thêm phần tử mới nếu không tồn tại
    }
    document.querySelector(".box_sl_gianhap").classList.add('hide');
    document.querySelector(".overlay").classList.add('hide');
    event_show_detail_Import()
}
window.event_xacnhan = event_xacnhan
show_list_product()
async function list_NCC() {
    try {
        let res_ncc =  await axiosInstance.get(`/api/suppliers/`)
        let html = ""
        for(let i=0; i< res_ncc.data.length; i++){
            html +=` 
            <option value ="${res_ncc.data[i].SupplierID}">${res_ncc.data[i].SupplierName}</option>
            `
        }
        document.querySelector(".form-select").innerHTML += html
    } catch (error) {
        return null;
    }
}
list_NCC();
document.querySelector(".form-select").addEventListener("change", function(){
    let valueNcc = document.querySelector(".form-select").value
    if(Number(valueNcc) != 0)
        orderImport.idNcc = Number(valueNcc)
})
function event_show_detail_Import(){
    let html=""
    for(let i= 0; i <orderImport.detailImport.length; i++)
    {
        html +=`
        <tr>
            <th scope="row">${orderImport.detailImport[i].id_item_product}</th>
            <td>${orderImport.detailImport[i].qty}</td>
            <td>${orderImport.detailImport[i].price.toLocaleString("vi-VN")} VNĐ</td>
            <td><button type="button" class="btn btn-danger" onclick="delete_item(${orderImport.detailImport[i].id_item_product})">Xóa</button></td>
        </tr>
        `
    }
    document.querySelector(".body_table_import").innerHTML = html
}
document.querySelector(".overlay").addEventListener("click", function(){
    document.querySelector(".box_sl_gianhap").classList.add('hide');
    document.querySelector(".overlay").classList.add('hide');
})
function delete_item(id){
    orderImport.detailImport = orderImport.detailImport.filter(item => item.id_item_product !== id);
    event_show_detail_Import()
}
window.delete_item = delete_item
// let orderImport = {
//     detailImport: [],
//     idNhanVien: null, // khi log quăng lên local để lấy id người nhập
//     idNcc: null,
//     TongTien: null,
//     // NgayNhap: xuống dưới be làm ngày nhập
// }
document.querySelector(".btn_xacnhan").addEventListener("click", function(){
    orderImport.idNhanVien = "log"
    let Temp = 0
    for(let i = 0; i < orderImport.detailImport.length; i++)
    {
        Temp += Number(orderImport.detailImport[i].price)*Number(orderImport.detailImport[i].qty)
    }
    if(orderImport.idNcc == null)
        {
            alert("bạn chưa chọn nhà cung cấp")
            return null;
        }
    if(orderImport.idNhanVien == null)
    {
        alert("không có nhân viên nhập")
        return null;
    }
    if(orderImport.detailImport.length == 0)
    {
        alert("danh sách nhập trống")
        return null;
    }
    alert("ok")
})
document.querySelector(".btn_search").addEventListener("input", async function(){
    let res_product_item = await axiosInstance.get(`/product/product_item_all`);
    let search = document.querySelector(".btn_search").value.toLowerCase().trim();
    document.querySelector(".list_product_import").innerHTML = "";
    let result = [];
    for (let item of res_product_item.data.data) {
        let res_product = await axiosInstance.get(`/product/get_product_by_productID/${item.product_id}`);
        if (
            String(item.id).toLowerCase().includes(search) ||
            String(res_product.data.ProductName).toLowerCase().includes(search)
        ) {
            result.push(item);
        }
    }
    if (search === "") {
        result = res_product_item.data.data;
        console.log(result)
    }
    if (result == null)
    {
        document.querySelector(".list_product_import").innerHTML = "";
    }
    else {
        for(let i= 0; i<result.length; i++)
            {
                let res_product = await axiosInstance.get(`/product/get_product_by_productID/${result[0].product_id}`)
                document.querySelector(".list_product_import").innerHTML += 
                `<div class = "box_product_import">
                    <img src="img/imgs${result[i].product_image}" alt="">
                    <div class = "box_infor_product_import">
                        <p>${result[i].id}</p>
                        <p>${res_product.data.ProductName}</p>
                        <p>Dung lượng: 128GB</p>
                        <p>Ram: 6GB</p>
                        <p>Màu sắc: Vàng</p>
                        <div class="box_quantity">
                            <button type="button" class="btn btn-secondary value_quantity" onclick="show_popup(${res_product_item.data.data[i].id})">Nhập hàng</button>
                        </div>
                    </div>
                <div>`;
            }
    }
})