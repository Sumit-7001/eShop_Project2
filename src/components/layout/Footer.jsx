import React from 'react';
import { Facebook, Twitter, Instagram, Linkedin, Mail, Phone, MapPin } from 'lucide-react';
import '../../styles/Footer.css';

const Footer = () => {
  return (
    <footer className="footer">
      <div className="container footer-grid">
        <div className="footer-about">
          <div className="logo">
            <span className="logo-icon">e</span>
            <span className="logo-text">Shop</span>
          </div>
          <p className="about-text">
            eShop is a multi-purpose eCommerce platform best suitable for all kinds of sectors like Electronics, Fashion, Groceries and Vegetables, Flowers, Gift articles, Medical and more.
          </p>
          <div className="social-links">
            <a href="#"><Facebook size={20} /></a>
            <a href="#"><Twitter size={20} /></a>
            <a href="#"><Instagram size={20} /></a>
            <a href="#"><Linkedin size={20} /></a>
          </div>
        </div>

        <div className="footer-links">
          <h3>Call Us</h3>
          <ul>
            <li><Phone size={16} /> 1234567890</li>
            <li><h3>Mail Us</h3></li>
            <li><Mail size={16} /> eshop@gmail.com</li>
            <li><MapPin size={16} /> 123 Street, City, Country</li>
          </ul>
        </div>

        <div className="footer-links">
          <h3>Useful Links</h3>
          <ul>
            <li><a href="#">Become a Seller</a></li>
            <li><a href="#">Become an Affiliate User</a></li>
            <li><a href="#">Return Policy</a></li>
            <li><a href="#">Shipping Policy</a></li>
            <li><a href="#">Products</a></li>
          </ul>
        </div>

        <div className="footer-links">
          <h3>About Us</h3>
          <ul>
            <li><a href="#">About Us</a></li>
            <li><a href="#">Contact Us</a></li>
            <li><a href="#">Terms & Conditions</a></li>
            <li><a href="#">Privacy Policy</a></li>
          </ul>
        </div>
      </div>
      <div className="footer-bottom">
        <div className="container">
          <p>&copy; 2026 eShop - ecommerce. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
