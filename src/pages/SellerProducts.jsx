import React, { useState, useMemo } from 'react';
import { Link, useParams } from 'react-router-dom';
import { ChevronRight } from 'lucide-react';
import FilterSidebar from '../components/products/FilterSidebar';
import ProductTopBar from '../components/products/ProductTopBar';
import ProductCard from '../components/common/ProductCard';
import { sellers } from '../data/dummyData';
import '../styles/CategoryProducts.css'; // Reusing styles for consistency

const SellerProducts = ({ 
  addToCart,
  favoriteItems = [],
  compareItems = [],
  toggleFavorite,
  toggleCompare
}) => {
  const { id } = useParams();
  const [sortBy, setSortBy] = useState('relevance');
  const [itemsPerPage, setItemsPerPage] = useState(12);
  const [isMobileFilterOpen, setIsMobileFilterOpen] = useState(false);
  const [viewMode, setViewMode] = useState('grid');
  
  const seller = sellers.find(s => s.id === parseInt(id));

  const sortedProducts = useMemo(() => {
    if (!seller) return [];
    const products = [...seller.products];
    switch (sortBy) {
      case 'price-low-high':
        return products.sort((a, b) => a.price - b.price);
      case 'price-high-low':
        return products.sort((a, b) => b.price - a.price);
      case 'newest':
        return products.sort((a, b) => b.id - a.id);
      default:
        return products;
    }
  }, [seller, sortBy]);

  const displayedProducts = sortedProducts.slice(0, itemsPerPage);

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
          {/* Mobile Overlay */}
          {isMobileFilterOpen && (
            <div className="filter-overlay" onClick={() => setIsMobileFilterOpen(false)}></div>
          )}
          
          <FilterSidebar 
            isOpen={isMobileFilterOpen} 
            onClose={() => setIsMobileFilterOpen(false)} 
          />
          
          <main className="products-main-content">
            <ProductTopBar 
              totalProducts={sortedProducts.length} 
              sortBy={sortBy} 
              onSortChange={setSortBy}
              itemsPerPage={itemsPerPage}
              onItemsPerPageChange={setItemsPerPage}
              onFilterClick={() => setIsMobileFilterOpen(true)}
              viewMode={viewMode}
              onViewModeChange={setViewMode}
            />
            
            <div className={`products-grid-listing ${viewMode === 'list' ? 'list-view' : ''}`}>
              {displayedProducts.length > 0 ? (
                displayedProducts.map(product => (
                  <ProductCard 
                    key={product.id} 
                    product={product} 
                    onAddToCart={addToCart} 
                    viewMode={viewMode}
                    isFavorite={favoriteItems.some(item => item.id === product.id)}
                    isComparing={compareItems.some(item => item.id === product.id)}
                    onToggleFavorite={toggleFavorite}
                    onToggleCompare={toggleCompare}
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

