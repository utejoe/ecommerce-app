import React, { useEffect, useState } from "react";
import "./Popular.css";
import Item from "../Item/Item"; // Make sure this path is correct

const Popular = () => {
  const [popularItems, setPopularItems] = useState([]);

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

  return (
    <div className="popular">
      <h1>POPULAR IN WOMEN</h1>
      <hr />
      <div className="popular-item">
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
    </div>
  );
};

export default Popular;
