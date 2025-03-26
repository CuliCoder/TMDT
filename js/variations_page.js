import axiosInstance from "./configAxios.js";

const getProductItem = async (id) => {
  try {
    const response = await axiosInstance.get(
      "/product/product_item_by_productID/" + id
    );
    return response.data;
  } catch (error) {
    console.error(error);
  }
};
const delete_product_item = async (productId) => {
  try {
    const confirmDelete = confirm("Muốn xóa biển thể sản phẩm ID: " + productId + "?");
    if (!confirmDelete) return;
    const response = await axiosInstance.delete(
      `/product/delete_product_item/${productId}`
    );
    alert(response.data.message);
    renderProductItems();
  } catch (error) {
    console.error(error);
  }
}
const renderProductItems = async () => {
  const url = new URL(window.location.href);
  const id = url.searchParams.get("ProductID");
  const products = await getProductItem(id);
  let productsContainer = document.getElementById("product-list");
  productsContainer.innerHTML = "";
  products.data.forEach((product) => {
    const productElement = `<tr class="tm-product" data-id="${product.id}">
                    <th scope="row" class="w-25"><img
                      src="http://localhost:3000${product.product_image}"
                      alt=""
                      class="img-fluid w-50"
                    /></th>
                    <td>${product.id}</td>
                    <td>${product.product_id}</td>
                    <td class="tm-product-name">${product.SKU}</td>
                    <td>${product.qty_in_stock}</td>
                    <td class="truncate">${product.description}</td>
                    <td>${parseFloat(product.profit_margin)} %</td>
                    <td>${parseFloat(product.price)}</td>
                    <td>
                      <a href="#" class="btn-delete tm-product-delete-link">
                        <i class="far fa-trash-alt tm-product-delete-icon"></i>
                      </a>
                    </td>
                  </tr>`;
    productsContainer.innerHTML += productElement;
  });

  // Thêm sự kiện click cho tất cả các phần tử có lớp tm-product-name
  document.querySelectorAll(".tm-product").forEach((element) => {
    element.addEventListener("click", (e) => {
      if (e.target.closest("a")) return;
      window.location.href = `edit_variation.html?ProductItemID=${element.getAttribute(
        "data-id"
      )}`;
    });
  });
  document.querySelectorAll(".btn-delete").forEach((element) => {
    element.addEventListener("click", (e) => {
      const productId = element.closest(".tm-product").getAttribute("data-id");
      delete_product_item(productId);
    });
  });

};

renderProductItems();
document.querySelector(".button-add").addEventListener("click", () => {
  window.location.href = `add_variation.html?ProductID=${new URL(
    window.location.href
  ).searchParams.get("ProductID")}`;
});
