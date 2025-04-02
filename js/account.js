document.addEventListener("DOMContentLoaded", function () {
  // Check login status and update UI
  updateHeaderUI();

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

  // Login form submission
  const loginForm = document.getElementById("login-form");
  if (loginForm) {
    loginForm.addEventListener("submit", function (e) {
      e.preventDefault();

      // Get form values
      const email = document.getElementById("email").value;
      const password = document.getElementById("password").value;
      const remember = document.getElementById("remember")?.checked;

      // Validate form
      if (!email || !password) {
        alert("Vui lòng nhập đầy đủ thông tin");
        return;
      }

      // Save login status to localStorage
      const userData = {
        email: email,
        name: "Nguyễn Văn A",
        loggedIn: true,
      };
      localStorage.setItem("userData", JSON.stringify(userData));

      // Simulate login success (would be replaced with actual API call)
      alert("Đăng nhập thành công! Chào mừng bạn quay trở lại.");
      window.location.href = "profile.html";
    });
  }

  // Function to update header based on login status
  function updateHeaderUI() {
    const userData = JSON.parse(
      localStorage.getItem("userData") || '{"loggedIn": false}'
    );
    const userNavItem = document.querySelector(".top-nav ul li:first-child");

    if (userNavItem) {
      if (userData.loggedIn) {
        userNavItem.innerHTML =
          '<a href="profile.html"><i class="fas fa-user-circle"></i> Tài khoản của tôi</a>';
      } else {
        userNavItem.innerHTML =
          '<a href="login.html"><i class="fas fa-user"></i> Đăng nhập</a>';
      }
    }
  }

  // Register form submission
  const registerForm = document.getElementById("register-form");
  if (registerForm) {
    registerForm.addEventListener("submit", function (e) {
      e.preventDefault();

      // Get form values
      const fullname = document.getElementById("fullname").value;
      const phone = document.getElementById("phone").value;
      const email = document.getElementById("email").value;
      const password = document.getElementById("new-password").value;
      const confirmPassword = document.getElementById("confirm-password").value;
      const agreeTerms = document.getElementById("agree-terms").checked;

      // Validate form
      if (!fullname || !phone || !email || !password || !confirmPassword) {
        alert("Vui lòng nhập đầy đủ thông tin");
        return;
      }

      if (password !== confirmPassword) {
        alert("Mật khẩu xác nhận không khớp với mật khẩu mới");
        return;
      }

      if (!agreeTerms) {
        alert("Vui lòng đồng ý với điều khoản sử dụng và chính sách bảo mật");
        return;
      }

      // Simulate registration success (would be replaced with actual API call)
      alert("Đăng ký thành công! Chào mừng bạn đến với HONGO.");
      window.location.href = "login.html";
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
      const inputs = profileForm.querySelectorAll("input");
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

  if (profileForm) {
    profileForm.addEventListener("submit", function (e) {
      e.preventDefault();

      // Simulate update success (would be replaced with actual API call)
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
    passwordForm.addEventListener("submit", function (e) {
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
      alert("Đổi mật khẩu thành công!");

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
      localStorage.removeItem("userData");

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
