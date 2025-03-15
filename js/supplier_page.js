var data = []
var filterData = []
async function getData(){
    let response = await fetch('http://localhost:3000/api/suppliers')
    data = await response.json()
    filterData = [...data]
    renderDataPagination()
}
getData();
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
document.addEventListener('DOMContentLoaded', function() {
    document.getElementById('sup-text_search').addEventListener('keyup', search);
});

function search(){
    var searchValue = document.getElementById('sup-text_search').value.toLowerCase().trim()
    filterData = data.filter(item => 
        item.SupplierName.toLowerCase().includes(searchValue)
        || item.ContactName.toLowerCase().includes(searchValue)
        || item.ContactEmail.toLowerCase().includes(searchValue)
        || item.ContactPhone.toLowerCase().includes(searchValue)
        || item.Address.toLowerCase().includes(searchValue)
    )
    $('#sup-pagination').pagination('destroy');
    renderDataPagination()
}

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
    const response = await fetch(`http://localhost:3000/api/suppliers/${id}`,{
        method: 'PUT',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            SupplierName: document.getElementById("editSupplierName").value.trim(),
            ContactName: document.getElementById("editContactName").value.trim(),
            ContactEmail: document.getElementById("editContactEmail").value.trim(),
            ContactPhone: document.getElementById("editContactPhone").value.trim(),
            Address: document.getElementById("editAddress").value.trim()
        })
    });
    const data_response = await response.json()
    console.log(data_response)
    getData()

    // fetch(`http://localhost:3000/api/suppliers/${id}`, {
    //     method: 'PUT',
    //     headers: {
    //         'Content-Type': 'application/json'
    //     },
    //     body: JSON.stringify({
    //         SupplierName: document.getElementById("editSupplierName").value.trim(),
    //         ContactName: document.getElementById("editContactName").value.trim(),
    //         ContactEmail: document.getElementById("editContactEmail").value.trim(),
    //         ContactPhone: document.getElementById("editContactPhone").value.trim(),
    //         Address: document.getElementById("editAddress").value.trim()
    //     })
    // })
    // .then(response => response.json())
    // .then(data => {
    //     console.log('Success:', data);
    //     getData()
    // })
    // .catch(error => console.error('Error:', error));

    // Đóng modal
    bootstrap.Modal.getInstance(document.getElementById('editModal')).hide();
}

