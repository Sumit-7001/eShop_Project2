import React from 'react';
import { Link } from 'react-router-dom';
import BrandCard from '../common/BrandCard';
import { brands } from '../../data/dummyData';
import '../../styles/BrandsRow.css';

const BrandsRow = () => {
  const displayedBrands = brands.slice(0, 8);

  return (
    <section className="brands-section">
      <div className="container">
        <div className="brands-header">
          <h2>Top Brands</h2>
          <Link to="/brands" className="see-all-link">See All</Link>
        </div>
        <div className="brands-scroll no-scrollbar">
          {displayedBrands.map(brand => (
            <BrandCard key={brand.id} brand={brand} />
          ))}
        </div>
      </div>
    </section>
  );
};

export default BrandsRow;
