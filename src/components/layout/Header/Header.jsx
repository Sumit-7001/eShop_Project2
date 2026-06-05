import React, { useState, useEffect, memo } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { ShoppingCart, Menu, X, ArrowLeftRight, Heart, Sun, Moon, ShoppingBag } from 'lucide-react';
import { useApp } from '../../context/AppContext';
import SearchBar from '../common/SearchBar';
import '../../styles/Header.css';

const Header = memo(() => {
  const {
    cartCount,
    favoriteItems,
    compareItems,
    toggleFavorite,
    addToCart,
    currentUser,
    handleSignOut,
    openAuthModal,
    isDark,
    toggleDarkMode,
  } = useApp();

  const [isSticky, setIsSticky] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [favoritesSidebarOpen, setFavoritesSidebarOpen] = useState(false);
  const location = useLocation();
  const isAdmin = currentUser?.role === 'admin';

  useEffect(() => {
    const handleScroll = () => setIsSticky(window.scrollY > 50);
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    setMobileMenuOpen(false);
    setFavoritesSidebarOpen(false);
  }, [location.pathname]);

  // Lock body scroll when sidebar is open
  useEffect(() => {
    document.body.style.overflow = favoritesSidebarOpen ? 'hidden' : '';
    return () => { document.body.style.overflow = ''; };
  }, [favoritesSidebarOpen]);

  return (
    <header className="header">
      {/* Top Bar */}
      <div className={`top-bar ${isAdmin ? 'admin-top-bar' : ''}`}>
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

          {isAdmin && (
            <div className="secure-portal-banner">
              <span className="shield-icon">🛡️</span>
              <span>SECURE ADMIN PORTAL</span>
            </div>
          )}

          <div className="top-bar-right">
            <span className="lang-selector coral-text">EN</span>
            {currentUser ? (
              <span className="auth-links-group coral-text">
                <span className="user-greeting">Hello, {currentUser.name}</span>
                {isAdmin && (
                  <Link to="/admin" className="admin-panel-badge">Admin Panel</Link>
                )}
                <span className="auth-link" onClick={handleSignOut}>Sign Out</span>
              </span>
            ) : (
              <span className="auth-links-group coral-text">
                <span className="auth-link" onClick={() => openAuthModal('login')}>Sign In</span>
                <span className="divider">/</span>
                <span className="auth-link" onClick={() => openAuthModal('signup')}>Sign Up</span>
              </span>
            )}
          </div>
        </div>
      </div>

      {/* Main Navbar */}
      <nav className={`navbar ${isSticky ? 'sticky' : ''}`}>
        <div className="container navbar-content">
          <Link to="/" className="logo" aria-label="MarketHub Home">
            <img src="/markethub_logo.png" alt="M" className="logo-icon" style={{ background: 'transparent', padding: 0, objectFit: 'contain' }} />
            <span className="logo-text" style={{ fontWeight: '900', letterSpacing: '-0.5px' }}>
              <span style={{ color: 'var(--text-dark)' }}>Market</span>
              <span style={{ color: 'var(--primary-color)' }}>Hub</span>
            </span>
          </Link>

          {/* Search Bar */}
          <SearchBar />

          {/* Nav Links */}
          <ul className={`nav-links ${mobileMenuOpen ? 'active' : ''}`} role="navigation">
            <li><Link to="/" className={location.pathname === '/' ? 'active' : ''}>Home</Link></li>
            <li><Link to="/sellers" className={location.pathname === '/sellers' ? 'active' : ''}>Sellers</Link></li>
            <li><Link to="/contact" className={location.pathname === '/contact' ? 'active' : ''}>Contact</Link></li>
            <li><Link to="/faqs" className={location.pathname === '/faqs' ? 'active' : ''}>FAQs</Link></li>
            <li><Link to="/blogs" className={location.pathname === '/blogs' ? 'active' : ''}>Blog</Link></li>
          </ul>

          {/* Action Icons */}
          <div className="nav-actions">
            {/* Dark Mode Toggle */}
            <button
              className="nav-icon-btn dark-mode-toggle"
              onClick={toggleDarkMode}
              title={isDark ? 'Switch to Light Mode' : 'Switch to Dark Mode'}
              aria-label="Toggle dark mode"
            >
              {isDark ? <Sun size={20} /> : <Moon size={20} />}
            </button>

            {/* Compare */}
            <Link to="/compare" className="nav-icon-btn compare-btn" title="Compare Products" aria-label={`Compare (${compareItems.length})`}>
              <ArrowLeftRight size={20} />
              {compareItems.length > 0 && (
                <span className="compare-count">{compareItems.length}</span>
              )}
            </Link>

            {/* Wishlist */}
            <button
              className="nav-icon-btn wishlist-btn"
              onClick={() => setFavoritesSidebarOpen(true)}
              title="View Wishlist"
              aria-label={`Wishlist (${favoriteItems.length})`}
            >
              <Heart size={20} />
              {favoriteItems.length > 0 && (
                <span className="wishlist-count">{favoriteItems.length}</span>
              )}
            </button>

            {/* Cart */}
            <Link to="/cart" className="nav-icon-btn cart-btn" title="Shopping Cart" aria-label={`Cart (${cartCount})`}>
              <ShoppingCart size={20} />
              <span className="cart-count">{cartCount}</span>
            </Link>

            {/* Mobile Menu Toggle */}
            <button
              className="menu-toggle"
              onClick={() => setMobileMenuOpen(prev => !prev)}
              aria-label="Toggle menu"
              aria-expanded={mobileMenuOpen}
            >
              {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>
        </div>
      </nav>

      {/* Wishlist Sidebar Drawer */}
      <div
        className={`favorites-sidebar-backdrop ${favoritesSidebarOpen ? 'active' : ''}`}
        onClick={() => setFavoritesSidebarOpen(false)}
        aria-hidden="true"
      >
        <div
          className={`favorites-sidebar ${favoritesSidebarOpen ? 'open' : ''}`}
          onClick={e => e.stopPropagation()}
          role="dialog"
          aria-label="Wishlist"
        >
          <div className="favorites-sidebar-header">
            <h3>
              <Heart size={18} style={{ marginRight: 8, color: 'var(--primary-color)' }} />
              My Wishlist ({favoriteItems.length})
            </h3>
            <button className="close-sidebar-btn" onClick={() => setFavoritesSidebarOpen(false)} aria-label="Close wishlist">
              <X size={24} />
            </button>
          </div>

          <div className="favorites-sidebar-content">
            {favoriteItems.length === 0 ? (
              <div className="favorites-empty-state">
                <Heart size={52} className="empty-heart-icon" />
                <p>Your wishlist is empty.</p>
                <span>Save products you love to buy them later!</span>
                <button className="continue-shopping-btn" onClick={() => setFavoritesSidebarOpen(false)}>
                  Continue Shopping
                </button>
              </div>
            ) : (
              <div className="favorites-list">
                {favoriteItems.map(item => (
                  <div key={item.id} className="favorites-item">
                    <Link
                      to={`/product/${item.id}`}
                      className="fav-item-image-link"
                      onClick={() => setFavoritesSidebarOpen(false)}
                    >
                      <div className="fav-item-image-wrapper">
                        <img src={item.image} alt={item.title} className="fav-item-image" />
                      </div>
                    </Link>
                    <div className="fav-item-details">
                      <Link
                        to={`/product/${item.id}`}
                        className="fav-item-title-link"
                        onClick={() => setFavoritesSidebarOpen(false)}
                      >
                        <h4 className="fav-item-title">{item.title}</h4>
                      </Link>
                      <div className="fav-item-price">₹{item.price}</div>
                      <div className="fav-item-actions">
                        <button
                          className="fav-add-to-cart-btn"
                          onClick={() => {
                            addToCart(item);
                            setFavoritesSidebarOpen(false);
                          }}
                        >
                          <ShoppingBag size={12} style={{ marginRight: 4 }} />
                          Add to Cart
                        </button>
                        <button
                          className="fav-remove-btn"
                          onClick={() => toggleFavorite(item)}
                          title="Remove from wishlist"
                        >
                          Remove
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </header>
  );
});

Header.displayName = 'Header';

export default Header;
