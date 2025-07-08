import React, { createContext, useState, useEffect } from "react";
import all_product from "../Components/Assets/all_product";

export const ShopContext = createContext(null);

// ✅ Clean cart initialization (no zeros for unused products)
const getDefaultCart = () => {
  return {};
};

const ShopContextProvider = (props) => {
  const [cartItems, setCartItems] = useState(() => {
    const localCart = localStorage.getItem("cart");
    return localCart ? JSON.parse(localCart) : getDefaultCart();
  });

  const isLoggedIn = !!localStorage.getItem("auth-token");

  useEffect(() => {
    localStorage.setItem("cart", JSON.stringify(cartItems));
  }, [cartItems]);

  const addToCart = async (itemId) => {
    setCartItems((prev) => ({
      ...prev,
      [itemId]: (prev[itemId] || 0) + 1,
    }));

    if (isLoggedIn) {
      await fetch("http://localhost:3300/addtocart", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "auth-token": localStorage.getItem("auth-token"),
        },
        body: JSON.stringify({ itemId }),
      })
        .then((res) => res.json())
        .then((data) => console.log("Cart updated:", data));
    }
  };

  const removeFromCart = async (itemId) => {
    setCartItems((prev) => {
      const newCart = {
        ...prev,
        [itemId]: Math.max((prev[itemId] || 0) - 1, 0),
      };
      if (newCart[itemId] === 0) delete newCart[itemId]; // 🧹 remove zero items
      return newCart;
    });

    if (isLoggedIn) {
      try {
        await fetch("http://localhost:3300/removefromcart", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            "auth-token": localStorage.getItem("auth-token"),
          },
          body: JSON.stringify({ itemId }),
        });
      } catch (err) {
        console.error("❌ Error syncing remove from cart:", err);
      }
    }
  };

  // ✅ On login sync — clean backend cart before set
  useEffect(() => {
    const handleLogin = async () => {
      const token = localStorage.getItem("auth-token");
      if (!token) return;

      try {
        const res = await fetch("http://localhost:3300/getcart", {
          headers: {
            "auth-token": token,
          },
        });

        const data = await res.json();
        if (data.success) {
          const cleanedCart = Object.fromEntries(
            Object.entries(data.cart).filter(([_, qty]) => qty > 0)
          );
          setCartItems(cleanedCart);
          localStorage.removeItem("cart");
          console.log("✅ Cleaned and fetched cart from backend after login");
        }
      } catch (err) {
        console.error("❌ Failed to fetch cart after login:", err);
      }
    };

    window.addEventListener("userLoggedIn", handleLogin);
    return () => {
      window.removeEventListener("userLoggedIn", handleLogin);
    };
  }, []);

  // ✅ On reload if already logged in
  useEffect(() => {
    const token = localStorage.getItem("auth-token");
    if (token) {
      fetch("http://localhost:3300/getcart", {
        headers: { "auth-token": token },
      })
        .then((res) => res.json())
        .then((data) => {
          if (data.success) {
            const cleanedCart = Object.fromEntries(
              Object.entries(data.cart).filter(([_, qty]) => qty > 0)
            );
            setCartItems(cleanedCart);
            localStorage.removeItem("cart");
            console.log(
              "✅ Cleaned and fetched cart from backend on initial load"
            );
          }
        })
        .catch((err) => {
          console.error("❌ Error loading backend cart on init:", err);
        });
    }
  }, []);

  const getTotalCartAmount = () => {
    let total = 0;
    for (const item in cartItems) {
      const product = all_product.find((p) => p.id === Number(item));
      if (product && cartItems[item] > 0) {
        total += product.new_price * cartItems[item];
      }
    }
    return total;
  };

  const getTotalCartItems = () => {
    return Object.values(cartItems).reduce((a, b) => a + b, 0);
  };

  const contextValue = {
    all_product,
    cartItems,
    addToCart,
    removeFromCart,
    getTotalCartAmount,
    getTotalCartItems,
  };

  return (
    <ShopContext.Provider value={contextValue}>
      {props.children}
    </ShopContext.Provider>
  );
};

export default ShopContextProvider;
