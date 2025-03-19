import axiosInstance from "./configAxios.js";
const product_id = new URL(window.location.href).searchParams.get("ProductID");
const loadCategories = async () => {
  try {
    const response = await axiosInstance.get(`/product/categories`);
    const categorySelect = document.getElementById("categorySelect");
    for (let i = 0; i < response.data.data.length; i++) {
      const option = document.createElement("option");
      option.value = response.data.data[i].CategoryID;
      option.text = response.data.data[i].CategoryName;
      categorySelect.appendChild(option);
      if(response.data.data[i].CategoryID == product.category_id){
        option.selected = true;
      }
    }
  } catch (error) {
    console.error(error);
    return null;
  }
};
const get_info_product = async () => {
    try{
        const response = await axiosInstance.get(`/product/get_product_by_productID/${product_id}`);
        return response.data;
    }
    catch(error){
        console.error(error);
        return null;
    }
}
const product = await get_info_product();
document.getElementById("nameProduct").value = product.ProductName;
document.getElementById("description").value = product.Description;
document.getElementById("imagePreview").src = `http://localhost:3000${product.product_image}`;
document.getElementById("imagePreview").style.display = "block";
loadCategories();

window.submitProduct = async function () {
  const file = document.getElementById("productImage").files[0];
  let formData = new FormData();
  formData.append("product_id", product_id);
  formData.append("nameProduct", document.getElementById("nameProduct").value);
  formData.append("description", document.getElementById("description").value);
  formData.append(
    "categoryID",
    document.getElementById("categorySelect").value
  );
  formData.append("image", file);
  try {
    const response = await axiosInstance.put(
      "/product/update_product",
      formData,
      {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      }
    );
    alert(response.data.message);
  } catch (error) {
    alert(error.response.data.message);
  }
};
window.previewImage = function () {
  const file = document.getElementById("productImage").files[0];
  const preview = document.getElementById("imagePreview");
  if (file) {
    const reader = new FileReader();
    reader.onload = (e) => {
      preview.src = e.target.result;
      preview.style.display = "block";
    };
    reader.readAsDataURL(file);
  } else {
    preview.style.display = "none";
  }
};
