document.addEventListener("DOMContentLoaded", function () {
    fetchUserAddresses();
});

function getUserId() {
    return sessionStorage.getItem("userId") || 0;
}

async function fetchUserAddresses() {
    try {
        const userId = getUserId();
        if (!userId || userId === "0") {
            console.error("Không tìm thấy userId. Người dùng chưa đăng nhập.");
            document.getElementById("address-list").innerHTML = "<p>Vui lòng đăng nhập để xem địa chỉ.</p>";
            return;
        }

        const response = await fetch(`http://localhost:3000/api/addressCustomer/${userId}`);

        if (!response.ok) {
            throw new Error("Lỗi khi lấy dữ liệu địa chỉ");
        }

        const addresses = await response.json();
        renderAddressList(addresses);
    } catch (error) {
        console.error("Lỗi:", error);
        document.getElementById("address-list").innerHTML = "<p>Không thể tải danh sách địa chỉ.</p>";
    }
}

function renderAddressList(addresses) {
    const addressListContainer = document.getElementById("address-list");
    addressListContainer.innerHTML = ""; // Xóa danh sách cũ trước khi render lại

    if (addresses.length === 0) {
        addressListContainer.innerHTML = "<p>Chưa có địa chỉ nào.</p>";
        return;
    }

    addresses.forEach(address => {
        const addressItem = document.createElement("div");
        addressItem.classList.add("address-item");
        addressItem.id = `address-${address.iduser_address}`;  // Gắn id cho mỗi item để dễ dàng xóa sau này

        addressItem.innerHTML = `
            <div class="address-info">
                <p><strong>${address.name}</strong></p>
                <p>Số điện thoại: ${address.phonenumber}</p>
                <p>Địa chỉ: ${address.address}</p>
            </div>
            <div class="address-actions">
                ${address.setDefault 
                    ? "<span class='default-label'>Mặc định</span>" 
                    : `<button class="set-default-btn" onclick="setDefaultAddress(${address.iduser_address})">Chọn mặc định</button>`
                }
                <button class="edit-btn" onclick="editAddress(${address.iduser_address})">Sửa</button>
                <button class="delete-btn" onclick="deleteAddress(${address.iduser_address})">Xóa</button>
            </div>
        `;

        addressListContainer.appendChild(addressItem);
    });
}


async function setDefaultAddress(addressId) {
    try {
        // Lấy iduser từ hàm getUserId()
        const userId = getUserId();  // Hàm getUserId() sẽ trả về id của người dùng hiện tại

        if (!userId) {
            alert("Không tìm thấy thông tin người dùng.");
            return;
        }

        const response = await fetch(`http://localhost:3000/api/addressCustomer/set_default/${addressId}`, {
            method: "PUT",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ iduser: userId }) // Gửi iduser trong body
        });

        // Kiểm tra xem server trả về gì trong trường hợp lỗi
        const result = await response.json();

        if (!response.ok) {
            console.error("Lỗi từ server:", result.message || "Không thể kết nối đến server.");
            alert(result.message || "Có lỗi xảy ra, vui lòng thử lại.");
            return;
        }

        // Kiểm tra kết quả từ server
        console.log("Kết quả từ server:", result);  // Debug kết quả trả về từ server
        if (result.success) {
            alert("Đã đặt địa chỉ này làm mặc định.");
            fetchUserAddresses(); // Load lại danh sách địa chỉ
        } else {
            alert(result.message || "Không thể đặt làm mặc định.");
        }
    } catch (error) {
        console.error("Lỗi khi đặt mặc định:", error);
        alert("Có lỗi xảy ra, vui lòng thử lại.");
    }
}

async function addAddress() {
    try {
        const userId = getUserId(); // Lấy ID người dùng
        if (!userId) {
            alert("Vui lòng đăng nhập trước khi thêm địa chỉ.");
            return;
        }

        // Lấy thông tin từ form nhập địa chỉ
        const name = document.getElementById("fullname").value.trim();
        const phonenumber = document.getElementById("phone").value.trim();
        const address = document.getElementById("address").value.trim();
        const setDefault = document.getElementById("set-default").checked ? 1 : 0;

        // Kiểm tra input có rỗng không
        if (!name || !phonenumber || !address) {
            alert("Vui lòng nhập đầy đủ thông tin.");
            return;
        }

        // Gửi request đến API
        const response = await fetch("http://localhost:3000/api/addressCustomer/", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ iduser: userId, name, phonenumber, address, setDefault })
        });

        const result = await response.json();

        if (response.ok && result.success) {
            alert("Thêm địa chỉ thành công!");
            fetchUserAddresses(); // Load lại danh sách địa chỉ
            resetAddressForm(); // Xóa dữ liệu trong form
            document.getElementById("address-form").style.display = "none";
        } else {
            alert(result.message || "Không thể thêm địa chỉ.");
        }
    } catch (error) {
        console.error("Lỗi khi thêm địa chỉ:", error);
        alert("Có lỗi xảy ra, vui lòng thử lại.");
    }
}

// Reset form
function resetAddressForm() {
    document.getElementById("fullname").value = "";
    document.getElementById("phone").value = "";
    document.getElementById("address").value = "";
    document.getElementById("set-default").checked = false;
}

// Hàm xóa địa chỉ từ frontend
async function deleteAddress(id) {
    try {
        const response = await fetch(`http://localhost:3000/api/addressCustomer/${id}`, {
            method: 'DELETE',  // Sử dụng phương thức DELETE
            headers: {
                'Content-Type': 'application/json',  // Đảm bảo gửi dữ liệu với định dạng JSON
            },
        });

        const data = await response.json();  // Chuyển dữ liệu phản hồi thành JSON

        if (data.success) {
            alert('Xóa địa chỉ thành công!');
            // Cập nhật lại UI hoặc làm mới danh sách địa chỉ
            // Xóa địa chỉ khỏi danh sách hiển thị
            const addressElement = document.getElementById(`address-${id}`);
            if (addressElement) {
                addressElement.remove();
            }
        } else {
            alert('Lỗi khi xóa địa chỉ!');
        }
    } catch (error) {
        console.error('Có lỗi xảy ra:', error);
        alert('Lỗi server!');
    }
}

// Hàm để mở form chỉnh sửa và điền thông tin vào form
function editAddress(addressId) {
    // Lấy thông tin địa chỉ từ DOM
    const addressItem = document.querySelector(`#address-${addressId}`);
    if (!addressItem) {
        alert("Không tìm thấy địa chỉ.");
        return;
    }

    const name = addressItem.querySelector(".address-info strong").innerText;
    const phone = addressItem.querySelector(".address-info p:nth-child(2)").innerText.split(": ")[1];
    const address = addressItem.querySelector(".address-info p:nth-child(3)").innerText.split(": ")[1];

    // Điền thông tin vào form
    document.getElementById("edit-fullname").value = name;
    document.getElementById("edit-phone").value = phone;
    document.getElementById("edit-address").value = address;

    // Lưu ID địa chỉ vào form để sau này gửi khi lưu
    document.getElementById("edit-address-form").dataset.addressId = addressId;

    // Hiển thị form chỉnh sửa
    document.getElementById("edit-address-form").style.display = "block";
}

// Hàm để lưu thông tin chỉnh sửa địa chỉ
async function saveEditAddress() {
    try {
        const addressId = document.getElementById("edit-address-form").dataset.addressId;
        const name = document.getElementById("edit-fullname").value.trim();
        const phonenumber = document.getElementById("edit-phone").value.trim();
        const address = document.getElementById("edit-address").value.trim();

        // Kiểm tra dữ liệu nhập vào
        if (!name || !phonenumber || !address) {
            alert("Vui lòng nhập đầy đủ thông tin.");
            return;
        }

        // Gửi dữ liệu chỉnh sửa đến API
        const response = await fetch(`http://localhost:3000/api/addressCustomer/${addressId}`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ name, phonenumber, address })  // Gửi thông tin chỉnh sửa
        });

        const data = await response.json();

        if (response.ok && data.success) {
            alert('Cập nhật địa chỉ thành công!');
            fetchUserAddresses();  // Cập nhật lại danh sách địa chỉ
            cancelEditAddress();  // Đóng form chỉnh sửa
        } else {
            alert(data.message || 'Không thể cập nhật địa chỉ.');
        }
    } catch (error) {
        console.error('Có lỗi xảy ra:', error);
        alert('Lỗi server! Vui lòng thử lại sau.');
    }
}

// Hàm để hủy chỉnh sửa và đóng form
function cancelEditAddress() {
    // Đóng form chỉnh sửa
    document.getElementById("edit-address-form").style.display = "none";

    // Reset form
    document.getElementById("edit-fullname").value = "";
    document.getElementById("edit-phone").value = "";
    document.getElementById("edit-address").value = "";
}

















