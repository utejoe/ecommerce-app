import React, { useContext, useEffect, useState } from "react";
import "./Profile.css";
import { useNavigate } from "react-router-dom";
import { ShopContext } from "../../Context/ShopContext";

const Profile = () => {
  const navigate = useNavigate();
  const {
    cartItems,
    all_product,
    getTotalCartItems,
    getTotalCartAmount,
  } = useContext(ShopContext);

  const [user, setUser] = useState({ name: "Loading...", isAdmin: false });

  // 🔄 Load user data dynamically
  useEffect(() => {
    const token = localStorage.getItem("auth-token");
    if (!token) {
      alert("You must be logged in to view your profile.");
      navigate("/login");
      return;
    }

    fetch(`${process.env.REACT_APP_API_BASE_URL}/userinfo`, {
      headers: {
        "auth-token": token,
      },
    })
      .then((res) => res.json())
      .then((data) => {
        if (data.success) {
          setUser({ name: data.user.name, isAdmin: data.user.isAdmin });
        } else {
          alert("Failed to fetch user info.");
        }
      })
      .catch((err) => {
        console.error("❌ Error fetching user info:", err);
      });
  }, [navigate]);

  return (
    <div className="profile">
      <h1>Welcome, {user.name}</h1>

      <div className="cart-summary">
        <h2>Your Cart</h2>
        <p>🛒 {getTotalCartItems()} item(s)</p>
        <p>💰 Total: ${getTotalCartAmount()}</p>

        {getTotalCartItems() > 0 ? (
          <ul className="cart-list">
            {Object.entries(cartItems).map(([itemId, qty]) => {
              const product = all_product.find((p) => p.id === Number(itemId));
              if (!product) return null;
              return (
                <li key={itemId}>
                  {product.name} × {qty} — ${product.new_price * qty}
                </li>
              );
            })}
          </ul>
        ) : (
          <p>Your cart is empty</p>
        )}
      </div>

      {user.isAdmin && (
        <button className="admin-btn" onClick={() => navigate("/admin")}>
          Manage Products (Admin Only)
        </button>
      )}
    </div>
  );
};

export default Profile;
