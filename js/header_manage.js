//header trang quản lý
let header_bar = document.querySelector(".header>div").children;
let arr_href = [
  "index.html",
  "product_page.html",
  "order_page.html",
  "customers_page.html",
  "statistics_page.html",
];
for (let i = 1; i < header_bar.length - 1; i++) {
  header_bar[i].addEventListener("click", () => {
    location.href = arr_href[i - 1];
  });
}
let userLogin = JSON.parse(localStorage.getItem("userLogin"));
header_bar[6].children[1].innerHTML = userLogin.FullName;
header_bar[6].addEventListener("click", () => {
  localStorage.removeItem("userLogin");
  location.href = "index.html";
});
