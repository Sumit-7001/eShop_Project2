import React from 'react';
import { LayoutGrid, List } from 'lucide-react';
import '../../styles/CategoryProducts.css';

const ProductTopBar = ({ totalProducts, sortBy, onSortChange, itemsPerPage, onItemsPerPageChange }) => {
  return (
    <div className="product-top-bar">
      <div className="top-bar-left">
        <h2>Products</h2>
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
          <select value={itemsPerPage || 12} onChange={(e) => onItemsPerPageChange && onItemsPerPageChange(Number(e.target.value))}>
            {Array.from({ length: 22 }, (_, i) => i + 1).map(n => (
              <option key={n} value={n}>{n}</option>
            ))}
          </select>
        </div>
        <div className="view-modes">
          <button className="view-mode-btn active"><LayoutGrid size={20} /></button>
          <button className="view-mode-btn"><List size={20} /></button>
        </div>
      </div>
    </div>
  );
};

export default ProductTopBar;
