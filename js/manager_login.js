import axiosInstance from "./configAxios.js";
document.addEventListener("DOMContentLoaded", () => {
  document
    .getElementById("admin-login-form")
    .addEventListener("submit", async (e) => {
      e.preventDefault();

      const loginIdentifier = document
        .getElementById("loginIdentifier")
        .value.trim();
      const password = document.getElementById("password").value.trim();
      const errorMessage = document.getElementById("error-message");
      const response = await axiosInstance.post(
        "http://localhost:3000/auth/loginAdmin",
        {
          loginIdentifier: loginIdentifier,
          password: password,
        }
      );
      if(response.data.error != 0){
        errorMessage.style.display = "block"; // Hiển thị thông báo lỗi
        errorMessage.innerHTML = response.data.message;
      }
      else{
        localStorage.setItem("adminLoggedIn", response.data.data.id);
        alert("Đăng nhập thành công!");
        window.location.href = "./products_page.html"; // Chuyển hướng đến trang quản lý sản phẩm
      }
    });
});
