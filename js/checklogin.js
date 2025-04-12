document.addEventListener("DOMContentLoaded", async () => {
  const user = JSON.parse(localStorage.getItem("Myid"));
  const currentUrl = window.location.pathname.split("/").pop();
  const authorizedUrls = ["login.html", "register.html"];

  if (authorizedUrls.includes(currentUrl) && user) {
    window.location.href = "index.html";
  }
  const unauthorizedUrls = [
    "profile.html",
    "checkout.html",
    "order_history.html",
  ];
  if (unauthorizedUrls.includes(currentUrl) && !user) {
    window.location.href = "login.html";
  }
  const account_menu = document.querySelector("#account-menu");
  const productUrl = ["smartphone-detail.html", "smartphones.html"];
  if (productUrl.includes(currentUrl)) {
    account_menu.innerHTML = !user
      ? `<a href="../login.html"><i class="fas fa-user"></i> Đăng nhập</a>`
      : `<a href="../profile.html"
      ><i class="fas fa-user-circle"></i> Tài khoản của tôi</a
    >`;
  } else {
    account_menu.innerHTML = !user
      ? `<a href="login.html"><i class="fas fa-user"></i> Đăng nhập</a>`
      : `<a href="profile.html"
      ><i class="fas fa-user-circle"></i> Tài khoản của tôi</a
    >`;
  }
});
