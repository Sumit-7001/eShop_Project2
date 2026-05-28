import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { 
  Star, ChevronRight, Minus, Plus, Heart, GitCompare, 
  Facebook, Twitter, Linkedin, MessageCircle, Share2,
  Truck, ShieldCheck, RotateCcw, Store, ShoppingCart
} from 'lucide-react';
import ProductCard from '../components/common/ProductCard';
import { useApp } from '../context/AppContext';
import '../styles/ProductDetails.css';

const ProductDetails = () => {
  const {
    addToCart,
    isFavorite,
    isComparing,
    toggleFavorite,
    toggleCompare,
    smartphonesState,
    watchesState,
    furnitureState,
    kidsState,
    favoriteItems,
    compareItems
  } = useApp();
  const { id } = useParams();
  const [product, setProduct] = useState(null);
  const [quantity, setQuantity] = useState(1);
  const [activeTab, setActiveTab] = useState('description');
  const [selectedImage, setSelectedImage] = useState(0);

  useEffect(() => {
    const mergedProducts = [
      ...smartphonesState,
      ...watchesState,
      ...furnitureState,
      ...kidsState
    ];
    const foundProduct = mergedProducts.find(p => p.id === parseInt(id));
    setProduct(foundProduct);
    window.scrollTo(0, 0);
  }, [id]);

  if (!product) {
    return (
      <div className="container" style={{ padding: '100px 0', textAlign: 'center' }}>
        <h2>Product not found</h2>
        <Link to="/" style={{ color: 'var(--primary-color)' }}>Go back to home</Link>
      </div>
    );
  }

  const { title, price, oldPrice, rating, image } = product;

  const handleQuantity = (type) => {
    if (type === 'plus') setQuantity(prev => prev + 1);
    if (type === 'minus' && quantity > 1) setQuantity(prev => prev - 1);
  };

  // Mock related products based on the current product category/type
  const getRelatedProducts = () => {
    if (smartphonesState.find(p => p.id === product.id)) return smartphonesState.filter(p => p.id !== product.id).slice(0, 4);
    if (watchesState.find(p => p.id === product.id)) return watchesState.filter(p => p.id !== product.id).slice(0, 4);
    if (furnitureState.find(p => p.id === product.id)) return furnitureState.filter(p => p.id !== product.id).slice(0, 4);
    if (kidsState.find(p => p.id === product.id)) return kidsState.filter(p => p.id !== product.id).slice(0, 4);
    return [...smartphonesState, ...watchesState, ...furnitureState, ...kidsState].filter(p => p.id !== product.id).slice(0, 4);
  };

  const isCurrentFavorite = isFavorite(product.id);
  const isCurrentComparing = isComparing(product.id);

  return (
    <div className="product-details-page">
      <div className="product-breadcrumb-area">
        <div className="container">
          <ul className="breadcrumb">
            <li><Link to="/">Home</Link> <ChevronRight size={14} /></li>
            <li><Link to="/categories">Product</Link> <ChevronRight size={14} /></li>
            <li><Link to="/category/smartphones">Electronics</Link> <ChevronRight size={14} /></li>
            <li className="active">Smartphone</li>
          </ul>
        </div>
      </div>

      <div className="container">
        <div className="product-main-container">
          {/* Left: Gallery */}
          <div className="product-gallery">
            <div className="thumbnails">
              {[image, image, image].map((img, idx) => (
                <div 
                  key={idx} 
                  className={`thumb-item ${selectedImage === idx ? 'active' : ''}`}
                  onClick={() => setSelectedImage(idx)}
                >
                  <img src={img} alt={`${title} thumb ${idx}`} />
                </div>
              ))}
            </div>
            <div className="main-image-wrapper">
              <img src={image} alt={title} className="main-image" />
            </div>
          </div>

          {/* Right: Info */}
          <div className="product-info-details">
            <h1 className="product-title-large">{title}</h1>
            {smartphonesState.some(p => p.id === product.id) && <p className="product-subtitle">Premium Smartphone Experience</p>}
            
            <div className="price-rating-row">
              <div className="large-price">${price.toLocaleString()}</div>
              <div className="product-rating-box">
                <div className="stars">
                  {[...Array(5)].map((_, i) => (
                    <Star 
                      key={i} 
                      size={16} 
                      fill={i < Math.floor(rating) ? "#FFD700" : "none"} 
                      color={i < Math.floor(rating) ? "#FFD700" : "#ccc"} 
                    />
                  ))}
                </div>
                <span className="reviews-count">( 3 Reviews )</span>
              </div>
            </div>

            {smartphonesState.some(p => p.id === product.id) && (
              <div className="option-group">
                <span className="option-label">Color</span>
                <div className="color-options">
                  <div className="color-circle active" style={{ backgroundColor: '#ff4d4d' }}></div>
                  <div className="color-circle" style={{ backgroundColor: '#000' }}></div>
                </div>
              </div>
            )}

            {smartphonesState.some(p => p.id === product.id) && (
              <div className="option-group">
                <span className="option-label">Expandable Storage</span>
                <div className="storage-options">
                  <div className="storage-pill active">128 GB</div>
                  <div className="storage-pill">256 GB</div>
                </div>
              </div>
            )}

            <div className="quantity-action-row">
              <div className="quantity-selector">
                <button className="qty-btn" onClick={() => handleQuantity('minus')}><Minus size={16} /></button>
                <div className="qty-input">{quantity}</div>
                <button className="qty-btn" onClick={() => handleQuantity('plus')}><Plus size={16} /></button>
              </div>
              <button className="add-cart-large" onClick={() => addToCart(product, quantity)}>
                <ShoppingCart size={20} /> Add to Cart
              </button>
              <button 
                className={`icon-btn-outline compare-btn ${isCurrentComparing ? 'active' : ''}`}
                onClick={() => toggleCompare(product)}
                title={isCurrentComparing ? "Remove from comparison" : "Add to comparison"}
              >
                <GitCompare size={20} />
              </button>
              <button 
                className={`icon-btn-outline wishlist-btn ${isCurrentFavorite ? 'active' : ''}`}
                onClick={() => toggleFavorite(product)}
                title={isCurrentFavorite ? "Remove from wishlist" : "Add to wishlist"}
              >
                <Heart size={20} fill={isCurrentFavorite ? "currentColor" : "none"} />
              </button>
            </div>

            <div className="seller-mini-card">
              <Store className="seller-icon" size={20} />
              <div>
                <span className="seller-name">Super Market</span>
              </div>
            </div>

            <div className="trust-badges">
              <div className="trust-item">
                <div style={{ background: '#f0f0f0', padding: '10px', borderRadius: '50%' }}>
                  <img src="https://cdn-icons-png.flaticon.com/512/1554/1554401.png" width="20" alt="COD" />
                </div>
                <span>COD</span>
                <p>Cash on Delivery is eligible for orders above $10 and below $500000</p>
              </div>
              <div className="trust-item">
                <div style={{ background: '#f0f0f0', padding: '10px', borderRadius: '50%' }}>
                  <img src="https://cdn-icons-png.flaticon.com/512/411/411763.png" width="20" alt="Return" />
                </div>
                <span>No Cancellation</span>
              </div>
              <div className="trust-item">
                <div style={{ background: '#f0f0f0', padding: '10px', borderRadius: '50%' }}>
                  <img src="https://cdn-icons-png.flaticon.com/512/3514/3514491.png" width="20" alt="Returnable" />
                </div>
                <span>No Returnable</span>
              </div>
            </div>

            <div className="product-meta" style={{ fontSize: '13px', color: '#666', display: 'flex', flexDirection: 'column', gap: '5px' }}>
              {smartphonesState.some(p => p.id === product.id) && <div>Color : <span style={{ color: '#1a1a1a' }}>Red, Black</span></div>}
              {smartphonesState.some(p => p.id === product.id) && <div>Expandable Storage : <span style={{ color: '#1a1a1a' }}>128 GB, 256 GB</span></div>}
              <div>Brand : <span style={{ color: '#ff4d4d' }}>● Apple</span></div>
            </div>

            <div className="share-links">
              <span className="share-label">Share :</span>
              <div className="social-icons">
                <a href="#" className="social-icon facebook"><Facebook size={16} /></a>
                <a href="#" className="social-icon twitter"><Twitter size={16} /></a>
                <a href="#" className="social-icon whatsapp"><MessageCircle size={16} /></a>
                <a href="#" className="social-icon pinterest"><Share2 size={16} /></a>
                <a href="#" className="social-icon linkedin"><Linkedin size={16} /></a>
              </div>
            </div>
          </div>
        </div>

        {/* Tabs */}
        <div className="product-tabs-section">
          <div className="tabs-header">
            <button 
              className={`tab-btn ${activeTab === 'description' ? 'active' : ''}`}
              onClick={() => setActiveTab('description')}
            >
              Description
            </button>
            <button 
              className={`tab-btn ${activeTab === 'reviews' ? 'active' : ''}`}
              onClick={() => setActiveTab('reviews')}
            >
              Reviews
            </button>
            <button 
              className={`tab-btn ${activeTab === 'sold' ? 'active' : ''}`}
              onClick={() => setActiveTab('sold')}
            >
              Sold By
            </button>
            <button 
              className={`tab-btn ${activeTab === 'faqs' ? 'active' : ''}`}
              onClick={() => setActiveTab('faqs')}
            >
              FAQs
            </button>
          </div>
          <div className="tab-content">
            {activeTab === 'description' && (
              <div className="description-grid">
                <div className="spec-table">
                  {smartphonesState.some(p => p.id === product.id) ? (
                    <>
                      <div className="spec-row">
                        <div className="spec-label">256 GB ROM</div>
                        <div className="spec-label">General</div>
                      </div>
                      <div className="spec-row">
                        <div className="spec-label">17.02 cm (6.7 inch) Super Retina XDR Display</div>
                        <div className="spec-label">In The Box</div>
                        <div className="spec-value">Smartphone, Charging Cable, Documentation</div>
                        <div className="spec-label">Touchscreen</div>
                        <div className="spec-value">Yes</div>
                      </div>
                      <div className="spec-row">
                        <div className="spec-label">High Resolution Camera</div>
                        <div className="spec-label">Model Name</div>
                        <div className="spec-value">{title}</div>
                        <div className="spec-label">Quick Charging</div>
                        <div className="spec-value">Yes</div>
                      </div>
                      <div className="spec-row" style={{ gridTemplateColumns: '1fr', marginTop: '20px' }}>
                        <div className="spec-value">
                          <h4 style={{ marginBottom: '10px' }}>Product Description</h4>
                          <p>{product.description || 'No detailed description available for this model yet.'}</p>
                        </div>
                      </div>
                    </>
                  ) : (
                    <div className="spec-row" style={{ gridTemplateColumns: '1fr' }}>
                      <div className="spec-value">
                        <h4 style={{ marginBottom: '15px' }}>Product Overview</h4>
                        <p>{product.description || `This premium ${title} is designed for comfort and durability. It features high-quality materials and state-of-the-art craftsmanship to ensure the best user experience.`}</p>
                        <ul style={{ marginTop: '15px', listStyle: 'disc', paddingLeft: '20px' }}>
                          <li>Premium build quality</li>
                          <li>Elegant and modern design</li>
                          <li>Durable and long-lasting</li>
                          <li>Highly rated by customers</li>
                        </ul>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            )}
            {activeTab === 'reviews' && <p>No reviews yet.</p>}
            {activeTab === 'sold' && <p>Sold by Super Market - Metro Merchants Mart.</p>}
            {activeTab === 'faqs' && <p>No FAQs available for this product.</p>}
          </div>
        </div>

        {/* Related Products */}
        <section className="related-products-section">
          <div style={{ textAlign: 'center', marginBottom: '30px' }}>
            <h2 style={{ fontSize: '24px', fontWeight: '700' }}>Related Products</h2>
            <div style={{ width: '50px', height: '3px', background: 'var(--primary-color)', margin: '10px auto' }}></div>
          </div>
          <div className="related-grid">
            {getRelatedProducts().map(item => (
              <ProductCard 
                key={item.id} 
                product={item} 
                onAddToCart={addToCart} 
                isFavorite={favoriteItems.some(f => f.id === item.id)}
                isComparing={compareItems.some(c => c.id === item.id)}
                onToggleFavorite={toggleFavorite}
                onToggleCompare={toggleCompare}
              />
            ))}
          </div>
        </section>
      </div>
    </div>
  );
};

export default ProductDetails;
