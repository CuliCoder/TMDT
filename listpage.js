let limit = 12; //limit products a page
let thispage = 1; //current page
let list = document.querySelectorAll(".all-products .product"); //array products
function loaditem() {
  let beginget = limit * (thispage - 1); //index start
  let endget = limit * thispage - 1; //index end
  for (let i = 0; i < list.length; i++) {
    if (i >= beginget && i <= endget) list[i].style.display = "block";
    else list[i].style.display = "none";
  }
  listPage();
}
loaditem();
function listPage() {
  let count = Math.ceil(list.length / limit); //page total
  document.querySelector(".list-page").innerHTML = "";
  if (thispage != 1) {
    //prev page
    let prev = document.createElement("li");
    prev.innerText = "Trước";
    prev.setAttribute("onclick", "changePage(" + (thispage - 1) + ")");
    document.querySelector(".list-page").appendChild(prev);
  }
  for (i = 1; i <= count; i++) {
    let newPage = document.createElement("li");
    newPage.innerText = i;
    if (i == thispage) newPage.classList.add("page-current");
    newPage.setAttribute("onclick", "changePage(" + i + ")");
    document.querySelector(".list-page").appendChild(newPage);
  }
  if (thispage != count) {
    //next page
    let next = document.createElement("li");
    next.innerText = "Sau";
    next.setAttribute("onclick", "changePage(" + (thispage + 1) + ")");
    document.querySelector(".list-page").appendChild(next);
  }
}
function changePage(i) {
  thispage = i;
  loaditem();
}
