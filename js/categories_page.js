async function getCategoryData() {
    let response = await fetch('http://localhost:3000/categories');
    categoryData = await response.json();
    console.log("Dữ liệu từ API:", categoryData);
    filterCategoryData = [...categoryData];
    console.log("Dữ liệu filterCategoryData:", filterCategoryData);
    renderCategoryPagination();
}
getCategoryData();

function renderCategoryPagination() {
    $('#category-pagination').pagination({
        dataSource: filterCategoryData,
        pageSize: 10,
        showGoInput: true,
        showGoButton: true,
        callback: function (data, pagination) {
            var html = data.map(item => {
                return `
                    <div class="row border-bottom py-2">
                        <div class="col">${item.CategoryName }</div>
                        <div class="col">${item.CreatedAt}</div>
                        <div class="col">
                            <div class="brand-btn-container">
                                <button class="btn btn-warning btn-sm" onclick="editCategory(${item.CategoryID })">Sửa</button>
                                <button class="btn btn-danger btn-sm" onclick="deleteCategory(${item.CategoryID })">Xóa</button>
                            </div>
                        </div>
                    </div>
                `;
            }).join("");

            $("#category-data").html(html);
        }
    });
}

async function submitCategory() {
    let categoryName = document.getElementById("categoryName").value.trim();

    if (!categoryName) {
        alert("Vui lòng nhập tên loại!");
        return;
    }

    let newCategory = { CategoryName: categoryName };

    try {
        let response = await fetch('http://localhost:3000/categories', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(newCategory)
        });

        if (response.ok) {
            alert("Thêm loại thành công!");
            await getCategoryData();
            bootstrap.Modal.getInstance(document.getElementById('addCategoryModal')).hide();
            document.getElementById("categoryName").value = "";
        } else {
            alert("Thêm loại thất bại!");
        }
    } catch (error) {
        console.error("Lỗi khi gửi yêu cầu:", error);
        alert("Có lỗi xảy ra, vui lòng thử lại!");
    }
}

function editCategory(categoryID) {
    let category = categoryData.find(item => item.CategoryID === categoryID);
    if (!category) return alert("Không tìm thấy loại!");

    document.getElementById("editCategoryID").value = category.CategoryID;
    document.getElementById("editCategoryName").value = category.CategoryName;

    let modal = new bootstrap.Modal(document.getElementById('editCategoryModal'));
    modal.show();
}

async function saveCategoryEdit() {
    let categoryID = parseInt(document.getElementById("editCategoryID").value);
    let categoryName = document.getElementById("editCategoryName").value.trim();

    if (!categoryName) {
        alert("Vui lòng nhập tên loại!");
        return;
    }

    const response = await fetch(`http://localhost:3000/categories/${categoryID}`, {
        method: 'PUT',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({ CategoryName: categoryName })
    });

    if (response.ok) {
        await getCategoryData();
        bootstrap.Modal.getInstance(document.getElementById('editCategoryModal')).hide();
    } else {
        alert("Cập nhật thất bại!");
    }
}

async function deleteCategory(categoryID) {
    if (confirm("Bạn có chắc chắn muốn xóa loại này không?")) {
        try {
            const response = await fetch(`http://localhost:3000/categories/${categoryID}`, {
                method: 'DELETE',
                headers: {
                    'Content-Type': 'application/json'
                }
            });

            if (response.ok) {
                alert("Xóa loại thành công!");
                await getCategoryData();
            } else {
                const errorData = await response.json();
                alert(`Xóa loại thất bại: ${errorData.message || 'Không rõ lỗi'}`);
            }
        } catch (error) {
            alert("Có lỗi xảy ra, vui lòng thử lại!");
        }
    }
}

function searchCategory() {
    var searchValue = document.getElementById('category-search').value.toLowerCase().trim();

    filterCategoryData = categoryData.filter(item => {
        return !searchValue || item.CategoryName.toLowerCase().includes(searchValue);
    });

    // Tắt phân trang cũ và tái tạo lại
    $('#category-pagination').pagination('destroy');
    renderCategoryPagination();
}

document.addEventListener('DOMContentLoaded', function () {
    document.getElementById('category-search').addEventListener('keyup', searchCategory);
    document.getElementById('category-btn_search').addEventListener('click', searchCategory);
});
