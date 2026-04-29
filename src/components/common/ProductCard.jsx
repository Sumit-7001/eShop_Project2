import React from 'react';
import { Link } from 'react-router-dom';
import { Star, ShoppingCart } from 'lucide-react';
import '../../styles/ProductCard.css';

const ProductCard = ({ product, onAddToCart, viewMode = 'grid' }) => {
  const { id, title, price, oldPrice, rating, image, sale } = product;

  return (
    <div className={`product-card ${viewMode === 'list' ? 'list-card' : ''}`}>
      {sale && <div className="sale-badge">SALE</div>}
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

export default ProductCard;
