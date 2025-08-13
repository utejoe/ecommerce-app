import React, { useContext } from "react";
import "./CartItems.css";
import { ShopContext } from "../../Context/ShopContext";
import remove_icon from "../Assets/cart_cross_icon.png";
import { PaystackButton } from "react-paystack";

const CartItems = () => {
  const { getTotalCartAmount, all_product, cartItems, removeFromCart } =
    useContext(ShopContext);

  const publicKey = process.env.REACT_APP_PAYSTACK_PUBLIC_KEY;
  const amount = getTotalCartAmount() * 100; // Paystack wants amount in Kobo
  const email = "customer@example.com"; // Replace with logged-in user email
  const name = "Customer Name"; // Replace with logged-in user name

  const componentProps = {
    email,
    amount,
    publicKey,
    text: "Pay Now",
    onSuccess: (response) => {
      console.log("Payment success:", response);
      alert("Payment Successful!");
      // Optionally send response.reference to backend for verification
    },
    onClose: () => alert("Payment window closed"),
  };

  return (
    <div className="cartitems">
      <div className="cartitems-format-main">
        <p>Products</p>
        <p>Title</p>
        <p>Price</p>
        <p>Quantity</p>
        <p>Total</p>
        <p>Remove</p>
      </div>
      <hr />
      {all_product.map((e) => {
        if (cartItems[e.id] > 0) {
          return (
            <div key={e.id}>
              <div className="cartitems-format cartitems-format-main">
                <img src={e.image} alt="" className="carticon-product-icon" />
                <p>{e.name}</p>
                <p>₦{e.new_price}</p>
                <button className="cartitems-quantity">
                  {cartItems[e.id]}
                </button>
                <p>₦{e.new_price * cartItems[e.id]}</p>
                <img
                  className="cartitems-remove-icon"
                  src={remove_icon}
                  onClick={() => removeFromCart(e.id)}
                  alt=""
                />
              </div>
              <hr />
            </div>
          );
        } else {
          return null;
        }
      })}
      <div className="cartitems-down">
        <div className="cartitems-total">
          <h1>Cart Totals</h1>
          <div>
            <div className="cartitems-total-items">
              <p>Subtotal</p>
              <p>₦{getTotalCartAmount()}</p>
            </div>
            <hr />
            <div className="cartitems-total-items">
              <p>Shipping Fee</p>
              <p>Free</p>
            </div>
            <hr />
            <div className="cartitems-total-items">
              <h3>Total</h3>
              <h3>₦{getTotalCartAmount()}</h3>
            </div>
          </div>
          <PaystackButton className="payButton" {...componentProps} />
        </div>
      </div>
    </div>
  );
};

export default CartItems;
