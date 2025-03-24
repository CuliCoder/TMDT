import axiosInstance from "./configAxios.js";
let list_import = []
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
                    <nav class="navbar navbar-light bg-light box_gianhap">
                        <form class="form-inline">
                        <input class="form-control mr-sm-2 valueFind" type="search" placeholder="Giá nhập" aria-label="Search" id="gia${i}">
                        </form>
                    </nav>
                    <div class="box_quantity">
                        <p class ="giam" onclick="tang_giam_value('giam', ${i})">-</p>
                        <input data-id="${i}" type="number" min="1" max="100" step="1" value="0" class = "value_quantity" onblur="regex_value_quantity(${i})">
                        <p class ="tang" onclick="tang_giam_value('tang', ${i})">+</p>
                    </div>
                </div>
            <div>`;
        }
    } catch (error) {
        return null;       
    }
}
show_list_product()
//window.show_list_product = show_list_product()

async function tang_giam_value(status, id){
    try {
        const regex = /^[1-9]\d*$/;
        let inputElement = document.querySelector(`input[data-id="${id}"]`);
        let inputElementPrice = document.getElementById(`gia${id}`)
    let res_product_item = 
            await axiosInstance.get(`/product/product_item_all`)
    if(status === "giam"){
        inputElement.value = Math.max(Number(inputElement.value) - 1, 0);
    }
    else if(status === "tang")
    {
        inputElement.value = Math.min(Number(inputElement.value) + 1, 100);
    }
    if(!regex.test(inputElementPrice.value)){
        alert("Giá trị của giá nhập và số lượng phải là số nguyên dương và lớn hơn 0!");
        inputElementPrice.value = 0;
        inputElement.value = 0;
        return null;
    }
    if(Number(inputElement.value) === 0){
        list_import = list_import.filter(item=>item.id_item_product !== res_product_item.data.data[id].id);
        return null;
    }
    let data = {
        id_item_product: res_product_item.data.data[id].id,
        qty: Number(inputElement.value),
        price: Number(inputElementPrice.value)
    }
    let existingItem = list_import.find(item => item.id_item_product === data.id_item_product);
            if (existingItem) {
                existingItem.qty = data.qty; // Cập nhật số lượng nếu phần tử đã tồn tại
                existingItem.price = data.price
            } else {
                list_import.push(data); // Thêm phần tử mới nếu không tồn tại
            }
    event_show_detail_Import()
    } catch (error) {
        return null;
    }
}
window.tang_giam_value = tang_giam_value
async function regex_value_quantity(id) {
    try {
        let inputElement = document.querySelector(`input[data-id="${id}"]`);
        let inputElementPrice = document.getElementById(`gia${id}`)
        let value = inputElement.value; 
        const regex = /^[1-9]\d*$/; // Regex kiểm tra số nguyên dương (bắt đầu từ 1 trở lên)
        if (!regex.test(value) || !regex.test(inputElementPrice.value)) {
            alert("Giá trị của giá nhập và số lượng phải là số nguyên dương và lớn hơn 0!");
            inputElement.value = 0; // Đặt giá trị mặc định là 1 nếu không hợp lệ
            inputElementPrice.value = 0
        }
        else{
            let res_product_item = 
            await axiosInstance.get(`/product/product_item_all`)
            let data = {
                id_item_product: res_product_item.data.data[id].id,
                qty: Number(value),
                price: Number(inputElementPrice.value)
            }
            let existingItem = list_import.find(item => item.id_item_product === data.id_item_product);
            if (existingItem) {
                existingItem.qty = data.qty; // Cập nhật số lượng nếu phần tử đã tồn tại
                existingItem.price = data.price
            } else {
                list_import.push(data); // Thêm phần tử mới nếu không tồn tại
            }
        }
        event_show_detail_Import()
    } catch (error) {
        return null;
    }
}
window.regex_value_quantity = regex_value_quantity
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
    for(let i= 0; i <list_import.length; i++)
    {
        html +=`
        <tr>
            <th scope="row">${list_import[i].id_item_product}</th>
            <td>${list_import[i].qty}</td>
            <td>${list_import[i].price}</td>
        </tr>
        `
    }
    document.querySelector(".body_table_import").innerHTML = html
}
document.querySelector(".btn_xacnhan").addEventListener("click",function(){
    // let list_import = []
    // let orderImport = {
    // detailImport: [],
    // idNhanVien: null, // khi log quăng lên local để lấy id người nhập
    // idNcc: null,
    // TongTien: null,
    // NgayNhap: null
    orderImport.detailImport = list_import;
    orderImport.idNhanVien = "log"
    let Temp = 0
    for(let i = 0; i < list_import.length; i++)
    {
        Temp += Number(list_import[i].price)*Number(list_import[i].qty)
    }
    orderImport.TongTien = Temp;
    console.log(orderImport)
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
})
