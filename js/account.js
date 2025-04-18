document.addEventListener("DOMContentLoaded", function () {
  // Toggle password visibility
  const togglePasswordButtons = document.querySelectorAll(".toggle-password");

  togglePasswordButtons.forEach((button) => {
    button.addEventListener("click", function () {
      const input = this.previousElementSibling;

      // Toggle input type
      if (input.type === "password") {
        input.type = "text";
        this.classList.remove("fa-eye");
        this.classList.add("fa-eye-slash");
      } else {
        input.type = "password";
        this.classList.remove("fa-eye-slash");
        this.classList.add("fa-eye");
      }
    });
  });

  const loginForm = document.getElementById("login-form");
  if (loginForm) {
    loginForm.addEventListener("submit", async function (e) {
      e.preventDefault();

      const identifier = document.getElementById("email").value;
      const password = document.getElementById("password").value;

      console.log("Đăng nhập với:", identifier);
      console.log("Password:", password);

      if (!identifier || !password) {
        alert("Vui lòng nhập đầy đủ thông tin");
        return;
      }

      // Kiểm tra identifier là Email hay PhoneNumber
      const requestBody = identifier.includes("@")
        ? { Email: identifier, Password: password } // Nếu có '@' => Email
        : { PhoneNumber: identifier, Password: password }; // Không có '@' => PhoneNumber

      console.log("Request body gửi lên server:", JSON.stringify(requestBody));

      try {
        const response = await fetch("http://localhost:3000/auth/login", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(requestBody), // Sửa lại body đúng format
        });

        const data = await response.json();

        if (data.error === 0) {
          alert("Đăng nhập thành công! Chào mừng bạn quay trở lại.");
          window.userId = data.data.id;
          localStorage.setItem("Myid", JSON.stringify(data.data.id)); // Lưu thông tin người dùng vào localStorage
          sessionStorage.setItem("userId", data.data.id);
          window.location.href =
            data.data.role == "admin"
              ? "./manager/products_page.html"
              : "profile.html";
        } else {
          alert(data.message || "Đăng nhập thất bại");
        }
      } catch (error) {
        alert("Lỗi kết nối đến server. Vui lòng thử lại!");
        console.error("Lỗi đăng nhập:", error);
      }
    });
  }

  // Register form submission
  const registerForm = document.getElementById("register-form");

  if (registerForm) {
    registerForm.addEventListener("submit", async function (e) {
      e.preventDefault();

      // Lấy dữ liệu từ form
      const fullname = document.getElementById("fullname").value.trim();
      const phone = document.getElementById("phone").value.trim();
      const email = document.getElementById("email").value.trim();
      const password = document.getElementById("new-password").value;
      const confirmPassword = document.getElementById("confirm-password").value;
      const agreeTerms = document.getElementById("agree-terms").checked;

      // Kiểm tra dữ liệu nhập
      if (!fullname || !phone || !email || !password || !confirmPassword) {
        alert("Vui lòng nhập đầy đủ thông tin");
        return;
      }

      // Kiểm tra email hợp lệ
      const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
      if (!emailRegex.test(email)) {
        alert("Email không hợp lệ. Vui lòng nhập đúng định dạng.");
        return;
      }

      // Kiểm tra số điện thoại hợp lệ (Bắt đầu bằng 0, 10-11 số)
      const phoneRegex = /^0\d{9,10}$/;
      if (!phoneRegex.test(phone)) {
        alert("Số điện thoại không hợp lệ. Vui lòng nhập đúng định dạng.");
        return;
      }

      if (password !== confirmPassword) {
        alert("Mật khẩu xác nhận không khớp với mật khẩu mới");
        return;
      }

      // Tạo object gửi lên server
      const requestBody = {
        FullName: fullname,
        PhoneNumber: phone,
        Email: email,
        Password: password,
        ConfirmPassword: confirmPassword,
      };

      console.log("Request body gửi lên server:", JSON.stringify(requestBody));

      try {
        // Gửi request đến API backend
        const response = await fetch("http://localhost:3000/auth/register", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(requestBody),
        });

        if (!response.ok) {
          // Nếu server trả về lỗi, kiểm tra mã lỗi
          const errorData = await response.json();
          alert(`Lỗi: ${errorData.message || "Đăng ký thất bại"}`);
          return;
        }

        const data = await response.json();
        console.log("Phản hồi từ server:", data);

        if (data.error === 0) {
          alert("Đăng ký thành công! Chào mừng bạn đến với hệ thống.");
          window.location.href = "login.html";
        } else {
          alert(data.message || "Đăng ký thất bại");
        }
      } catch (error) {
        alert("Lỗi kết nối đến server. Vui lòng thử lại!");
        console.error("Lỗi đăng ký:", error);
      }
    });
  }

  // Password strength checker
  const newPasswordInput = document.getElementById("new-password");
  const strengthBar = document.querySelector(".strength-bar");
  const strengthText = document.querySelector(".strength-text");

  if (newPasswordInput && strengthBar && strengthText) {
    newPasswordInput.addEventListener("input", function () {
      const password = this.value;
      let strength = 0;

      // Check password length
      if (password.length >= 8) {
        strength += 1;
      }

      // Check for numbers
      if (/\d/.test(password)) {
        strength += 1;
      }

      // Check for lowercase letters
      if (/[a-z]/.test(password)) {
        strength += 1;
      }

      // Check for uppercase letters
      if (/[A-Z]/.test(password)) {
        strength += 1;
      }

      // Check for special characters
      if (/[^A-Za-z0-9]/.test(password)) {
        strength += 1;
      }

      // Update strength indicator
      switch (strength) {
        case 0:
        case 1:
          strengthBar.style.width = "20%";
          strengthBar.style.backgroundColor = "#f44336"; // Red
          strengthText.innerText = "Rất yếu";
          strengthText.style.color = "#f44336";
          break;
        case 2:
          strengthBar.style.width = "40%";
          strengthBar.style.backgroundColor = "#ff9800"; // Orange
          strengthText.innerText = "Yếu";
          strengthText.style.color = "#ff9800";
          break;
        case 3:
          strengthBar.style.width = "60%";
          strengthBar.style.backgroundColor = "#ffc107"; // Amber
          strengthText.innerText = "Trung bình";
          strengthText.style.color = "#ffc107";
          break;
        case 4:
          strengthBar.style.width = "80%";
          strengthBar.style.backgroundColor = "#8bc34a"; // Light green
          strengthText.innerText = "Mạnh";
          strengthText.style.color = "#8bc34a";
          break;
        case 5:
          strengthBar.style.width = "100%";
          strengthBar.style.backgroundColor = "#4caf50"; // Green
          strengthText.innerText = "Rất mạnh";
          strengthText.style.color = "#4caf50";
          break;
      }
    });
  }

  // Profile edit functionality
  const toggleEditBtn = document.getElementById("toggle-edit");
  const cancelEditBtn = document.getElementById("cancel-edit");
  const profileForm = document.getElementById("profile-form");

  if (toggleEditBtn && profileForm) {
    toggleEditBtn.addEventListener("click", function () {
      // Enable inputs
      const inputs = profileForm.querySelectorAll("input:not(#createdate)");
      inputs.forEach((input) => {
        input.disabled = false;
      });

      // Show form actions
      const formActions = profileForm.querySelector(".form-actions");
      if (formActions) {
        formActions.style.display = "block";
      }

      // Hide edit button
      this.style.display = "none";
    });
  }

  if (cancelEditBtn && profileForm) {
    cancelEditBtn.addEventListener("click", function () {
      // Disable inputs
      const inputs = profileForm.querySelectorAll("input");
      inputs.forEach((input) => {
        input.disabled = true;
      });

      // Hide form actions
      const formActions = profileForm.querySelector(".form-actions");
      if (formActions) {
        formActions.style.display = "none";
      }

      // Show edit button
      if (toggleEditBtn) {
        toggleEditBtn.style.display = "flex";
      }
    });
  }
  async function getData() {
    let Myid = localStorage.getItem("Myid");
    if (!Myid) {
      console.error("Myid chưa được khởi tạo!");
      return;
    }

    try {
      const response = await fetch(
        `http://localhost:3000/api/customers/${Myid}`
      );
      const data = await response.json();

      if (data) {
        console.log("Dữ liệu đăng nhập:", data);

        // Gán dữ liệu vào form
        document.getElementById("fullname").value = data.FullName || "";
        document.getElementById("createdate").value =
          new Date(data.CreatedAt).toLocaleDateString("vi-VN") || "";
        document.getElementById("phone").value = data.PhoneNumber || "";
        document.getElementById("email").value = data.Email || "";
      } else {
        console.error("Không tìm thấy người dùng.");
      }
    } catch (error) {
      console.error("Lỗi kết nối đến server:", error);
      // alert("Lỗi kết nối đến server. Vui lòng thử lại!");
    }
  }
  getData();
  if (profileForm) {
    profileForm.addEventListener("submit", async function (e) {
      let Myid = localStorage.getItem("Myid");
      e.preventDefault();
  
      const fullName = document.getElementById("fullname").value.trim();
      const email = document.getElementById("email").value.trim();
      const phone = document.getElementById("phone").value.trim();
  
      // Kiểm tra dữ liệu trống
      if (!fullName || !email || !phone) {
        alert("Vui lòng điền đầy đủ thông tin.");
        return;
      }
  
      // Kiểm tra cấu trúc email
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(email)) {
        alert("Email không hợp lệ. Vui lòng nhập đúng định dạng (vd: example@mail.com)");
        return;
      }
      const phoneRegex = /^(0\d{9})$/;
      if (!phoneRegex.test(phone)) {
        alert("Số điện thoại không hợp lệ. Vui lòng nhập đúng định dạng (vd: 0337840995)");
        return;
      }
      
      const updatedData = {
        FullName: fullName,
        Email: email,
        PhoneNumber: phone,
      };
  
      try {
        const response = await fetch(
          `http://localhost:3000/api/customers/${Myid}`,
          {
            method: "PUT",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(updatedData),
          }
        );
  
        const result = await response.json();
      } catch (error) {
        console.error("Lỗi cập nhật:", error);
        alert("Lỗi server!");
        return;
      }
  
      alert("Cập nhật thông tin thành công!");
  
      // Disable inputs
      const inputs = profileForm.querySelectorAll("input");
      inputs.forEach((input) => {
        input.disabled = true;
      });
  
      // Hide form actions
      const formActions = profileForm.querySelector(".form-actions");
      if (formActions) {
        formActions.style.display = "none";
      }
  
      // Show edit button
      if (toggleEditBtn) {
        toggleEditBtn.style.display = "flex";
      }
    });
  }
  

  // Change password form submission
  const passwordForm = document.getElementById("password-form");
  if (passwordForm) {
    passwordForm.addEventListener("submit", async function (e) {
      e.preventDefault();

      // Get form values
      const currentPassword = document.getElementById("current-password").value;
      const newPassword = document.getElementById("new-password").value;
      const confirmNewPassword = document.getElementById(
        "confirm-new-password"
      ).value;

      // Validate form
      if (!currentPassword || !newPassword || !confirmNewPassword) {
        alert("Vui lòng nhập đầy đủ thông tin");
        return;
      }

      if (newPassword !== confirmNewPassword) {
        alert("Mật khẩu xác nhận không khớp với mật khẩu mới");
        return;
      }

      // Simulate password change success (would be replaced with actual API call)
      const Myid = localStorage.getItem("Myid"); // Lấy id người dùng từ localStorage

      try {
        const response = await fetch(
          `http://localhost:3000/api/customers/change-password/${Myid}`,
          {
            method: "PUT",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              oldPassword: currentPassword,
              newPassword: newPassword,
            }),
          }
        );
        if (!response.ok) {
          const error = await response.json();
          console.error("API Error:", error);
          alert(error.message || "Có lỗi xảy ra khi cập nhật mật khẩu.");
          return;
        }

        const result = await response.json();
        if (result.message === "Đổi mật khẩu thành công!") {
          alert("Đổi mật khẩu thành công!");
          passwordForm.reset(); // Reset form sau khi thành công
        } else {
          alert(result.message || "Có lỗi xảy ra, vui lòng thử lại");
        }
      } catch (error) {
        console.error("Lỗi cập nhật mật khẩu:", error);
        alert("Lỗi server!");
      }

      // Reset form
      passwordForm.reset();
    });
  }

  // Social connection buttons
  const connectButtons = document.querySelectorAll(".btn-connect");
  const disconnectButtons = document.querySelectorAll(".btn-disconnect");

  connectButtons.forEach((button) => {
    button.addEventListener("click", function () {
      // Simulate connection (would be replaced with actual OAuth flow)
      alert("Kết nối tài khoản mạng xã hội thành công!");

      // Change button to "Hủy liên kết"
      const connectionItem = this.closest(".connection-item");
      const connectionInfo = connectionItem.querySelector(".connection-info p");

      connectionInfo.innerText = "Đã liên kết với example@gmail.com";
      this.innerText = "Hủy liên kết";
      this.classList.remove("btn-connect");
      this.classList.add("btn-disconnect");
    });
  });

  disconnectButtons.forEach((button) => {
    button.addEventListener("click", function () {
      // Confirm disconnection
      if (confirm("Bạn có chắc muốn hủy liên kết tài khoản này?")) {
        // Simulate disconnection (would be replaced with actual API call)
        alert("Đã hủy liên kết tài khoản mạng xã hội!");

        // Change button to "Liên kết"
        const connectionItem = this.closest(".connection-item");
        const connectionInfo =
          connectionItem.querySelector(".connection-info p");

        connectionInfo.innerText = "Chưa liên kết";
        this.innerText = "Liên kết";
        this.classList.remove("btn-disconnect");
        this.classList.add("btn-connect");
      }
    });
  });

  // Logout functionality
  const logoutLink = document.getElementById("logout-link");
  if (logoutLink) {
    logoutLink.addEventListener("click", function (e) {
      e.preventDefault();

      // Clear user data from localStorage
      localStorage.removeItem("Myid");

      // Redirect to home page
      alert("Đăng xuất thành công!");
      window.location.href = "index.html";
    });
  }
});

// Address form handling
function showAddressForm(type, addressData) {
  const form = document.getElementById("address-form");
  const formTitle = document.getElementById("form-title");
  const addressForm = document.getElementById("delivery-address-form");

  form.style.display = "block";

  if (type === "edit") {
    formTitle.textContent = "Sửa địa chỉ";
    // Fill form with existing data
    addressForm.fullname.value = addressData.fullname;
    addressForm.phone.value = addressData.phone;
    addressForm.address.value = addressData.address;
    addressForm["set-default"].checked = addressData.isDefault;
  } else {
    formTitle.textContent = "Thêm địa chỉ mới";
    addressForm.reset();
  }

  // Scroll to form
  form.scrollIntoView({ behavior: "smooth" });
}

function hideAddressForm() {
  const form = document.getElementById("address-form");
  form.style.display = "none";
}

// Update edit button click handlers
document.addEventListener("DOMContentLoaded", function () {
  document.querySelectorAll(".edit-btn").forEach((button) => {
    button.addEventListener("click", function () {
      const addressCard = this.closest(".address-card");
      const addressData = {
        fullname: addressCard.querySelector("h3").textContent,
        phone: addressCard
          .querySelector(".phone")
          .textContent.replace(/[^\d]/g, ""),
        address: addressCard.querySelector(".address").textContent,
        isDefault: addressCard.querySelector(".default-badge") !== null,
      };
      showAddressForm("edit", addressData);
    });
  });
});
