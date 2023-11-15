// let array = [
//   "productId:",
//   "img:",
//   "title:",
//   "brand:",
//   "price_show:",
//   "price_origin:",
//   "screen_size:",
//   "screen_technology:",
//   "rear_camera:",
//   "front_camera:",
//   "Chipset:",
//   "RAM_capacit:",
//   "internal_storage:",
//   "Pin:",
//   "SIM_card:",
//   "OS:",
//   "screen_resolution:",
//   "screen_features:",
// ];
// let tmp = "";
// tmp +=
//   array[0] +
//   0 +
//   "," +
//   array[1] +
//   '"' +
//   document.querySelector(".box-ksp img").src +
//   '",' +
//   array[2] +
//   '"' +
//   document.querySelector(".box-product-name h1").innerHTML +
//   '",' +
//   array[3] +
//   '"' +
//   "OPPO" +
//   '",' +
//   array[4] +
//   '"' +
//   format(document.getElementsByClassName("tpt---sale-price")[1].innerHTML) +
//   '",';
// if (document.getElementsByClassName("tpt---price") == null) {
//   console.log("true");
//   tmp +=
//     array[5] +
//     '"' +
//     format(document.getElementsByClassName("tpt---price")[0].innerHTML) +
//     '",';
// } else {
//   tmp += array[5] + '"' + '",';
// }
// let index = 6;
// for (
//   let i = 0;
//   i < document.querySelectorAll(".technical-content div").length;
//   i++
// ) {
//   tmp +=
//     array[index] +
//     '"' +
//     document.querySelectorAll(".technical-content div")[i].innerHTML +
//     '",';
//   index++;
// }

// function format(str) {
//   let a = str.split(".");
//   let tmp = a.join("");
//   let tmp1 = tmp.split("đ");
//   return tmp1[0];
// }
// console.log(tmp);

let products = [
  {
    productId: 0,
    img: "https://cdn2.cellphones.com.vn/insecure/rs:fill:358:358/q:80/plain/https://cellphones.com.vn/media/catalog/product/g/a/galaxys23ultra_front_green_221122_2.jpg",
    title: "Samsung Galaxy S23 Ultra 256GB",
    brand: "SAMSUNG",
    price_show: "21790000",
    price_origin: "31990000",
    screen_size: "6.8 inches",
    screen_technology: "Dynamic AMOLED 2X",
    rear_camera:
      "Siêu rộng: 12MP F2.2 (Dual Pixel AF)<br>Chính: 200MP F1.7 OIS ±3° (Super Quad Pixel AF)<br>Tele 1: 10MP F4.9 (10X, Dual Pixel AF) OIS,<br>Tele 2: 10MP F2.4 (3X, Dual Pixel AF) OIS Thu phóng chuẩn không gian 100X",
    front_camera: "12MP F2.2 (Dual Pixel AF)",
    Chipset: "Snapdragon 8 Gen 2 (4 nm)",
    RAM_capacit: "8 GB",
    internal_storage: "256 GB",
    Pin: "5.000mAh",
    SIM_card: "2 Nano SIM hoặc 1 Nano + 1 eSIM",
    OS: "Android",
    screen_resolution: "1440 x 3088 pixels (QHD+)",
    screen_features: "120Hz, HDR10+, 1750 nits, Gorilla Glass Victus 2",
  },
  {
    productId: 0,
    img: "https://cdn2.cellphones.com.vn/insecure/rs:fill:358:358/q:80/plain/https://cellphones.com.vn/media/catalog/product/i/p/iphone-15-pro-max_2__5.jpg",
    title: "iPhone 15 Pro Max 256GB | Chính hãng VN/A",
    brand: "APPLE",
    price_show: "34990000",
    price_origin: "",
    screen_size: "6.7 inches",
    screen_technology: "Super Retina XDR OLED",
    rear_camera:
      "Camera chính: 48MP, 24 mm, ƒ/1.78, <br>Camera góc siêu rộng: 12 MP, 13 mm, ƒ/2.2<br>Camera Tele 5x: 12 MP, 120 mm, ƒ/2.8<br>Camera Tele 2x: 12 MP, 48 mm, ƒ/1.78",
    front_camera: "12MP, ƒ/1.9",
    Chipset: "A17 Pro",
    RAM_capacit: "8 GB",
    internal_storage: "256 GB",
    Pin: "4422 mAh",
    SIM_card: "2 SIM (nano‑SIM và eSIM)",
    OS: "iOS 17",
    screen_resolution: "2796 x 1290-pixel",
    screen_features:
      "Tốc độ làm mới 120Hz<br>460 ppi<br>HDR<br>True Tone<br>Dải màu rộng (P3)<br>Haptic Touch<br>Tỷ lệ tương phản 2.000.000:1",
  },
  {
    productId: 0,
    img: "https://cdn2.cellphones.com.vn/insecure/rs:fill:358:358/q:80/plain/https://cellphones.com.vn/media/catalog/product/v/n/vn_iphone_15_pink_pdp_image_position-1a_pink_color_2.jpg",
    title: "iPhone 15 128GB | Chính hãng VN/A",
    brand: "APPLE",
    price_show: "21990000",
    price_origin: "22990000",
    screen_size: "6.1 inches",
    screen_technology: "Super Retina XDR OLED",
    rear_camera:
      "Camera chính: 48MP<br>Camerra góc rộng: 12MP<br> Camera Tele: 12MP",
    front_camera: "12MP",
    Chipset: "Apple A16 Bionic",
    RAM_capacit: "6 GB",
    internal_storage: "128 GB",
    Pin: "3349 mAh",
    SIM_card: "2 SIM (nano‑SIM và eSIM)",
    OS: "iOS 17",
    screen_resolution: "1179 x 2556 pixels",
    screen_features:
      "Dynamic Island <br>HDR display <br>True Tone <br>Wide color (P3) <br>Haptic Touch<br>Lớp phủ oleophobia chống dấu vân tay<br>Độ sáng tối đa: 2000 nits<br>Mặt kính cảm ứng: Kính cường lực Ceramic Shield",
  },
  {
    productId: 0,
    img: "https://cdn2.cellphones.com.vn/insecure/rs:fill:358:358/q:80/plain/https://cellphones.com.vn/media/catalog/product/t/_/t_m_18.png",
    title: "iPhone 14 Pro Max 128GB | Chính hãng VN/A",
    brand: "APPLE",
    price_show: "26390000",
    price_origin: "29990000",
    screen_size: "6.7 inches",
    screen_technology: "Super Retina XDR OLED",
    rear_camera:
      "Camera chính: 48 MP, f/1.8, 24mm, 1.22µm, PDAF, OIS <br> Camera góc siêu rộng: 12 MP, f/2.2, 13mm, 120˚, 1.4µm, PDAF <br> Camera tele: 12 MP, f/2.8, 77mm (telephoto), PDAF, OIS, 3x optical zoom <br> Cảm biến độ sâu TOF 3D LiDAR",
    front_camera: "Camera selfie: 12 MP, f/1.9, 23mm, 1/3.6, PDAF",
    Chipset: "Apple A16 Bionic 6-core",
    RAM_capacit: "6 GB",
    internal_storage: "128 GB",
    Pin: "4.323 mAh",
    SIM_card: "2 SIM (nano‑SIM và eSIM)",
    OS: "iOS 16",
    screen_resolution: "2796 x 1290-pixel",
    screen_features:
      "120Hz, Always-On display, HDR, True Tone, Haptic Touch, 2,000,000:1, 2000 nits",
  },
  {
    productId: 0,
    img: "https://cdn2.cellphones.com.vn/insecure/rs:fill:358:358/q:80/plain/https://cellphones.com.vn/media/catalog/product/_/7/_76666_7__3.jpg",
    title: "Xiaomi Redmi Note 12 8GB 128GB",
    brand: "XIAOMI",
    price_show: "4990000",
    price_origin: "5790000",
    screen_size: "6.67 inches",
    screen_technology: "AMOLED",
    rear_camera:
      "Camera chính: 50MP, f/1.8 <br> Camera góc rộng: 8MP, f/2.2, 120° <br> Camera Macro: 2MP, f/2.4",
    front_camera: "13MP, f/2.45",
    Chipset: "Qualcomm Snapdragon 685",
    RAM_capacit: "8 GB",
    internal_storage: "128 GB",
    Pin: "5000mAh",
    SIM_card: "2 SIM (Nano-SIM)",
    OS: "Android 12",
    screen_resolution: "1080 x 2400 pixels (FullHD+)",
    screen_features:
      "Tần số quét 120Hz, độ sáng 1200nits  <br> Corning® Gorilla® Glass 3",
  },
  {
    productId: 0,
    img: "https://cdn2.cellphones.com.vn/insecure/rs:fill:358:358/q:80/plain/https://cellphones.com.vn/media/catalog/product/_/7/_76666_7__3.jpg",
    title: "Xiaomi Redmi Note 12 4GB 128GB",
    brand: "XIAOMI",
    price_show: "4990000",
    price_origin: "5790000",
    screen_size: "6.67 inches",
    screen_technology: "AMOLED",
    rear_camera:
      "Camera chính: 50MP, f/1.8 <br> Camera góc rộng: 8MP, f/2.2, 120° <br> Camera Macro: 2MP, f/2.4",
    front_camera: "13MP, f/2.45",
    Chipset: "Qualcomm Snapdragon 685",
    RAM_capacit: "4 GB",
    internal_storage: "128 GB",
    Pin: "5000mAh",
    SIM_card: "2 SIM (Nano-SIM)",
    OS: "Android 12",
    screen_resolution: "1080 x 2400 pixels (FullHD+)",
    screen_features:
      "Tần số quét 120Hz, độ sáng 1200nits  <br> Corning® Gorilla® Glass 3",
  },
  {
    productId: 0,
    img: "https://cdn2.cellphones.com.vn/insecure/rs:fill:358:358/q:80/plain/https://cellphones.com.vn/media/catalog/product/x/i/xiaomi-13-pro-thumb-xanh-la9.jpg",
    title: " Xiaomi 13T Pro 5G (12GB - 512GB)",
    brand: "XIAOMI",
    price_show: "15990000",
    price_origin: "16990000",
    screen_size: "6.67 inches",
    screen_technology: "OLED",
    rear_camera:
      "Camera chính góc rộng: 50 MP, 1/1.22<br>Camera góc siêu rộng: 12 MP<br>Camera Tele: 50 MP",
    front_camera: "20 MP",
    Chipset: "Dimensity 9200+",
    RAM_capacit: "12 GB",
    internal_storage: "512 GB",
    Pin: "5.000 mAh",
    SIM_card: "2 SIM (nano‑SIM và eSIM)",
    OS: "Android 13",
    screen_resolution: "1220 x 2712 pixels",
    screen_features: "Màn OLED 1.5K<br>Tần số quét 144 Hz",
  },
  {
    productId: 0,
    img: "https://cdn2.cellphones.com.vn/insecure/rs:fill:358:358/q:80/plain/https://cellphones.com.vn/media/catalog/product/x/i/xiaomi-redmi-note-12-pro-5g.png",
    title: " Xiaomi Redmi Note 12 Pro 5G ",
    brand: "XIAOMI",
    price_show: "8490000",
    price_origin: "9490000",
    screen_size: "6.67 inches",
    screen_technology: "AMOLED",
    rear_camera:
      "Camera góc rộng: 50MP, f/1.9, PDAF, OIS Camera góc siêu rộng: 8 MP, f/1.9, 119˚ Camera macro: 2 MP, f/2.4",
    front_camera: "Camera góc rộng: 16 MP",
    Chipset: "MediaTek Dimensity 1080 8 nhân",
    RAM_capacit: "8 GB",
    internal_storage: "256 GB",
    Pin: "5.000 mAh",
    SIM_card: "2 SIM (Nano-SIM)",
    OS: "Android 12",
    screen_resolution: "1080 x 2400 pixels (FullHD+)",
    screen_features:
      "Tần số quét: 120Hz Dolby Vision, HDR10+, 500 nit, 900 nit Kính cường lực Corning Gorilla Glass 5",
  },
  {
    productId: 0,
    img: "https://cdn2.cellphones.com.vn/insecure/rs:fill:358:358/q:80/plain/https://cellphones.com.vn/media/catalog/product/x/i/xiaomi-13.png",
    title: " Xiaomi 13 8GB 256GB ",
    brand: "XIAOMI",
    price_show: "18090000",
    price_origin: "22990000",
    screen_size: "6.36 inches",
    screen_technology: "AMOLED",
    rear_camera:
      "Camera chính: 50MP, f/1.8, HyperOIS Camera tele của Leica: 10MP, f/2.0, OIS Camera góc siêu rộng Leica: 12MP, f/2.2",
    front_camera: "Camera selfie trong màn hình 32MP, f/2.0",
    Chipset: "Chip Snapdragon® 8 thế hệ thứ 2",
    RAM_capacit: "8 GB",
    internal_storage: "256 GB",
    Pin: "Pin 4500mAh",
    SIM_card: "2 SIM (Nano-SIM)",
    OS: "MIUI 14, Android 13",
    screen_resolution: "1080 x 2400 pixels (FullHD+)",
    screen_features:
      "Tốc độ lấy mẫu cảm ứng: lên tới 240Hz, Độ sáng: HBM 1200 nits (typ), độ sáng tối đa 1900 nits, HDR Tầm nhìn Dolby® HDR10+, Gam màu: DCI-P3",
  },
  {
    productId: 0,
    img: "https://cdn2.cellphones.com.vn/insecure/rs:fill:358:358/q:80/plain/https://cellphones.com.vn/media/catalog/product/x/i/xiaomi-redmi-note-12-pro-4g.png",
    title: " Xiaomi Redmi Note 12 Pro 4G 8GB 256GB ",
    brand: "XIAOMI",
    price_show: "7190000",
    price_origin: "7990000",
    screen_size: "6.67 inches",
    screen_technology: "AMOLED",
    rear_camera:
      "Camera chính: 108MP, f/1.9, 1/1.52 Camera góc siêu rộng: 8MP, f/2.2, FOV 120° Camera cận cảnh: 2MP, f/2.4 Camera chiều sâu: 2MP, f/2.4",
    front_camera: "16MP, f/2.45",
    Chipset: "Qualcomm SM7150 Snapdragon 732G (8 nm)",
    RAM_capacit: "8 GB",
    internal_storage: "256 GB",
    Pin: "5000mAh",
    SIM_card: "2 SIM (Nano-SIM)",
    OS: "MIUI 13 dựa trên Android 11",
    screen_resolution: "1080 x 2400 pixels (FullHD+)",
    screen_features:
      "Tần số quét 120Hz, Độ sáng tối đa 1100 nits Corning® Gorilla® Glass 5",
  },
  {
    productId: 0,
    img: "https://cdn2.cellphones.com.vn/insecure/rs:fill:358:358/q:80/plain/https://cellphones.com.vn/media/catalog/product/x/i/xiaomi-redmi-12c.png",
    title: " Xiaomi Redmi 12C 4GB 64GB ",
    brand: "XIAOMI",
    price_show: "2390000",
    price_origin: "3590000",
    screen_size: "6.71 inches",
    screen_technology: "IPS LCD",
    rear_camera: "Camera góc rộng: 50MP, PDAF Camera đo độ sâu: 0.08MP",
    front_camera: "5 MP",
    Chipset: "Mediatek MT6769Z Helio G85 (12nm)",
    RAM_capacit: "4 GB",
    internal_storage: "64 GB",
    Pin: "5,000 mAh",
    SIM_card: "2 SIM (Nano-SIM)",
    OS: "Android 13",
    screen_resolution: "720 x 1650 pixels",
    screen_features: "500 nits",
  },
  {
    productId: 0,
    img: "https://cdn2.cellphones.com.vn/insecure/rs:fill:358:358/q:80/plain/https://cellphones.com.vn/media/catalog/product/x/i/xiaomi-redmi-note-12s.png",
    title: " Xiaomi Redmi Note 12S ",
    brand: "XIAOMI",
    price_show: "5890000",
    price_origin: "6690000",
    screen_size: "6.43 inches",
    screen_technology: "AMOLED",
    rear_camera:
      "Camera chính: 108MP, f/1.89 Camera góc siêu rộng: 8MP, f/2.2, FOV 118° Camera cận cảnh: 2MP, f/2.4",
    front_camera: "16MP, f/2.45",
    Chipset: "MediaTek Helio G96",
    RAM_capacit: "8 GB",
    internal_storage: "256 GB",
    Pin: "5000 mAh",
    SIM_card: "2 SIM (Nano-SIM)",
    OS: "Android 13",
    screen_resolution: "1080 x 2400 pixels (FullHD+)",
    screen_features:
      "Tần số quét 90Hz, Độ sáng: tối đa 700 nit (typ), 1000 nits cực đại (typ), Kính Corning Gorilla Glass 3 Chế độ Sunlight, Chế độ đọc sách 3.0",
  },
  {
    productId: 0,
    img: "https://cdn2.cellphones.com.vn/insecure/rs:fill:358:358/q:80/plain/https://cellphones.com.vn/media/catalog/product/x/i/xiaomi-13-lite.png",
    title: " Xiaomi 13 Lite ",
    brand: "XIAOMI",
    price_show: "9490000",
    price_origin: "11490000",
    screen_size: "6.55 inches",
    screen_technology: "AMOLED",
    rear_camera:
      "Camera chính: 50 MP, f/1.8, PDAF Camera góc siêu rộng: 8 MP, f/2.2, 119˚ Camera macro: 2 MP, f/2.4",
    front_camera:
      "Camera góc siêu rộng: 32 MP, f/2.4 Camera cảm chân dung: 8 MP",
    Chipset: "Chip Snapdragon 7 Gen 1 (4 nm)",
    RAM_capacit: "8 GB",
    internal_storage: "256 GB",
    Pin: "4500 mAh",
    SIM_card: "2 SIM (Nano-SIM)",
    OS: "Android 12, MIUI 14",
    screen_resolution: "1080 x 2400 pixels (FullHD+)",
    screen_features:
      "68 triệu màu, Dolby Vision, HDR10+, 120Hz, 500 nits, Corning Gorilla Glass 5",
  },
  {
    productId: 0,
    img: "https://cdn2.cellphones.com.vn/insecure/rs:fill:358:358/q:80/plain/https://cellphones.com.vn/media/catalog/product/x/i/xiaomi-mi-12t.png",
    title: " Xiaomi 12T 8GB 128GB ",
    brand: "XIAOMI",
    price_show: "8990000",
    price_origin: "12490000",
    screen_size: "6.67 inches",
    screen_technology: "AMOLED",
    rear_camera: "108MP + 8MP + 2MP",
    front_camera: "20MP",
    Chipset: "MediaTek Dimensity 8100 Ultra",
    RAM_capacit: "8 GB",
    internal_storage: "128 GB",
    Pin: "5000mAh",
    SIM_card: "2 SIM (Nano-SIM)",
    OS: "Android 12, MIUI 13",
    screen_resolution: "1220 x 2712 pixels",
    screen_features: "1 tỉ màu, 120Hz, Dolby Vision, HDR10+",
  },
  {
    productId: 0,
    img: "https://cdn2.cellphones.com.vn/insecure/rs:fill:358:358/q:80/plain/https://cellphones.com.vn/media/catalog/product/1/1/11-pro-plus-blue-qoc-quy.jpg",
    title: " Xiaomi Redmi Note 11 Pro Plus 5G  ",
    brand: "XIAOMI",
    price_show: "6790000",
    price_origin: "9990000",
    screen_size: "6.67 inches",
    screen_technology: "AMOLED",
    rear_camera:
      "Camera góc rộng: 108 MP, f/1.8, PDAF Camera góc siêu rộng: 8 MP, f/2,2, FOV 120° Camera macro: 2 MP, f/2.4",
    front_camera: "16 MP",
    Chipset: "MediaTek Dimensity 920 5G (6 nm)",
    RAM_capacit: "8 GB",
    internal_storage: "256 GB",
    Pin: "Li-Po 4500 mAh",
    SIM_card: "2 SIM (Nano-SIM)",
    OS: "Android 11, MIUI 12.5",
    screen_resolution: "1080 x 2400 pixels (FullHD+)",
    screen_features:
      "Tần số quét 120 Hz, Corning Gorilla Glass 5, HDR10, 700 nits, 1200 nits (peak)",
  },
  {
    productId: 0,
    img: "https://cdn2.cellphones.com.vn/insecure/rs:fill:358:358/q:80/plain/https://cellphones.com.vn/media/catalog/product/p/o/poco-x5-256gb_1.png",
    title: " Xiaomi POCO X5 5G 8GB 256GB ",
    brand: "XIAOMI",
    price_show: "6250000",
    price_origin: "7490000",
    screen_size: "6.67 inches",
    screen_technology: "AMOLED",
    rear_camera:
      "Camera góc rộng: 48MP, f/1.8, PDAF Camera góc siêu rộng: 8MP, f/2.2, 118˚ Camera macro: 2MP, f/2.4",
    front_camera: "Camera góc rộng: 13MP, f/2.5",
    Chipset: "Snapdragon 695 5G (6 nm)",
    RAM_capacit: "8 GB",
    internal_storage: "256 GB",
    Pin: "5000 mAh",
    SIM_card: "Nano-SIM",
    OS: "MIUI 13 (Android 12)",
    screen_resolution: "1080 x 2400 pixels (FullHD+)",
    screen_features:
      "Tần số quét 120 Hz Độ sáng: 700 nit (HBM), 1200 nit (cao nhất) Corning Gorilla Glass 3 Gam màu rộng DCI-P3395 ppi Màn hình Sunlight Chế độ đọc 3.0",
  },
  {
    productId: 0,
    img: "https://cdn2.cellphones.com.vn/insecure/rs:fill:358:358/q:80/plain/https://cellphones.com.vn/media/catalog/product/r/e/reno10_5g_-_combo_product_-_blue.png",
    title: " OPPO Reno10 5G 8GB 256GB ",
    brand: "OPPO",
    price_show: "10490000",
    price_origin: "10990000",
    screen_size: "6.7 inches",
    screen_technology: "AMOLED",
    rear_camera:
      "Camera góc rộng: 64MP; f/1.7, PDAF<br> Chụp Telephoto chân dung: 32 MP, f/2.0<br> Camera góc siêu rộng: 8 MP, f/2.2, Zoom quang lai 2X× và Xoom kỹ thuật số 20X",
    front_camera: "Camera góc rộng: 32 MP, f/2.4",
    Chipset: "MediaTek Dimensity 7050",
    RAM_capacit: "8 GB",
    internal_storage: "256 GB",
    Pin: "5000 mAh",
    SIM_card: "2 SIM (Nano-SIM)",
    OS: "Android 13",
    screen_resolution: "1080 x 2412 pixels",
    screen_features:
      "1.07 tỷ màu, tần số quét 120Hz, HDR10+, tỷ lệ hiển thị 93%, 950 nits , viền cong 3D",
  },
  {
    productId: 0,
    img: "https://cdn2.cellphones.com.vn/insecure/rs:fill:358:358/q:80/plain/https://cellphones.com.vn/media/catalog/product/o/p/oppo-find-n2-flip.png",
    title: " OPPO Find N2 Flip ",
    brand: "OPPO",
    price_show: "18490000",
    price_origin: "19990000",
    screen_size: "6.8 inches",
    screen_technology: "AMOLED",
    rear_camera:
      "Camera góc rộng: 50MP, f/1.8, 23mm, PDAF <br> Camera góc siêu rộng 8MP, f/2.2, 112˚",
    front_camera: "Camera góc rộng: 32MP, f/2.4, 22mm, AF",
    Chipset: "MediaTek 9000+ (4nm)",
    RAM_capacit: "8 GB",
    internal_storage: "256 GB",
    Pin: "4300 mAh",
    SIM_card: "2 SIM (Nano-SIM)",
    OS: "Android 13",
    screen_resolution: "1080 x 2520 pixels",
    screen_features:
      "Có thể gập lại <br>  Màn hình chính: FHD+ (2520×1080), 120Hz, 16,7 triệu màu, 403 PPI, 1200nit, AMOLED,  Kính siêu mỏng UTG<br>Màn hình phụ: 720×382, 30/60Hz, 250 PPI, 800nit, Corning Gorilla Glass 5",
  },
  {
    productId: 0,
    img: "https://cdn2.cellphones.com.vn/insecure/rs:fill:358:358/q:80/plain/https://cellphones.com.vn/media/catalog/product/o/p/oppo-reno-8-5g.png",
    title: " OPPO Reno8 5G (8GB 256GB) ",
    brand: "OPPO",
    price_show: "11990000",
    price_origin: "13990000",
    screen_size: "6.4 inches",
    screen_technology: "AMOLED",
    rear_camera:
      "Camera chính: 50 MP, f/1.8 <br> Camera phụ: 8 MP f/2.4 <br> Camera Marco: 2 MP f/2.2",
    front_camera: " 32 MP, f/2.4",
    Chipset: "MediaTek Dimensity 1300 8 nhân",
    RAM_capacit: "8 GB",
    internal_storage: "256 GB",
    Pin: "Li-Po 4500 mAh",
    SIM_card: "2 SIM (Nano-SIM)",
    OS: "Android 12",
    screen_resolution: "1080 x 2400 pixels (FullHD+)</a>",
    screen_features: "Kính cường lực Corning Gorilla Glass 5",
  },
  {
    productId: 0,
    img: "https://cdn2.cellphones.com.vn/insecure/rs:fill:358:358/q:80/plain/https://cellphones.com.vn/media/catalog/product/o/p/oppo-reno-8t-4g-256gb.png",
    title: " OPPO Reno8 T 4G 256GB ",
    brand: "OPPO",
    price_show: "7190000",
    price_origin: "8490000",
    screen_size: "6.4 inches",
    screen_technology: "AMOLED",
    rear_camera: "100MP (Chính) + 2MP (Kính hiển vi) + 2MP (Mono)",
    front_camera: "32MP",
    Chipset: "Helio G99, tối đa 2.2GHz",
    RAM_capacit: "8 GB",
    internal_storage: "256 GB",
    Pin: "5000mAh (Typ)",
    SIM_card: "2 SIM (Nano-SIM)",
    OS: "ColorOS 13, nền tảng Android 13",
    screen_resolution: "080 x 2400 pixels (FullHD+)",
    screen_features: "16 triệu màu, 90Hz, Kính cường lực GG5",
  },
  {
    productId: 0,
    img: "https://cdn2.cellphones.com.vn/insecure/rs:fill:358:358/q:80/plain/https://cellphones.com.vn/media/catalog/product/o/p/oppo-a58_1_1.png",
    title: " OPPO A58 4G 6GB 128GB ",
    brand: "OPPO",
    price_show: "4990000",
    price_origin: "",
    screen_size: "6.72 inches",
    screen_technology: "IPS LCD",
    rear_camera: "50 MP,F/1.8 (chính) + 2 MP, F/2.4 (Xóa phông)",
    front_camera: "8 MP, F/2.0",
    Chipset: "Helio G85, tối đa 2.0GHz",
    RAM_capacit: "6 GB",
    internal_storage: "128 GB",
    Pin: "5000mAh (Typ)",
    SIM_card: "2 SIM (Nano-SIM)",
    OS: "ColorOS 13.1, nền tảng Android 13",
    screen_resolution: "1080 x 2400 pixels (FullHD+)</a>",
    screen_features: "16 triệu màu, Kính cường lực Panda",
  },
  {
    productId: 0,
    img: "https://cdn2.cellphones.com.vn/insecure/rs:fill:358:358/q:80/plain/https://cellphones.com.vn/media/catalog/product/f/i/find-n3-flip-vang_1.png",
    title: " OPPO Find N3 Flip 12GB 256GB ",
    brand: "OPPO",
    price_show: "22990000",
    price_origin: "",
    screen_size: "6.8 inches",
    screen_technology: "AMOLED",
    rear_camera:
      "Camera chính: 50 MP, f/1.8, OIS <br> Camera góc rộng: 48 MP,  f/2.2<br> Tele: 32 MP,  f/2.0",
    front_camera: "32 MP, f/2.4, FOV 90°, ống kính 5P; Hỗ trợ AF",
    Chipset: "MediaTek Dimensity 9200",
    RAM_capacit: "12 GB",
    internal_storage: "256 GB",
    Pin: "Li-Po 4300 mAh",
    SIM_card: "2 SIM (Nano-SIM)",
    OS: "Android 13",
    screen_resolution: "1080 x 2520 pixels",
    screen_features:
      "Màn hình chính: 6.8 inch, FHD+ (1080 x 2520 Pixels), tần số quét 120 Hz, 1.07 tỷ màu,1600 nits, Kính siêu mỏng Schott UTG<br> Màn hình phụ: 3.26 inch, AMOLED, 720 × 382 pixels, 16.7 triệu màu, độ sáng 900 nits, Kính cường lực GG7",
  },
  {
    productId: 0,
    img: "https://cdn2.cellphones.com.vn/insecure/rs:fill:358:358/q:80/plain/https://cellphones.com.vn/media/catalog/product/f/i/find_n3_-_combo_product_-_gold.png",
    title: " OPPO Find N3 16GB 512GB ",
    brand: "OPPO",
    price_show: "44990000",
    price_origin: "",
    screen_size: "7.82 inches",
    screen_technology: "OLED",
    rear_camera:
      "Camera chính: 48MP, f/1.7, OIS<br>Camera góc rộng: 48MP, f/2.2<br>Camera Tele: 64MP, f/2.6",
    front_camera: "Màn hình chính: 20MP, f/2.2 <br>Màn hình ngoài: 32MP, f/2.4",
    Chipset: "Snapdragon 8 Gen 2 8 nhân",
    RAM_capacit: "16 GB",
    internal_storage: "512 GB",
    Pin: "4805 mAh",
    SIM_card: "Nano-SIM + eSIM",
    OS: "Android 13",
    screen_resolution: "2268 x 2440 pixels ",
    screen_features:
      "Màn hình chính: 7.82 inches, 2K+ (2268 x 2440 Pixels), OLED, 120Hz, 2800 nit, 1 tỷ màu, Kính UTG<br>Màn hình phụ: 6.31 inches, FHD+ (1116 x 2484 Pixels), 120Hz, Kính siêu mỏng Nanocrystal",
  },
  {
    productId: 0,
    img: "https://cdn2.cellphones.com.vn/insecure/rs:fill:358:358/q:80/plain/https://cellphones.com.vn/media/catalog/product/o/p/oppo-a18.png",
    title: " OPPO A18 4GB 128GB ",
    brand: "OPPO",
    price_show: "3990000",
    price_origin: "",
    screen_size: "6.56 inches",
    screen_technology: "IPS LCD ",
    rear_camera: "Camera chính: 8 MP,  f/2.0<br>Camera xóa phông: 2 MP,  f/2.4",
    front_camera: "5 MP, f/2.2",
    Chipset: "MediaTek Helio G85 8 nhân",
    RAM_capacit: "4 GB",
    internal_storage: "128 GB",
    Pin: "5000mAh",
    SIM_card: "2 SIM (Nano-SIM)",
    OS: "Android 13",
    screen_resolution: "720 x 1612 (HD+)",
    screen_features:
      "Tần số quét 90Hz, 16 triệu màu, Kính cường lực Panda, 720 nits, ",
  },
  {
    productId: 0,
    img: "https://cdn2.cellphones.com.vn/insecure/rs:fill:358:358/q:80/plain/https://cellphones.com.vn/media/catalog/product/o/p/oppo-a55_1_.png",
    title: " OPPO A77s ",
    brand: "OPPO",
    price_show: "4790000",
    price_origin: "",
    screen_size: "6.56 inches",
    screen_technology: "IPS LCD",
    rear_camera:
      "Camera góc rộng: 50 MP, f/1.8, PDAF <br>Camera chân dung: 2 MP, f/2.4",
    front_camera: "8 MP, f/2.0",
    Chipset: "Snapdragon 680 4G",
    RAM_capacit: "8 GB",
    internal_storage: "128 GB",
    Pin: "5,000mAh",
    SIM_card: "2 SIM (Nano-SIM)",
    OS: " Android 12",
    screen_resolution: "720 x 1612 (HD+)",
    screen_features: "90Hz, 480 nits (typ)",
  },
  {
    productId: 0,
    img: "https://cdn2.cellphones.com.vn/insecure/rs:fill:358:358/q:80/plain/https://cellphones.com.vn/media/catalog/product/c/o/combo_product_-_black_-_reno7_4g.png",
    title: " OPPO Reno7 4G (8GB - 128GB) ",
    brand: "OPPO",
    price_show: "6000000",
    price_origin: "7990000",
    screen_size: "6.43 inches",
    screen_technology: "AMOLED",
    rear_camera:
      "Camera chính: 64MP, f/1.7; FOV 79°; ống kính 6P; AF<br>Microscope: 2MP, f/3.3<br>Đơn sắc: 2MP, f/2.4",
    front_camera: "32MP, f/2.4; FOV 85°",
    Chipset: "Snapdragon™ 680",
    RAM_capacit: "8 GB",
    internal_storage: "128 GB",
    Pin: "4500 mAh",
    SIM_card: "2 SIM (Nano-SIM)",
    OS: "Android 11, ColorOS 12",
    screen_resolution: "1080 x 2400 pixels (FullHD+)",
    screen_features: "16,7 triệu màu, 409PPI, 90Hz",
  },
  {
    productId: 0,
    img: "https://cdn2.cellphones.com.vn/insecure/rs:fill:358:358/q:80/plain/https://cellphones.com.vn/media/catalog/product/o/p/oppo-reno-7_1.png",
    title: " OPPO Reno7 5G (8GB 256GB) ",
    brand: "OPPO",
    price_show: "7590000",
    price_origin: "12990000",
    screen_size: "6.43 inches",
    screen_technology: "AMOLED",
    rear_camera:
      "Camera chính: 64 MP, f/1.7, PDAF <br> Camera góc siêu rộng: 8 MP, f/2.25, 120˚ <br> Camera macro: 2 MP, f/2.4",
    front_camera: "32MP f/2.4",
    Chipset: "MediaTek Dimensity 900",
    RAM_capacit: "8 GB",
    internal_storage: "256 GB",
    Pin: "Li-Po 4500 mAh",
    SIM_card: "2 SIM (Nano-SIM)",
    OS: "Android 11, ColorOS 12",
    screen_resolution: "1080 x 2400 pixels (FullHD+)",
    screen_features:
      "90Hz, 430 nits (typ), 600 nits (HDR), Corning Gorilla Glass 5, HDR10+, 16.7 triệu màu",
  },
  {
    productId: 0,
    img: "https://cdn2.cellphones.com.vn/insecure/rs:fill:358:358/q:80/plain/https://cellphones.com.vn/media/catalog/product/o/p/oppo-reno7-pro_1.png",
    title: " OPPO Reno 7 Pro ",
    brand: "OPPO",
    price_show: "11190000",
    price_origin: "18990000",
    screen_size: "6.5 inches",
    screen_technology: "AMOLED",
    rear_camera:
      "Camera góc rộng: 50MP (IMX766) <br> Camera góc siêu rộng: 8MP (IMX355) <br> Camera macro: 2MP (OmniVision OV02B10)",
    front_camera: "32 MP, f/2.4",
    Chipset: "MediaTek Dimensity 1200 Max 8 nhân",
    RAM_capacit: "12 GB",
    internal_storage: "256 GB",
    Pin: "4500 mAh",
    SIM_card: "2 SIM (Nano-SIM)",
    OS: "Android 11, ColorOS 12",
    screen_resolution: "1080 x 2400 pixels (FullHD+)",
    screen_features:
      "Tần số quét 90 Hz, Độ sáng tối đa: 920 nits, Kính cường lực Corning Gorilla Glass 5",
  },
];
if (localStorage.getItem("json-products") == null) {
  let productId_start = 100000;
  for (let i = 0; i < products.length; i++)
    products[i].productId = productId_start + i + 1;
  products.reverse();
  let json_products = JSON.stringify(products);
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
<div class="product-box" onclick="showProductInfo(${item.productId})">
  <div class="product-img">
    <img
      src="${item.img}"  alt="lỗi ảnh"
    />
  </div>
  <div class="product-info">
    <h3 class="product-title">${item.title}</h3>
    <div class="product-price">
      <p class="product-price-show">${price_format(item.price_show)}</p>
      <p class="product-price-origin">${price_format(item.price_origin)}</p>
    </div>
    <a href="chitietsanpham.html" class="product-btn">Chi tiết</a>
  </div>
</div>
</div>`;
}
showProductMainPage();
function showProductMainPage() {
  products = JSON.parse(localStorage.getItem("json-products"));
  document.querySelector(".all-products").innerHTML = "";
  for (let i = 0; i < products.length; i++)
    document.querySelector(".all-products").innerHTML += show(products[i]);
}
function showProductInfo(id_product) {
  let products = JSON.parse(localStorage.getItem("json-products"));
  for (let i = 0; i < products.length; i++) {
    if (products[i].productId == id_product) {
      localStorage.setItem("ProductInfo", JSON.stringify(products[i]));
    }
  }
  location.href = "chitietsanpham.html";
}
