import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Search, ShoppingCart, Menu, X, ChevronDown } from 'lucide-react';
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
            <span>English <ChevronDown size={14} /></span>
            <span>USD <ChevronDown size={14} /></span>
          </div>
          <div className="top-bar-right">
            <span className="auth-link" onClick={openLogin}>Sign In</span>
            <span className="divider">/</span>
            <span className="auth-link" onClick={openSignup}>Sign Up Here</span>
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
            <button className="nav-icon-btn cart-btn">
              <ShoppingCart size={20} />
              <span className="cart-count" key={cartCount}>{cartCount}</span>
            </button>
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
