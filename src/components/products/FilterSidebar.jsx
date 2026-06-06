import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { X } from 'lucide-react';
import '../../styles/CategoryProducts.css';
import { brands, categories } from '../../data/dummyData';
import { attributesData } from '../../utils/filterHelpers';

const FilterSidebar = ({ isOpen, onClose, selectedFilters = { attributes: {}, brands: [], categories: [] }, onFilterChange, currentCategorySlug }) => {
  const [expandedSections, setExpandedSections] = useState({
    categories: true,
    brands: true,
    price: true,
    attributes: true
  });

  const [expandedAttributes, setExpandedAttributes] = useState({});

  const toggleSection = (section) => {
    setExpandedSections(prev => ({ ...prev, [section]: !prev[section] }));
  };

  const toggleAttribute = (attrName) => {
    setExpandedAttributes(prev => ({ ...prev, [attrName]: !prev[attrName] }));
  };

  const handleAttributeChange = (attrName, option) => {
    if (!onFilterChange) return;
    const currentAttrSelections = selectedFilters.attributes[attrName] || [];
    const newAttrSelections = currentAttrSelections.includes(option)
      ? currentAttrSelections.filter(opt => opt !== option)
      : [...currentAttrSelections, option];

    onFilterChange({
      ...selectedFilters,
      attributes: {
        ...selectedFilters.attributes,
        [attrName]: newAttrSelections
      }
    });
  };

  const visibleAttributes = currentCategorySlug 
    ? attributesData.filter(attr => !attr.validCategories || attr.validCategories.includes(currentCategorySlug))
    : attributesData;

  const handleBrandChange = (brandSlug) => {
    if (!onFilterChange) return;
    const newBrands = selectedFilters.brands.includes(brandSlug)
      ? selectedFilters.brands.filter(b => b !== brandSlug)
      : [...selectedFilters.brands, brandSlug];
    
    onFilterChange({
      ...selectedFilters,
      brands: newBrands
    });
  };

  const handleCategoryChange = (categoryId) => {
    if (!onFilterChange) return;
    const newCategories = selectedFilters.categories.includes(categoryId)
      ? selectedFilters.categories.filter(c => c !== categoryId)
      : [...selectedFilters.categories, categoryId];
    
    onFilterChange({
      ...selectedFilters,
      categories: newCategories
    });
  };

  const clearFilters = () => {
    if (onFilterChange) {
      onFilterChange({ attributes: {}, brands: [], categories: [] });
    }
  };

  return (
    <aside className={`filter-sidebar ${isOpen ? 'mobile-open' : ''}`}>
      <div className="mobile-filter-header">
        <h2>Filters</h2>
        <button className="close-filter-btn" onClick={onClose}>
          <X size={24} />
        </button>
      </div>

      <div className="filter-section">
        <div className="filter-header" onClick={() => toggleSection('attributes')}>
          <h3>Attributes</h3>
          <span className={`arrow ${expandedSections.attributes ? 'up' : 'down'}`}>▾</span>
        </div>
        {expandedSections.attributes && visibleAttributes.length > 0 && (
          <ul className="filter-list">
            {visibleAttributes.map(attr => (
              <li key={attr.name} className="filter-item-group">
                <div 
                  className="filter-item expandable" 
                  onClick={() => toggleAttribute(attr.name)}
                  style={{ cursor: 'pointer', display: 'flex', justifyContent: 'space-between', padding: '5px 0' }}
                >
                  <span><span className="bullet">›</span> {attr.name}</span>
                  <span style={{ fontSize: '12px' }}>{expandedAttributes[attr.name] ? '▲' : '▼'}</span>
                </div>
                {expandedAttributes[attr.name] && (
                  <ul className="sub-filter-list" style={{ paddingLeft: '15px', listStyle: 'none' }}>
                    {attr.options.map(option => (
                      <li key={option} className="checkbox-item" style={{ padding: '4px 0' }}>
                        <label style={{ display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer', fontSize: '13px' }}>
                          <input 
                            type="checkbox" 
                            checked={(selectedFilters.attributes[attr.name] || []).includes(option)}
                            onChange={() => handleAttributeChange(attr.name, option)}
                          />
                          {option}
                        </label>
                      </li>
                    ))}
                  </ul>
                )}
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
          <div className="brands-list" style={{ display: 'flex', flexDirection: 'column', gap: '8px', marginTop: '10px' }}>
            {brands.slice(0, 10).map(brand => (
              <label key={brand.id} style={{ display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer', fontSize: '13px' }}>
                <input 
                  type="checkbox" 
                  checked={selectedFilters.brands.includes(brand.slug)}
                  onChange={() => handleBrandChange(brand.slug)}
                />
                <img src={brand.logo} alt={brand.name} style={{ width: '20px', height: '20px', objectFit: 'contain' }} />
                {brand.name}
              </label>
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
          <ul className="filter-list" style={{ marginTop: '10px' }}>
            {categories.slice(0, 10).map(cat => (
              <li key={cat.id} className="filter-item checkbox-item" style={{ padding: '4px 0' }}>
                <label style={{ display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer', fontSize: '13px' }}>
                  <input 
                    type="checkbox" 
                    id={`cat-${cat.id}`}
                    checked={selectedFilters.categories.includes(cat.id)}
                    onChange={() => handleCategoryChange(cat.id)}
                  />
                  {cat.name}
                </label>
              </li>
            ))}
          </ul>
        )}
      </div>

      <div className="filter-actions">
        <button className="btn-filter" onClick={onClose}>Apply Filters</button>
        <button className="btn-clear" onClick={clearFilters}>Clear</button>
      </div>
    </aside>
  );
};

export default FilterSidebar;
