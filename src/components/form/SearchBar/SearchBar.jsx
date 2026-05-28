import React, { useState, useEffect, useRef, useCallback, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { Search, X } from 'lucide-react';
import { useApp } from '../../context/AppContext';
import '../../styles/SearchBar.css';

const SearchBar = () => {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState([]);
  const [isOpen, setIsOpen] = useState(false);
  const [selectedIndex, setSelectedIndex] = useState(-1);

  const { smartphonesState, watchesState, furnitureState, kidsState } = useApp();

  // Stable memoized merged products list to prevent infinite loop
  const allProducts = useMemo(() => [
    ...smartphonesState.map(p => ({ ...p, category: 'smartphones' })),
    ...watchesState.map(p => ({ ...p, category: 'watches' })),
    ...furnitureState.map(p => ({ ...p, category: 'furniture' })),
    ...kidsState.map(p => ({ ...p, category: 'kids' })),
  ], [smartphonesState, watchesState, furnitureState, kidsState]);

  const navigate = useNavigate();
  const inputRef = useRef(null);
  const containerRef = useRef(null);
  const debounceRef = useRef(null);

  // Debounced search
  useEffect(() => {
    clearTimeout(debounceRef.current);
    if (query.trim().length < 2) {
      setResults([]);
      setIsOpen(false);
      return;
    }
    debounceRef.current = setTimeout(() => {
      const q = query.toLowerCase();
      const found = allProducts
        .filter(p =>
          p.title.toLowerCase().includes(q) ||
          p.category.toLowerCase().includes(q)
        )
        .slice(0, 6);
      setResults(found);
      setIsOpen(found.length > 0);
      setSelectedIndex(-1);
    }, 250);
    return () => clearTimeout(debounceRef.current);
  }, [query, allProducts]);

  // Click outside to close
  useEffect(() => {
    const handleClick = (e) => {
      if (containerRef.current && !containerRef.current.contains(e.target)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClick);
    return () => document.removeEventListener('mousedown', handleClick);
  }, []);

  const handleSelect = useCallback((product) => {
    setQuery('');
    setIsOpen(false);
    navigate(`/product/${product.id}`);
  }, [navigate]);

  const handleKeyDown = (e) => {
    if (!isOpen) return;
    if (e.key === 'ArrowDown') {
      e.preventDefault();
      setSelectedIndex(prev => Math.min(prev + 1, results.length - 1));
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      setSelectedIndex(prev => Math.max(prev - 1, -1));
    } else if (e.key === 'Enter' && selectedIndex >= 0) {
      handleSelect(results[selectedIndex]);
    } else if (e.key === 'Escape') {
      setIsOpen(false);
      inputRef.current?.blur();
    }
  };

  const handleClear = () => {
    setQuery('');
    setIsOpen(false);
    inputRef.current?.focus();
  };

  return (
    <div className="search-bar-wrapper" ref={containerRef}>
      <div className={`search-input-container ${isOpen ? 'open' : ''}`}>
        <Search size={16} className="search-icon-left" />
        <input
          ref={inputRef}
          type="text"
          className="search-input"
          placeholder="Search products..."
          value={query}
          onChange={e => setQuery(e.target.value)}
          onKeyDown={handleKeyDown}
          onFocus={() => results.length > 0 && setIsOpen(true)}
          aria-label="Search products"
          aria-autocomplete="list"
          aria-expanded={isOpen}
        />
        {query && (
          <button className="search-clear-btn" onClick={handleClear} aria-label="Clear search">
            <X size={14} />
          </button>
        )}
      </div>

      {isOpen && results.length > 0 && (
        <div className="search-dropdown" role="listbox">
          {results.map((product, idx) => (
            <div
              key={product.id}
              className={`search-result-item ${selectedIndex === idx ? 'selected' : ''}`}
              role="option"
              aria-selected={selectedIndex === idx}
              onClick={() => handleSelect(product)}
              onMouseEnter={() => setSelectedIndex(idx)}
            >
              <div className="search-result-img-wrapper">
                <img src={product.image} alt={product.title} className="search-result-img" />
              </div>
              <div className="search-result-info">
                <p className="search-result-title">{product.title}</p>
                <span className="search-result-meta">
                  <span className="search-result-category">{product.category}</span>
                  <span className="search-result-price">${product.price}</span>
                </span>
              </div>
            </div>
          ))}
          <div className="search-dropdown-footer">
            <span>{results.length} result{results.length !== 1 ? 's' : ''} for "<strong>{query}</strong>"</span>
          </div>
        </div>
      )}
    </div>
  );
};

export default SearchBar;
