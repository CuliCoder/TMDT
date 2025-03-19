import axiosInstance from "./configAxios.js";

const getProducts = async () => {
  try {
    const response = await axiosInstance.get("/product/products");
    return response.data;
  } catch (error) {
    console.error(error);
  }
};
const deleteProduct = async (productId) => {
  try {
    const confirmDelete = confirm("Muốn xóa sản phẩm ID: " + productId + "?");
    if (!confirmDelete) return;
    const response = await axiosInstance.delete(
      `/product/delete_product/${productId}`
    );
    alert(response.data.message);
    renderProducts();
  } catch (error) {
    console.error(error);
  }
}
const renderProducts = async () => {
  const products = await getProducts();
  console.log(products);
  let productsContainer = document.getElementById("product-list");
  productsContainer.innerHTML = "";
  products.forEach((product) => {
    const productElement = `<tr class="tm-product" data-id="${product.ProductID}">
                    <th scope="row" class="w-25"><img
                      src="http://localhost:3000${product.product_image}"
                      alt=""
                      class="img-fluid w-50"
                    /></th>
                    <td>${product.ProductID}</td>
                    <td class="tm-product-name">${product.ProductName}</td>
                    <td class="truncate">${product.Description}</td>
                    <td>${product.CategoryName}</td>
                    <td>
                      <a href="edit_product.html?ProductID=${product.ProductID}" class="tm-product-delete-link">
                        <i class="far fa-edit"></i>
                      </a>
                      <a href="#" class="btn-delete tm-product-delete-link">
                        <i class="far fa-trash-alt tm-product-delete-icon"></i>
                      </a>
                    </td>
                  </tr>`;
    productsContainer.innerHTML += productElement;
  });

  document.querySelectorAll(".tm-product").forEach((element) => {
    element.addEventListener("click", (e) => {
      if (e.target.closest("a")) return;
      const productId = element.getAttribute("data-id");
      console.log(productId);
      window.location.href = `variations_page.html?ProductID=${productId}`;
    });
  });
  document.querySelectorAll(".btn-delete").forEach((element) => {
    element.addEventListener("click", (e) => {
      e.preventDefault();
      const productId = element.closest(".tm-product").getAttribute("data-id");
      deleteProduct(productId);
    });
  });
};

renderProducts();
