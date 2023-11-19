//-----slide show------
let slides = document.querySelector(".img-feature"); //thẻ chứa các img
let imgs = slides.getElementsByTagName("img"); //lấy tất cả các hình đang có trong slides
let currentSlide = 0; //vị trí hiện tại
let auto_slide_show = setInterval(slideshow, 3000); //cứ 3s sẽ thực hiện hàm slideshow
let list_dot = document.querySelectorAll(".list-dot .dot"); //các nút chấm
//chuyển sang slide kế
function slideshow() {
  if (currentSlide == imgs.length - 1) {
    currentSlide = 0;
    slides.style.transform = `translateX(0px)`;
    document.querySelector(".dot.active").classList.remove("active");
    list_dot[currentSlide].classList.add("active");
  } else {
    currentSlide++;
    let width = imgs[0].offsetWidth;
    slides.style.transform = `translateX(${width * -1 * currentSlide}px)`;
    document.querySelector(".dot.active").classList.remove("active");
    list_dot[currentSlide].classList.add("active");
  }
}
//chuyển slide theo chấm
function dot(index) {
  clearInterval(auto_slide_show);
  currentSlide = index;
  let width = imgs[0].offsetWidth;
  slides.style.transform = `translateX(${width * -1 * currentSlide}px)`;
  for (let i = 0; i < list_dot.length; i++)
    list_dot[i].classList.remove("active");
  list_dot[currentSlide].classList.add("active");
  auto_slide_show = setInterval(slideshow, 3000);
}
//ấn nút sẽ chuyển về slide trước
document.querySelector(".prev").addEventListener("click", () => {
  clearInterval(auto_slide_show); //ngắt auto
  if (currentSlide == 0) {
    currentSlide = imgs.length - 1;
    let width = imgs[0].offsetWidth;
    slides.style.transform = `translateX(${width * -1 * currentSlide}px)`;
    document.querySelector(".dot.active").classList.remove("active");
    list_dot[currentSlide].classList.add("active");
  } else {
    currentSlide--;
    let width = imgs[0].offsetWidth;
    slides.style.transform = `translateX(${width * -1 * currentSlide}px)`;
    document.querySelector(".dot.active").classList.remove("active");
    list_dot[currentSlide].classList.add("active");
  }
  auto_slide_show = setInterval(slideshow, 3000); //khởi chạy lại auto
});
//ấn nút sẽ chuyển sang slide kế
document.querySelector(".next").addEventListener("click", () => {
  clearInterval(auto_slide_show);
  slideshow();
  auto_slide_show = setInterval(slideshow, 3000);
});
