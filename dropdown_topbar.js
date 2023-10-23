let icon_search = document.querySelector(".header .bx-search ");
let search_box = document.querySelector(".search-bg");
icon_search.addEventListener("click", () => {
  console.log(icon_search);
  console.log(search_box);
  search_box.classList.toggle("hide");
  document.querySelector(".search-bg input").focus();
});
