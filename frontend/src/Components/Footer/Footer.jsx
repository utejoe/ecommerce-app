import React from 'react'
import './Footer.css'
import footer_logo from '../Assets/logo_big.png'
import instagram_icon from '../Assets/instagram_icon.png'
import pinterest_icon from '../Assets/pinterest_icon.png'
import whatsapp_icon from '../Assets/whatsapp_icon.png'
import { Link } from 'react-router-dom'
const Footer = ({ SetMenu }) => {
  return (
    <footer className="footer">
      <Link className="footer-logo"
        to="/"
        style={{
          textDecoration: "none",
        }}
        onClick={() => SetMenu("shop")} // <-- update menu here
      >
        <img src={footer_logo} alt="Shopper Logo" />
        <p>SHOPPER</p>
      </Link>
      <ul className="footer-links">
        <li>Company</li>
        <li>Products</li>
        <li>Offices</li>
        <li>About</li>
        <li>Contact</li>
      </ul>
      <div className="footer-social-icons">
        <div className="footer-icons-container">
          <img src={instagram_icon} alt="Instagram" />
        </div>
        <div className="footer-icons-container">
          <img src={pinterest_icon} alt="Pinterest" />
        </div>
        <div className="footer-icons-container">
          <img src={whatsapp_icon} alt="WhatsApp" />
        </div>
      </div>
      <div className="footer-copyright">
        <hr />
        <p>Copyright © {new Date().getFullYear()} All Rights Reserved</p>
      </div>
    </footer>
  );
};

export default Footer