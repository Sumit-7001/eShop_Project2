import React, { useState, useMemo } from 'react';
import { Link, useParams } from 'react-router-dom';
import { ChevronRight } from 'lucide-react';
import FilterSidebar from '../components/products/FilterSidebar';
import ProductTopBar from '../components/products/ProductTopBar';
import ProductCard from '../components/common/ProductCard';
import { smartphones, watches, furniture, kids, fashion, electronics, digitalProduct, homeAppliances, vegetables, decor, books } from '../data/dummyData';
import '../styles/CategoryProducts.css';

const CategoryProducts = ({ addToCart }) => {
  const { slug } = useParams();
  const [sortBy, setSortBy] = useState('relevance');
  const [itemsPerPage, setItemsPerPage] = useState(12);

  const categoryMap = {
    smartphones: {
      title: 'Smartphones & Basic Mobiles',
      data: smartphones
    },
    watches: {
      title: 'Top Rated Watches',
      data: watches
    },
    furniture: {
      title: 'Furniture Products',
      data: furniture
    },
    kids: {
      title: "Kid's Section",
      data: kids
    },
    fashion: {
      title: 'Fashion Trends',
      data: fashion
    },
    electronics: {
      title: 'Electronic Gadgets',
      data: electronics
    },
    'digital-product': {
      title: 'Digital Products',
      data: digitalProduct
    },
    'home-appliances': {
      title: 'Home Appliances',
      data: homeAppliances
    },
    vegetable: {
      title: 'Fresh Vegetables',
      data: vegetables
    },
    decor: {
      title: 'Home Decor',
      data: decor
    },
    books: {
      title: 'Books & Literature',
      data: books
    }
  };

  const currentCategory = categoryMap[slug] || { title: 'Products', data: [] };

  const sortedProducts = useMemo(() => {
    const products = [...currentCategory.data];
    switch (sortBy) {
      case 'price-low-high':
        return products.sort((a, b) => a.price - b.price);
      case 'price-high-low':
        return products.sort((a, b) => b.price - a.price);
      case 'newest':
        return products.sort((a, b) => b.id - a.id);
      default:
        return products;
    }
  }, [currentCategory.data, sortBy]);

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
          <FilterSidebar />
          
          <main className="products-main-content">
            <ProductTopBar 
              totalProducts={sortedProducts.length} 
              sortBy={sortBy} 
              onSortChange={setSortBy}
              itemsPerPage={itemsPerPage}
              onItemsPerPageChange={setItemsPerPage}
            />
            
            <div className="products-grid-listing">
              {displayedProducts.map(product => (
                <ProductCard 
                  key={product.id} 
                  product={product} 
                  onAddToCart={addToCart} 
                />
              ))}
            </div>
          </main>
        </div>
      </div>
    </div>
  );
};

export default CategoryProducts;

