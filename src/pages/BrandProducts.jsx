import React, { useState, useMemo, useEffect } from 'react';
import { Link, useParams } from 'react-router-dom';
import { ChevronRight, Package } from 'lucide-react';
import ProductCard from '../components/common/ProductCard';
import Pagination from '../components/common/Pagination';
import { brands, brandProducts } from '../data/dummyData';
import { useApp } from '../context/AppContext';
import '../styles/BrandProducts.css';

const BrandProducts = () => {
  const { addToCart, isFavorite, isComparing, toggleFavorite, toggleCompare } = useApp();
  const { slug } = useParams();
  const brand = brands.find(b => b.slug === slug);
  const products = brandProducts[slug] || [];
  const [sortBy, setSortBy] = useState('relevance');
  const [itemsPerPage, setItemsPerPage] = useState(9);
  const [currentPage, setCurrentPage] = useState(1);

  useEffect(() => {
    setCurrentPage(1);
  }, [itemsPerPage, sortBy, slug]);

  const sortedProducts = useMemo(() => {
    const sorted = [...products];
    switch (sortBy) {
      case 'price-low-high':
        return sorted.sort((a, b) => a.price - b.price);
      case 'price-high-low':
        return sorted.sort((a, b) => b.price - a.price);
      case 'newest':
        return sorted.sort((a, b) => b.id - a.id);
      default:
        return sorted;
    }
  }, [products, sortBy]);

  let totalPages = 1;
  let displayedProducts = sortedProducts;
  if (itemsPerPage !== 'All') {
    totalPages = Math.ceil(sortedProducts.length / itemsPerPage);
    const startIndex = (currentPage - 1) * itemsPerPage;
    displayedProducts = sortedProducts.slice(startIndex, startIndex + itemsPerPage);
  }

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
            <div className="brand-products-header-right">
              <span className="product-count">{products.length} items found</span>
              <div className="brand-sort-by">
                <span>Show:</span>
                <select value={itemsPerPage} onChange={(e) => setItemsPerPage(e.target.value === 'All' ? 'All' : Number(e.target.value))}>
                  <option value="All">All</option>
                  {Array.from({ length: 20 }, (_, i) => i + 3).map(n => (
                    <option key={n} value={n}>{n}</option>
                  ))}
                </select>
              </div>
              <div className="brand-sort-by">
                <select value={sortBy} onChange={(e) => setSortBy(e.target.value)}>
                  <option value="relevance">Relevance</option>
                  <option value="price-low-high">Price: Low to High</option>
                  <option value="price-high-low">Price: High to Low</option>
                  <option value="newest">Newest Arrivals</option>
                </select>
              </div>
            </div>
          </div>

          {displayedProducts.length > 0 ? (
            <div className="brand-products-grid">
              {displayedProducts.map(product => (
                <ProductCard
                  key={product.id}
                  product={product}
                  onAddToCart={addToCart}
                  isFavorite={isFavorite(product.id)}
                  isComparing={isComparing(product.id)}
                  onToggleFavorite={toggleFavorite}
                  onToggleCompare={toggleCompare}
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
          {itemsPerPage !== 'All' && totalPages > 1 && (
            <div style={{ marginTop: '40px', display: 'flex', justifyContent: 'center' }}>
              <Pagination 
                currentPage={currentPage}
                totalPages={totalPages}
                onPageChange={setCurrentPage}
              />
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default BrandProducts;

