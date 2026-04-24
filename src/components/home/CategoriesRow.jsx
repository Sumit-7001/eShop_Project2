import React from 'react';
import { Link } from 'react-router-dom';
import CategoryCard from '../common/CategoryCard';
import { categories } from '../../data/dummyData';
import '../../styles/CategoriesRow.css';

const CategoriesRow = () => {
  const displayedCategories = categories.slice(0, 8);

  return (
    <section className="categories-section">
      <div className="container">
        <div className="categories-header">
          <h2>Popular Categories</h2>
          <Link to="/categories" className="see-all-link">See All</Link>
        </div>
        <div className="categories-scroll no-scrollbar">
          {displayedCategories.map(category => (
            <CategoryCard key={category.id} category={category} />
          ))}
        </div>
      </div>
    </section>
  );
};

export default CategoriesRow;
