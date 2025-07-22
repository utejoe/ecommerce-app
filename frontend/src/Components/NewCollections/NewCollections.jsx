import React, { useEffect, useState } from "react";
import "./NewCollections.css";
import Item from "../Item/Item";
import { newCollectionsAPI } from "../../services/api";

const NewCollections = () => {
  const [new_collection, setNew_collection] = useState([]);

  useEffect(() => {
    const fetchNewCollections = async () => {
      try {
        const res = await fetch(newCollectionsAPI);
        const data = await res.json();

        if (data.success) {
          setNew_collection(data.products);
        } else {
          console.error("❌ Failed to load new collections:", data.message);
        }
      } catch (error) {
        console.error("❌ Error fetching new collections:", error);
      }
    };

    fetchNewCollections();
  }, []);

  return (
    <div className="new-collections" id="latest-collection">
      <h1>NEW COLLECTIONS</h1>
      <hr />
      <div className="collections">
        {new_collection.map((item, i) => (
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

export default NewCollections;
