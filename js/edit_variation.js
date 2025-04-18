import axiosInstance from "./configAxios.js";
let variants = [];
let attributeSelect = document.getElementById("attributeSelect");
const product_id = new URL(window.location.href).searchParams.get(
  "ProductItemID"
);
const get_product_item = async () => {
  try {
    const response = await axiosInstance.get(
      "/product/product_item_by_ID/" + product_id
    );
    console.log(response.data.data);
    return response.data.data;
  } catch (error) {
    console.log(error);
    return null;
  }
};
const product_item = await get_product_item();
variants = product_item.attributes;
document.getElementById("sku").value = product_item.sku;
document.getElementById("description").value = product_item.description;
document.getElementById("profit_margin").value = product_item.profit_margin;
document.getElementById(
  "imagePreview"
).src = `http://localhost:3000${product_item.product_image}`;
document.getElementById("imagePreview").style.display = "block";
const loadCategories = async () => {
  try {
    const response = await axiosInstance.get(
      `/product/categoryByProductID/${product_item.product_id}`
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
    if (!product_item) return;
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
  console.log(variants, attribute);
  // Kiểm tra nếu thuộc tính đã tồn tại
  if (variants.some((variant) => variant.variantID == attribute)) {
    alert("Thuộc tính này đã được chọn.");
    return;
  }
  variants.push({ variantID: attribute, variantName: text, values: value });
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
    item.innerHTML = `${variant.variantName}: ${variant.values} <button class="btn btn-danger btn-sm" onclick="removeVariant(${index})">Xóa</button>`;
    list.appendChild(item);
  });
}
renderVariants();

window.removeVariant = function (index) {
  variants.splice(index, 1);
  renderVariants();
};

window.submitVariants = async function () {
  const file = document.getElementById("variantImage").files[0];
  let formData = new FormData();
  formData.append("product_item_id", product_id);
  formData.append("sku", document.getElementById("sku").value);
  formData.append("description", document.getElementById("description").value);
  formData.append("profit_margin", parseFloat(document.getElementById("profit_margin").value).toFixed(2));
  formData.append("image", file);
  formData.append("variants", JSON.stringify(variants));
  try {
    const response = await axiosInstance.put(
      "/product/update_product_item",
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
