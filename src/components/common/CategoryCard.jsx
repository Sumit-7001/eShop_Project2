import React from 'react';
import '../../styles/CategoryCard.css';

const CategoryCard = ({ category }) => {
  return (
    <div className="category-card">
      <div className="category-image-wrapper">
        <img src={category.image} alt={category.name} className="category-img" />
      </div>
      <span className="category-name">{category.name}</span>
    </div>
  );
};

export default CategoryCard;
