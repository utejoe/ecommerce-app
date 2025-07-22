// frontend/src/Components/Popular/Popular.jsx
import React, { useEffect, useState, useRef } from "react";
import "./Popular.css";
import Item from "../Item/Item";

const Popular = () => {
  const [popularItems, setPopularItems] = useState([]);
  const [currentPage, setCurrentPage] = useState(0);
  const carouselRef = useRef(null);
  const intervalRef = useRef(null);
  const itemsPerPage = 4; // Adjust to match your design

  useEffect(() => {
    const fetchPopularItems = async () => {
      try {
        const res = await fetch("https://ecommerce-app-ccnh.onrender.com/popularinwomen");
        const data = await res.json();
        if (data.success) {
          setPopularItems(data.products);
        } else {
          console.error("❌ Failed to load popular items:", data.message);
        }
      } catch (error) {
        console.error("❌ Error fetching popular items:", error);
      }
    };

    fetchPopularItems();
  }, []);

  const totalPages = Math.ceil(popularItems.length / itemsPerPage);

  const scrollToPage = (pageIndex) => {
    const container = carouselRef.current;
    if (!container) return;
    const scrollAmount = container.offsetWidth;
    container.scrollTo({ left: scrollAmount * pageIndex, behavior: "smooth" });
    setCurrentPage(pageIndex);
  };

  const scrollRight = () => {
    if (currentPage < totalPages - 1) {
      scrollToPage(currentPage + 1);
    }
  };

  const scrollLeft = () => {
    if (currentPage > 0) {
      scrollToPage(currentPage - 1);
    }
  };

  // Auto-scroll
  useEffect(() => {
    intervalRef.current = setInterval(() => {
      setCurrentPage((prevPage) =>
        prevPage < totalPages - 1 ? prevPage + 1 : 0
      );
    }, 4000);

    return () => clearInterval(intervalRef.current);
  }, [totalPages]);

  useEffect(() => {
    scrollToPage(currentPage);
  }, [currentPage]);

  return (
    <div className="popular">
      <h1>POPULAR IN WOMEN</h1>
      <hr />

      <div className="carousel-controls">
        <button className="carousel-btn left" onClick={scrollLeft}>
          &#10094;
        </button>

        <div className="popular-item" ref={carouselRef}>
          {popularItems.map((item, i) => (
            <Item
              key={i}
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

      {/* Dots */}
      <div className="carousel-dots">
        {Array.from({ length: totalPages }).map((_, index) => (
          <div
            key={index}
            className={`dot ${index === currentPage ? "active" : ""}`}
            onClick={() => scrollToPage(index)}
          ></div>
        ))}
      </div>
    </div>
  );
};

export default Popular;
