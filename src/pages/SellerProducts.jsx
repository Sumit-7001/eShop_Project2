import React, { useState, useMemo, useEffect } from 'react';
import { Link, useParams } from 'react-router-dom';
import { ChevronRight } from 'lucide-react';
import FilterSidebar from '../components/products/FilterSidebar';
import ProductTopBar from '../components/products/ProductTopBar';
import ProductCard from '../components/common/ProductCard';
import Pagination from '../components/common/Pagination';
import { sellers, getProductsBySeller } from '../data/dummyData';
import { useApp } from '../context/AppContext';
import { applyFilters } from '../utils/filterHelpers';
import '../styles/CategoryProducts.css';

const SellerProducts = () => {
  const { addToCart, isFavorite, isComparing, toggleFavorite, toggleCompare } = useApp();
  const { id } = useParams();
  const [sortBy, setSortBy] = useState('relevance');
  const [itemsPerPage, setItemsPerPage] = useState(9);
  const [isMobileFilterOpen, setIsMobileFilterOpen] = useState(false);
  const [viewMode, setViewMode] = useState('grid');
  const [selectedFilters, setSelectedFilters] = useState({ attributes: {}, brands: [], categories: [] });
  const [currentPage, setCurrentPage] = useState(1);

  useEffect(() => {
    setCurrentPage(1);
  }, [itemsPerPage, sortBy, selectedFilters, id]);
  
  const seller = sellers.find(s => s.id === parseInt(id));

  const sortedProducts = useMemo(() => {
    if (!seller) return [];
    let products = [...seller.products];

    products = applyFilters(products, selectedFilters);

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
  }, [seller, sortBy, selectedFilters]);

  let totalPages = 1;
  let displayedProducts = sortedProducts;
  if (itemsPerPage !== 'All') {
    totalPages = Math.ceil(sortedProducts.length / itemsPerPage);
    const startIndex = (currentPage - 1) * itemsPerPage;
    displayedProducts = sortedProducts.slice(startIndex, startIndex + itemsPerPage);
  }

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
            selectedFilters={selectedFilters}
            onFilterChange={setSelectedFilters}
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
              {displayedProducts.map(product => (
                <ProductCard 
                  key={product.id} 
                  product={product} 
                  onAddToCart={addToCart} 
                  viewMode={viewMode}
                  isFavorite={isFavorite(product.id)}
                  isComparing={isComparing(product.id)}
                  onToggleFavorite={toggleFavorite}
                  onToggleCompare={toggleCompare}
                />
              ))}
              {displayedProducts.length === 0 && (
                <div style={{ padding: '20px', gridColumn: '1 / -1', textAlign: 'center' }}>
                  <p>No products found matching your filters.</p>
                </div>
              )}
            </div>

            {itemsPerPage !== 'All' && totalPages > 1 && (
              <div style={{ marginTop: '40px', display: 'flex', justifyContent: 'center' }}>
                <Pagination 
                  currentPage={currentPage}
                  totalPages={totalPages}
                  onPageChange={setCurrentPage}
                />
              </div>
            )}
          </main>
        </div>
      </div>
    </div>
  );
};

export default SellerProducts;

