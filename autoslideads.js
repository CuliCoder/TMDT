//index ads img left
let Lindex = 0;
//index ads img right
let Rindex = 0;
//runtime t is left and p is right
let t, p;
showLAds();
showRAds();
//press previous or next convert img and turn off runtime(left)
function plusSlide_left(n) {
  Lindex += n;
  press_showLAds();
  clearTimeout(t);
}
//...(right)
function plusSlide_right(n) {
  Rindex += n;
  press_showRAds();
  clearTimeout(p);
}
//press dot convert img and turn off runtime(left)
function currentSlide_left(n) {
  Lindex = n;
  clearTimeout(t);
  press_showLAds();
}
//..(right)
function currentSlide_right(n) {
  Rindex = n;
  clearTimeout(p);
  press_showRAds();
}
//auto convert img(left)
function showLAds() {
  let i;
  let lads = document.getElementsByClassName("lads");
  let ldot = document.getElementsByClassName("ldot");
  for (i = 0; i < lads.length; i++) lads[i].style.display = "none";
  Lindex++;
  if (Lindex > lads.length) Lindex = 1;
  for (i = 0; i < ldot.length; i++)
    ldot[i].className = ldot[i].className.replace(" active", "");
  lads[Lindex - 1].style.display = "block";
  ldot[Lindex - 1].className += " active";
  t = setTimeout(showLAds, 3000);
}
//press to convert img(left)
function press_showLAds() {
  let i;
  let lads = document.getElementsByClassName("lads");
  let ldot = document.getElementsByClassName("ldot");
  for (i = 0; i < lads.length; i++) lads[i].style.display = "none";
  if (Lindex > lads.length) Lindex = 1;
  if (Lindex < 1) Lindex = lads.length;
  for (i = 0; i < ldot.length; i++)
    ldot[i].className = ldot[i].className.replace(" active", "");
  lads[Lindex - 1].style.display = "block";
  ldot[Lindex - 1].className += " active";
} //auto convert img(right)
function showRAds() {
  let i;
  let rads = document.getElementsByClassName("rads");
  let rdot = document.getElementsByClassName("rdot");
  for (i = 0; i < rads.length; i++) rads[i].style.display = "none";
  Rindex++;
  if (Rindex > rads.length) Rindex = 1;
  for (i = 0; i < rdot.length; i++)
    rdot[i].className = rdot[i].className.replace(" active", "");
  rads[Rindex - 1].style.display = "block";
  rdot[Rindex - 1].className += " active";
  p = setTimeout(showRAds, 3000);
}
//press to convert img(right)
function press_showRAds() {
  let i;
  let rads = document.getElementsByClassName("rads");
  let rdot = document.getElementsByClassName("rdot");
  for (i = 0; i < rads.length; i++) rads[i].style.display = "none";
  if (Rindex > rads.length) Rindex = 1;
  if (Rindex < 1) Rindex = rads.length;
  for (i = 0; i < rdot.length; i++)
    rdot[i].className = rdot[i].className.replace(" active", "");
  rads[Rindex - 1].style.display = "block";
  rdot[Rindex - 1].className += " active";
}
