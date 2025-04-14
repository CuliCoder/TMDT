// Khởi tạo DateRangePicker
$(document).ready(function () {
    initDateRangePicker();
    fetchStatistics();
    fetchTopProducts();
});

function initDateRangePicker() {
    const today = moment().format('YYYY-MM-DD'); // Lấy ngày hôm nay
    $('#revenue-date-range').daterangepicker({
        locale: {
            format: 'YYYY-MM-DD'
        },
        opens: 'center',
        startDate: today, // Chọn ngày hôm nay làm startDate
        endDate: today // Chọn ngày hôm nay làm endDate
    });

    // Khi người dùng chọn khoảng thời gian
    $('#revenue-date-range').on('apply.daterangepicker', function (ev, picker) {
        const startDate = picker.startDate.format('YYYY-MM-DD');
        const endDate = picker.endDate.format('YYYY-MM-DD');

        fetchStatistics(startDate, endDate); // Gọi hàm lấy thống kê theo khoảng thời gian mới
    });

    // Gọi thống kê cho ngày hôm nay ngay khi trang được tải
    fetchStatistics(today, today);
}


// Gọi toàn bộ thống kê
function fetchStatistics(startDate, endDate) {
    fetchTodayOrders(); // Lấy thông tin đơn hàng hôm nay
    fetchNewCustomers(); // Lấy số khách hàng mới
    fetchTotalRevenue(startDate, endDate);
}

function fetchTotalRevenue(startDate, endDate) {
    const url = (startDate === endDate) ? 
        'http://localhost:3000/api/statistics/total-revenue-today' : 
        'http://localhost:3000/api/statistics/total-revenue';

    const data = (startDate === endDate) ? {} : { startDate, endDate };

    $.ajax({
        url: url,
        method: 'POST',
        contentType: 'application/json',
        data: JSON.stringify(data),
        success: function (response) {
            console.log('Tổng doanh thu:', response); // Kiểm tra dữ liệu trả về
            if (response && response.totalRevenue !== undefined && !isNaN(response.totalRevenue)) {
                $('#totalRevenue').text('₫' + parseFloat(response.totalRevenue).toLocaleString()); // Hiển thị tổng doanh thu
            } else {
                $('#totalRevenue').text('₫0'); // Nếu không có dữ liệu hợp lệ, hiển thị 0
            }
        },
        error: function (error) {
            console.error('Có lỗi khi gọi API Total Revenue:', error);
            $('#totalRevenue').text('₫0'); // Hiển thị 0 nếu có lỗi khi gọi API
        }
    });
}


function fetchNewCustomers() {
    $.ajax({
        url: 'http://localhost:3000/api/statistics/new-users', // Đường dẫn API
        method: 'POST',
        contentType: 'application/json',
        success: function (response) {
            console.log('Dữ liệu khách hàng mới:', response); // Kiểm tra dữ liệu trả về
            if (response && response.newUsers !== undefined) {
                $('#newCustomers').text(response.newUsers); // Hiển thị số khách hàng mới
            } else {
                $('#newCustomers').text(0); // Nếu không có dữ liệu, hiển thị 0
            }
        },
        error: function (error) {
            console.error('Có lỗi khi gọi API New Users:', error);
        }
    });
}

// Gọi API đơn hàng hôm nay
function fetchTodayOrders() {
    $.ajax({
        url: 'http://localhost:3000/api/statistics/order-today',
        method: 'POST',
        contentType: 'application/json',
        success: function (response) {
            console.log('Dữ liệu đơn hàng hôm nay:', response); // Kiểm tra dữ liệu trả về
            if (response && response.orders) {
                renderTodayOrders(response.orders); // Nếu có đơn hàng, render
            } else {
                $('#todayOrdersTable').html('<tr><td colspan="7" class="text-center">Không có đơn hàng hôm nay</td></tr>'); // Nếu không có đơn hàng, hiển thị thông báo
            }
        },
        error: function (error) {
            console.error('Có lỗi khi gọi API Order Today:', error);
        }
    });
}

function renderTodayOrders(orders) {
    console.log("Render đơn hàng:", orders); // ✅ Thêm dòng này

    let html = '';
    orders.forEach((order, index) => {
        const orderDate = new Date(order.OrderDate);
        const formattedDate = orderDate.toLocaleDateString('vi-VN');

        html += `
            <tr>
                <td>${index + 1}</td>
                <td>${order.OrderID}</td>
                <td>${formattedDate}</td>
                <td>₫${parseFloat(order.TotalAmount).toLocaleString()}</td>
                <td>${order.name}</td>
                <td>${order.phonenumber}</td>
                <td>${order.payment_method || 'N/A'}</td>
            </tr>
        `;
    });
    $('#todayOrdersTable').html(html);
}

// Hàm gọi API lấy sản phẩm bán chạy nhất
function fetchTopProducts() {
    $.ajax({
        url: 'http://localhost:3000/api/statistics/top-products', // Đường dẫn API
        method: 'POST',
        contentType: 'application/json',
        success: function (response) {
            console.log('Top sản phẩm bán chạy:', response); // Kiểm tra dữ liệu trả về
            if (response && response.topProducts && response.topProducts.length > 0) {
                renderTopProduct(response.topProducts); // Render sản phẩm bán chạy nhất
            } else {
                $('#topProducts').html('<li class="text-white p-2 mb-1">Không có sản phẩm bán chạy</li>');
            }
        },
        error: function (error) {
            console.error('Có lỗi khi gọi API Top Products:', error);
        }
    });
}

function renderTopProduct(products) {
    let html = '';
    if (products.length > 0) {
        const product = products[0]; // Lấy sản phẩm đầu tiên (bán chạy nhất)
        html = `
            <li class="p-2 mb-1">
                <strong>${product.ProductName}</strong> : ${product.totalSold}
            </li>
        `;
    } else {
        html = '<li class="text-white p-2 mb-1">Không có sản phẩm bán chạy</li>';
    }
    $('#topProducts').html(html).hide().fadeIn(500); // Fade-in effect
}
