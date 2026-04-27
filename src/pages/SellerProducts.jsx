import React from 'react';
import { Link, useParams } from 'react-router-dom';
import { ChevronRight } from 'lucide-react';
import FilterSidebar from '../components/products/FilterSidebar';
import ProductTopBar from '../components/products/ProductTopBar';
import ProductCard from '../components/common/ProductCard';
import { sellers } from '../data/dummyData';
import '../styles/CategoryProducts.css'; // Reusing styles for consistency

const SellerProducts = ({ addToCart }) => {
  const { id } = useParams();
  
  const seller = sellers.find(s => s.id === parseInt(id));

  if (!seller) {
    return (
      <div className="container" style={{ padding: '100px 0', textAlign: 'center' }}>
        <h2>Seller not found</h2>
        <Link to="/sellers" className="btn-primary" style={{ display: 'inline-block', marginTop: '20px', padding: '10px 25px', backgroundColor: 'var(--primary-color)', color: 'white', borderRadius: '5px' }}>Back to Sellers</Link>
      </div>
    );
  }

  return (
    <div className="category-products-page">
      <div className="category-breadcrumb-area">
        <div className="container">
          <ul className="breadcrumb">
            <li><Link to="/">Home</Link> <ChevronRight size={14} /></li>
            <li><Link to="/sellers">Sellers</Link> <ChevronRight size={14} /></li>
            <li className="active">{seller.name}</li>
          </ul>
        </div>
      </div>

      <div className="container">
        <div className="category-products-layout">
          <FilterSidebar />
          
          <main className="products-main-content">
            <ProductTopBar totalProducts={seller.products.length} />
            
            <div className="products-grid-listing">
              {seller.products.length > 0 ? (
                seller.products.map(product => (
                  <ProductCard 
                    key={product.id} 
                    product={product} 
                    onAddToCart={addToCart} 
                  />
                ))
              ) : (
                <div className="no-products" style={{ textAlign: 'center', padding: '50px', width: '100%' }}>
                  <p>No products found for this seller.</p>
                </div>
              )}
            </div>
          </main>
        </div>
      </div>
    </div>
  );
};

export default SellerProducts;
