//----------------tạo đường dẫn------------------
//đường dẫn để lọc giá
opt_price();
function opt_price() {
  let opt = document.querySelectorAll(".filter-price>div:nth-child(2) a");
  //giá min , max của từng option
  let array = [
    {
      min: 0,
      max: 2000000,
    },
    {
      min: 2000000,
      max: 4000000,
    },
    {
      min: 4000000,
      max: 7000000,
    },
    {
      min: 7000000,
      max: 13000000,
    },
    {
      min: 13000000,
      max: 20000000,
    },
    {
      min: 20000000,
      max: Number.MAX_SAFE_INTEGER,
    },
  ];
  //tạo đường dẫn để lọc giá của trang chủ hoặc trang của mỗi hãng
  for (let i = 0; i < opt.length; i++) {
    if (!location.href.includes("brand")) {
      opt[i].href = "index.html?price=" + array[i].min + "-" + array[i].max;
    } else {
      let brand = location.href.split(/[?,&,=]/)[2];
      opt[i].href =
        "index.html?brand=" +
        brand +
        "&price=" +
        array[i].min +
        "-" +
        array[i].max;
    }
  }
}
