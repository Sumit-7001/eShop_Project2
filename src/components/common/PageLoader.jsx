import React from 'react';
import '../../styles/PageLoader.css';

// Skeleton card that mimics ProductCard proportions
const SkeletonCard = () => (
  <div className="skeleton-card">
    <div className="skeleton skeleton-image" />
    <div className="skeleton-body">
      <div className="skeleton skeleton-title" />
      <div className="skeleton skeleton-title short" />
      <div className="skeleton-price-row">
        <div className="skeleton skeleton-price" />
        <div className="skeleton skeleton-btn" />
      </div>
    </div>
  </div>
);

const PageLoader = ({ count = 8 }) => (
  <div className="page-loader-container">
    <div className="skeleton-grid">
      {Array.from({ length: count }).map((_, i) => (
        <SkeletonCard key={i} />
      ))}
    </div>
  </div>
);

export default PageLoader;
