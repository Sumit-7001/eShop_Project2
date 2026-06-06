import React from 'react';
import { Link } from 'react-router-dom';
import { Facebook, Twitter, Instagram, Linkedin, Mail, Phone, MapPin } from 'lucide-react';
import '../../styles/Footer.css';

const Footer = () => {
  return (
    <footer className="footer">
      <div className="container footer-grid">
        <div className="footer-about">
          <div className="logo" style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <img src="/markethub_logo.png" alt="MarketHub" className="logo-icon" style={{ background: 'transparent', padding: 0, width: '32px', height: '32px', objectFit: 'contain' }} />
            <span className="logo-text" style={{ fontSize: '1.8rem', fontWeight: '900', letterSpacing: '-0.5px' }}>
              <span style={{ color: 'var(--text-dark)' }}>Market</span>
              <span style={{ color: 'var(--primary-color)' }}>Hub</span>
            </span>
          </div>
          <p className="about-text">
            MarketHub is a multi-purpose eCommerce platform best suitable for all kinds of sectors like Electronics, Fashion, Groceries and Vegetables, Flowers, Gift articles, Medical and more.
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
            <li><Mail size={16} /> markethub@gmail.com</li>
            <li><MapPin size={16} /> 123 Street, City, Country</li>
          </ul>
        </div>

        <div className="footer-links">
          <h3>Useful Links</h3>
          <ul>
            <li><Link to="/sellers">Become a Seller</Link></li>
            <li><Link to="/affiliate">Become an Affiliate User</Link></li>
            <li><Link to="/return-policy">Return Policy</Link></li>
            <li><Link to="/shipping-policy">Shipping Policy</Link></li>
            <li><Link to="/categories">Products</Link></li>
          </ul>
        </div>

        <div className="footer-links">
          <h3>About Us</h3>
          <ul>
            <li><Link to="/about">About Us</Link></li>
            <li><Link to="/contact">Contact Us</Link></li>
            <li><Link to="/terms-conditions">Terms & Conditions</Link></li>
            <li><Link to="/privacy-policy">Privacy Policy</Link></li>
          </ul>
        </div>
      </div>
      <div className="footer-bottom">
        <div className="container">
          <p>&copy; 2026 MarketHub - ecommerce. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
