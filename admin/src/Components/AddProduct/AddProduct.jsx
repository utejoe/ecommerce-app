import React, { useState } from "react";
import './AddProduct.css';
import upload_area from '../../assets/upload_area.svg';
import { uploadImage, addProduct } from "../../services/api";  // ✅ import endpoints

const AddProduct = () => {
  const [image, setImage] = useState(null);
  const [productDetails, setproductDetails] = useState({
    name: "",
    category: "women",
    new_price: "",
    old_price: ""
  });

  const imageHandler = (e) => {
    setImage(e.target.files[0]);
  };

  const changeHandler = (e) => {
    setproductDetails({ ...productDetails, [e.target.name]: e.target.value });
  };

  const Add_Product = async () => {
    if (!productDetails.name || !image || !productDetails.old_price || !productDetails.new_price) {
      alert("Please fill in all fields");
      return;
    }

    const formData = new FormData();
    formData.append("product", image);

    let responseData;
    try {
      const response = await fetch(uploadImage, {
        method: "POST",
        headers: {
          Accept: "application/json",
        },
        body: formData,
      });
      responseData = await response.json();
    } catch (error) {
      console.error("Upload failed", error);
      alert("Image upload failed.");
      return;
    }

    if (responseData.success) {
      const fullProduct = {
        ...productDetails,
        image: responseData.image_url,
      };

      try {
        const productRes = await fetch(addProduct, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Accept: "application/json",
          },
          body: JSON.stringify(fullProduct),
        });

        const result = await productRes.json();
        if (result.success) {
          console.log("✅ Product added:", result.product);
          alert("Product added successfully!");
        } else {
          console.warn("❌ Failed to add product:", result.message);
        }
      } catch (error) {
        console.error("Add product error:", error);
        alert("Server error while adding product.");
      }
    } else {
      alert("Image upload failed.");
    }
  };

  return (
    <div className="add-product">
      <div className="addproduct-itemfield">
        <p>Product title</p>
        <input value={productDetails.name} onChange={changeHandler} type="text" name="name" placeholder="Type here" />
      </div>
      <div className="addproduct-price">
        <div className="addproduct-itemfield">
          <p>Price</p>
          <input value={productDetails.old_price} onChange={changeHandler} type="text" name="old_price" placeholder="Type here" />
        </div>
        <div className="addproduct-itemfield">
          <p>Offer Price</p>
          <input value={productDetails.new_price} onChange={changeHandler} type="text" name="new_price" placeholder="Type here" />
        </div>
      </div>
      <div className="addproduct-itemfield">
        <p>Product Category</p>
        <select value={productDetails.category} onChange={changeHandler} name="category" className="add-product-selector">
          <option value="women">Women</option>
          <option value="men">Men</option>
          <option value="kid">Kid</option>
        </select>
      </div>
      <div className="addproduct-itemfield">
        <label htmlFor="file-input">
          <img src={image ? URL.createObjectURL(image) : upload_area} className="addproduct-thumbnail-img" alt="Product thumbnail" />
        </label>
        <input onChange={imageHandler} type="file" name="image" id="file-input" accept="image/*" hidden />
      </div>
      <button onClick={Add_Product} className="addproduct-btn">ADD</button>
    </div>
  );
};

export default AddProduct;
