import axiosInstance from "./configAxios.js";

//định dạng giá
function price_format(price) {
  if (price == "") return "";
  let price_str = "";
  price = price.slice(0, -3);
  let tmp = price;
  for (let i = price.length; i > 3; i -= 3) {
    price_str = "." + tmp.slice(-3) + price_str;
    tmp = tmp.substr(0, i - 3);
  }
  tmp = tmp.slice(0);
  return tmp + price_str + "₫";
}
// Lấy thông tin chi tiết sản phẩm từ API và hiển thị lên trang
async function showProductInfo() {
  try {
    let urlParams = new URLSearchParams(window.location.search);
    let ProductID = urlParams.get("id"); // Lấy id từ URL

    // Gọi API lấy thông tin sản phẩm theo ID
    let res = await axiosInstance.get(`/products/${ProductID}`);
    let product = res.data.data;

    console.log("📌 Dữ liệu sản phẩm:", product);

    let imageRes = await axiosInstance.get(`/images?ProductID=${ProductID}`);
    let imageData = imageRes.data;

    let imageItem = imageData.find((img) => img.ProductID == ProductID);
    product.imageURL = imageItem
      ? `http://localhost:3000/${imageItem.ImageURL}.jpg`
      : "default-image.jpg";

    // Hiển thị tên sản phẩm
    document.querySelector(".hdchitietsanpham p").innerHTML =
      product.ProductName;

    // Hiển thị thông tin sản phẩm
    document.querySelector(".boxchitiet").innerHTML = `
      <img src="${product.imageURL}" alt="${product.ProductName}"/>
      <div class="inforchitiet">
        <p>Thông số kỹ thuật</p>  
        <table class="tbthongsokithuat">
          <tr class="bgr"><td>Kích thước màn hình</td><td>${product.screen_size}</td></tr>
          <tr><td>Công nghệ màn hình</td><td>${product.screen_technology}</td></tr>
          <tr class="bgr"><td>Camera sau</td><td>${product.rear_camera}</td></tr>
          <tr><td>Camera trước</td><td>${product.front_camera}</td></tr>
          <tr class="bgr"><td>Chipset</td><td>${product.Chipset}</td></tr>
          <tr><td>Dung lượng RAM</td><td>${product.RAM_capacit}</td></tr>
          <tr class="bgr"><td>Bộ nhớ trong</td><td>${product.internal_storage}</td></tr>
          <tr><td>Pin</td><td>${product.pin}</td></tr>
          <tr class="bgr"><td>Thẻ SIM</td><td>${product.SIM_card}</td></tr>
          <tr><td>Hệ điều hành</td><td>${product.OS}</td></tr>
          <tr class="bgr"><td>Độ phân giải màn hình</td><td>${product.screen_resolution}</td></tr>
          <tr><td>Tính năng màn hình</td><td>${product.screen_features}</td></tr>
        </table>
      </div>`;

    // Hiển thị giá
    document.querySelector(".price").innerHTML = `
      <p>${price_format(product.Price)}</p>
      <p>${price_format(product.Price)}</p>`;

    // Gán sự kiện cho nút "Mua ngay" và "Thêm vào giỏ hàng"
    document
      .querySelector(".muangay")
      .setAttribute("onclick", `pay_now(${product.ProductID},1)`);
    document
      .querySelector(".addgiohang")
      .setAttribute("onclick", `pay_now(${product.ProductID},0)`);
  } catch (error) {
    console.error("Lỗi khi tải thông tin sản phẩm:", error);
  }
}

// Gọi hàm khi trang tải xong
showProductInfo();

//thông báo
function showntf(message) {
  let notification = document.querySelector(".notification");
  notification.innerHTML = "";
  let ntf_complete = document.createElement("div");
  ntf_complete.innerHTML = '<i class="bx bx-check"></i>' + message;
  ntf_complete.classList.add("complete");
  notification.appendChild(ntf_complete);
  ntf_complete.style.animation = "showNotification 3s linear";
}
//click nút "mua ngay" or "them vao gio hang"
window.pay_now = async function (id_product, go) {
  console.log(id_product, go);
  if (JSON.parse(localStorage.getItem("userLogin")) == null) {
    //đăng nhập mới được vào thêm vào giỏ hàng
    alert("Vui lòng đăng nhập để mua hàng");
  } else {
    let color = document.querySelector(".color").value;
    let product = JSON.parse(localStorage.getItem("json-products"));
    let userLogin = JSON.parse(localStorage.getItem("userLogin"));
    if (userLogin !== null) {
      //nếu tài khoản hoạt động
      try {
        // let issame = false;
        // const cart = await axiosInstance.get(
        //   `/api/getCart?userID=${userLogin.id}`
        // );
        // for (let i = 0; i < cart.data.length; i++) {
        //   if (
        //     id_product == userLogin.cart[i].productId &&
        //     color == userLogin.cart[i].color
        //   ) {
        //     //nếu sản phẩm có trong giỏ
        //     userLogin.cart[i].quantity = userLogin.cart[i].quantity + 1;
        //     userLogin.cart[i].total_price =
        //       userLogin.cart[i].quantity * userLogin.cart[i].price_show;
        //     let new_cart = userLogin.cart[i];
        //     userLogin.cart.splice(i, 1); //xóa đi sản phẩm đó
        //     userLogin.cart.unshift(new_cart); //cập nhật lại và đẩy lên đầu danh sách
        //     localStorage.setItem("userLogin", JSON.stringify(userLogin)); //up lên localStorage
        //     localStorage.setItem(
        //       "newly-added-product",
        //       JSON.stringify(new_cart)
        //     ); //up lên LocalStorage lưu trữ lại sản phẩm vừa thêm
        //     updateUsers(); //update user
        //     issame = true; //sản phẩm đã có trong giỏ
        //     break;
        //   }
        // }

        //nếu sản phẩm không có trong giỏ

        let quantity = 1;
        const res = await axiosInstance.post("/api/addToCart", {
          userID: userLogin.id,
          productID: id_product,
          quantity,
        });
        // console.log("📌 Thêm vào giỏ hàng:", res.data);

        // let cart = {
        //   productId: product[j].productId,
        //   name: product[j].title,
        //   img: product[j].img,
        //   color: color,
        //   brand: product[j].brand,
        //   price_show: product[j].price_show,
        //   price_origin: product[j].price_origin,
        //   quantity: quantity,
        //   total_price: total_price(quantity, product[j].price_show),
        // };
        // userLogin.cart.unshift(cart);
        // localStorage.setItem("userLogin", JSON.stringify(userLogin));
        // localStorage.setItem("newly-added-product", JSON.stringify(cart));
        // updateUsers();
        if (res.data.error !== 0) return;
        showntf("Thêm vào giỏ hàng thành công"); //in thông báo
        if (go == 1) {
          //nếu ấn vào mua ngay sẽ chuyển qua giỏ hàng
          setTimeout(() => {
            location.href = "giohang.html";
          }, 500);
        }
      } catch (err) {
        console.log(err);
      }
    } else {
      //tài khoản bị khóa
      alert("Tài khoản đã bị khóa không thể mua hàng!");
    }
  }
};
//trả về tổng giá
function total_price(quantity, price) {
  return quantity * price;
}
//cập nhật lại user
function updateUsers() {
  let userLogin = JSON.parse(localStorage.getItem("userLogin"));
  let users = JSON.parse(localStorage.getItem("users"));
  for (let i = 0; i < users.length; i++) {
    if (users[i].user == userLogin.user) {
      users[i] = userLogin;
      break;
    }
  }
  localStorage.setItem("users", JSON.stringify(users));
}
