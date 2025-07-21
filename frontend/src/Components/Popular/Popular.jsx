// frontend/src/Components/Popular/Popular.jsx
import React, { useEffect, useState, useRef } from "react";
import "./Popular.css";
import Item from "../Item/Item";

const Popular = () => {
  const [popularItems, setPopularItems] = useState([]);
  const carouselRef = useRef(null);
  const intervalRef = useRef(null);

  useEffect(() => {
    const fetchPopularItems = async () => {
      try {
        const res = await fetch("http://localhost:3300/popularinwomen");
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

  // Slide scroll
  const scrollLeft = () => {
    if (carouselRef.current) {
      carouselRef.current.scrollBy({ left: -300, behavior: "smooth" });
    }
  };

  const scrollRight = () => {
    if (carouselRef.current) {
      carouselRef.current.scrollBy({ left: 300, behavior: "smooth" });
    }
  };

  // Auto-scroll every 4s
  useEffect(() => {
    intervalRef.current = setInterval(() => {
      scrollRight();
    }, 4000);

    return () => clearInterval(intervalRef.current);
  }, []);

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
    </div>
  );
};

export default Popular;
