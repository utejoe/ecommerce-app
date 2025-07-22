// frontend/src/Components/Navbar/Navbar.jsx
import React, { useContext, useRef, useState, useEffect } from "react";
import "./Navbar.css";
import logo from "../Assets/logo.png";
import cart_icon from "../Assets/cart_icon.png";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { FaUserCircle } from "react-icons/fa";
import { ShopContext } from "../../Context/ShopContext";
import nav_dropdown from "../Assets/nav-dropdown.png";

export const Navbar = ({ menu, SetMenu }) => {
  const { getTotalCartItems } = useContext(ShopContext);
  const menuRef = useRef();
  const navigate = useNavigate();

  const location = useLocation();

  useEffect(() => {
    const path = location.pathname;
    if (path.startsWith("/men")) SetMenu("men");
    else if (path.startsWith("/women")) SetMenu("women");
    else if (path.startsWith("/kids")) SetMenu("kids");
    else SetMenu("shop");
  }, [location.pathname, SetMenu]);

  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [profileImage, setProfileImage] = useState(null);

  useEffect(() => {
    const checkLogin = () => {
      const token = localStorage.getItem("auth-token");
      setIsLoggedIn(!!token);

      // Update profile image if available
      const storedImage = localStorage.getItem("profile-image");
      setProfileImage(storedImage || null);
    };

    checkLogin(); // Initial check

    // Listen to custom login or image update events
    window.addEventListener("userLoggedIn", checkLogin);
    window.addEventListener("profileImageUpdated", checkLogin);

    return () => {
      window.removeEventListener("userLoggedIn", checkLogin);
      window.removeEventListener("profileImageUpdated", checkLogin);
    };
  }, []);

  const dropdown_toggle = (e) => {
    menuRef.current.classList.toggle("nav-menu-visible");
    e.target.classList.toggle("open");
  };

  const handleLogout = () => {
    localStorage.removeItem("auth-token");
    localStorage.removeItem("profile-image");
    setIsLoggedIn(false);
    setProfileImage(null);
    navigate("/");
  };

  const handleImageError = () => {
    setProfileImage(null); // Fallback to default icon
  };

  return (
    <div className="navbar">
      <Link
        to="/"
        className="nav-logo"
        style={{ textDecoration: "none", color: "inherit", cursor: "pointer" }}
        onClick={() => SetMenu("shop")}
      >
        <img src={logo} alt="" />
        <p>SHOPPER</p>
      </Link>

      <img
        className="nav-dropdown"
        onClick={dropdown_toggle}
        src={nav_dropdown}
        alt=""
      />

      <ul ref={menuRef} className="nav-menu">
        <li onClick={() => SetMenu("shop")}>
          <Link style={{ textDecoration: "none" }} to="/">
            Shop
          </Link>
          {menu === "shop" && <hr />}
        </li>
        <li onClick={() => SetMenu("men")}>
          <Link style={{ textDecoration: "none" }} to="/men">
            Men
          </Link>
          {menu === "men" && <hr />}
        </li>
        <li onClick={() => SetMenu("women")}>
          <Link style={{ textDecoration: "none" }} to="/women">
            Women
          </Link>
          {menu === "women" && <hr />}
        </li>
        <li onClick={() => SetMenu("kids")}>
          <Link style={{ textDecoration: "none" }} to="/kids">
            Kids
          </Link>
          {menu === "kids" && <hr />}
        </li>
      </ul>

      <div className="nav-login-cart">
        {isLoggedIn ? (
          <>
            <Link to="/profile" className="profile-icon-link">
              {profileImage ? (
                <img
                  src={profileImage}
                  alt="Profile"
                  onError={handleImageError}
                  className="profile-icon-img"
                />
              ) : (
                <FaUserCircle className="profile-icon" />
              )}
            </Link>
            <button onClick={handleLogout}>Logout</button>
          </>
        ) : (
          <Link to="/login">
            <button>Login</button>
          </Link>
        )}
        <Link to="/cart">
          <img src={cart_icon} alt="Cart" />
        </Link>
        <div className="nav-cart-count">{getTotalCartItems()}</div>
      </div>
    </div>
  );
};
