import axiosInstance from "./configAxios.js";
const variants = [];
let attributeSelect = document.getElementById("attributeSelect");
const product_id = new URL(window.location.href).searchParams.get("ProductID");
const loadCategories = async () => {
  try {
    const response = await axiosInstance.get(
      `/product/categoryByProductID/${product_id}`
    );
    return response.data.data.CategoryID;
  } catch (error) {
    console.error(error);
    return null;
  }
};
const loadBrands = async () => {
  try {
    const response = await axiosInstance.get("/product/brands");
    return response.data.data;
  } catch (error) {
    console.error(error);
    return null;
  }
};
const renderBrands = async (brands) => {
  const brandSelect = document.createElement("select");
  brandSelect.className = "form-select";
  brandSelect.id = "attributeValue";
  brandSelect.required = true;
  console.log(brands);
  brands.forEach((brand) => {
    let option = document.createElement("option");
    option.value = brand.name;
    option.text = brand.name;
    brandSelect.appendChild(option);
  });
  document.querySelector(".attributeValue").innerHTML = "";
  document.querySelector(".attributeValue").appendChild(brandSelect);
};
const add_Attribute = async () => {
  try {
    const newAttribute = prompt("Nhập tên thuộc tính mới:");
    document.querySelector(".attributeValue").innerHTML =
      '<input type="text" class="form-control" id="attributeValue" required>';
    if (!newAttribute) return;
    const response = await axiosInstance.post("/product/add_attribute", {
      name: newAttribute,
      categoryID: await loadCategories(),
    });
    alert(response.data.message);
    loadAttributes();
  } catch (error) {
    console.error(error);
  }
};
const loadAttributes = async () => {
  try {
    const id_category = await loadCategories();
    const brands = await loadBrands();
    if (!id_category || !brands) return;
    attributeSelect.innerHTML = "";
    const defaultOption = document.createElement("option");
    defaultOption.value = "";
    defaultOption.text = "Chọn thuộc tính";
    const addAttribute = document.createElement("option");
    addAttribute.value = "";
    addAttribute.text = "Thêm thuộc tính";
    attributeSelect.appendChild(defaultOption);
    attributeSelect.appendChild(addAttribute);
    const response = await axiosInstance.get(
      "/product/attributes/" + id_category
    );
    response.data.data.forEach((attribute) => {
      let option = document.createElement("option");
      option.value = attribute.VariantID;
      option.text = attribute.VariantName;
      attributeSelect.appendChild(option);
    });
    attributeSelect.addEventListener("change", async () => {
      const attribute =
        attributeSelect.options[attributeSelect.selectedIndex].text;
      if (attribute === "Hãng") {
        renderBrands(brands);
        return;
      }
      if (attribute === "Thêm thuộc tính") {
        console.log("Thêm thuộc tính");
        await add_Attribute();
        return;
      }
      console.log("Thuộc tính khác");
      document.querySelector(".attributeValue").innerHTML =
        '<input type="text" class="form-control" id="attributeValue" required>';
    });
  } catch (error) {
    console.error(error);
  }
};
loadAttributes();
window.addVariant = function () {
  const attributeSelect = document.getElementById("attributeSelect");
  const attribute = attributeSelect.value;
  const text = attributeSelect.options[attributeSelect.selectedIndex].text;
  const value = document.getElementById("attributeValue").value.trim();

  if (!attribute || !value) {
    alert("Vui lòng chọn thuộc tính và nhập giá trị.");
    return;
  }
  // Kiểm tra nếu thuộc tính đã tồn tại
  if (variants.some((variant) => variant.idVariation == attribute)) {
    alert("Thuộc tính này đã được chọn.");
    return;
  }
  variants.push({ idVariation: attribute, name: text, value: value });
  renderVariants();

  attributeSelect.value = "";
  document.getElementById("attributeValue").value = "";
};

function renderVariants() {
  const list = document.getElementById("variantList");
  list.innerHTML = "";

  variants.forEach((variant, index) => {
    const item = document.createElement("li");
    item.className =
      "list-group-item d-flex justify-content-between align-items-center";
    item.innerHTML = `${variant.name}: ${variant.value} <button class="btn btn-danger btn-sm" onclick="removeVariant(${index})">Xóa</button>`;
    list.appendChild(item);
  });
}

window.removeVariant = function (index) {
  variants.splice(index, 1);
  renderVariants();
};

window.submitVariants = async function () {
  const file = document.getElementById("variantImage").files[0];
  let formData = new FormData();
  formData.append(
    "product_id",
    new URL(window.location.href).searchParams.get("ProductID")
  );
  formData.append("sku", document.getElementById("sku").value);
  formData.append("description", document.getElementById("description").value);
  formData.append("image", file);
  formData.append("variants", JSON.stringify(variants));
  try {
    const response = await axiosInstance.post(
      "/product/add_product_item",
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
  const file = document.getElementById("variantImage").files[0];
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
