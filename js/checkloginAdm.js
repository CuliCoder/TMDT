document.addEventListener("DOMContentLoaded", async () => {
  const admin = JSON.parse(localStorage.getItem("adminLoggedIn"));
  console.log(admin);
  const currentUrl = window.location.pathname.split("/").pop();
  const authorizedUrls = ["login.html", "register.html"];
  const adminUrls = [
    "products_page.html",
    "sidebar_DonHang.html",
    "customers_page.html",
    "categories_page.html",
    "brand_page.html",
    "supplier_page.html",
    "sidebar_nhaphang.html",
    "promotion_page.html",
    "add_product.html",
    "edit_product.html",
    "variations_page.html",
    "add_variation.html",
    "edit_variation.html",
  ];
  if (adminUrls.includes(currentUrl) && !admin) {
    window.location.href = "./login.html";
  }
  if (authorizedUrls.includes(currentUrl) && admin) {
    window.location.href = "./products_page.html";
  }
  
  const logoutButton = document.querySelector("#logout-link");
  console.log(logoutButton);
  if (logoutButton) {
    logoutButton.addEventListener("click", (e) => {
        console.log("Logout clicked");
      e.preventDefault();
      localStorage.removeItem("adminLoggedIn");
      window.location.href = "./login.html";
    });
  }
});
