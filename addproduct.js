let products = [
  {
    img: "https://cdn2.cellphones.com.vn/insecure/rs:fill:358:358/q:80/plain/https://cellphones.com.vn/media/catalog/product/g/a/galaxys23ultra_front_green_221122_2.jpg",
    title: "Samsung Galaxy S23 Ultra 256GB",
    price_show: "21790000",
    price_origin: "31990000",
  },
  {
    img: "https://cdn2.cellphones.com.vn/insecure/rs:fill:358:358/q:80/plain/https://cellphones.com.vn/media/catalog/product/i/p/iphone-15-pro-max_2__5.jpg",
    title: "iPhone 15 Pro Max 256GB | Chính hãng VN/A",
    price_show: "34990000",
    price_origin: "",
  },
  {
    img: "https://cdn2.cellphones.com.vn/insecure/rs:fill:358:358/q:80/plain/https://cellphones.com.vn/media/catalog/product/v/n/vn_iphone_15_pink_pdp_image_position-1a_pink_color_2.jpg",
    title: "iPhone 15 128GB | Chính hãng VN/A",
    price_show: "21990000",
    price_origin: "22990000",
  },
  {
    img: "https://cdn2.cellphones.com.vn/insecure/rs:fill:358:358/q:80/plain/https://cellphones.com.vn/media/catalog/product/t/_/t_m_18.png",
    title: "iPhone 14 Pro Max 128GB | Chính hãng VN/A",
    price_show: "26390000",
    price_origin: "29990000",
  },
  {
    img: "https://cdn2.cellphones.com.vn/insecure/rs:fill:358:358/q:80/plain/https://cellphones.com.vn/media/catalog/product/_/7/_76666_7__3.jpg",
    title: "Xiaomi Redmi Note 12 8GB 128GB",
    price_show: "4990000",
    price_origin: "5790000",
  },
];

let json_products;
if (localStorage.getItem("add-product") == null) {
  json_products = JSON.stringify(products);
  console.log(json_products);
  localStorage.setItem("json-products", json_products);
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
function show(item) {
  return `<div class="product col l-3 m-4 c-6">
<div class="product-box">
  <div class="product-img">
    <img
      src="${item.img}"
    />
  </div>
  <div class="product-info">
    <h3 class="product-title">${item.title}</h3>
    <div class="product-price">
      <p class="product-price-show">${price_format(item.price_show)}</p>
      <p class="product-price-origin">${price_format(item.price_origin)}</p>
    </div>
    <a href="" class="product-btn">Mua ngay</a>
  </div>
</div>
</div>`;
}
if (localStorage.getItem("add-product") == "true") {
  let new_product = {
    img: localStorage.getItem("product-img"),
    title: localStorage.getItem("product-title"),
    price_show: localStorage.getItem("product-price-show"),
    price_origin: localStorage.getItem("product-price-origin"),
  };
  products = JSON.parse(localStorage.getItem("json-products"));
  products.push(new_product);
  localStorage.setItem("add-product", "false");
  json_products = JSON.stringify(products);
  localStorage.setItem("json-products", json_products);
}

products = JSON.parse(localStorage.getItem("json-products"));
console.log(products);
document.querySelector(".all-products").innerHTML = products.map(show).join("");

// link ảnh:https://cdn2.cellphones.com.vn/insecure/rs:fill:358:358/q:80/plain/https://cellphones.com.vn/media/catalog/product/_/7/_76666_7__3.jpg
//tên sp:Xiaomi Redmi Note 12 8GB 128GB
//giá hiển thị:4990000
//giá gốc:5790000
