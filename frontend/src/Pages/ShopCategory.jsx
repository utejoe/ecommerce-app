import React, { useContext, useState, useMemo } from "react";
import "./CSS/ShopCategory.css";
import { ShopContext } from "../Context/ShopContext";
import dropdown_icon from "../Components/Assets/dropdown_icon.png";
import Item from "../Components/Item/Item";
import Pagination from "../Components/Pagination/Pagination"; // ✅ Import

const ShopCategory = (props) => {
  const { all_product } = useContext(ShopContext);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 8;

  const filteredProducts = useMemo(() => {
    return all_product.filter(
      (item) => item.category.toLowerCase() === props.category.toLowerCase()
    );
  }, [all_product, props.category]);

  const totalPages = Math.ceil(filteredProducts.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const currentItems = filteredProducts.slice(startIndex, startIndex + itemsPerPage);

  return (
    <div className="shop-category">
      <img className="shopcategory-banner" src={props.banner} alt="banner" />

      <div className="shopcategory-indexSort">
        <p>
          <span>Showing {startIndex + 1} - {Math.min(startIndex + itemsPerPage, filteredProducts.length)}</span> of {filteredProducts.length} products
        </p>
        <div className="shopcategory-sort">
          Sort by <img src={dropdown_icon} alt="dropdown icon" />
        </div>
      </div>

      <div className="shopcategory-products">
        {currentItems.length === 0 ? (
          <p>No products found in this category.</p>
        ) : (
          currentItems.map((item) => (
            <Item
              key={item.id}
              id={item.id}
              name={item.name}
              image={item.image}
              new_price={item.new_price}
              old_price={item.old_price}
            />
          ))
        )}
      </div>

      {totalPages > 1 && (
        <Pagination
          currentPage={currentPage}
          totalPages={totalPages}
          onPageChange={setCurrentPage}
        />
      )}

      <div className="shopcategory-loadmore">Explore More</div>
    </div>
  );
};

export default ShopCategory;
