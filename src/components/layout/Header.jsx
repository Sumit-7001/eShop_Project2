import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Search, ShoppingCart, Menu, X, ChevronDown, ArrowLeftRight } from 'lucide-react';
import '../../styles/Header.css';

const Header = ({ cartCount, openLogin, openSignup }) => {
  const [isSticky, setIsSticky] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const location = useLocation();

  useEffect(() => {
    const handleScroll = () => {
      setIsSticky(window.scrollY > 50);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Close mobile menu on route change
  useEffect(() => {
    setMobileMenuOpen(false);
  }, [location]);

  return (
    <header className="header">
      <div className="top-bar">
        <div className="container top-bar-content">
          <div className="top-bar-left">
            <span className="top-icon apple-icon">
              <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" viewBox="0 0 384 512">
                <path d="M318.7 268.7c-.2-36.7 16.4-64.4 50-84.8-18.8-26.9-47.2-41.7-84.7-44.6-35.5-2.8-74.3 20.7-88.5 20.7-15 0-49.4-19.7-76.4-19.7C63.3 141.2 4 184.8 4 273.5q0 39.3 14.4 81.2c12.8 36.7 59 126.7 107.2 125.2 25.2-.6 43-17.9 75.8-17.9 31.8 0 48.3 17.9 76.4 17.9 48.6-.7 90.4-82.5 102.6-119.3-65.2-30.7-61.7-90-61.7-91.9zm-56.6-164.2c27.3-32.4 24.8-61.9 24-72.5-24.1 1.4-52 16.4-67.9 34.9-17.5 19.8-27.8 44.3-25.6 71.9 26.1 2 49.9-11.4 69.5-34.3z"/>
              </svg>
            </span>
            <span className="top-icon play-icon">
              <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" viewBox="0 0 24 24">
                <polygon points="5 3 19 12 5 21 5 3"></polygon>
              </svg>
            </span>
          </div>
          <div className="top-bar-right">
            <span className="lang-selector coral-text">EN <ChevronDown size={14} /></span>
            <span className="auth-links-group coral-text">
              <span className="auth-link" style={{cursor: 'pointer'}} onClick={openLogin}>Sign In</span>
              <span style={{margin: '0 5px'}}>/</span>
              <span className="auth-link" style={{cursor: 'pointer'}} onClick={openSignup}>Sign Up Here</span>
            </span>
          </div>
        </div>
      </div>

      <nav className={`navbar ${isSticky ? 'sticky' : ''}`}>
        <div className="container navbar-content">
          <Link to="/" className="logo">
            <span className="logo-icon">e</span>
            <span className="logo-text">Shop</span>
          </Link>

          <ul className={`nav-links ${mobileMenuOpen ? 'active' : ''}`}>
            <li><Link to="/" className={location.pathname === '/' ? 'active' : ''}>Home</Link></li>
            <li><Link to="/sellers" className={location.pathname === '/sellers' ? 'active' : ''}>Sellers</Link></li>
            <li><Link to="/contact" className={location.pathname === '/contact' ? 'active' : ''}>Contact Us</Link></li>
            <li><Link to="/faqs" className={location.pathname === '/faqs' ? 'active' : ''}>FAQs</Link></li>
            <li><Link to="/blogs" className={location.pathname === '/blogs' ? 'active' : ''}>Blogs</Link></li>
          </ul>

          <div className="nav-actions">
            <button className="nav-icon-btn"><Search size={20} /></button>
            <Link to="/compare" className="nav-icon-btn"><ArrowLeftRight size={20} /></Link>
            <Link to="/cart" className="nav-icon-btn cart-btn">
              <ShoppingCart size={20} />
              <span className="cart-count" key={cartCount}>{cartCount}</span>
            </Link>
            <button 
              className="menu-toggle" 
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            >
              {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>
        </div>
      </nav>
    </header>
  );
};

export default Header;
