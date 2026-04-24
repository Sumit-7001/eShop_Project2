import React, { useState } from 'react';
import { categories } from '../data/dummyData';
import CategoryCard from '../components/common/CategoryCard';
import Pagination from '../components/common/Pagination';
import '../styles/AllPages.css';

const AllCategoriesPage = () => {
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 12;
  
  const totalPages = Math.ceil(categories.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const currentItems = categories.slice(startIndex, startIndex + itemsPerPage);

  const handlePageChange = (page) => {
    setCurrentPage(page);
    window.scrollTo(0, 0);
  };

  return (
    <div className="all-pages-wrapper">
      <main className="container main-content">
        <h1 className="page-title">Categories</h1>
        <div className="items-grid">
          {currentItems.map(category => (
            <CategoryCard key={category.id} category={category} />
          ))}
        </div>
        <Pagination 
          currentPage={currentPage} 
          totalPages={totalPages} 
          onPageChange={handlePageChange} 
        />
      </main>
    </div>
  );
};

export default AllCategoriesPage;
