import React from 'react';
import { Link } from 'react-router-dom';
import { ChevronRight } from 'lucide-react';
import FilterSidebar from '../components/products/FilterSidebar';
import ProductTopBar from '../components/products/ProductTopBar';
import ProductCard from '../components/common/ProductCard';
import { smartphones } from '../data/dummyData';
import '../styles/CategoryProducts.css';

const CategoryProducts = ({ addToCart }) => {
  return (
    <div className="category-products-page">
      <div className="category-breadcrumb-area">
        <div className="container">
          <ul className="breadcrumb">
            <li><Link to="/">Home</Link> <ChevronRight size={14} /></li>
            <li><Link to="/categories">Section</Link> <ChevronRight size={14} /></li>
            <li className="active">Smartphones & Basic Mobiles</li>
          </ul>
        </div>
      </div>

      <div className="container">
        <div className="category-products-layout">
          <FilterSidebar />
          
          <main className="products-main-content">
            <ProductTopBar totalProducts={smartphones.length} />
            
            <div className="products-grid-listing">
              {smartphones.map(product => (
                <ProductCard 
                  key={product.id} 
                  product={product} 
                  onAddToCart={addToCart} 
                />
              ))}
            </div>
          </main>
        </div>
      </div>
    </div>
  );
};

export default CategoryProducts;
