import React from 'react';
import { Link } from 'react-router-dom';
import emptyCompareImg from '../assets/images/empty_compare.png';
import { useApp } from '../context/AppContext';
import '../styles/Compare.css';

const Compare = () => {
  const { compareItems, removeFromCompare: onRemoveFromCompare, addToCart: onAddToCart } = useApp();
  return (
    <div className="compare-page">
      <div className="breadcrumb-section">
        <div className="container">
          <div className="breadcrumb">
            <Link to="/">Home</Link>
            <span className="separator">&gt;</span>
            <span className="current">Compare</span>
          </div>
        </div>
      </div>

      <div className="compare-content container">
        {compareItems.length === 0 ? (
          <div className="empty-state">
            <img src={emptyCompareImg} alt="No items to compare" className="empty-compare-img" />
            <h3 className="empty-text">No products to compare</h3>
            <p className="empty-subtext">You have not added any products to compare yet. Add products to compare to see them here.</p>
            <Link to="/" className="back-to-shop-btn">Continue Shopping</Link>
          </div>
        ) : (
          <div className="compare-wrapper">
            <div className="compare-header">
              <h2>Product Comparison ({compareItems.length}/4)</h2>
              <p>Compare details of your selected products to make the right choice.</p>
            </div>
            
            <div className="compare-table-wrapper">
              <div className="compare-table">
                {/* Headers Column */}
                <div className="compare-col-header">
                  <div className="compare-row-label first-row">Product</div>
                  <div className="compare-row-label">Price</div>
                  <div className="compare-row-label">Rating</div>
                  <div className="compare-row-label">Availability</div>
                  <div className="compare-row-label">Action</div>
                </div>

                {/* Product Columns */}
                {compareItems.map(item => (
                  <div key={item.id} className="compare-col">
                    {/* First row - product header card */}
                    <div className="compare-row-value first-row compare-product-info">
                      <button 
                        className="remove-compare-btn" 
                        onClick={() => onRemoveFromCompare(item.id)}
                        title="Remove from comparison"
                      >
                        ✕
                      </button>
                      <div className="compare-img-container">
                        <img src={item.image} alt={item.title} className="compare-img" />
                      </div>
                      <Link to={`/product/${item.id}`}>
                        <h4 className="compare-title">{item.title}</h4>
                      </Link>
                    </div>

                    {/* Second row - Price */}
                    <div className="compare-row-value compare-price-row">
                      <span className="compare-curr-price">₹{item.price}</span>
                      {item.oldPrice && <span className="compare-old-price">₹{item.oldPrice}</span>}
                    </div>

                    {/* Third row - Rating */}
                    <div className="compare-row-value compare-rating-row">
                      <span className="compare-rating-star">★</span>
                      <span className="compare-rating-text">{item.rating} / 5</span>
                    </div>

                    {/* Fourth row - Availability */}
                    <div className="compare-row-value">
                      {item.sale ? (
                        <span className="compare-badge compare-sale-badge">SALE ACTIVE</span>
                      ) : (
                        <span className="compare-badge compare-stock-badge">IN STOCK</span>
                      )}
                    </div>

                    {/* Fifth row - Actions */}
                    <div className="compare-row-value compare-action-row">
                      <button 
                        className="compare-cart-btn"
                        onClick={() => onAddToCart(item)}
                      >
                        Add to Cart
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Compare;
