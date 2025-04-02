import axiosInstance from "./configAxios.js";
let itemsPerPage = 5;
let currentPage = 1;
let totalPages = 1;

var data = [];
var filterData = [];

async function getData() {
  let response = await fetch("http://localhost:3000/api/promotions");
  data = await response.json();
  filterData = [...data];
  renderDataPagination();
}
getData();

function formatDateTime(date) {
  return new Date(date)
    .toLocaleString("sv-SE", { timeZone: "UTC" })
    .replace("T", " ");
}

function renderDataPagination() {
  $("#promo-pagination").pagination({
    dataSource: filterData,
    pageSize: 10,
    showGoInput: true,
    showGoButton: true,
    callback: function (data, pagination) {
      var html = data
        .map((item) => {
          return `
                    <div class="row border-bottom py-2">
                        <div class="col">${item.PromotionName || "trống"}</div>
                        <div class="col">${item.Description || "trống"}</div>
                        <div class="col">${item.DiscountRate || "trống"}%</div>
                        <div class="col">${
                          formatDateTime(item.StartDate) || "trống"
                        }</div>
                        <div class="col">${
                          formatDateTime(item.EndDate) || "trống"
                        }</div>
                        <div class="col">${
                          formatDateTime(item.CreatedAt) || "trống"
                        }</div> <!-- Thêm Ngày tạo -->
                        <div class="col">
                            <div class="prom-btn-container"> <!-- Thêm container để chứa các nút -->
                                
                                <button class="btn btn-warning btn-sm" onclick="editPromotion(${item.PromotionID})">Sửa</button>
                                <button class="btn btn-info btn-sm" data-bs-toggle="modal" data-bs-target="#chooseProductsModal" onclick="checkProduct(${item.PromotionID})">Chọn sản phẩm</button>
                            </div>
                        </div>
                    </div>
                `;
        })
        .join("");

      $("#promo-data").html(html);
    },
  });
}
// <button class="btn btn-danger btn-sm" onclick="deletePromotion(${item.PromotionID})">Xóa</button>

document.addEventListener("DOMContentLoaded", function () {
  document
    .getElementById("promo-text_search")
    .addEventListener("keyup", search);
  document.getElementById("promo-btn_search").addEventListener("click", search);
});

async function submitPromotion() {
  let promotionName = document.getElementById("promotionName").value.trim();
  let description = document.getElementById("description").value.trim();
  let discountRate = parseFloat(
    document.getElementById("discountRate").value.trim()
  );
  let startDate = document.getElementById("startDate").value.trim();
  let endDate = document.getElementById("endDate").value.trim();

  if (!promotionName || !discountRate || !startDate || !endDate) {
    alert("Vui lòng nhập đầy đủ thông tin!");
    return;
  }

  let newPromotion = {
    PromotionName: promotionName,
    Description: description,
    DiscountRate: discountRate,
    StartDate: startDate,
    EndDate: endDate,
  };

  try {
    let response = await fetch("http://localhost:3000/api/promotions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(newPromotion),
    });

    if (response.ok) {
      alert("Thêm khuyến mãi thành công!");
      await getData();
      bootstrap.Modal.getInstance(
        document.getElementById("addPromoModal")
      ).hide();
      // Reset form
      document.getElementById("promotionName").value = "";
      document.getElementById("description").value = "";
      document.getElementById("discountRate").value = "";
      document.getElementById("startDate").value = "";
      document.getElementById("endDate").value = "";
    } else {
      alert("Thêm khuyến mãi thất bại!");
    }
  } catch (error) {
    console.error("Lỗi khi gửi yêu cầu:", error);
    alert("Có lỗi xảy ra, vui lòng thử lại!");
  }
}

function search() {
  var searchValue = document
    .getElementById("promo-text_search")
    .value.toLowerCase()
    .trim();

  // Lọc dữ liệu theo tên hoặc mô tả khuyến mãi
  filterData = data.filter((item) => {
    var matchText =
      !searchValue ||
      item.PromotionName.toLowerCase().includes(searchValue) ||
      item.Description.toLowerCase().includes(searchValue);

    return matchText;
  });

  // Tắt phân trang cũ và tái tạo lại
  $("#promo-pagination").pagination("destroy");
  renderDataPagination();
}

window.editPromotion = function (PromotionID) {
  let promo = data.find((item) => item.PromotionID === PromotionID);
  if (!promo) return alert("Không tìm thấy khuyến mãi!");

  let startDateFormatted = new Date(promo.StartDate)
    .toISOString()
    .split("T")[0];
  let endDateFormatted = new Date(promo.EndDate).toISOString().split("T")[0];

  document.getElementById("editPromoID").value = promo.PromotionID;
  document.getElementById("editPromotionName").value = promo.PromotionName;
  document.getElementById("editDescription").value = promo.Description;
  document.getElementById("editDiscountRate").value = promo.DiscountRate;
  document.getElementById("editStartDate").value = startDateFormatted;
  document.getElementById("editEndDate").value = endDateFormatted;

  // Hiển thị modal
  let modal = new bootstrap.Modal(document.getElementById("editPromoModal"));
  modal.show();
};

window.saveEdit = async function () {
  let id = parseInt(document.getElementById("editPromoID").value);

  // Lấy giá trị ngày và đảm bảo định dạng là "yyyy-MM-dd"
  let startDate = document.getElementById("editStartDate").value.trim();
  let endDate = document.getElementById("editEndDate").value.trim();

  // Kiểm tra ngày tháng có hợp lệ không
  if (!startDate || !endDate) {
    alert("Vui lòng nhập đầy đủ ngày bắt đầu và ngày kết thúc!");
    return;
  }

  // Chuyển ngày sang định dạng yyyy-MM-dd (loại bỏ phần giờ phút giây)
  const formatDate = (dateStr) => {
    let date = new Date(dateStr);
    return date.toISOString().split("T")[0]; // Chỉ lấy phần yyyy-MM-dd
  };

  // Đảm bảo rằng ngày được gửi chính xác, không bị lệch múi giờ
  startDate = formatDate(startDate);
  endDate = formatDate(endDate);

  // Gửi PUT request để cập nhật thông tin
  const response = await fetch(`http://localhost:3000/api/promotions/${id}`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      PromotionName: document.getElementById("editPromotionName").value.trim(),
      Description: document.getElementById("editDescription").value.trim(),
      DiscountRate: parseFloat(
        document.getElementById("editDiscountRate").value.trim()
      ),
      StartDate: startDate, // Đảm bảo rằng ngày được gửi chính xác
      EndDate: endDate, // Đảm bảo rằng ngày được gửi chính xác
    }),
  });

  if (response.ok) {
    // Tải lại dữ liệu sau khi cập nhật
    await getData();
    bootstrap.Modal.getInstance(
      document.getElementById("editPromoModal")
    ).hide();
  } else {
    alert("Cập nhật thất bại!");
  }
};

window.deletePromotion = async function (PromotionID) {
  if (confirm("Bạn có chắc chắn muốn xóa khuyến mãi này không?")) {
    try {
      const response = await fetch(
        `http://localhost:3000/api/promotions/${PromotionID}`,
        {
          method: "DELETE",
          headers: {
            "Content-Type": "application/json",
          },
        }
      );

      if (response.ok) {
        alert("Xóa khuyến mãi thành công!");
        await getData(); // Tải lại dữ liệu sau khi xóa
      } else {
        const errorData = await response.json();
        alert(
          `Xóa khuyến mãi thất bại: ${errorData.message || "Không rõ lỗi"}`
        );
      }
    } catch (error) {
      alert("Có lỗi xảy ra, vui lòng thử lại!");
    }
  }
};

let selectedProducts = []; // Danh sách sản phẩm đã chọn

// Hàm để lấy sản phẩm từ API
const getProducts = async () => {
  try {
    const response = await axiosInstance.get("/product/products");
    if (response.data && Array.isArray(response.data)) {
      return response.data;
    }
    throw new Error("Dữ liệu không hợp lệ");
  } catch (error) {
    console.error(error);
    alert("Lỗi khi lấy sản phẩm!");
    return [];
  }
};

// Hàm để hiển thị danh sách sản phẩm vào modal
async function displayProductList() {
  const products = await getProducts(); // Lấy sản phẩm từ API

  const productListDiv = document.getElementById("product-list");
  productListDiv.innerHTML = ""; // Xóa dữ liệu cũ trong modal trước khi thêm mới

  if (products.length === 0) {
    productListDiv.innerHTML = "<p>Không có sản phẩm để hiển thị.</p>";
    return;
  }

  products.forEach((product) => {
    const productItem = document.createElement("div");
    productItem.classList.add("form-check");
    productItem.innerHTML = `
            <input class="form-check-input" type="checkbox" value="${product.ProductID}" id="product-${product.ProductID}">
            <label class="form-check-label" for="product-${product.ProductID}">
                ${product.ProductName}
            </label>
        `;
    productListDiv.appendChild(productItem);
  });

  // Lắng nghe sự kiện thay đổi trạng thái checkbox để cập nhật selectedProducts
  productListDiv
    .querySelectorAll('input[type="checkbox"]')
    .forEach((checkbox) => {
      checkbox.addEventListener("change", () => {
        if (checkbox.checked) {
          selectedProducts.push(checkbox.value);
        } else {
          selectedProducts = selectedProducts.filter(
            (productId) => productId !== checkbox.value
          );
        }
      });
    });
}

// Lấy dữ liệu sản phẩm khi modal được mở
window.setPromotionID = function (promotionID) {
  selectedProducts = []; // Reset lại danh sách sản phẩm đã chọn
  displayProductList(); // Gọi hàm để hiển thị sản phẩm trong modal
  document.getElementById("apply-products-btn").onclick = () =>
    applySelectedProducts(promotionID); // Gán sự kiện áp dụng
};

// Lấy danh sách sản phẩm đã chọn và gửi yêu cầu
async function applySelectedProducts(promotionID) {
  if (selectedProducts.length === 0) {
    alert("Vui lòng chọn ít nhất một sản phẩm!");
    return;
  }

  try {
    const response = await fetch(
      `http://localhost:3000/api/promotions/${promotionID}/apply`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ products: selectedProducts }),
      }
    );

    if (response.ok) {
      alert("Áp dụng sản phẩm cho khuyến mãi thành công!");
      $("#chooseProductsModal").modal("hide"); // Đóng modal
    } else {
      const errorData = await response.json();
      alert(
        `Áp dụng sản phẩm thất bại: ${errorData.message || "Không rõ lỗi"}`
      );
    }
  } catch (error) {
    alert("Có lỗi xảy ra, vui lòng thử lại!");
    console.error("Lỗi khi áp dụng sản phẩm:", error);
  }
}

window.checkProduct = async function (promotionId){
    selectedProducts = []
    const response = await fetch(`http://localhost:3000/api/promotions/${promotionId}/products`)
    const data = await response.json();
    console.log(data)
    openCheckboxProduct(data, promotionId)
}
var table;
function openCheckboxProduct(data,promotionId){
    if ($.fn.DataTable.isDataTable("#product-list")) {
        table.destroy();
    }
    document.getElementById("promotion-id").value = promotionId;
    var tableBody = document.querySelector("#product-list tbody")
    tableBody.innerHTML = "";
    data.forEach(products => {
        var tableRow = document.createElement("tr");
        tableRow.innerHTML = `
            <td>${products.ProductID}</td>
            <td>${products.ProductName}</td>
            <td><input type="checkbox" ${products.IsPromotion ? 'checked' : ''}></td>
        `;
        tableBody.appendChild(tableRow);
    })
    table = $('#product-list').DataTable({
        paging: true,
        searching: true,
        ordering: true,
        lengthChange: false,
        info: false,
        pageLength: 5
    });
}
document.addEventListener("DOMContentLoaded", function () {
    document.getElementById("apply-products-btn").addEventListener("click", saveEdit);
});
async function saveEdit(){
    var promotionId = document.getElementById("promotion-id").value;
    var productList = []    
    document.querySelectorAll("#product-list tbody tr").forEach(row => {
        var checkProduct = row.querySelector("input[type=checkbox]")
        if (checkProduct.checked){
            var id = row.cells[0].textContent
            productList.push(id)
        }
    })
    try {
        const response = await fetch(`http://localhost:3000/api/promotions/${promotionId}/apply`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                products: productList
            })
        });

        const result = await response.json();
        console.log("Server response:", result);
    } catch (error) {
        console.error("Lỗi khi gửi dữ liệu:", error);
    }
    $("#chooseProductsModal").modal("hide");
} 