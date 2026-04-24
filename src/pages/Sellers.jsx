import React from 'react';
import SellerCard from '../components/common/SellerCard';
import { sellers } from '../data/dummyData';
import { LayoutGrid, List, ChevronDown } from 'lucide-react';
import '../styles/Sellers.css';

const Sellers = () => {
  return (
    <div className="sellers-page">
      <div className="breadcrumb-area">
        <div className="container">
          <p>Home <span> &gt; </span> Sellers</p>
        </div>
      </div>

      <div className="container">
        <h1 className="page-title">Sellers</h1>

        <div className="sellers-controls">
          <div className="control-left">
            <div className="filter-dropdown">
              Relevance <ChevronDown size={16} />
            </div>
            <div className="search-seller">
              <input type="text" placeholder="Search Seller" />
            </div>
          </div>
          <div className="control-right">
            <span>Show: </span>
            <div className="show-dropdown">
              12 <ChevronDown size={16} />
            </div>
            <div className="view-mode">
              <button className="active"><LayoutGrid size={20} /></button>
              <button><List size={20} /></button>
            </div>
          </div>
        </div>

        <div className="sellers-grid">
          {sellers.map(seller => (
            <SellerCard key={seller.id} seller={seller} />
          ))}
        </div>
      </div>
    </div>
  );
};

export default Sellers;
