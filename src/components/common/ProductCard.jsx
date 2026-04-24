import React from 'react';
import { Star, ShoppingCart } from 'lucide-react';
import '../../styles/ProductCard.css';

const ProductCard = ({ product, onAddToCart }) => {
  const { title, price, oldPrice, rating, image, sale } = product;

  return (
    <div className="product-card">
      {sale && <div className="sale-badge">SALE</div>}
      <div className="product-image-wrapper">
        <img src={image} alt={title} className="product-image" />
      </div>
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
        <h3 className="product-title">{title}</h3>
        <div className="product-price-row">
          <div className="price-container">
            <span className="current-price">${price}</span>
            {oldPrice && <span className="old-price">${oldPrice}</span>}
          </div>
          <button className="add-to-cart-btn" onClick={onAddToCart}>
            <ShoppingCart size={18} />
          </button>
        </div>
      </div>
    </div>
  );
};

export default ProductCard;
