//header
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
// show revenue
function revenue(brand) {
  let quantity = 0;
  let total_price = 0;
  let users = JSON.parse(localStorage.getItem("users"));
  for (let i = 0; i < users.length; i++) {
    for (let j = 0; j < users[i].order.length; j++) {
      if (users[i].order[j].status == "Đơn hàng đã được xác nhận") {
        for (let v = 0; v < users[i].order[j].products.length; v++) {
          if (users[i].order[j].products[v].brand == brand) {
            quantity += users[i].order[j].products[v].quantity;
            total_price += users[i].order[j].products[v].total_price;
          }
        }
      }
    }
  }
  return [quantity, total_price];
}
show_revenue();
function show_revenue() {
  document.querySelector(
    ".list-brands .brands"
  ).innerHTML = `<li class="top-list">
  <ul>
    <li>STT</li>
    <li>Hãng</li>
    <li>Số lượng bán ra</li>
    <li>Doanh thu</li>
  </ul>
</li>`;
  let array_brand = ["APPLE", "SAMSUNG", "XIAOMI", "OPPO", "REALME"];
  let total = [0, 0];
  for (let i = 0; i < array_brand.length; i++) {
    let Revenue = revenue(array_brand[i]);
    total[0] += Revenue[0];
    total[1] += Revenue[1];
    document.querySelector(
      ".list-brands .brands"
    ).innerHTML += `<li class="brand">
    <ul>
      <li>${i + 1}</li>
      <li>${array_brand[i]}</li>
      <li>${Revenue[0]}</li>
      <li>${price_format("" + Revenue[1])}</li>
    </ul>
  </li>`;
  }
  document.querySelector(
    ".list-brands .brands"
  ).innerHTML += `<li class="brand">
  <ul>
    <li>Tổng</li>
    <li>${total[0]}</li>
    <li>${price_format("" + total[1])}</li>
  </ul>
</li>`;
}
function price_format(price) {
  if (price == "") return "";
  let price_str = "";
  let tmp = price;
  for (i = price.length; i > 3; i -= 3) {
    price_str = "." + tmp.slice(-3) + price_str;
    tmp = tmp.substr(0, i - 3);
  }
  tmp = tmp.slice(0);
  return tmp + price_str + "₫";
}
