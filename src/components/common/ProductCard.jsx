import React, { memo } from 'react';
import { Link } from 'react-router-dom';
import { Star, ShoppingCart, Heart, ArrowLeftRight } from 'lucide-react';
import '../../styles/ProductCard.css';

const ProductCard = ({ 
  product, 
  onAddToCart, 
  viewMode = 'grid',
  isFavorite = false,
  isComparing = false,
  onToggleFavorite,
  onToggleCompare
}) => {
  const { id, title, price, oldPrice, rating, image, sale } = product;

  return (
    <div className={`product-card ${viewMode === 'list' ? 'list-card' : ''}`}>
      {sale && <div className="sale-badge">SALE</div>}
      
      <div className="product-actions-floating">
        <button 
          className={`floating-action-btn ${isFavorite ? 'active' : ''}`}
          onClick={(e) => {
            e.preventDefault();
            e.stopPropagation();
            if (onToggleFavorite) onToggleFavorite(product);
          }}
          title={isFavorite ? "Remove from Favorites" : "Add to Favorites"}
        >
          <Heart size={16} fill={isFavorite ? "#ff4d4d" : "none"} color={isFavorite ? "#ff4d4d" : "currentColor"} />
        </button>
        <button 
          className={`floating-action-btn ${isComparing ? 'active' : ''}`}
          onClick={(e) => {
            e.preventDefault();
            e.stopPropagation();
            if (onToggleCompare) onToggleCompare(product);
          }}
          title={isComparing ? "Remove from Compare" : "Compare Product"}
        >
          <ArrowLeftRight size={16} />
        </button>
      </div>

      <Link to={`/product/${id}`} className="product-image-wrapper">
        <img src={image} alt={title} className="product-image" />
      </Link>
      <div className="product-info">
        <div className="product-rating">
          {[...Array(5)].map((_, i) => (
            <Star
              key={i}
              size={14}
              fill={i < Math.floor(rating) ? "#FFD700" : "none"}
              color={i < Math.floor(rating) ? "#FFD700" : "#ccc"}
            />
          ))}
          <span className="rating-value">{rating}</span>
        </div>
        <Link to={`/product/${id}`}>
          <h3 className="product-title">{title}</h3>
        </Link>
        <div className="product-price-row">
          <div className="price-container">
            <span className="current-price">${price}</span>
            {oldPrice && <span className="old-price">${oldPrice}</span>}
          </div>
          <button className="add-to-cart-btn" onClick={(e) => {
            e.preventDefault();
            onAddToCart(product);
          }}>
            <ShoppingCart size={18} />
          </button>
        </div>
      </div>
    </div>
  );
};

export default memo(ProductCard);
