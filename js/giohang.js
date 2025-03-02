import axiosInstance from "./configAxios.js";
//trở về trang trước
window.back = function () {
  history.go(-1);
};
//check ô chọn tất cả hoặc bỏ chọn tất cả
window.selectAll = async function () {
  let checkbox = document.querySelectorAll("input[type='checkbox']");
  if (document.querySelector("#myCheckbox").checked) {
    //nếu ô chọn tất cả được check sẽ thay đổi text thành "Bỏ chọn tất cả"
    document.querySelector(".select label").innerHTML = "Bỏ chọn tất cả";
    for (let i = 0; i < checkbox.length; i++) {
      //check tất cả các ô
      checkbox[i].checked = true;
    }
  } else {
    document.querySelector(".select label").innerHTML = "Chọn tất cả";
    for (let i = 0; i < checkbox.length; i++) {
      //bỏ check tất cả các ô
      checkbox[i].checked = false;
    }
  }
  sentence_at_begin(); //hidden or show "Xóa tất cả sản phẩm đã chọn"
  await total_price_bill(); //update tổng giá
};
//hidden or show "Xóa tất cả sản phẩm đã chọn"
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
//thay đổi số lượng sản phẩm
window.change_quantity = async function (num, productID, index) {
  let userLogin = JSON.parse(localStorage.getItem("userLogin"));
  const res = await axiosInstance.put("/api/updateCart", {
    userID: userLogin.id,
    productID: productID,
    quantity: num,
  });

  // if (userLogin.cart[index].quantity + num >= 1) {
  //   userLogin.cart[index].quantity = userLogin.cart[index].quantity + num;
  //   userLogin.cart[index].total_price =
  //     userLogin.cart[index].quantity * userLogin.cart[index].price_show;
  //   localStorage.setItem("userLogin", JSON.stringify(userLogin)); //up lại lên localStorage
  //   updateUsers(); //cập nhật lại user
  // }
  if (res.data.error === 0) {
    document.querySelectorAll(".addproduct input")[index].value =
      res.data.quantity; //update số hiển thị
    await total_price_bill(); //update tổng giá
  }
};
//tính tổng giá
let total_price;
window.total_price_bill = async function () {
  try {
    total_price = 0;
    let count = 0;
    let userLogin = JSON.parse(localStorage.getItem("userLogin"));
    const res = await axiosInstance.get("/api/getCart?userID=" + userLogin.id);
    const cart = res.data;
    let listItemSelect = document.querySelectorAll(".boxproduct >input");
    for (let i = 0; i < listItemSelect.length; i++) {
      if (listItemSelect[i].checked) {
        console.log(parseFloat(cart[i].Price) * cart[i].Quantity);
        total_price += parseFloat(cart[i].Price) * cart[i].Quantity;
        count += cart[i].Quantity;
      }
    }
    document.querySelector(".sotienthanhtoan p:nth-child(2)").innerHTML =
      price_format("" + total_price + ".00");
    if (count > 0) {
      document.querySelector(".muangay").classList.add("muangay-active");
      document.querySelector(".muangay").innerHTML = "Mua ngay (" + count + ")";
    } else {
      document.querySelector(".muangay").classList.remove("muangay-active");
      document.querySelector(".muangay").innerHTML = "Mua ngay";
    }
    sentence_at_begin(); //hidden or show "Xóa tất cả sản phẩm đã chọn"
  } catch (err) {
    console.log(err);
  }
};
//nút "mua ngay"
window.btn_pay_now = async function() {
  try {
    if (
      document.querySelector(".muangay").classList.contains("muangay-active") ==
      false
    ) {
      alert("Vui lòng chọn sản phẩm muốn mua");
    } else {
      let userLogin = JSON.parse(localStorage.getItem("userLogin"));
      let listItemSelect = document.querySelectorAll(".boxproduct >input");
      const res = await axiosInstance.get("/api/getCart?userID=" + userLogin.id);
      const cart = res.data;
      let order = {
        UserID: userLogin.id,
        TotalAmount : total_price,
        detailOrder: [],
      };
      for (let i = 0; i < listItemSelect.length; i++) {
        if (listItemSelect[i].checked) {
          order.detailOrder.push({
            ProductID: cart[i].ProductID,
            Quantity: cart[i].Quantity,
            Price: cart[i].Price,
          });
        }
      }
      console.log(order);
      await axiosInstance.post("/orders", order);
      alert("Đặt hàng thành công!!");
      delete_array_product_cart();
    }
  } catch (error) {
    
  }
}
//show sản phẩm trong giỏ hàng của người dùng
showCart();
async function showCart() {
  try {
    let userLogin = JSON.parse(localStorage.getItem("userLogin"));
    const res = await axiosInstance.get("/api/getCart?userID=" + userLogin.id);
    const cart = res.data;
    console.log(cart);
    //làm api lấy tên với ảnh, giá của sản phẩm
    if (cart.length == 0) {
      //nếu không có sản phẩm trong giỏ sẽ xuất hiện "Giỏ hàng của bạn đang trống"
      document.querySelector(".boxgiohang").innerHTML = `<div class="hdtop">
    <i class="fa-solid fa-arrow-left" onclick="back()"></i>
    <p>Giỏ hàng của bạn</p>
  </div><p>Giỏ hàng của bạn đang trống<p>`;
      document.querySelector(".pay").style.visibility = "hidden"; //ẩn phần thanh toán
    } else {
      //ngược lại sẽ xuất hiện các thành phần của giỏ hàng
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
      //chạy vòng lặp để show các sản phẩm trong giỏ
      for (let i = 0; i < cart.length; i++) {
        document.querySelector(
          ".boxgiohang"
        ).innerHTML += `<div class="boxproduct">
    <input type="checkbox" onchange="total_price_bill()"/>
    <img
      src="http://localhost:3000${cart[i].ImageURL}.jpg"
    />
    <div class="infor">
      <p>${cart[i].ProductName}</p>
      <p>${price_format(cart[i].Price)} <s>${price_format(
          cart[i].Price
        )}</s></p>
    </div>
    <div class="thaotac">
      <div class="trash" onclick="delete_product_cart(${
        cart[i].ProductID
      })"><i class="fa-regular fa-trash-can"></i></div>
      <div class="addproduct">
        <i class="fa-solid fa-minus" onclick="change_quantity(-1,${
          cart[i].ProductID
        },${i})"></i>
        <input type="text" value="${cart[i].Quantity}" readonly />
        <i class="fa-solid fa-plus" onclick="change_quantity(1,${
          cart[i].ProductID
        },${i})"></i>
      </div>
    </div>
  </div>`;
      }
      document
        .querySelector(".muangay")
        .setAttribute("onclick", "btn_pay_now()");
      //nếu là sản phẩm vừa được thêm vào giỏ sẽ được check box
      if (JSON.parse(localStorage.getItem("newly-added-product")) != null)
        newly_added_product();
      total_price_bill(); //tính tổng tiền các sản phẩm được check
    }
  } catch (error) {
    console.error("Lỗi tải dữ liệu sản phẩm: ", error);
  }
}
//check box cho sản phẩm vừa được thêm vào giỏ
function newly_added_product() {
  let product = JSON.parse(localStorage.getItem("newly-added-product"));
  let userLogin = JSON.parse(localStorage.getItem("userLogin"));
  if (userLogin.cart.length == 1) {
    //nếu chỉ có 1 sản phẩm trong giỏ sẽ check ô chọn tất cả
    document.querySelector("#myCheckbox").checked = true;
    selectAll();
  } else {
    //ngược lại sẽ chỉ check sản phẩm vừa được thêm
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

//xóa nhiều sản phẩm trong giỏ
window.delete_array_product_cart = async function () {
  try {
    let listCheckBox = document.querySelectorAll(".boxproduct >input"); //các ô check box của mỗi sản phẩm
    let userLogin = JSON.parse(localStorage.getItem("userLogin"));
    const res = await axiosInstance.get("/api/getCart?userID=" + userLogin.id);
    const cart = res.data;
    let arraySelected = []; //mảng chứa id,color của mỗi sản phẩm được check box
    for (let i = 0; i < listCheckBox.length; i++) {
      if (listCheckBox[i].checked) {
        let selected = {
          productId: cart[i].ProductID,
          // color:cart[i].color,
        };
        arraySelected.push(selected);
      }
    }
    //xóa sản phẩm nào có id,color trong mảng arraySelected
    let success = 1;
    for (let i = 0; i < arraySelected.length; i++) {
      // let j = 0;
      // while (j < userLogin.cart.length) {
      //   if (
      //     arraySelected[i].productId == userLogin.cart[j].productId &&
      //     arraySelected[i].color == userLogin.cart[j].color
      //   ) {
      //     userLogin.cart.splice(j, 1);
      //     break;
      //   } else j++;
      // }
      console.log(arraySelected[i].productId);
      const res = await axiosInstance.delete(
        `/api/removeFromCart?userID=${userLogin.id}&productID=${arraySelected[i].productId}`
      );
      if (res.data.error !== 0) {
        success = 0;
        break;
      }
    }
    if (success == 1) {
      showCart();
    }
    // localStorage.setItem("userLogin", JSON.stringify(userLogin)); //up lên localStorage
    // updateUsers(); //cập nhật lại user
    // showCart(); //cập nhật hiển thị sản phẩm
  } catch (error) {
    console.log(error);
  }
};
//xóa 1 sản phẩm trong giỏ
window.delete_product_cart = async function (ProductID) {
  try {
    let userLogin = JSON.parse(localStorage.getItem("userLogin"));
    const res = await axiosInstance.delete(
      `/api/removeFromCart?userID=${userLogin.id}&productID=${ProductID}`
    );
    if (res.data.error === 0) {
      showCart();
    }
  } catch (err) {
    console.log(err);
  }
};
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
//cập nhật lại user trong danh sách
// function updateUsers() {
//   let userLogin = JSON.parse(localStorage.getItem("userLogin"));
//   let users = JSON.parse(localStorage.getItem("users"));

//   for (let i = 0; i < users.length; i++) {
//     if (users[i].user == userLogin.user) {
//       users[i] = userLogin;
//       break;
//     }
//   }
//   localStorage.setItem("users", JSON.stringify(users));
// }
