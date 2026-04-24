import React from 'react';
import '../../styles/SectionTitle.css';

const SectionTitle = ({ title, viewMoreLink = '#' }) => {
  return (
    <div className="section-title-container">
      <h2 className="section-title-text">{title}</h2>
      <a href={viewMoreLink} className="view-more-link">
        View More <span className="arrow">→</span>
      </a>
    </div>
  );
};

export default SectionTitle;
