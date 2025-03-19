import axiosInstance from "./configAxios.js";
const loadCategories = async () => {
  try {
    const response = await axiosInstance.get(`/product/categories`);
    const categorySelect = document.getElementById("categorySelect");
    for (let i = 0; i < response.data.data.length; i++) {
      const option = document.createElement("option");
      option.value = response.data.data[i].CategoryID;
      option.text = response.data.data[i].CategoryName;
      categorySelect.appendChild(option);
    }
  } catch (error) {
    console.error(error);
    return null;
  }
};
loadCategories();

window.submitProduct = async function () {
  const file = document.getElementById("productImage").files[0];
  let formData = new FormData();
  formData.append("nameProduct", document.getElementById("nameProduct").value);
  formData.append("description", document.getElementById("description").value);
  formData.append(
    "categoryID",
    document.getElementById("categorySelect").value
  );
  formData.append("image", file);
  try {
    const response = await axiosInstance.post(
      "/product/add_product",
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
