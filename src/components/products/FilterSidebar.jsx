import React, { useState } from 'react';
import '../../styles/CategoryProducts.css';
import { brands, categories } from '../../data/dummyData';

const FilterSidebar = () => {
  const [expandedSections, setExpandedSections] = useState({
    attributes: true,
    brands: true,
    categories: true,
  });

  const toggleSection = (section) => {
    setExpandedSections(prev => ({
      ...prev,
      [section]: !prev[section]
    }));
  };

  const attributes = [
    'Battery Power', 'Color', 'Connectivity technologies', 
    'Display Technology', 'Expandable Storage', 'Item Weight', 'Material Type'
  ];

  return (
    <aside className="filter-sidebar">
      <div className="filter-section">
        <div className="filter-header" onClick={() => toggleSection('attributes')}>
          <h3>Attributes</h3>
          <span className={`arrow ${expandedSections.attributes ? 'up' : 'down'}`}>▾</span>
        </div>
        {expandedSections.attributes && (
          <ul className="filter-list">
            {attributes.map(attr => (
              <li key={attr} className="filter-item expandable">
                <span className="bullet">›</span> {attr}
              </li>
            ))}
          </ul>
        )}
      </div>

      <div className="filter-section">
        <div className="filter-header" onClick={() => toggleSection('brands')}>
          <h3>Brands</h3>
          <span className={`arrow ${expandedSections.brands ? 'up' : 'down'}`}>▾</span>
        </div>
        {expandedSections.brands && (
          <div className="brands-grid-small">
            {brands.map(brand => (
              <div key={brand.id} className="brand-logo-small" title={brand.name}>
                <img src={brand.logo} alt={brand.name} />
              </div>
            ))}
          </div>
        )}
      </div>

      <div className="filter-section">
        <div className="filter-header" onClick={() => toggleSection('categories')}>
          <h3>Categories</h3>
          <span className={`arrow ${expandedSections.categories ? 'up' : 'down'}`}>▾</span>
        </div>
        {expandedSections.categories && (
          <ul className="filter-list">
            {categories.map(cat => (
              <li key={cat.id} className="filter-item checkbox-item">
                <input type="checkbox" id={`cat-${cat.id}`} />
                <label htmlFor={`cat-${cat.id}`}>{cat.name}</label>
              </li>
            ))}
          </ul>
        )}
      </div>

      <div className="filter-actions">
        <button className="btn-filter">Filter</button>
        <button className="btn-clear">Clear</button>
      </div>
    </aside>
  );
};

export default FilterSidebar;
