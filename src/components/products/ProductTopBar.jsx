import React from 'react';
import { LayoutGrid, List } from 'lucide-react';
import '../../styles/CategoryProducts.css';

const ProductTopBar = ({ totalProducts }) => {
  return (
    <div className="product-top-bar">
      <div className="top-bar-left">
        <h2>Products</h2>
      </div>
      <div className="top-bar-right">
        <div className="sort-by">
          <select>
            <option>Relevance</option>
            <option>Price: Low to High</option>
            <option>Price: High to Low</option>
            <option>Newest Arrivals</option>
          </select>
        </div>
        <div className="show-items">
          <span>Show:</span>
          <select>
            <option>12</option>
            <option>24</option>
            <option>48</option>
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
