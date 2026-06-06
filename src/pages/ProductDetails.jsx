import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { 
  Star, ChevronRight, Minus, Plus, Heart, GitCompare, 
  Facebook, Twitter, Linkedin, MessageCircle, Share2,
  Truck, ShieldCheck, RotateCcw, Store, ShoppingCart,
  Tag, MapPin, Sparkles, ThumbsUp, ThumbsDown
} from 'lucide-react';
import ProductCard from '../components/common/ProductCard';
import { useApp } from '../context/AppContext';
import { brandProducts, sellers } from '../data/dummyData';
import '../styles/ProductDetails.css';

// Import local assets for Frequently Bought Together
import speakerImg from '../assets/images/bluetooth_speaker.png';
import sunglassesImg from '../assets/images/sunglasses.png';
import airPurifierImg from '../assets/images/air_purifier.png';
import teddyBearImg from '../assets/images/teddy_bear.png';
import leatherBeltImg from '../assets/images/leather_belt.png';

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
    fashionState,
    electronicsState,
    digitalProductState,
    homeAppliancesState,
    vegetableState,
    decorState,
    booksState,
    favoriteItems,
    compareItems
  } = useApp();
  const { id } = useParams();
  const [product, setProduct] = useState(null);
  const [quantity, setQuantity] = useState(1);
  const [activeTab, setActiveTab] = useState('description');
  const [selectedImage, setSelectedImage] = useState(0);
  const [pincode, setPincode] = useState('');
  const [pincodeStatus, setPincodeStatus] = useState(null); // null, 'loading', 'valid', 'invalid'
  const [deliveryDate, setDeliveryDate] = useState('');
  const [fbtChecked, setFbtChecked] = useState(true);
  const [selectedColor, setSelectedColor] = useState('');
  const [selectedStorage, setSelectedStorage] = useState('128 GB');

  useEffect(() => {
    if (product) {
       if (product.color) {
         setSelectedColor(product.color.split(',')[0].trim());
       } else if (product.category === 'smartphones') {
         setSelectedColor('#ff4d4d');
       }
       if (product.category === 'smartphones') {
         setSelectedStorage('128 GB');
       }
    }
  }, [product]);

  useEffect(() => {
    const allBrandProducts = Object.values(brandProducts).flat().filter(Boolean).map(p => ({ ...p, category: p.category || 'brand' }));
    const allSellerProducts = sellers.flatMap(s => s.products || []).filter(Boolean).map(p => ({ ...p, category: p.category || 'seller' }));
    
    const mergedProducts = [
      ...smartphonesState.map(p => ({ ...p, category: 'smartphones' })),
      ...watchesState.map(p => ({ ...p, category: 'watches' })),
      ...furnitureState.map(p => ({ ...p, category: 'furniture' })),
      ...kidsState.map(p => ({ ...p, category: 'kids' })),
      ...fashionState.map(p => ({ ...p, category: 'fashion' })),
      ...electronicsState.map(p => ({ ...p, category: 'electronics' })),
      ...digitalProductState.map(p => ({ ...p, category: 'digital-product' })),
      ...homeAppliancesState.map(p => ({ ...p, category: 'home-appliances' })),
      ...vegetableState.map(p => ({ ...p, category: 'vegetable' })),
      ...decorState.map(p => ({ ...p, category: 'decor' })),
      ...booksState.map(p => ({ ...p, category: 'books' })),
      ...allBrandProducts,
      ...allSellerProducts
    ].filter(Boolean);
    const foundProduct = mergedProducts.find(p => p.id && p.id.toString() === id?.toString());
    setProduct(foundProduct);
    window.scrollTo(0, 0);
  }, [id, smartphonesState, watchesState, furnitureState, kidsState, fashionState, electronicsState, digitalProductState, homeAppliancesState, vegetableState, decorState, booksState]);

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
    const category = product.category;
    const map = {
      smartphones: smartphonesState,
      watches: watchesState,
      furniture: furnitureState,
      kids: kidsState,
      fashion: fashionState,
      electronics: electronicsState,
      'digital-product': digitalProductState,
      'home-appliances': homeAppliancesState,
      vegetable: vegetableState,
      decor: decorState,
      books: booksState
    };
    const list = map[category] || [];
    return list.filter(p => p.id !== product.id).slice(0, 4);
  };

  const isCurrentFavorite = isFavorite(product.id);
  const isCurrentComparing = isComparing(product.id);

  // Frequently Bought Together Accessory configuration
  const getFbtAccessory = () => {
    const cat = product.category;
    if (cat === 'smartphones' || cat === 'electronics') {
      return { id: product.id + 1000, title: "Bluetooth Portable Speaker", price: 49, image: speakerImg };
    }
    if (cat === 'watches') {
      return { id: product.id + 1000, title: "UV Protected Sunglasses", price: 29, image: sunglassesImg };
    }
    if (cat === 'furniture' || cat === 'decor') {
      return { id: product.id + 1000, title: "Smart Air Purifier", price: 199, image: airPurifierImg };
    }
    if (cat === 'kids') {
      return { id: product.id + 1000, title: "Soft Teddy Bear Toy", price: 19, image: teddyBearImg };
    }
    return { id: product.id + 1000, title: "Leather Smart Belt", price: 15, image: leatherBeltImg };
  };

  const fbtAccessory = product ? getFbtAccessory() : null;

  const handleCheckPincode = (e) => {
    e.preventDefault();
    if (!/^\d{6}$/.test(pincode)) {
      setPincodeStatus('invalid');
      return;
    }
    setPincodeStatus('loading');
    setTimeout(() => {
      const days = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
      const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
      const delivery = new Date();
      delivery.setDate(delivery.getDate() + 3);
      const dayName = days[delivery.getDay()];
      const dateNum = delivery.getDate();
      const monthName = months[delivery.getMonth()];
      
      setDeliveryDate(`${dayName}, ${monthName} ${dateNum}`);
      setPincodeStatus('valid');
    }, 600);
  };

  const handleAddFbtToCart = () => {
    addToCart(product, 1);
    if (fbtChecked && fbtAccessory) {
      const accessoryProduct = {
        id: fbtAccessory.id,
        title: fbtAccessory.title,
        price: fbtAccessory.price,
        image: fbtAccessory.image,
        quantity: 1
      };
      addToCart(accessoryProduct, 1);
    }
  };

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
            {product.category === 'smartphones' && <p className="product-subtitle">Premium Smartphone Experience</p>}
            
            <div className="price-rating-row">
              <div className="large-price">₹{price.toLocaleString()}</div>
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

            {/* Flipkart-style Available Offers */}
            <div className="available-offers-container">
              <h4 className="offers-title"><Tag size={16} /> Available Offers</h4>
              <ul className="offers-list">
                <li className="offer-item">
                  <Tag size={14} className="offer-tag-icon" />
                  <span><strong>Bank Offer:</strong> 10% instant discount on SBI Credit Cards, up to ₹50 on orders above ₹250. <span className="tnc-link">T&C</span></span>
                </li>
                <li className="offer-item">
                  <Tag size={14} className="offer-tag-icon" />
                  <span><strong>Bank Offer:</strong> 5% Unlimited Cashback on MarketHub Axis Bank Credit Card. <span className="tnc-link">T&C</span></span>
                </li>
                <li className="offer-item">
                  <Tag size={14} className="offer-tag-icon" />
                  <span><strong>Special Price:</strong> Get extra ₹15 off on select premium digital payments. <span className="tnc-link">T&C</span></span>
                </li>
                <li className="offer-item">
                  <Tag size={14} className="offer-tag-icon" />
                  <span><strong>No Cost EMI:</strong> Interest-free EMI plans starting from ₹30/month. <span className="tnc-link">T&C</span></span>
                </li>
              </ul>
            </div>

            {product.color ? (
              <div className="option-group">
                <span className="option-label">Color</span>
                <div className="color-options">
                  {product.color.split(',').map((c, idx) => {
                    const trimmedColor = c.trim();
                    return (
                      <div 
                        key={idx} 
                        className={`color-circle ${selectedColor === trimmedColor ? 'active' : ''}`} 
                        style={{ backgroundColor: trimmedColor.toLowerCase() }}
                        title={trimmedColor}
                        onClick={() => setSelectedColor(trimmedColor)}
                      ></div>
                    );
                  })}
                </div>
              </div>
            ) : product.category === 'smartphones' ? (
              <div className="option-group">
                <span className="option-label">Color</span>
                <div className="color-options">
                  <div 
                    className={`color-circle ${selectedColor === '#ff4d4d' ? 'active' : ''}`} 
                    style={{ backgroundColor: '#ff4d4d' }}
                    onClick={() => setSelectedColor('#ff4d4d')}
                  ></div>
                  <div 
                    className={`color-circle ${selectedColor === '#000' ? 'active' : ''}`} 
                    style={{ backgroundColor: '#000' }}
                    onClick={() => setSelectedColor('#000')}
                  ></div>
                </div>
              </div>
            ) : null}

            {product.category === 'smartphones' && (
              <div className="option-group">
                <span className="option-label">Expandable Storage</span>
                <div className="storage-options">
                  <div 
                    className={`storage-pill ${selectedStorage === '128 GB' ? 'active' : ''}`}
                    onClick={() => setSelectedStorage('128 GB')}
                  >128 GB</div>
                  <div 
                    className={`storage-pill ${selectedStorage === '256 GB' ? 'active' : ''}`}
                    onClick={() => setSelectedStorage('256 GB')}
                  >256 GB</div>
                </div>
              </div>
            )}

            <div className="quantity-action-row">
              <div className="quantity-selector">
                <button className="qty-btn" onClick={() => handleQuantity('minus')}><Minus size={16} /></button>
                <div className="qty-input">{quantity}</div>
                <button className="qty-btn" onClick={() => handleQuantity('plus')}><Plus size={16} /></button>
              </div>
              <button className="add-cart-large" onClick={() => addToCart({ ...product, selectedColor, selectedStorage }, quantity)}>
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

            {/* Pincode Delivery Checker */}
            <div className="pincode-delivery-checker">
              <span className="checker-label"><MapPin size={16} /> Delivery & Services Checker</span>
              <form onSubmit={handleCheckPincode} className="pincode-input-wrapper">
                <input 
                  type="text" 
                  placeholder="Enter Delivery Pincode (6-digit)" 
                  value={pincode}
                  onChange={(e) => setPincode(e.target.value.replace(/\D/g, ''))}
                  maxLength={6}
                  className="pincode-input"
                />
                <button type="submit" className="pincode-submit-btn">Check</button>
              </form>
              
              {pincodeStatus === 'loading' && (
                <p className="pincode-message loading">Checking availability...</p>
              )}
              {pincodeStatus === 'valid' && (
                <div className="pincode-message success">
                  <p className="delivery-date-text">Delivery by <strong>{deliveryDate}</strong> | <span className="free-tag">Free</span></p>
                  <p className="cod-availability">✔ Cash on Delivery Available</p>
                  <p className="replacement-availability">✔ 7 Days Replacement Policy</p>
                </div>
              )}
              {pincodeStatus === 'invalid' && (
                <p className="pincode-message error">❌ Please enter a valid 6-digit pincode (e.g. 110001)</p>
              )}
            </div>

            {/* Product Highlights & Warranty */}
            <div className="quick-highlights-section">
              <h4 className="section-small-title"><Sparkles size={16} /> Key Highlights</h4>
              <ul className="highlights-list">
                {product.category === 'smartphones' && (
                  <>
                    <li>12 GB RAM | 256 GB ROM | Expandable up to 1 TB</li>
                    <li>17.27 cm (6.8 inch) Quad HD+ Dynamic AMOLED 2X Display</li>
                    <li>200MP + 50MP + 12MP + 10MP Quad Rear Camera | 12MP Front</li>
                    <li>5000 mAh Li-Ion High-Capacity Battery</li>
                    <li>Snapdragon 8 Gen 3 Deca-Core Processor</li>
                  </>
                )}
                {product.category === 'watches' && (
                  <>
                    <li>1.43-inch Always-on AMOLED Display</li>
                    <li>Heart Rate, SpO2, and Sleep Quality Tracking</li>
                    <li>5ATM Water Resistant up to 50 Meters</li>
                    <li>Up to 10 Days of Battery Life on Single Charge</li>
                    <li>Built-in GPS and Bluetooth Calling support</li>
                  </>
                )}
                {product.category === 'furniture' && (
                  <>
                    <li>Made from premium quality teak wood and durable steel frame</li>
                    <li>Ergonomic and highly comfortable seating design</li>
                    <li>Stain-resistant fabric upholstery, easy to clean</li>
                    <li>Sturdy structure with a maximum load capacity of 150 kg</li>
                    <li>Minimal assembly required with included kit</li>
                  </>
                )}
                {product.category === 'kids' && (
                  <>
                    <li>Made from 100% safe, non-toxic, BPA-free materials</li>
                    <li>Soft fabric finish with double reinforced stitching</li>
                    <li>Stimulates cognitive growth and creative imagination</li>
                    <li>ASTM and EN71 safety standards certified</li>
                    <li>Suitable for kids of all ages (3 years and up)</li>
                  </>
                )}
                {!['smartphones', 'watches', 'furniture', 'kids'].includes(product.category) && (
                  <>
                    <li>High quality materials and craftsmanship</li>
                    <li>Premium look and feel with modern design elements</li>
                    <li>Durable and highly reliable performance</li>
                    <li>100% satisfaction guaranteed product</li>
                  </>
                )}
              </ul>
              <div className="warranty-services-summary">
                <div className="service-bullet">🛡 1 Year Manufacturer Warranty</div>
                <div className="service-bullet">🔁 7 Days Replacement Policy</div>
              </div>
            </div>

            <div className="trust-badges">
              <div className="trust-item">
                <div style={{ background: '#f0f0f0', padding: '10px', borderRadius: '50%' }}>
                  <img src="https://cdn-icons-png.flaticon.com/512/1554/1554401.png" width="20" alt="COD" />
                </div>
                <span>COD</span>
                <p>Cash on Delivery is eligible for orders above ₹10 and below ₹500000</p>
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
              {product.color ? (
                <div>Color : <span style={{ color: '#1a1a1a' }}>{product.color}</span></div>
              ) : (
                product.category === 'smartphones' && <div>Color : <span style={{ color: '#1a1a1a' }}>Red, Black</span></div>
              )}
              {product.category === 'smartphones' && <div>Expandable Storage : <span style={{ color: '#1a1a1a' }}>128 GB, 256 GB</span></div>}
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

        {/* Frequently Bought Together Bundle */}
        {fbtAccessory && (
          <div className="frequently-bought-together-section">
            <h3 className="section-title-medium">Frequently Bought Together</h3>
            <div className="fbt-container-box">
              <div className="fbt-products-row">
                {/* Main Product Card */}
                <div className="fbt-product-item">
                  <div className="fbt-img-wrapper">
                    <img src={image} alt={title} className="fbt-img" />
                  </div>
                  <div className="fbt-info">
                    <span className="fbt-item-name">{title}</span>
                    <span className="fbt-item-price">₹{price.toLocaleString()}</span>
                  </div>
                </div>
                
                {/* Plus Connector */}
                <div className="fbt-connector">+</div>
                
                {/* Accessory Card */}
                <div className="fbt-product-item">
                  <div className="fbt-checkbox-wrapper">
                    <input 
                      type="checkbox" 
                      id="accessory-cb" 
                      checked={fbtChecked} 
                      onChange={(e) => setFbtChecked(e.target.checked)}
                      className="fbt-checkbox"
                    />
                    <label htmlFor="accessory-cb" className="fbt-checkbox-label">
                      <div className="fbt-img-wrapper">
                        <img src={fbtAccessory.image} alt={fbtAccessory.title} className="fbt-img" />
                      </div>
                    </label>
                  </div>
                  <div className="fbt-info">
                    <span className="fbt-item-name">{fbtAccessory.title}</span>
                    <span className="fbt-item-price">₹{fbtAccessory.price}</span>
                  </div>
                </div>
              </div>
              
              {/* Price calculations & CTA */}
              <div className="fbt-summary-card">
                <div className="fbt-summary-row">
                  <span className="summary-lbl">Items Count:</span>
                  <span className="summary-val">{fbtChecked ? 2 : 1}</span>
                </div>
                <div className="fbt-summary-row grand-total">
                  <span className="summary-lbl">Bundle Total:</span>
                  <span className="summary-val">₹{(price + (fbtChecked ? fbtAccessory.price : 0)).toLocaleString()}</span>
                </div>
                <button onClick={handleAddFbtToCart} className="fbt-add-btn">
                  <ShoppingCart size={16} /> Add Bundle to Cart
                </button>
              </div>
            </div>
          </div>
        )}

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
                  {product.category === 'smartphones' ? (
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
            {activeTab === 'reviews' && (
              <div className="reviews-tab-container">
                <div className="reviews-summary-row">
                  <div className="overall-rating-card">
                    <span className="big-rating-score">{rating} ★</span>
                    <span className="rating-subtitle">Out of 5 Stars</span>
                    <span className="total-ratings-count">3 Ratings & 3 Reviews</span>
                  </div>
                  <div className="rating-bars-container">
                    <div className="rating-bar-row">
                      <span className="star-num">5 ★</span>
                      <div className="rating-bar-outer">
                        <div className="rating-bar-inner" style={{ width: '80%' }}></div>
                      </div>
                      <span className="row-percentage">80%</span>
                    </div>
                    <div className="rating-bar-row">
                      <span className="star-num">4 ★</span>
                      <div className="rating-bar-outer">
                        <div className="rating-bar-inner" style={{ width: '15%' }}></div>
                      </div>
                      <span className="row-percentage">15%</span>
                    </div>
                    <div className="rating-bar-row">
                      <span className="star-num">3 ★</span>
                      <div className="rating-bar-outer">
                        <div className="rating-bar-inner" style={{ width: '5%' }}></div>
                      </div>
                      <span className="row-percentage">5%</span>
                    </div>
                    <div className="rating-bar-row">
                      <span className="star-num">2 ★</span>
                      <div className="rating-bar-outer">
                        <div className="rating-bar-inner" style={{ width: '0%' }}></div>
                      </div>
                      <span className="row-percentage">0%</span>
                    </div>
                    <div className="rating-bar-row">
                      <span className="star-num">1 ★</span>
                      <div className="rating-bar-outer">
                        <div className="rating-bar-inner" style={{ width: '0%' }}></div>
                      </div>
                      <span className="row-percentage">0%</span>
                    </div>
                  </div>
                </div>

                <div className="reviews-list-container">
                  <h4 className="reviews-list-header">Customer Feedback</h4>
                  <div className="review-card-item">
                    <div className="review-header">
                      <span className="review-rating-badge green">5 ★</span>
                      <span className="review-title">Simply superb product!</span>
                    </div>
                    <p className="review-body">
                      Absolutely loved this item. The performance is top notch and build quality feels extremely premium. Would highly recommend this to anyone looking for a high-quality option.
                    </p>
                    <div className="review-footer">
                      <span className="review-author">Aniket Sharma</span>
                      <span className="verified-badge">✔ Verified Purchaser</span>
                      <span className="review-date">May 12, 2026</span>
                      <div className="review-votes">
                        <button className="vote-btn"><ThumbsUp size={14} /> 124</button>
                        <button className="vote-btn"><ThumbsDown size={14} /> 8</button>
                      </div>
                    </div>
                  </div>

                  <div className="review-card-item">
                    <div className="review-header">
                      <span className="review-rating-badge green">5 ★</span>
                      <span className="review-title">Best in class features</span>
                    </div>
                    <p className="review-body">
                      Really good value for money. Using it daily for a few weeks now and haven't faced a single issue. Extremely satisfied with this purchase!
                    </p>
                    <div className="review-footer">
                      <span className="review-author">Sneha Kapoor</span>
                      <span className="verified-badge">✔ Verified Purchaser</span>
                      <span className="review-date">Apr 28, 2026</span>
                      <div className="review-votes">
                        <button className="vote-btn"><ThumbsUp size={14} /> 93</button>
                        <button className="vote-btn"><ThumbsDown size={14} /> 3</button>
                      </div>
                    </div>
                  </div>

                  <div className="review-card-item">
                    <div className="review-header">
                      <span className="review-rating-badge yellow">4 ★</span>
                      <span className="review-title">Great purchase, highly recommend</span>
                    </div>
                    <p className="review-body">
                      Sleek design, works exactly as advertised. The delivery was fast and the packaging was robust. Only minor issue is user manual details could be slightly more detailed.
                    </p>
                    <div className="review-footer">
                      <span className="review-author">Rajesh Kumar</span>
                      <span className="verified-badge">✔ Verified Purchaser</span>
                      <span className="review-date">Apr 15, 2026</span>
                      <div className="review-votes">
                        <button className="vote-btn"><ThumbsUp size={14} /> 45</button>
                        <button className="vote-btn"><ThumbsDown size={14} /> 2</button>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}
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
