// frontend/src/Components/RelatedProducts/RelatedProducts.jsx
import React, { useContext, useRef, useEffect } from "react";
import "./RelatedProducts.css";
import Item from "../Item/Item";
import { ShopContext } from "../../Context/ShopContext";

const RelatedProducts = ({ category, currentProductId }) => {
  const { all_product } = useContext(ShopContext);
  const carouselRef = useRef(null);
  const intervalRef = useRef(null);

  // Filter related products
  const related = all_product.filter(
    (item) =>
      item.category.toLowerCase() === category.toLowerCase() &&
      item.id !== Number(currentProductId)
  );

  const scrollLeft = () => {
    carouselRef.current?.scrollBy({ left: -300, behavior: "smooth" });
  };

  const scrollRight = () => {
    carouselRef.current?.scrollBy({ left: 300, behavior: "smooth" });
  };

  useEffect(() => {
    intervalRef.current = setInterval(() => {
      scrollRight();
    }, 4000);

    return () => clearInterval(intervalRef.current);
  }, [related]);

  return (
    <div className="relatedproducts">
      <h1>Related Products</h1>
      <hr />

      {related.length > 0 ? (
        <div className="carousel-controls">
          <button className="carousel-btn left" onClick={scrollLeft}>
            &#10094;
          </button>

          <div className="relatedproducts-item" ref={carouselRef}>
            {related.map((item) => (
              <Item
                key={item.id}
                id={item.id}
                name={item.name}
                image={item.image}
                new_price={item.new_price}
                old_price={item.old_price}
              />
            ))}
          </div>

          <button className="carousel-btn right" onClick={scrollRight}>
            &#10095;
          </button>
        </div>
      ) : (
        <p className="no-related">No related products found.</p>
      )}
    </div>
  );
};

export default RelatedProducts;
