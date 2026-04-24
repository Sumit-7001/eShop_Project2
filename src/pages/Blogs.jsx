import React, { useState, useMemo } from 'react';
import { Link } from 'react-router-dom';
import { blogsData } from '../data/blogsData';
import '../styles/Blogs.css';

const Blogs = () => {
  const [category, setCategory] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const [itemsToShow, setItemsToShow] = useState(12);

  const filteredBlogs = useMemo(() => {
    return blogsData.filter(blog => {
      const matchesCategory = category === '' || blog.category?.toLowerCase() === category.toLowerCase();
      const matchesSearch = blog.title.toLowerCase().includes(searchQuery.toLowerCase()) || 
                           blog.description.toLowerCase().includes(searchQuery.toLowerCase());
      return matchesCategory && matchesSearch;
    }).slice(0, itemsToShow);
  }, [category, searchQuery, itemsToShow]);

  return (
    <div className="blogs-page">
      {/* Breadcrumb Area */}
      <div className="breadcrumb">
        <div className="container breadcrumb-content">
          <Link to="/">Home</Link>
          <span className="breadcrumb-separator">&gt;</span>
          <span>Blogs</span>
        </div>
      </div>

      <div className="blogs-container">
        {/* Filters Area */}
        <div className="blogs-filters">
          <select 
            className="filter-select" 
            value={category}
            onChange={(e) => setCategory(e.target.value)}
          >
            <option value="">All Categories</option>
            <option value="fashion">Fashion</option>
            <option value="sports">Sports</option>
            <option value="food">Food</option>
            <option value="tech">Technology</option>
          </select>
          
          <input 
            type="text" 
            className="filter-input" 
            placeholder="Search Blog..." 
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
          
          <div className="filter-show">
            <span>Show:</span>
            <select 
              className="filter-select" 
              value={itemsToShow}
              onChange={(e) => setItemsToShow(Number(e.target.value))}
            >
              <option value="6">6</option>
              <option value="12">12</option>
              <option value="16">16</option>
              <option value="20">20</option>
              <option value="24">24</option>
            </select>
          </div>
        </div>

        {/* Blogs Grid */}
        {filteredBlogs.length > 0 ? (
          <div className="blogs-grid">
            {filteredBlogs.map((blog) => (
              <div className="blog-card" key={blog.id}>
                <div className="blog-image-wrapper">
                  <img src={blog.image} alt={blog.title} className="blog-image" />
                </div>
                <div className="blog-content">
                  <h3 className="blog-title">{blog.title}</h3>
                  <p className="blog-description">{blog.description}</p>
                  <div className="blog-footer">
                    <span className="blog-footer-icon"></span>
                    <span>{blog.date}</span>
                  </div>
                  <div>
                    <Link to={`/blogs/${blog.id}`} className="blog-read-more">Read More</Link>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="no-results">
            <h3>No blogs found matching your criteria.</h3>
            <button onClick={() => {setCategory(''); setSearchQuery('');}} className="reset-btn">Reset Filters</button>
          </div>
        )}
      </div>
    </div>
  );
};

export default Blogs;
