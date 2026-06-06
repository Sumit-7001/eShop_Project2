import React, { useState, useMemo, memo } from 'react';
import { Link, useParams } from 'react-router-dom';
import { ChevronRight } from 'lucide-react';
import FilterSidebar from '../components/products/FilterSidebar';
import ProductTopBar from '../components/products/ProductTopBar';
import ProductCard from '../components/common/ProductCard';
import { useApp } from '../context/AppContext';
import { applyFilters } from '../utils/filterHelpers';
import '../styles/CategoryProducts.css';

const CategoryProducts = () => {
  const {
    smartphonesState,
    watchesState,
    furnitureState,
    kidsState,
    fashionState,
    electronicsState,
    digitalProductState,
    homeAppliancesState,
    vegetableState,
    decorState,
    booksState,
    addToCart,
    isFavorite,
    isComparing,
    toggleFavorite,
    toggleCompare,
  } = useApp();

  const { slug } = useParams();
  const [sortBy, setSortBy] = useState('relevance');
  const [itemsPerPage, setItemsPerPage] = useState(12);
  const [isMobileFilterOpen, setIsMobileFilterOpen] = useState(false);
  const [viewMode, setViewMode] = useState('grid');
  const [selectedFilters, setSelectedFilters] = useState({ attributes: {}, brands: [], categories: [] });

  const categoryMap = useMemo(() => ({
    smartphones:       { title: 'Smartphones & Basic Mobiles', data: smartphonesState },
    watches:           { title: 'Top Rated Watches',           data: watchesState },
    furniture:         { title: 'Furniture Products',          data: furnitureState },
    kids:              { title: "Kid's Section",               data: kidsState },
    fashion:           { title: 'Fashion Trends',              data: fashionState },
    electronics:       { title: 'Electronic Gadgets',          data: electronicsState },
    'digital-product': { title: 'Digital Products',            data: digitalProductState },
    'home-appliances': { title: 'Home Appliances',             data: homeAppliancesState },
    vegetable:         { title: 'Fresh Vegetables',            data: vegetableState },
    decor:             { title: 'Home Decor',                  data: decorState },
    books:             { title: 'Books & Literature',          data: booksState },
  }), [smartphonesState, watchesState, furnitureState, kidsState, fashionState, electronicsState, digitalProductState, homeAppliancesState, vegetableState, decorState, booksState]);

  const currentCategory = categoryMap[slug] || { title: 'Products', data: [] };

  const sortedProducts = useMemo(() => {
    let products = [...currentCategory.data];

    products = applyFilters(products, selectedFilters);

    // Sort
    switch (sortBy) {
      case 'price-low-high': return products.sort((a, b) => a.price - b.price);
      case 'price-high-low': return products.sort((a, b) => b.price - a.price);
      case 'newest':         return products.sort((a, b) => b.id - a.id);
      default:               return products;
    }
  }, [currentCategory.data, sortBy, selectedFilters]);

  const displayedProducts = sortedProducts.slice(0, itemsPerPage);

  return (
    <div className="category-products-page">
      <div className="category-breadcrumb-area">
        <div className="container">
          <ul className="breadcrumb">
            <li><Link to="/">Home</Link> <ChevronRight size={14} /></li>
            <li><Link to="/categories">Section</Link> <ChevronRight size={14} /></li>
            <li className="active">{currentCategory.title}</li>
          </ul>
        </div>
      </div>

      <div className="container">
        <div className="category-products-layout">
          {isMobileFilterOpen && (
            <div className="filter-overlay" onClick={() => setIsMobileFilterOpen(false)} />
          )}

          <FilterSidebar 
            isOpen={isMobileFilterOpen} 
            onClose={() => setIsMobileFilterOpen(false)} 
            selectedFilters={selectedFilters}
            onFilterChange={setSelectedFilters}
            currentCategorySlug={slug}
          />

          <main className="products-main-content">
            <ProductTopBar
              totalProducts={sortedProducts.length}
              sortBy={sortBy}
              onSortChange={setSortBy}
              itemsPerPage={itemsPerPage}
              onItemsPerPageChange={setItemsPerPage}
              onFilterClick={() => setIsMobileFilterOpen(true)}
              viewMode={viewMode}
              onViewModeChange={setViewMode}
            />

            <div className={`products-grid-listing ${viewMode === 'list' ? 'list-view' : ''}`}>
              {displayedProducts.map(product => (
                <ProductCard
                  key={product.id}
                  product={product}
                  onAddToCart={addToCart}
                  viewMode={viewMode}
                  isFavorite={isFavorite(product.id)}
                  isComparing={isComparing(product.id)}
                  onToggleFavorite={toggleFavorite}
                  onToggleCompare={toggleCompare}
                />
              ))}
              {displayedProducts.length === 0 && (
                <div style={{ padding: '20px', gridColumn: '1 / -1', textAlign: 'center' }}>
                  <p>No products found matching your filters.</p>
                </div>
              )}
            </div>
          </main>
        </div>
      </div>
    </div>
  );
};

export default memo(CategoryProducts);
