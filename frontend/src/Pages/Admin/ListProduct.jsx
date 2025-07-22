import React, { useState, useEffect } from "react";
import "./ListProduct.css";
import cross_icon from '../../Components/Assets/cross_icon.png';
import { allProducts, removeProduct } from "../../services/api";

const ListProduct = () => {
  const [allProductsList, setAllProductsList] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchProducts = async () => {
    try {
      const response = await fetch(allProducts);
      const data = await response.json();

      const products = Array.isArray(data)
        ? data
        : Array.isArray(data.products)
        ? data.products
        : [];

      setAllProductsList(products);
    } catch (error) {
      console.error("Error fetching products:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  const remove_product = async (id) => {
    try {
      const response = await fetch(removeProduct, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id }),
      });

      if (response.ok) {
        setAllProductsList((prev) => prev.filter((p) => p.id !== id));
      }
    } catch (error) {
      console.error("Error deleting product:", error);
    }
  };

  return (
    <div className="list-product">
      <h1>All Products List</h1>
      <div className="listproduct-format-main">
        <p>Product</p>
        <p>Title</p>
        <p>Old Price</p>
        <p>New Price</p>
        <p>Category</p>
        <p>Remove</p>
      </div>

      <div className="listproduct-allproducts">
        <hr />
        {loading ? (
          <p className="loading">Loading products...</p>
        ) : allProductsList.length > 0 ? (
          allProductsList.map((product) => (
            <React.Fragment key={product.id}>
              <div className="listproduct-format-main listproduct-format">
                <img src={product.image} alt={product.name} className="listproduct-product-icon" />
                <p>{product.name}</p>
                <p>${product.old_price}</p>
                <p>${product.new_price}</p>
                <p>{product.category}</p>
                <img
                  src={cross_icon}
                  alt="Remove"
                  className="listproduct-remove-icon"
                  onClick={() => remove_product(product.id)}
                  style={{ cursor: "pointer" }}
                />
              </div>
              <hr />
            </React.Fragment>
          ))
        ) : (
          <p className="no-products">No products available.</p>
        )}
      </div>
    </div>
  );
};

export default ListProduct;
