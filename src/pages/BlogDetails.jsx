import React, { useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { blogsData } from '../data/blogsData';
import '../styles/BlogDetails.css';

const BlogDetails = () => {
  const { slug } = useParams();
  
  // Extract ID from the end of the slug (e.g., ...-skill-level-1 -> 1)
  const idStr = slug ? slug.split('-').pop() : '';
  const blogId = parseInt(idStr);
  
  const blog = blogsData.find(b => b.id === blogId);

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  if (!blog) {
    return (
      <div className="blog-details-page">
        <div className="container" style={{ padding: '100px 20px', textAlign: 'center' }}>
          <h2>Blog not found</h2>
          <Link to="/blogs" style={{ color: '#e06a58', marginTop: '20px', display: 'inline-block' }}>Back to Blogs</Link>
        </div>
      </div>
    );
  }

  return (
    <div className="blog-details-page">
      {/* Breadcrumb Area */}
      <div className="breadcrumb">
        <div className="container breadcrumb-content">
          <Link to="/">Home</Link>
          <span className="breadcrumb-separator">&gt;</span>
          <Link to="/blogs">Blogs</Link>
          <span className="breadcrumb-separator">&gt;</span>
          <span>{blog.title}</span>
        </div>
      </div>

      <div className="container">
        <div className="blog-details-container">
          <div className="blog-details-image-wrapper">
            <img src={blog.image} alt={blog.title} className="blog-details-image" />
          </div>
          
          <h1 className="blog-details-title">{blog.title}</h1>
          
          <div className="blog-details-content">
            {blog.content ? (
              <div dangerouslySetInnerHTML={{ __html: blog.content }} />
            ) : (
              <>
                <p>{blog.description}</p>
                <p>More detailed content coming soon...</p>
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default BlogDetails;
