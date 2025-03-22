var data = []
var filterData = []
async function getData(){
    let response = await fetch('http://localhost:3000/api/customers')
    data = await response.json()
    filterData = [...data]
    renderDataPagination()
}
getData();
console.log(data[0])
// dinh dang ngay gio
function formatDateTime(data){
    return new Date(data).toLocaleString('sv-SE', { timeZone: 'UTC' }).replace('T', ' ');
}
function renderDataPagination(){
    $('#cus-pagination').pagination({
        dataSource: filterData,
        pageSize: 10,
        showGoInput: true,
        showGoButton: true,
        callback: function(data, pagination) {
            // template method of yourself
            var html = data.map(item => {
                let isLocked = item.status == 0; 
                return `
                    <div class="row border-bottom py-2">
                        <div class="col">${item.Username || 'trống'}</div>
                        <div class="col">${item.Email || 'trống'}</div>
                        <div class="col">${item.FullName || 'trống'}</div>
                        <div class="col">${item.PhoneNumber || 'trống'}</div>
                        <div class="col">${formatDateTime(item.CreatedAt) || 'trống'}</div>
                        <div class="col">
                            <div class="d-flex"> 
                                <div onclick="edit(${item.UserID})">
                                    <i class="fa-solid fa-pen-to-square"></i>
                                    <span>Sửa</span>
                                </div>
                                <div onclick="lock(${item.UserID})">
                                    <i class="fa-solid ${isLocked ? 'fa-lock' : 'fa-unlock'}"></i>
                                    <span>${isLocked ? 'Khóa' : 'Mở khóa'}</span>
                                </div>
                            </div>
                        </div>
                    </div>
                `;
            }).join("");
            
            $("#cus-data").html(html);
            
        }
    })
}
// tim kiem 
document.addEventListener('DOMContentLoaded', function() {
    document.getElementById('cus-text_search').addEventListener('keyup', search);
    document.getElementById('cus-btn_search').addEventListener('click', search);
});

function search(){
    var searchValue = document.getElementById('cus-text_search').value.toLowerCase().trim()
    var dateFromValue =  document.getElementById('cus-Date-From').value
    var dateToValue =document.getElementById('cus-Date-To').value
    var dateFrom = dateFromValue ? new Date(dateFromValue) : null;
    var dateTo = dateToValue ? new Date(dateToValue) : null;
    console.log(dateFrom," , ",dateTo)
    filterData = data.filter(item => {
        var dateItem = item.CreatedAt ? new Date(item.CreatedAt) : null;
        var matchText = !searchValue || item.Username.toLowerCase().includes(searchValue)
        || item.Email.toLowerCase().includes(searchValue)
        || item.FullName.toLowerCase().includes(searchValue)
        || item.PhoneNumber.toLowerCase().includes(searchValue)
        || item.CreatedAt.toLowerCase().includes(searchValue)
        
        var matchDate =(!dateFrom || dateItem >= dateFrom) && (!dateTo || dateItem <= dateTo)
        return matchText && matchDate
    })
    $('#cus-pagination').pagination('destroy');
    renderDataPagination()
}
//them 


//================================================
// chinh sua
function edit(UserID) {
    let customer = data.find(item => item.UserID === UserID);
    if (!customer) return alert("Không tìm thấy nhà cung cấp!");
    console.log(customer.PasswordHash)
    // Gán giá trị vào modal
    document.getElementById("editCusID").value = customer.UserID;
    document.getElementById("editCusUserName").value = customer.Username;

    document.getElementById("editCusEmail").value = customer.Email;
    document.getElementById("editCusFullName").value = customer.FullName;
    document.getElementById("editCusPhoneNumber").value = customer.PhoneNumber;

    // Hiển thị modal
    let modal = new bootstrap.Modal(document.getElementById('editCusModal'));
    modal.show();
}

// Lưu chỉnh sửa
async function saveEdit() {
    let id = parseInt(document.getElementById("editCusID").value);
    const response = await fetch(`http://localhost:3000/api/customers/${id}`,{
        method: 'PUT',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            Username: document.getElementById("editCusUserName").value.trim(),
            Email: document.getElementById("editCusEmail").value.trim(),
            FullName: document.getElementById("editCusFullName").value.trim(),
            PhoneNumber: document.getElementById("editCusPhoneNumber").value.trim(),
        })
    });
    console.log(document.getElementById("editCusUserName").value.trim())
    console.log(document.getElementById("editCusEmail").value.trim())
    console.log(document.getElementById("editCusFullName").value.trim())
    console.log(document.getElementById("editCusPhoneNumber").value.trim())
    const data_response = await response.json()
    console.log(data_response)
    getData()

    // Đóng modal
    bootstrap.Modal.getInstance(document.getElementById('editCusModal')).hide();
}

// khóa tài khoản
async function lock(UserID) {
    var st = 0;
    var customer = data.find(item => item.UserID === UserID);
    if (!customer) return alert("Không tìm thấy nhà cung cấp!");
    if (customer.status == 0){
        st = 1;
    }
    const response =await fetch(`http://localhost:3000/api/customers/status/${UserID}`, {
        method: 'PUT',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            status: st
        })
    })
    const data_response = await response.json()
    console.log(data_response)
    getData()
}
//search date
document.addEventListener()