import React from 'react';
import { Star } from 'lucide-react';
import '../../styles/SellerCard.css';

const SellerCard = ({ seller }) => {
  return (
    <div className="seller-card">
      <div className="seller-logo-wrapper">
        <img src={seller.logo} alt={seller.name} className="seller-logo" />
      </div>
      <div className="seller-info">
        <div className="rating-stars">
          {[...Array(5)].map((_, index) => (
            <Star 
              key={index} 
              size={14} 
              fill={index < seller.rating ? "#ffcc00" : "none"} 
              color={index < seller.rating ? "#ffcc00" : "#ddd"} 
            />
          ))}
        </div>
        <h3 className="seller-name">{seller.name}</h3>
        <p className="seller-description">{seller.description}</p>
        <button className="view-products-btn">View Products</button>
      </div>
    </div>
  );
};

export default SellerCard;
