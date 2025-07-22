// frontend/src/Components/Popular/Popular.jsx
import React, { useEffect, useState, useRef } from "react";
import "./Popular.css";
import Item from "../Item/Item";
import { popularWomenAPI } from "../../services/api";

const Popular = () => {
  const [popularItems, setPopularItems] = useState([]);
  const carouselRef = useRef(null);
  const intervalRef = useRef(null);
  const scrollAmount = 300;

  useEffect(() => {
    const fetchPopularItems = async () => {
      try {
        const res = await fetch(popularWomenAPI);
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

  const scrollRight = () => {
    if (carouselRef.current) {
      carouselRef.current.scrollBy({ left: scrollAmount, behavior: "smooth" });
    }
  };

  const scrollLeft = () => {
    if (carouselRef.current) {
      carouselRef.current.scrollBy({ left: -scrollAmount, behavior: "smooth" });
    }
  };

  useEffect(() => {
    intervalRef.current = setInterval(() => {
      scrollRight();
    }, 4000);

    return () => clearInterval(intervalRef.current);
  }, [popularItems]);

  // ✅ Add this drag-to-scroll effect
  useEffect(() => {
    const container = carouselRef.current;
    if (!container) return;

    let isDown = false;
    let startX;
    let scrollLeft;

    const start = (e) => {
      isDown = true;
      startX = e.pageX || e.touches[0].pageX;
      scrollLeft = container.scrollLeft;
    };

    const move = (e) => {
      if (!isDown) return;
      const x = e.pageX || e.touches[0].pageX;
      const walk = x - startX;
      container.scrollLeft = scrollLeft - walk;
    };

    const end = () => {
      isDown = false;
    };

    container.addEventListener("mousedown", start);
    container.addEventListener("touchstart", start);
    container.addEventListener("mousemove", move);
    container.addEventListener("touchmove", move);
    container.addEventListener("mouseup", end);
    container.addEventListener("mouseleave", end);
    container.addEventListener("touchend", end);

    return () => {
      container.removeEventListener("mousedown", start);
      container.removeEventListener("touchstart", start);
      container.removeEventListener("mousemove", move);
      container.removeEventListener("touchmove", move);
      container.removeEventListener("mouseup", end);
      container.removeEventListener("mouseleave", end);
      container.removeEventListener("touchend", end);
    };
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
          {popularItems.map((item) => (
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
    </div>
  );
};

export default Popular;
