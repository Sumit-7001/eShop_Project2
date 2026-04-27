import React from 'react';
import { Link, useParams } from 'react-router-dom';
import { ChevronRight, Package } from 'lucide-react';
import ProductCard from '../components/common/ProductCard';
import { brands, brandProducts } from '../data/dummyData';
import '../styles/BrandProducts.css';

const BrandProducts = ({ addToCart }) => {
  const { slug } = useParams();
  const brand = brands.find(b => b.slug === slug);
  const products = brandProducts[slug] || [];

  if (!brand) {
    return (
      <div className="brand-products-page">
        <div className="container">
          <div className="brand-not-found">
            <Package size={64} />
            <h2>Brand not found</h2>
            <p>The brand you're looking for doesn't exist.</p>
            <Link to="/brands" className="btn-back-brands">Browse All Brands</Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="brand-products-page">
      {/* Breadcrumb */}
      <div className="brand-breadcrumb-area">
        <div className="container">
          <ul className="breadcrumb">
            <li><Link to="/">Home</Link> <ChevronRight size={14} /></li>
            <li><Link to="/brands">Brands</Link> <ChevronRight size={14} /></li>
            <li className="active">{brand.name}</li>
          </ul>
        </div>
      </div>

      {/* Brand Hero Banner */}
      <div className="brand-hero">
        <div className="container">
          <div className="brand-hero-content">
            <div className="brand-hero-logo">
              <img src={brand.logo} alt={brand.name} />
            </div>
            <div className="brand-hero-info">
              <h1>{brand.name}</h1>
              <p className="brand-hero-tagline">Explore the latest collection from {brand.name}</p>
              <div className="brand-hero-stats">
                <span className="stat-item">
                  <strong>{products.length}</strong> Products
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Products Grid */}
      <div className="container">
        <div className="brand-products-section">
          <div className="brand-products-header">
            <h2>All {brand.name} Products</h2>
            <span className="product-count">{products.length} items found</span>
          </div>

          {products.length > 0 ? (
            <div className="brand-products-grid">
              {products.map(product => (
                <ProductCard
                  key={product.id}
                  product={product}
                  onAddToCart={addToCart}
                />
              ))}
            </div>
          ) : (
            <div className="brand-no-products">
              <Package size={48} />
              <h3>No products available yet</h3>
              <p>Check back soon for new arrivals from {brand.name}!</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default BrandProducts;
