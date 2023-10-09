let search = document.querySelector(".bx-search");
let search_place = document.querySelector(".search-place");
let cart = document.querySelector(".bx-shopping-bag");
let place_check_cart = document.querySelector(".check-cart");
let input_search = document.querySelector(".input-search");
function showdropdown_search() {
  search_place.classList.toggle("show-drop-down");
  if (search_place.classList.contains("show-drop-down")) input_search.focus();
}
function showdropdown_cart() {
  place_check_cart.classList.toggle("show-drop-down");
}
search.addEventListener("click", function (e) {
  console.log(e.target);
  if (e.target == e.currentTarget) {
    showdropdown_search();
    if (place_check_cart.classList.contains("show-drop-down"))
      showdropdown_cart();
  }
});
search_place.addEventListener("click", function (e) {
  if (e.target == e.currentTarget) showdropdown_search();
});
cart.addEventListener("click", function (e) {
  if (e.target == e.currentTarget) {
    showdropdown_cart();
    if (search_place.classList.contains("show-drop-down"))
      showdropdown_search();
  }
});
//responsive
let width;
$(window).resize(function () {
  width = $(window).width();
  console.log(width);
});
place_check_cart.addEventListener("click", function (e) {
  if (width > 400) if (e.target == e.currentTarget) showdropdown_cart();
});
//mobile
let search_mobile = document.querySelector(".search-mobile");
let cart_mobile = document.querySelector(".cart-mobile");
let close_drop_down_search = document.querySelector(".bx-x-search");
let close_drop_down_cart = document.querySelector(".bx-x-cart");
let menu_drop_mobile = document.querySelector(".menu-drop");
let close_drop_down_menu = document.querySelector(".bx-x-menu");
let menu_header_mobile = document.querySelector(".bx-menu");

//search
search_mobile.addEventListener("click", function (e) {
  console.log(e.target);
  if (e.target == e.currentTarget) {
    showdropdown_search();
  }
});

close_drop_down_search.addEventListener("click", function (e) {
  if (e.target == e.currentTarget) showdropdown_search();
});
//cart
cart_mobile.addEventListener("click", function (e) {
  console.log(e.target);
  if (e.target == e.currentTarget) showdropdown_cart();
});
close_drop_down_cart.addEventListener("click", function (e) {
  console.log(e.target);
  if (e.target == e.currentTarget) showdropdown_cart();
});
//menu
function showdropdown_menu() {
  menu_drop_mobile.classList.toggle("show-drop-down");
}
menu_header_mobile.addEventListener("click", function (e) {
  if (e.target == e.currentTarget) showdropdown_menu();
});
close_drop_down_menu.addEventListener("click", function (e) {
  if (e.target == e.currentTarget) showdropdown_menu();
});
