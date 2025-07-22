import React, { useState } from "react";
import "./CSS/LoginSignup.css";
import { useNavigate } from "react-router-dom";
import { FaEye, FaEyeSlash } from "react-icons/fa"; // ✅ Eye icons

const baseURL = process.env.REACT_APP_API_BASE_URL;

export const LoginSignup = () => {
  const [state, setState] = useState("Login");
  const [formData, setFormData] = useState({
    username: "",
    password: "",
    email: "",
  });
  const [showPassword, setShowPassword] = useState(false); // 👁 Toggle state

  const navigate = useNavigate();

  const changeHandler = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  const login = async () => {
    try {
      const res = await fetch(`${baseURL}/login`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email: formData.email,
          password: formData.password,
        }),
      });

      const data = await res.json();

      if (data.success) {
        alert("✅ Login successful!");
        localStorage.setItem("auth-token", data.token);

        const localCart = JSON.parse(localStorage.getItem("cart")) || {};

        await fetch(`${baseURL}/synccart`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            "auth-token": data.token,
          },
          body: JSON.stringify({ cart: localCart }),
        });

        localStorage.removeItem("cart");

        window.dispatchEvent(new Event("userLoggedIn"));
        navigate("/");
      } else {
        alert("❌ Login failed: " + data.errors);
      }
    } catch (err) {
      console.error("Login error:", err);
      alert("❌ Error during login");
    }
  };

  const signup = async () => {
    try {
      const res = await fetch(`${baseURL}/signup`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          username: formData.username,
          email: formData.email,
          password: formData.password,
        }),
      });

      const data = await res.json();

      if (data.success) {
        alert("✅ Signup successful!");
        localStorage.setItem("auth-token", data.token);
        navigate("/");
      } else {
        alert("❌ Signup failed: " + data.errors);
      }
    } catch (err) {
      console.error("Signup error:", err);
      alert("❌ Error during signup");
    }
  };

  return (
    <div className="loginsignup">
      <div className="loginsignup-container">
        <h1>{state === "Login" ? "Login" : "Sign Up"}</h1>

        <div className="loginsignup-fields">
          {state === "Sign Up" && (
            <input
              name="username"
              value={formData.username}
              onChange={changeHandler}
              type="text"
              placeholder="Your Name"
            />
          )}
          <input
            name="email"
            value={formData.email}
            onChange={changeHandler}
            type="email"
            placeholder="Email Address"
          />

          {/* Password field with eye toggle */}
          <div className="password-wrapper">
            <input
              name="password"
              value={formData.password}
              onChange={changeHandler}
              type={showPassword ? "text" : "password"}
              placeholder="Password"
            />
            <span onClick={togglePasswordVisibility} className="eye-icon">
              {showPassword ? <FaEyeSlash /> : <FaEye />}
            </span>
          </div>
        </div>

        <button onClick={() => (state === "Login" ? login() : signup())}>
          Continue
        </button>

        {state === "Sign Up" ? (
          <p className="loginsignup-login">
            Already have an account?{" "}
            <span onClick={() => setState("Login")}>Login here</span>
          </p>
        ) : (
          <p className="loginsignup-login">
            Create an account?{" "}
            <span onClick={() => setState("Sign Up")}>Sign Up here</span>
          </p>
        )}

        <div className="loginsignup-agree">
          <input type="checkbox" />
          <p>By continuing, I agree to the terms of use & privacy policy</p>
        </div>
      </div>
    </div>
  );
};

export default LoginSignup;
