import React from 'react';
import { LayoutGrid, List, Filter } from 'lucide-react';
import '../../styles/CategoryProducts.css';

const ProductTopBar = ({ totalProducts, sortBy, onSortChange, itemsPerPage, onItemsPerPageChange, onFilterClick, viewMode = 'grid', onViewModeChange }) => {
  return (
    <div className="product-top-bar">
      <div className="top-bar-left">
        <h2>Products</h2>
        <button className="mobile-filter-btn" onClick={onFilterClick}>
          <Filter size={18} />
          <span>Filter</span>
        </button>
      </div>
      <div className="top-bar-right">
        <div className="sort-by">
          <select value={sortBy || 'relevance'} onChange={(e) => onSortChange && onSortChange(e.target.value)}>
            <option value="relevance">Relevance</option>
            <option value="price-low-high">Price: Low to High</option>
            <option value="price-high-low">Price: High to Low</option>
            <option value="newest">Newest Arrivals</option>
          </select>
        </div>
        <div className="show-items">
          <span>Show:</span>
          <select value={itemsPerPage} onChange={(e) => onItemsPerPageChange && onItemsPerPageChange(e.target.value === 'All' ? 'All' : Number(e.target.value))}>
            <option value="All">All</option>
            {Array.from({ length: 20 }, (_, i) => i + 3).map(n => (
              <option key={n} value={n}>{n}</option>
            ))}
          </select>
        </div>
        <div className="view-modes">
          <button 
            className={`view-mode-btn ${viewMode === 'grid' ? 'active' : ''}`}
            onClick={() => onViewModeChange && onViewModeChange('grid')}
          >
            <LayoutGrid size={20} />
          </button>
          <button 
            className={`view-mode-btn ${viewMode === 'list' ? 'active' : ''}`}
            onClick={() => onViewModeChange && onViewModeChange('list')}
          >
            <List size={20} />
          </button>
        </div>
      </div>
    </div>
  );
};

export default ProductTopBar;
