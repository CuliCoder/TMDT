//go back
function back() {
  history.go(-1);
}
//select all or deselect all
function selectAll() {
  let checkbox = document.querySelectorAll("input[type='checkbox']");
  if (document.querySelector("#myCheckbox").checked) {
    document.querySelector(".select label").innerHTML = "Bỏ chọn tất cả";
    for (let i = 0; i < checkbox.length; i++) {
      checkbox[i].checked = true;
    }
  } else {
    document.querySelector(".select label").innerHTML = "Chọn tất cả";
    for (let i = 0; i < checkbox.length; i++) {
      checkbox[i].checked = false;
    }
  }
  sentence_at_begin(); //hidden or show "Xóa tất cả sản phẩm đã chọn"
  total_price_bill(); //update total price
}
function sentence_at_begin() {
  let checkbox = document.querySelectorAll("input[type='checkbox']");
  for (let i = 0; i < checkbox.length; i++) {
    if (!checkbox[i].checked) {
      document.querySelector(".select p").style.visibility = "hidden";
    } else {
      document.querySelector(".select p").style.visibility = "visible";
      break;
    }
  }
}
//change quantity
function change_quantity(num, index) {
  let userLogin = JSON.parse(localStorage.getItem("userLogin"));
  if (userLogin.cart[index].quantity + num >= 1) {
    userLogin.cart[index].quantity = userLogin.cart[index].quantity + num;
    userLogin.cart[index].total_price =
      userLogin.cart[index].quantity * userLogin.cart[index].price_show;
    localStorage.setItem("userLogin", JSON.stringify(userLogin));
    updateUsers();
  }
  document.querySelectorAll(".addproduct input")[index].value =
    userLogin.cart[index].quantity;
  total_price_bill(); //update total price
}
let total_price;
function total_price_bill() {
  total_price = 0;
  let count = 0;
  let userLogin = JSON.parse(localStorage.getItem("userLogin"));
  let listItemSelect = document.querySelectorAll(".boxproduct >input");
  for (let i = 0; i < listItemSelect.length; i++) {
    if (listItemSelect[i].checked) {
      total_price += userLogin.cart[i].total_price;
      count += userLogin.cart[i].quantity;
    }
  }
  document.querySelector(".sotienthanhtoan p:nth-child(2)").innerHTML =
    price_format("" + total_price);
  if (count > 0) {
    document.querySelector(".muangay").classList.add("muangay-active");
    document.querySelector(".muangay").innerHTML = "Mua ngay (" + count + ")";
  } else {
    document.querySelector(".muangay").classList.remove("muangay-active");
    document.querySelector(".muangay").innerHTML = "Mua ngay";
  }
  sentence_at_begin(); //hidden or show "Xóa tất cả sản phẩm đã chọn"
}
//btn "mua ngay"
function btn_pay_now() {
  if (
    document.querySelector(".muangay").classList.contains("muangay-active") ==
    false
  ) {
    alert("Vui lòng chọn sản phẩm muốn mua");
  } else {
    let userLogin = JSON.parse(localStorage.getItem("userLogin"));
    let listItemSelect = document.querySelectorAll(".boxproduct >input");
    let products = [];
    for (let i = 0; i < listItemSelect.length; i++) {
      if (listItemSelect[i].checked) {
        products.push(userLogin.cart[i]);
      }
    }
    let orderId = userLogin.user + "0" + (userLogin.order.length + 1);
    let d = new Date();
    let date = d.toISOString();
    let status = "Đang chờ xử lý";
    let order_new = {
      orderId: orderId,
      products: products,
      date_purchase: date,
      status: status,
      total_price: total_price,
    };
    userLogin.order.unshift(order_new);
    localStorage.setItem("userLogin", JSON.stringify(userLogin));
    updateUsers();
    alert("Đặt hàng thành công!!");
  }
}
showCart();
//show all cart
function showCart() {
  let userLogin = JSON.parse(localStorage.getItem("userLogin"));
  if (userLogin.cart.length == 0) {
    document.querySelector(".boxgiohang").innerHTML = `<div class="hdtop">
    <i class="fa-solid fa-arrow-left" onclick="back()"></i>
    <p>Giỏ hàng của bạn</p>
  </div><p>Giỏ hàng của bạn đang trống<p>`;
    document.querySelector(".pay").style.visibility = "hidden";
  } else {
    document.querySelector(".boxgiohang").innerHTML = `<div class="hdtop">
  <i class="fa-solid fa-arrow-left" onclick="back()"></i>
  <p>Giỏ hàng của bạn</p>
</div>
<div class="hdbt">Giỏ hàng</div>
<div class="select">
  <input
    type="checkbox"
    id="myCheckbox"
    name="myCheckbox"
    onchange="selectAll()"
  />
  <label for="myCheckbox">Chọn tất cả</label>
  <p onclick="delete_array_product_cart()">Xoá tất cả sản phẩm đã chọn</p>
</div>`;
    for (let i = 0; i < userLogin.cart.length; i++) {
      document.querySelector(
        ".boxgiohang"
      ).innerHTML += `<div class="boxproduct">
    <input type="checkbox" onchange="total_price_bill()"/>
    <img
      src="${userLogin.cart[i].img}"
    />
    <div class="infor">
      <p>${userLogin.cart[i].name}-${userLogin.cart[i].color}</p>
      <p>${price_format(userLogin.cart[i].price_show)} <s>${price_format(
        userLogin.cart[i].price_origin
      )}</s></p>
    </div>
    <div class="thaotac">
      <div class="trash" onclick="delete_product_cart(${i})"><i class="fa-regular fa-trash-can"></i></div>
      <div class="addproduct">
        <i class="fa-solid fa-minus" onclick="change_quantity(-1,${i})"></i>
        <input type="text" value="${userLogin.cart[i].quantity}" readonly />
        <i class="fa-solid fa-plus" onclick="change_quantity(1,${i})"></i>
      </div>
    </div>
  </div>`;
    }
    document.querySelector(".muangay").setAttribute("onclick", "btn_pay_now()");
    //check box for newly added product
    if (JSON.parse(localStorage.getItem("newly-added-product")) != null)
      newly_added_product();
    total_price_bill();
  }
}
function newly_added_product() {
  let product = JSON.parse(localStorage.getItem("newly-added-product"));
  let userLogin = JSON.parse(localStorage.getItem("userLogin"));
  if (userLogin.cart.length == 1) {
    document.querySelector("#myCheckbox").checked = true;
    selectAll();
  } else {
    for (let i = 0; i < userLogin.cart.length; i++) {
      if (
        product.productId == userLogin.cart[i].productId &&
        product.color == userLogin.cart[i].color
      ) {
        document.querySelectorAll(".boxproduct >input")[i].checked = true;
      }
    }
  }
  localStorage.removeItem("newly-added-product");
}

//delete
function delete_array_product_cart() {
  let listCheckBox = document.querySelectorAll(".boxproduct >input");
  let userLogin = JSON.parse(localStorage.getItem("userLogin"));
  let arraySelected = [];
  for (let i = 0; i < listCheckBox.length; i++) {
    if (listCheckBox[i].checked) {
      let selected = {
        productId: userLogin.cart[i].productId,
        color: userLogin.cart[i].color,
      };
      arraySelected.push(selected);
    }
  }
  for (let i = 0; i < arraySelected.length; i++) {
    let j = 0;
    console.log(arraySelected[i]);
    while (j < userLogin.cart.length) {
      if (
        arraySelected[i].productId == userLogin.cart[j].productId &&
        arraySelected[i].color == userLogin.cart[j].color
      ) {
        userLogin.cart.splice(j, 1);
        break;
      } else j++;
    }
  }
  localStorage.setItem("userLogin", JSON.stringify(userLogin));
  updateUsers();
  showCart();
}
function delete_product_cart(index) {
  let userLogin = JSON.parse(localStorage.getItem("userLogin"));
  userLogin.cart.splice(index, 1);
  localStorage.setItem("userLogin", JSON.stringify(userLogin));
  updateUsers();
  showCart();
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
