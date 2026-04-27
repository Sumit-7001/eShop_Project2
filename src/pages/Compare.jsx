import React from 'react';
import { Link } from 'react-router-dom';
import emptyCompareImg from '../assets/images/empty_compare.png';
import '../styles/Compare.css';

const Compare = () => {
  return (
    <div className="compare-page">
      <div className="breadcrumb-section">
        <div className="container">
          <div className="breadcrumb">
            <Link to="/">Home</Link>
            <span className="separator">&gt;</span>
            <span className="current">Compare</span>
          </div>
        </div>
      </div>

      <div className="compare-content container">
        <div className="empty-state">
          <img src={emptyCompareImg} alt="No items to compare" className="empty-compare-img" />
          
          
        </div>
      </div>
    </div>
  );
};

export default Compare;
