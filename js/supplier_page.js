var data = []
var filterData = []
async function getData(){
    let response = await fetch('http://localhost:3000/api/suppliers')
    data = await response.json()
    filterData = [...data]
    renderDataPagination()
}
getData();
function formatDateTime(data){
    return new Date(data).toLocaleString('sv-SE', { timeZone: 'UTC' }).replace('T', ' ');
}
function renderDataPagination(){
    $('#sup-pagination').pagination({
        dataSource: filterData,
        pageSize: 10,
        showGoInput: true,
        showGoButton: true,
        callback: function(data, pagination) {
            // template method of yourself
            var html = data.map(item => {
                return `
                    <div class="row border-bottom py-2">
                        <div class="col">${item.SupplierName || 'trống'}</div>
                        <div class="col">${item.ContactName || 'trống'}</div>
                        <div class="col">${item.ContactEmail || 'trống'}</div>
                        <div class="col">${item.ContactPhone || 'trống'}</div>
                        <div class="col">${item.Address || 'trống'}</div>
                        <div class="col">${formatDateTime(item.CreatedAt) || 'trống'}</div>
                        <div class="col">
                        <div onclick = "edit(${item.SupplierID})">
                            <i class="fa-solid fa-pen-to-square"></i>
                            <span>Sửa</span>
                        </div>
                        </div>
                    </div>
               `
            }).join("");
            $("#sup-data").html(html);
        }
    })
}
// tim kiem 
document.addEventListener('DOMContentLoaded', function() {
    document.getElementById('sup-text_search').addEventListener('keyup', search);
    document.getElementById('sup-btn_search').addEventListener('click', search);
});

function search() {
    var searchValue = document.getElementById('sup-text_search').value.toLowerCase().trim();
    var dateFromValue = document.getElementById('sup-Date-From').value;
    var dateToValue = document.getElementById('sup-Date-To').value;
    var dateFrom = dateFromValue ? new Date(dateFromValue) : null;
    var dateTo = dateToValue ? new Date(dateToValue) : null;
    console.log(dateFrom, " , ", dateTo);

    filterData = data.filter(item => {
        var dateItem = item.CreatedAt ? new Date(item.CreatedAt) : null;
        
        var matchText = !searchValue 
            || item.SupplierName.toLowerCase().includes(searchValue)
            || item.ContactName.toLowerCase().includes(searchValue)
            || item.ContactEmail.toLowerCase().includes(searchValue)
            || item.ContactPhone.toLowerCase().includes(searchValue)
            || item.Address.toLowerCase().includes(searchValue)
            || item.CreatedAt.toLowerCase().includes(searchValue);

        var matchDate = (!dateFrom || dateItem >= dateFrom) && (!dateTo || dateItem <= dateTo);

        return matchText && matchDate;
    });

    $('#sup-pagination').pagination('destroy');
    renderDataPagination();
}
//them 
document.addEventListener('DOMContentLoaded', function() {
    let btn = document.getElementById('sup-btn_add');
    if (btn) {
        btn.addEventListener('click', add);
    } else {
        console.error("Không tìm thấy phần tử có ID 'sup-btn_add'");
    }
});

function add() {
    document.getElementById("addSupplierName").value = "";
    document.getElementById("addContactName").value = "";
    document.getElementById("addContactEmail").value = "";
    document.getElementById("addContactPhone").value = "";
    document.getElementById("addAddress").value = "";

    // Hiển thị modal
    let modal = new bootstrap.Modal(document.getElementById('addModal'));
    modal.show();
}

// Lưu chỉnh sửa
async function saveAdd() {
    const supplierName = document.getElementById("addSupplierName").value.trim();
    const contactName = document.getElementById("addContactName").value.trim();
    const contactEmail = document.getElementById("addContactEmail").value.trim();
    const contactPhone = document.getElementById("addContactPhone").value.trim();
    const address = document.getElementById("addAddress").value.trim();

    // Kiểm tra rỗng
    if (!supplierName || !contactName || !contactEmail || !contactPhone || !address) {
        alert("Vui lòng điền đầy đủ thông tin!");
        return;
    }

    // Kiểm tra định dạng email (phải là Gmail)
    const gmailRegex = /^[^\s@]+@gmail\.com$/;
    if (!gmailRegex.test(contactEmail)) {
        alert("Email không hợp lệ! Vui lòng nhập đúng định dạng email Gmail (ví dụ: tenban@gmail.com)");
        return;
    }
    const phoneRegex = /^(0\d{9})$/;
    if (!phoneRegex.test(contactPhone)) {
        alert("Số điện thoại không hợp lệ. Vui lòng nhập đúng định dạng (vd: 0337840995)");
        return;
    }

    const response = await fetch(`http://localhost:3000/api/suppliers`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            SupplierName: supplierName,
            ContactName: contactName,
            ContactEmail: contactEmail,
            ContactPhone: contactPhone,
            Address: address
        })
    });

    if (response.ok) {
        const data_response = await response.json();
        console.log(data_response);
        alert("Thêm nhà cung cấp thành công!");
        getData();

        // Đóng modal
        bootstrap.Modal.getInstance(document.getElementById('addModal')).hide();

    } else {
        alert("Đã xảy ra lỗi khi thêm nhà cung cấp.");
    }
}


//================================================
// chinh sua
function edit(supplierID) {
    let supplier = data.find(item => item.SupplierID === supplierID);
    if (!supplier) return alert("Không tìm thấy nhà cung cấp!");

    // Gán giá trị vào modal
    document.getElementById("editSupplierID").value = supplier.SupplierID;
    document.getElementById("editSupplierName").value = supplier.SupplierName;
    document.getElementById("editContactName").value = supplier.ContactName;
    document.getElementById("editContactEmail").value = supplier.ContactEmail;
    document.getElementById("editContactPhone").value = supplier.ContactPhone;
    document.getElementById("editAddress").value = supplier.Address;

    // Hiển thị modal
    let modal = new bootstrap.Modal(document.getElementById('editModal'));
    modal.show();
}

// Lưu chỉnh sửa
async function saveEdit() {
    let id = parseInt(document.getElementById("editSupplierID").value);
    const supplierName = document.getElementById("editSupplierName").value.trim();
    const contactName = document.getElementById("editContactName").value.trim();
    const contactEmail = document.getElementById("editContactEmail").value.trim();
    const contactPhone = document.getElementById("editContactPhone").value.trim();
    const address = document.getElementById("editAddress").value.trim();

    // Kiểm tra rỗng
    if (!supplierName || !contactName || !contactEmail || !contactPhone || !address) {
        alert("Vui lòng điền đầy đủ thông tin!");
        return;
    }

    // Kiểm tra định dạng Gmail
    const gmailRegex = /^[^\s@]+@gmail\.com$/;
    if (!gmailRegex.test(contactEmail)) {
        alert("Email không hợp lệ! Vui lòng nhập đúng định dạng Gmail (ví dụ: tenban@gmail.com)");
        return;
    }
    const phoneRegex = /^(0\d{9})$/;
    if (!phoneRegex.test(contactPhone)) {
        alert("Số điện thoại không hợp lệ. Vui lòng nhập đúng định dạng (vd: 0337840995)");
        return;
    }

    const response = await fetch(`http://localhost:3000/api/suppliers/${id}`, {
        method: 'PUT',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            SupplierName: supplierName,
            ContactName: contactName,
            ContactEmail: contactEmail,
            ContactPhone: contactPhone,
            Address: address
        })
    });

    if (response.ok) {
        const data_response = await response.json();
        console.log(data_response);
        alert("Cập nhật nhà cung cấp thành công!");
        getData();

        // Đóng modal
        bootstrap.Modal.getInstance(document.getElementById('editModal')).hide();
    } else {
        alert("Đã xảy ra lỗi khi cập nhật nhà cung cấp.");
    }
}

