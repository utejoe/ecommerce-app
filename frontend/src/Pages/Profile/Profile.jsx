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

  const [user, setUser] = useState({
    name: "Loading...",
    isAdmin: false,
    profileImage: "",
  });

  const [imageFile, setImageFile] = useState(null);
  const [previewUrl, setPreviewUrl] = useState(""); // for live preview

  useEffect(() => {
    const token = localStorage.getItem("auth-token");
    if (!token) {
      alert("You must be logged in to view your profile.");
      navigate("/login");
      return;
    }

    fetch(`${process.env.REACT_APP_API_BASE_URL}/userinfo`, {
      headers: { "auth-token": token },
    })
      .then((res) => res.json())
      .then((data) => {
        if (data.success) {
          setUser({
            name: data.user.name,
            isAdmin: data.user.isAdmin,
            profileImage: data.user.profileImage || "",
          });

          // Sync to localStorage for navbar
          if (data.user.profileImage) {
            localStorage.setItem("profile-image", data.user.profileImage);
          }
        } else {
          alert("Failed to fetch user info.");
        }
      })
      .catch((err) => {
        console.error("❌ Error fetching user info:", err);
      });
  }, [navigate]);

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    setImageFile(file);

    const tempUrl = URL.createObjectURL(file);
    setPreviewUrl(tempUrl); // set preview immediately

    // Optional: clean up object URL later
    return () => URL.revokeObjectURL(tempUrl);
  };

  const handleUpload = async () => {
    if (!imageFile) {
      alert("Please select an image.");
      return;
    }

    const token = localStorage.getItem("auth-token");
    const formData = new FormData();
    formData.append("image", imageFile);

    try {
      // Step 1: Upload image
      const uploadRes = await fetch(
        `${process.env.REACT_APP_API_BASE_URL}/upload-profile-image`,
        {
          method: "POST",
          headers: {
            "auth-token": token,
          },
          body: formData,
        }
      );

      const uploadData = await uploadRes.json();
      if (!uploadData.success) {
        alert("Failed to upload image file.");
        return;
      }

      const imageUrl = uploadData.imageUrl;

      // Step 2: Save image URL to MongoDB
      const saveRes = await fetch(
        `${process.env.REACT_APP_API_BASE_URL}/save-profile-image`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            "auth-token": token,
          },
          body: JSON.stringify({ imageUrl }),
        }
      );

      const saveData = await saveRes.json();

      if (saveData.success) {
        setUser((prev) => ({ ...prev, profileImage: imageUrl }));
        localStorage.setItem("profile-image", imageUrl);
        alert("✅ Profile image updated!");
        setPreviewUrl(""); // clear temp preview after save
      } else {
        alert("❌ Failed to save image URL.");
      }
    } catch (error) {
      console.error("Upload error:", error);
      alert("❌ Something went wrong.");
    }
  };

  return (
    <div className="profile">
      <h1>Welcome, {user.name}</h1>

      <div className="profile-image-section">
        <img
          src={
            previewUrl
              ? previewUrl
              : user.profileImage
              ? `${user.profileImage}?t=${Date.now()}`
              : "/default-avatar.png"
          }
          alt="Profile"
          className="profile-avatar"
        />
        <input type="file" accept="image/*" onChange={handleImageChange} />
        <button onClick={handleUpload}>Upload Profile Image</button>
      </div>

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
