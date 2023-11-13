createForBrand();
function createForBrand() {
  let listBrand = ["apple", "samsung", "xiaomi", "oppo", "realme"];
  let betweenHeader = document.getElementsByClassName("brand");
  for (let i = 0; i < listBrand.length; i++) {
    betweenHeader[i].innerHTML =
      '<a href="index.html?' +
      listBrand[i] +
      '">' +
      listBrand[i].toUpperCase() +
      "</a>";
  }
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
showProductInfo();
function showProductInfo() {
  let product = JSON.parse(localStorage.getItem("ProductInfo"));
  document.querySelector(".boxchitiet").innerHTML = `<img
  src="${product.img}"
/>
<div class="inforchitiet">
  <p>Thông số kỹ thuật</p>
  <table class="tbthongsokithuat">
    <tr class="bgr">
      <td>Kích thước màn hình</td>
      <td>${product.screen_size}</td>
    </tr>
    <tr>
      <td>Công nghệ màn hình</td>
      <td>${product.screen_technology}</td>
    </tr>
    <tr class="bgr">
      <td>Camera sau</td>
      <td>
      ${product.rear_camera}
      </td>
    </tr>
    <tr>
      <td>Camera trước</td>
      <td>${product.front_camera}</td>
    </tr>
    <tr class="bgr">
      <td>Chipset</td>
      <td>${product.Chipset}</td>
    </tr>
    <tr>
      <td>Dung lượng RAM</td>
      <td>${product.RAM_capacit}</td>
    </tr>
    <tr class="bgr">
      <td>Bộ nhớ trong</td>
      <td>${product.internal_storage}</td>
    </tr>
    <tr>
      <td>Pin</td>
      <td>${product.Pin}</td>
    </tr>
    <tr class="bgr">
      <td>Thẻ SIM</td>
      <td>${product.SIM_card}</td>
    </tr>
    <tr>
      <td>Hệ điều hành</td>
      <td>${product.OS}</td>
    </tr>
    <tr class="bgr">
      <td>Độ phân giải màn hình</td>
      <td>${product.screen_resolution}</td>
    </tr>
    <tr>
      <td>Tính năng màn hình</td>
      <td>
      ${product.screen_features}
      </td>
    </tr>
  </table>`;
  document
    .querySelector(".muangay")
    .setAttribute("onclick", "pay_now(" + product.productId + ",1)");
  document
    .querySelector(".addgiohang")
    .setAttribute("onclick", "pay_now(" + product.productId + ",0)");
  document.querySelector(".price").innerHTML = `<p>${price_format(
    product.price_show
  )}</p>
  <p>${price_format(product.price_origin)}</p>`;
}
function showntf(message) {
  let notification = document.querySelector(".notification");
  notification.innerHTML = "";
  let ntf_complete = document.createElement("div");
  ntf_complete.innerHTML = '<i class="bx bx-check"></i>' + message;
  ntf_complete.classList.add("complete");
  notification.appendChild(ntf_complete);
  ntf_complete.style.animation = "showNotification 3s linear";
}
//click btn "mua ngay" or "them vao gio hang"
function pay_now(id_product, go) {
  if (JSON.parse(localStorage.getItem("userLogin")) == null) {
    alert("Vui lòng đăng nhập để mua hàng");
  } else {
    let color = document.querySelector(".color").value;
    let product = JSON.parse(localStorage.getItem("json-products"));
    let userLogin = JSON.parse(localStorage.getItem("userLogin"));
    if (userLogin.status == "Hoạt động") {
      let issame = false;
      for (let i = 0; i < userLogin.cart.length; i++) {
        if (
          id_product == userLogin.cart[i].productId &&
          color == userLogin.cart[i].color
        ) {
          userLogin.cart[i].quantity = userLogin.cart[i].quantity + 1;
          userLogin.cart[i].total_price =
            userLogin.cart[i].quantity * userLogin.cart[i].price_show;
          let new_cart = userLogin.cart[i];
          userLogin.cart.splice(i, 1);
          userLogin.cart.unshift(new_cart);
          localStorage.setItem("userLogin", JSON.stringify(userLogin));
          localStorage.setItem("newly-added-product", JSON.stringify(new_cart));
          updateUsers();
          issame = true;
          break;
        }
      }
      if (issame == false) {
        for (let j = 0; j < product.length; j++) {
          if (id_product == product[j].productId) {
            let quantity = 1;
            let cart = {
              productId: product[j].productId,
              name: product[j].title,
              img: product[j].img,
              color: color,
              brand: product[j].brand,
              price_show: product[j].price_show,
              price_origin: product[j].price_origin,
              quantity: quantity,
              total_price: total_price(quantity, product[j].price_show),
            };
            userLogin.cart.unshift(cart);
            localStorage.setItem("userLogin", JSON.stringify(userLogin));
            localStorage.setItem("newly-added-product", JSON.stringify(cart));
            updateUsers();
            break;
          }
        }
      }
      showntf("Thêm vào giỏ hàng thành công");
      if (go == 1) {
        setTimeout(() => {
          location.href = "giohang.html";
        }, 500);
      }
    } else {
      alert("Tài khoản đã bị khóa không thể mua hàng!");
    }
  }
}

function total_price(quantity, price) {
  return quantity * price;
}
function updateUsers() {
  let userLogin = JSON.parse(localStorage.getItem("userLogin"));
  let users = JSON.parse(localStorage.getItem("users"));

  for (let i = 0; i < users.length; i++) {
    if (users[i].user == userLogin.user) {
      users[i] = userLogin;
      console.log("run");
      break;
    }
  }
  localStorage.setItem("users", JSON.stringify(users));
}
