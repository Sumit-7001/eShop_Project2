import React from 'react';
import { Link } from 'react-router-dom';
import '../../styles/BrandCard.css';

const BrandCard = ({ brand }) => {
  return (
    <Link to={`/brand/${brand.slug}`} className="brand-card">
      <div className="brand-logo-wrapper">
        <img src={brand.logo} alt={brand.name} className="brand-logo" />
      </div>
      <span className="brand-name">{brand.name}</span>
    </Link>
  );
};

export default BrandCard;
