import axiosInstance from "./configAxios.js";
document.addEventListener("DOMContentLoaded", async function () {
  const fullnametxt = document.querySelector("#fullname");
  const phonenumbertxt = document.querySelector("#phone");
  const addresstxt = document.querySelector("#address");
  const qrcode = document.querySelector("#qrcode");
  const checkoutBtn = document.querySelector(".checkout-btn");
  const qrModal = document.getElementById("qr-modal");
  const closeQrBtn = document.getElementById("close-qr-btn");
  let userID = localStorage.getItem("Myid");

  const get_address = async (userID) => {
    try {
      const response = await axiosInstance.get(
        `/api/addressCustomer/default/${userID}`
      );
      return response.data;
    } catch (error) {
      console.error("Error fetching address:", error);
    }
  };
  const load_address = async () => {
    if (userID == null) {
      return;
    }
    let address = await get_address(userID);
    if (address == null) {
      return;
    }
    fullnametxt.value = address.name;
    phonenumbertxt.value = address.phonenumber;
    addresstxt.value = address.address;
  };
  await load_address();
  async function removeProductFromCart(productId) {
    try {
      if (confirm("Bạn có chắc muốn xóa sản phẩm này khỏi giỏ hàng?")) {
        const response = await axiosInstance.delete(
          `/cart/${productId}/${userID}`
        );
        window.location.reload();
      }
    } catch (error) {
      console.error("Error removing product from cart:", error);
    }
  }
  async function getProductCart(userID) {
    try {
      const response = await axiosInstance.get("/cart?userID=" + userID);
      return response.data;
    } catch (error) {
      console.error("Error fetching cart products:", error);
    }
  }
  window.removeProductFromCart = removeProductFromCart;
  show_list_cart();
  window.show_list_cart = show_list_cart;
  async function show_list_cart() {
    let data = await getProductCart(userID);
    console.log(data);
    const cartContent = document.querySelector(".cart-items");
    let html = `
            <div class="cart-header">
                <div class="product-col">Sản phẩm</div>
                <div class="price-col">Đơn giá</div>
                <div class="quantity-col">Số lượng</div>
                <div class="total-col">Thành tiền</div>
                <div class="action-col"></div>
            </div>
    `;
    for (let i = 0; i < data.length; i++) {
      let attributes = {
        "Dung lượng RAM": null,
        "Bộ nhớ trong": null,
        Màu: null,
      };
      let res_product_item = await axiosInstance.get(
        `/product/product_item_by_ID/${data[i].id}`
      ); // lấy thông tin sản phẩm
      let priceOriginal = data[i].price; // lấy giá gốc
      let price =
        data[i].DiscountRate != null
          ? data[i].price - (data[i].price * data[i].DiscountRate) / 100
          : data[i].price; // tính giá sau khi giảm
      let total = price * data[i].Quantity; // tính tổng tiền
      let productData = res_product_item.data?.data;

      // Chuyển chuỗi JSON thành mảng
      let attributesData = productData.attributes; // Lấy thuộc tính từ dữ liệu sản phẩm

      if (Array.isArray(attributesData)) {
        attributesData.forEach((attribute) => {
          if (attributes.hasOwnProperty(attribute.variantName)) {
            attributes[attribute.variantName] = attribute.values;
          }
        });
      } else {
        console.warn("Dữ liệu attributes không hợp lệ:", attributesData);
      }
      // res_product_item.data.attributes.forEach((attribute) => {
      //     if (attributes.hasOwnProperty(attribute.variantName)) {
      //       attributes[attribute.variantName] = attribute.values;
      //     }
      //   });
      let {
        "Dung lượng RAM": ram,
        Màu: color,
        "Bộ nhớ trong": gb,
      } = attributes;
      console.log(ram, color, gb);
      html += `
        <div class="cart-item">
                        <div class="product-col">
                            <div class="product-info">
                                <div class="product-image">
                                   <img src="http://localhost:3000${
                                     res_product_item.data.data.product_image
                                   }" alt="Ảnh sản phẩm">
                                </div>
                                <div class="product-details">
                                    <h3>${data[i].ProductName}</h3>
                                    <p class="product-variant">Màu: ${
                                      color ? color : ""
                                    } | Bộ nhớ: ${ram ? ram : ""} - ${
        gb ? gb : ""
      }</p>
                                </div>
                            </div>
                        </div>
                        <div class="price-col">
                            <div class="price">${
                              Number(price).toLocaleString("vi-VN") + "₫"
                            }</div>
                            <div class="original-price">${
                              data[i].DiscountRate != null
                                ? Number(priceOriginal).toLocaleString(
                                    "vi-VN"
                                  ) + "đ"
                                : ""
                            }</div>
                        </div>
                        <div class="quantity-col">
                            <div class="quantity-control">
                                <button class="qty-btn decrease" onclick='tang_giam_Value("giam", event, ${
                                  data[i].id
                                },${price})'><i class="fas fa-minus"></i></button>
                                <input type="number" class="quantity-input" value="${
                                  data[i].Quantity
                                }" min="1" oninput="nhap_so_luong(event, ${
        data[i].id
      })" onchange ="set_Quantity_if_null(event, ${
        data[i].id
      })" onkeydown="return !['e', 'E', '+', '-'].includes(event.key);"/>
                                <button class="qty-btn increase" onclick='tang_giam_Value("tang", event, ${
                                  data[i].id
                                },${price})'><i class="fas fa-plus"></i></button>
                            </div>
                        </div>
                        <div class="total-col">
                            <div class="total-price">${total.toLocaleString(
                              "vi-VN"
                            )}₫</div>
                        </div>
                        <div class="action-col">
                            <button class="remove-btn" onclick="removeProductFromCart(${
                              data[i].id
                            })"><i class="fas fa-trash"></i></button>
                        </div>
                    </div>
        `;
    }
    totalOrder(); // tính tổng tiền
    cartContent.innerHTML = html;
  }
  async function tang_giam_Value(value, event, product_item_ID, price) {
    const quantityInput = event.target
      .closest(".quantity-control")
      .querySelector(".quantity-input");
    // const Prices = quantityInput
    //   .closest(".cart-item")
    //   .querySelector(".price-col")
    //   .querySelector(".price").textContent;
    let qtt = Number(quantityInput.value);
    // lỗi chuyển đổi giá thành số
    // const numericPrice = Number(Prices.replace(/[^0-9]/g, ""));
    if (value === "tang") {
      qtt += 1; // Tăng số lượng
    } else if (value === "giam" && qtt > 1) {
      qtt -= 1; // Giảm số lượng, không cho phép nhỏ hơn 1
    }
    await axiosInstance.put("/cart/", {
      userID: userID,
      product_item_ID: product_item_ID,
      quantity: qtt,
    });
    quantityInput.value = qtt;
    quantityInput
      .closest(".cart-item")
      .querySelector(".total-col")
      .querySelector(".total-price").textContent =
      (qtt * Number(price)).toLocaleString("vi-VN") + "₫";
    totalOrder(); // tính tổng tiền
  }
  window.tang_giam_Value = tang_giam_Value;
  async function totalOrder() {
    let total = 0;
    let data = await getProductCart(userID);
    if (data.length === 0) {
      document.querySelector(".cart-total").textContent = "0₫";
      return;
    }
    for (let i = 0; i < data.length; i++) {
      let price =
        data[i].DiscountRate != null
          ? data[i].price - (data[i].price * data[i].DiscountRate) / 100
          : data[i].price; // tính giá sau khi giảm
      total += price * data[i].Quantity; // tính tổng tiền
    }
    document.querySelector(".cart-total").textContent =
      total.toLocaleString("vi-VN") + "₫";
    return total;
  }
  async function nhap_so_luong(event, product_item_ID) {
    const quantityInput = event.target
      .closest(".quantity-control")
      .querySelector(".quantity-input");
    const Prices = quantityInput
      .closest(".cart-item")
      .querySelector(".price-col")
      .querySelector(".price").textContent;
    const numericPrice = Number(Prices.replace(/[^0-9]/g, ""));
    if (quantityInput.value === "") {
      return; // Không làm gì cả, đợi người dùng nhập tiếp
    }
    await axiosInstance.put("/cart/", {
      userID: userID,
      product_item_ID: product_item_ID,
      quantity: quantityInput.value,
    });
    quantityInput
      .closest(".cart-item")
      .querySelector(".total-col")
      .querySelector(".total-price").textContent =
      (quantityInput.value * Number(numericPrice)).toLocaleString("vi-VN") +
      "₫";
    totalOrder(); // tính tổng tiền
  }
  async function set_Quantity_if_null(event, product_item_ID) {
    const quantityInput = event.target
      .closest(".quantity-control")
      .querySelector(".quantity-input");
    const Prices = quantityInput
      .closest(".cart-item")
      .querySelector(".price-col")
      .querySelector(".price").textContent;
    const numericPrice = Number(Prices.replace(/[^0-9]/g, ""));
    if (quantityInput.value === "") {
      alert("Số lượng không được để trống!");
      quantityInput.value = 1; // Đặt giá trị mặc định là 1 nếu không có giá trị
      quantityInput
        .closest(".cart-item")
        .querySelector(".total-col")
        .querySelector(".total-price").textContent =
        (quantityInput.value * Number(numericPrice)).toLocaleString("vi-VN") +
        "₫";
      await axiosInstance.put("/cart/", {
        userID: userID,
        product_item_ID: product_item_ID,
        quantity: quantityInput.value,
      });
      totalOrder(); // tính tổng tiền
      return; // Không làm gì cả, đợi người dùng nhập tiếp
    }
    return;
  }
  window.set_Quantity_if_null = set_Quantity_if_null;
  window.nhap_so_luong = nhap_so_luong;
  const checkOrderStatus = async (idOrder) => {
    try {
      const response = await axiosInstance.get(`/orders/status/${idOrder}`);
      return response.data;
    } catch (error) {
      console.error("Error checking order status:", error);
    }
  };
  let checkOrderStatusInterval;
  let description;
  checkoutBtn.addEventListener("click", async () => {
    if (userID == null) {
      alert("Vui lòng đăng nhập để thanh toán!");
      return;
    }
    if (!fullnametxt.value || !phonenumbertxt.value || !addresstxt.value) {
      alert("Vui lòng nhập đầy đủ thông tin!");
      return;
    }
    if (phonenumbertxt.value.length < 10 || phonenumbertxt.value.length > 11) {
      alert("Số điện thoại không hợp lệ!");
      return;
    }
    if (isNaN(phonenumbertxt.value)) {
      alert("Số điện thoại không hợp lệ!");
      return;
    }
    const paymentMethod = document.querySelector(
      'input[name="payment"]:checked'
    ).value;
    const placeOrder = await axiosInstance.post(`/cart/placeOrder/${userID}`, {
      address: addresstxt.value,
      name: fullnametxt.value,
      phonenumber: phonenumbertxt.value,
      method: paymentMethod,
    });
    if (placeOrder.data.error == 1) {
      alert(placeOrder.data.message);
      return;
    }
    if (paymentMethod === "bank") {
      const idOrder = placeOrder.data.data.orderID;
      description = `DH${idOrder}`;
      const price = placeOrder.data.data.totalPrice;
      document.querySelector("#bank_des span").textContent = description;
      qrcode.innerHTML = `<img src="https://img.vietqr.io/image/970422-0000623239451-compact2.png?amount=${price}&addInfo=${description}&accountName=NGUYEN CONG TRUNG" alt=""/>`;
      qrModal.style.display = "flex";
      checkOrderStatusInterval = setInterval(async () => {
        const order = await checkOrderStatus(idOrder);
        if (order == null) {
          clearInterval(checkOrderStatus);
          return;
        }
        if (order.payment_status == "Đã thanh toán") {
          clearInterval(checkOrderStatus);
          alert("Thanh toán thành công!");
          qrModal.style.display = "none";
          window.location.reload();
        }
      }, 1000);
    } else {
      alert("Đặt hàng thành công! Thanh toán khi nhận hàng.");
    }
  });

  // Đóng modal mã QR
  closeQrBtn.addEventListener("click", () => {
    qrModal.style.display = "none";
    clearInterval(checkOrderStatusInterval);
    // window.location.reload();
  });
});
