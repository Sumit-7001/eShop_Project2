import React from 'react';
import { Link, useParams } from 'react-router-dom';
import { ChevronRight } from 'lucide-react';
import FilterSidebar from '../components/products/FilterSidebar';
import ProductTopBar from '../components/products/ProductTopBar';
import ProductCard from '../components/common/ProductCard';
import { smartphones, watches, furniture, kids } from '../data/dummyData';
import '../styles/CategoryProducts.css';

const CategoryProducts = ({ addToCart }) => {
  const { slug } = useParams();

  const categoryMap = {
    smartphones: {
      title: 'Smartphones & Basic Mobiles',
      data: smartphones
    },
    watches: {
      title: 'Top Rated Watches',
      data: watches
    },
    furniture: {
      title: 'Furniture Products',
      data: furniture
    },
    kids: {
      title: "Kid's Section",
      data: kids
    }
  };

  const currentCategory = categoryMap[slug] || categoryMap.smartphones;

  return (
    <div className="category-products-page">
      <div className="category-breadcrumb-area">
        <div className="container">
          <ul className="breadcrumb">
            <li><Link to="/">Home</Link> <ChevronRight size={14} /></li>
            <li><Link to="/categories">Section</Link> <ChevronRight size={14} /></li>
            <li className="active">{currentCategory.title}</li>
          </ul>
        </div>
      </div>

      <div className="container">
        <div className="category-products-layout">
          <FilterSidebar />
          
          <main className="products-main-content">
            <ProductTopBar totalProducts={currentCategory.data.length} />
            
            <div className="products-grid-listing">
              {currentCategory.data.map(product => (
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
