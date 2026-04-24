import React, { useState } from 'react';
import { brands } from '../data/dummyData';
import BrandCard from '../components/common/BrandCard';
import Pagination from '../components/common/Pagination';
import '../styles/AllPages.css';

const AllBrandsPage = () => {
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 16;
  
  const totalPages = Math.ceil(brands.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const currentItems = brands.slice(startIndex, startIndex + itemsPerPage);

  const handlePageChange = (page) => {
    setCurrentPage(page);
    window.scrollTo(0, 0);
  };

  return (
    <div className="all-pages-wrapper">
      <main className="container main-content">
        <h1 className="page-title">Brands</h1>
        <div className="items-grid brands-grid">
          {currentItems.map(brand => (
            <BrandCard key={brand.id} brand={brand} />
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

export default AllBrandsPage;
