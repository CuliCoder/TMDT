let icon_search = document.querySelector(".header .search ");
let search_box = document.querySelector(".search-bg");
icon_search.addEventListener("click", () => {
  search_box.classList.toggle("hide");
  document.querySelector(".search-bg input").focus();
});
