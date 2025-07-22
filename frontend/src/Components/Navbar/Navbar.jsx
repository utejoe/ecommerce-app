import React, { useContext, useRef, useState, useEffect } from "react";
import "./Navbar.css";
import logo from "../Assets/logo.png";
import cart_icon from "../Assets/cart_icon.png";
import { Link, useNavigate } from "react-router-dom";
import { FaUserCircle } from "react-icons/fa";

import { ShopContext } from "../../Context/ShopContext";
import nav_dropdown from "../Assets/nav-dropdown.png";

export const Navbar = ({ menu, SetMenu }) => {
  const { getTotalCartItems } = useContext(ShopContext);
  const menuRef = useRef();
  const navigate = useNavigate();

  const [isLoggedIn, setIsLoggedIn] = useState(false);

  useEffect(() => {
    const checkLogin = () => {
      const token = localStorage.getItem("auth-token"); // ✅ Correct key
      setIsLoggedIn(!!token);
    };

    checkLogin(); // ✅ Check on mount

    // ✅ Listen to custom login event
    window.addEventListener("userLoggedIn", checkLogin);

    return () => {
      window.removeEventListener("userLoggedIn", checkLogin);
    };
  }, []);

  const dropdown_toggle = (e) => {
    menuRef.current.classList.toggle("nav-menu-visible");
    e.target.classList.toggle("open");
  };

  const handleLogout = () => {
    localStorage.removeItem("auth-token"); // ✅ Clear auth-token
    setIsLoggedIn(false); // ✅ Update UI state
    navigate("/"); // ✅ Redirect to homepage
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
          <Link style={{ textDecoration: "none" }} to="men">
            Men
          </Link>
          {menu === "men" && <hr />}
        </li>
        <li onClick={() => SetMenu("women")}>
          <Link style={{ textDecoration: "none" }} to="women">
            Women
          </Link>
          {menu === "women" && <hr />}
        </li>
        <li onClick={() => SetMenu("kids")}>
          <Link style={{ textDecoration: "none" }} to="kids">
            Kids
          </Link>
          {menu === "kids" && <hr />}
        </li>
      </ul>

      <div className="nav-login-cart">
        {isLoggedIn ? (
          <>
            <Link to="/profile" className="profile-icon-link">
              {localStorage.getItem("profile-image") ? (
                <img
                  src={localStorage.getItem("profile-image")}
                  alt="Profile"
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