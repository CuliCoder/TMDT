let search = document.querySelector(".bx-search");
let search_place = document.querySelector(".search-place");
let cart = document.querySelector(".bx-shopping-bag");
let place_check_cart = document.querySelector(".check-cart");
function showdropdown_search() {
  search_place.classList.toggle("show-drop-down");
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
place_check_cart.addEventListener("click", function (e) {
  if (e.target == e.currentTarget) showdropdown_cart();
});
