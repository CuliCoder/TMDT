async function getData() {
    let response = await fetch('http://localhost:3000/brands');
    data = await response.json();
    console.log("Dữ liệu từ API:", data);
    filterData = [...data];
    console.log("Dữ liệu filterData:", filterData);
    renderDataPagination();
}
getData();

function renderDataPagination() {
    $('#brand-pagination').pagination({
        dataSource: filterData,
        pageSize: 10,
        showGoInput: true,
        showGoButton: true,
        callback: function (data, pagination) {
            var html = data.map(item => {
                return `
                    <div class="row border-bottom py-2">
                        <div class="col">${item.name}</div>
                        <div class="col">
                            <div class="brand-btn-container">
                                <button class="btn btn-warning btn-sm" onclick="editBrand(${item.idbrand})">Sửa</button>
                                <button class="btn btn-danger btn-sm" onclick="deleteBrand(${item.idbrand})">Xóa</button>
                            </div>
                        </div>
                    </div>
                `;
            }).join("");

            $("#brand-data").html(html);
        }
    });
}

async function submitBrand() {
    let brandName = document.getElementById("brandName").value.trim();

    if (!brandName) {
        alert("Vui lòng nhập tên hãng!");
        return;
    }

    let newBrand = { name: brandName };

    try {
        let response = await fetch('http://localhost:3000/brands', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(newBrand)
        });

        if (response.ok) {
            alert("Thêm hãng thành công!");
            await getData();
            bootstrap.Modal.getInstance(document.getElementById('addBrandModal')).hide();
            document.getElementById("brandName").value = "";
        } else {
            alert("Thêm hãng thất bại!");
        }
    } catch (error) {
        console.error("Lỗi khi gửi yêu cầu:", error);
        alert("Có lỗi xảy ra, vui lòng thử lại!");
    }
}

function editBrand(brandID) {
    let brand = data.find(item => item.idbrand === brandID);
    if (!brand) return alert("Không tìm thấy hãng!");

    document.getElementById("editBrandID").value = brand.idbrand;
    document.getElementById("editBrandName").value = brand.name;

    let modal = new bootstrap.Modal(document.getElementById('editBrandModal'));
    modal.show();
}

async function saveEdit() {
    let id = parseInt(document.getElementById("editBrandID").value);
    let brandName = document.getElementById("editBrandName").value.trim();

    if (!brandName) {
        alert("Vui lòng nhập tên hãng!");
        return;
    }

    const response = await fetch(`http://localhost:3000/brands/${id}`, {
        method: 'PUT',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({ name: brandName })
    });

    if (response.ok) {
        await getData();
        bootstrap.Modal.getInstance(document.getElementById('editBrandModal')).hide();
    } else {
        alert("Cập nhật thất bại!");
    }
}

async function deleteBrand(brandID) {
    if (confirm("Bạn có chắc chắn muốn xóa hãng này không?")) {
        try {
            const response = await fetch(`http://localhost:3000/brands/${brandID}`, {
                method: 'DELETE',
                headers: {
                    'Content-Type': 'application/json'
                }
            });

            if (response.ok) {
                alert("Xóa hãng thành công!");
                await getData();
            } else {
                const errorData = await response.json();
                alert(`Xóa hãng thất bại: ${errorData.message || 'Không rõ lỗi'}`);
            }
        } catch (error) {
            alert("Có lỗi xảy ra, vui lòng thử lại!");
        }
    }
}

function search() {
    var searchValue = document.getElementById('brand-search').value.toLowerCase().trim();

    filterData = data.filter(item => {
        return !searchValue || item.name.toLowerCase().includes(searchValue);
    });

    // Tắt phân trang cũ và tái tạo lại
    $('#brand-pagination').pagination('destroy');
    renderDataPagination();
}

document.addEventListener('DOMContentLoaded', function () {
    document.getElementById('brand-search').addEventListener('keyup', search);
    document.getElementById('brand-btn_search').addEventListener('click', search);
});



