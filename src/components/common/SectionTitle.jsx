import React from 'react';
import { Link } from 'react-router-dom';
import '../../styles/SectionTitle.css';

const SectionTitle = ({ title, viewMoreLink = '#' }) => {
  return (
    <div className="section-title-container">
      <h2 className="section-title-text">{title}</h2>
      <Link to={viewMoreLink} className="view-more-link">
        View More <span className="arrow">→</span>
      </Link>
    </div>
  );
};

export default SectionTitle;
