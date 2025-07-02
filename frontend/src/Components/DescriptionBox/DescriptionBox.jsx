import React from 'react'
import './DescriptionBox.css'

const DescriptionBox = () => {
  return (
    <div className="descriptionbox">
      <div className="descriptionbox-navigator">
        <div className="descriptionbox-nav-box">Description</div>
        <div className="descriptionbox-nav-box fade">Reviews (122)</div>
      </div>
      <div className="descriptionbox-description">
        <p>
          Shopper is a modern and user-friendly e-commerce website designed to
          offer customers a seamless and enjoyable online shopping experience.
          It features a wide selection of high-quality products ranging from
          fashion and electronics to home essentials and beauty items, all
          available at competitive prices. The platform is built with a clean,
          responsive design that works effortlessly across all devices, ensuring
          easy navigation and quick product discovery. Shopper provides a secure
          checkout system with multiple payment options, along with customer
          accounts for order tracking and profile management. Behind the scenes,
          it offers efficient tools for managing products, orders, and
          inventory, making it a reliable solution for both shoppers and
          business owners alike.
        </p>
        <p>
          With its focus on simplicity and speed, Shopper makes online shopping
          effortless and convenient. Customers can quickly find what they need
          and enjoy a smooth checkout process, while businesses benefit from
          easy management and real-time insights.
        </p>
      </div>
    </div>
  );
}

export default DescriptionBox