import React from 'react';
import '../../styles/BrandCard.css';

const BrandCard = ({ brand }) => {
  return (
    <div className="brand-card">
      <div className="brand-logo-wrapper">
        <img src={brand.logo} alt={brand.name} className="brand-logo" />
      </div>
      <span className="brand-name">{brand.name}</span>
    </div>
  );
};

export default BrandCard;
