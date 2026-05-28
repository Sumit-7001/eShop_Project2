import React, { useState } from 'react';
import { 
  LayoutDashboard, BarChart3, Package, ShoppingBag, 
  MessageSquare, Settings, Plus, Trash2, Edit2, 
  TrendingUp, Users, DollarSign, Star, AlertCircle, X,
  ShoppingBag as CartIcon, ExternalLink
} from 'lucide-react';
import { Link } from 'react-router-dom';
import '../styles/AdminDashboard.css';

const AdminDashboard = ({ 
  smartphones = [], 
  watches = [], 
  furniture = [], 
  kids = [], 
  onAddProduct, 
  onDeleteProduct, 
  onUpdateProduct 
}) => {
  const [activePanel, setActivePanel] = useState('overview');
  const [addProductModal, setAddProductModal] = useState(false);
  const [editProductModal, setEditProductModal] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState(null);

  // Form states for adding a product
  const [newTitle, setNewTitle] = useState('');
  const [newPrice, setNewPrice] = useState('');
  const [newOldPrice, setNewOldPrice] = useState('');
  const [newCategory, setNewCategory] = useState('smartphones');
  const [newImage, setNewImage] = useState('');
  const [newSale, setNewSale] = useState(false);
  const [newDescription, setNewDescription] = useState('');

  // Mock orders list with live update status
  const [orders, setOrders] = useState([
    { id: 'ORD-9021', customer: 'Arun Sen', date: 'May 27, 2026', amount: 1199, status: 'Pending', items: 'Samsung Galaxy S24 Ultra x1' },
    { id: 'ORD-9020', customer: 'Riya Roy', date: 'May 26, 2026', amount: 399, status: 'Shipped', items: 'Apple Watch Series 9 x1' },
    { id: 'ORD-9019', customer: 'Sumit Das', date: 'May 25, 2026', amount: 549, status: 'Delivered', items: 'Oak Wood Dining Table x1' },
    { id: 'ORD-9018', customer: 'Kavita Pal', date: 'May 25, 2026', amount: 899, status: 'Pending', items: 'Modern Velvet Sofa x1' }
  ]);

  // Mock feedback replies state
  const [feedbacks, setFeedbacks] = useState([
    { id: 1, author: 'Sohan Roy', rating: 5, date: 'May 27, 2026', comment: 'Excellent delivery speed and superb packaging!', product: 'iPhone 15 Pro Max', status: 'Approved' },
    { id: 2, author: 'Mita Sen', rating: 4, date: 'May 26, 2026', comment: 'The oak wood dining table is sturdy and fits perfectly.', product: 'Oak Wood Dining Table', status: 'Approved' },
    { id: 3, author: 'Dev Kar', rating: 2, date: 'May 24, 2026', comment: 'Phone got a bit warm during setup, but works okay now.', product: 'OnePlus 12', status: 'Pending Review' }
  ]);

  // Mock settings state
  const [storeSettings, setStoreSettings] = useState({
    name: 'eShop Global Inc.',
    email: 'contact@eshop.com',
    phone: '+91 9876543210',
    address: 'Salt Lake Sector V, Kolkata, India',
    currency: 'USD ($)',
    maintenance: false
  });

  // Calculate dynamic stats
  const activeProductsCount = smartphones.length + watches.length + furniture.length + kids.length;
  const totalRevenue = 148560;
  const totalCustomers = 842;
  const averageRating = 4.8;

  // Flatten products with category tags
  const allStoreProducts = [
    ...smartphones.map(p => ({ ...p, category: 'smartphones' })),
    ...watches.map(p => ({ ...p, category: 'watches' })),
    ...furniture.map(p => ({ ...p, category: 'furniture' })),
    ...kids.map(p => ({ ...p, category: 'kids' }))
  ];

  // Stock Alerts list (mock low stock alerts)
  const lowStockAlerts = [
    { title: 'Samsung Galaxy S24 Ultra', stock: '2 left', category: 'smartphones' },
    { title: 'Oak Wood Dining Table', stock: '1 left', category: 'furniture' },
    { title: 'Plush Teddy Bear', stock: '0 left (Out of stock)', category: 'kids' }
  ];

  const handleOrderAction = (orderId, newStatus) => {
    setOrders(prev => prev.map(o => o.id === orderId ? { ...o, status: newStatus } : o));
  };

  const handleSettingsSubmit = (e) => {
    e.preventDefault();
    alert('Store settings updated successfully!');
  };

  const handleAddProductSubmit = (e) => {
    e.preventDefault();
    if (!newTitle || !newPrice) {
      alert('Please enter a product title and price!');
      return;
    }
    const newProduct = {
      title: newTitle,
      price: parseFloat(newPrice),
      oldPrice: newOldPrice ? parseFloat(newOldPrice) : null,
      category: newCategory,
      image: newImage || 'https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?w=400&fit=crop',
      sale: newSale,
      description: newDescription || 'Premium product designed with high quality components.'
    };
    onAddProduct(newProduct);
    
    // Reset Form
    setNewTitle('');
    setNewPrice('');
    setNewOldPrice('');
    setNewImage('');
    setNewSale(false);
    setNewDescription('');
    setAddProductModal(false);
  };

  const openEditModal = (product) => {
    setSelectedProduct(product);
    setNewTitle(product.title);
    setNewPrice(product.price);
    setNewOldPrice(product.oldPrice || '');
    setNewCategory(product.category);
    setNewImage(product.image);
    setNewSale(product.sale || false);
    setNewDescription(product.description || '');
    setEditProductModal(true);
  };

  const handleEditProductSubmit = (e) => {
    e.preventDefault();
    if (!selectedProduct) return;
    const updated = {
      ...selectedProduct,
      title: newTitle,
      price: parseFloat(newPrice),
      oldPrice: newOldPrice ? parseFloat(newOldPrice) : null,
      category: newCategory,
      image: newImage,
      sale: newSale,
      description: newDescription
    };
    onUpdateProduct(updated);
    setEditProductModal(false);
    setSelectedProduct(null);
  };

  return (
    <div className="admin-dashboard-page">
      <div className="admin-container">
        
        {/* Sidebar Left */}
        <aside className="admin-sidebar">
          <div className="sidebar-brand">
            <CartIcon size={24} className="brand-logo-icon" />
            <h3>eShop Admin</h3>
          </div>

          <ul className="sidebar-menu">
            <li 
              className={activePanel === 'overview' ? 'active' : ''} 
              onClick={() => setActivePanel('overview')}
            >
              <LayoutDashboard size={18} />
              <span>Dashboard Overview</span>
            </li>
            <li 
              className={activePanel === 'analytics' ? 'active' : ''} 
              onClick={() => setActivePanel('analytics')}
            >
              <BarChart3 size={18} />
              <span>Analytics & Revenue</span>
            </li>
            <li 
              className={activePanel === 'products' ? 'active' : ''} 
              onClick={() => setActivePanel('products')}
            >
              <Package size={18} />
              <span>My Products</span>
            </li>
            <li 
              className={activePanel === 'orders' ? 'active' : ''} 
              onClick={() => setActivePanel('orders')}
            >
              <ShoppingBag size={18} />
              <span>Fulfill Orders</span>
            </li>
            <li 
              className={activePanel === 'feedback' ? 'active' : ''} 
              onClick={() => setActivePanel('feedback')}
            >
              <MessageSquare size={18} />
              <span>Customer Feedback</span>
            </li>
            <li 
              className={activePanel === 'settings' ? 'active' : ''} 
              onClick={() => setActivePanel('settings')}
            >
              <Settings size={18} />
              <span>Store Settings</span>
            </li>
          </ul>

          <div className="sidebar-footer">
            <div className="user-profile-mini">
              <div className="avatar-placeholder">SO</div>
              <div className="profile-info">
                <h4>Store Owner</h4>
                <p>Role: Administrator</p>
              </div>
            </div>
            <Link to="/" className="view-storefront-btn">
              <span>Visit Storefront</span>
              <ExternalLink size={14} />
            </Link>
          </div>
        </aside>

        {/* Dashboard Main Panel */}
        <main className="admin-main-panel">
          
          {/* Header Panel */}
          <header className="panel-header">
            <div className="header-info">
              <h1>
                {activePanel === 'overview' && 'Dashboard Overview'}
                {activePanel === 'analytics' && 'Analytics & Sales Reports'}
                {activePanel === 'products' && 'Product Catalog'}
                {activePanel === 'orders' && 'Order Management'}
                {activePanel === 'feedback' && 'Customer Reviews'}
                {activePanel === 'settings' && 'Operational Settings'}
              </h1>
              <p>Welcome back to your administration portal. Live status is shown below.</p>
            </div>
            {activePanel === 'products' && (
              <button className="add-product-main-btn" onClick={() => setAddProductModal(true)}>
                <Plus size={16} />
                <span>Add New Product</span>
              </button>
            )}
          </header>

          {/* Dynamic Panel Content */}
          <div className="panel-content-body">
            
            {/* PANEL: OVERVIEW */}
            {activePanel === 'overview' && (
              <div className="overview-panel">
                <div className="metrics-grid">
                  <div className="metric-card bg-gradient-blue">
                    <div className="metric-icon"><DollarSign size={24} /></div>
                    <div className="metric-info">
                      <p>Total Revenue</p>
                      <h3>${totalRevenue.toLocaleString()}</h3>
                    </div>
                    <span className="growth-tag"><TrendingUp size={12} /> +12.4%</span>
                  </div>

                  <div className="metric-card bg-gradient-purple">
                    <div className="metric-icon"><Package size={24} /></div>
                    <div className="metric-info">
                      <p>Active Products</p>
                      <h3>{activeProductsCount} Items</h3>
                    </div>
                  </div>

                  <div className="metric-card bg-gradient-emerald">
                    <div className="metric-icon"><Users size={24} /></div>
                    <div className="metric-info">
                      <p>Total Customers</p>
                      <h3>{totalCustomers}</h3>
                    </div>
                  </div>

                  <div className="metric-card bg-gradient-amber">
                    <div className="metric-icon"><Star size={24} /></div>
                    <div className="metric-info">
                      <p>Store Rating</p>
                      <h3>{averageRating} / 5.0</h3>
                    </div>
                  </div>
                </div>

                <div className="overview-secondary-grid">
                  {/* Low Stock Alerts */}
                  <div className="alert-box-card">
                    <div className="card-header-icon border-amber">
                      <AlertCircle size={20} className="amber-text" />
                      <h4>Low Stock Warnings</h4>
                    </div>
                    <div className="alert-list">
                      {lowStockAlerts.map((alert, idx) => (
                        <div key={idx} className="alert-item">
                          <div className="alert-title-group">
                            <span className="bullet"></span>
                            <p>{alert.title}</p>
                          </div>
                          <span className="stock-alert-badge">{alert.stock}</span>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Recent Activity */}
                  <div className="recent-activity-card">
                    <h4>Recent Activity Feed</h4>
                    <div className="activity-list">
                      <div className="activity-item">
                        <span className="activity-dot bg-blue"></span>
                        <p>Order <strong>ORD-9021</strong> received from <strong>Arun Sen</strong> - $1,199</p>
                        <span>10 mins ago</span>
                      </div>
                      <div className="activity-item">
                        <span className="activity-dot bg-emerald"></span>
                        <p>Product <strong>Google Pixel 8 Pro</strong> stock updated to 12 items</p>
                        <span>2 hours ago</span>
                      </div>
                      <div className="activity-item">
                        <span className="activity-dot bg-purple"></span>
                        <p>Customer feedback review approved for <strong>Oak Wood Dining Table</strong></p>
                        <span>1 day ago</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* PANEL: ANALYTICS */}
            {activePanel === 'analytics' && (
              <div className="analytics-panel">
                <div className="analytics-visuals">
                  <div className="chart-card">
                    <h4>Sales Volume Growth (Monthly)</h4>
                    <div className="mock-chart-container">
                      <svg viewBox="0 0 500 200" className="svg-chart">
                        <defs>
                          <linearGradient id="chartGrad" x1="0" y1="0" x2="0" y2="1">
                            <stop offset="0%" stopColor="#ff4d4d" stopOpacity="0.4" />
                            <stop offset="100%" stopColor="#ff4d4d" stopOpacity="0.0" />
                          </linearGradient>
                        </defs>
                        {/* Grid lines */}
                        <line x1="0" y1="50" x2="500" y2="50" stroke="#f1f5f9" />
                        <line x1="0" y1="100" x2="500" y2="100" stroke="#f1f5f9" />
                        <line x1="0" y1="150" x2="500" y2="150" stroke="#f1f5f9" />
                        
                        {/* Area */}
                        <path d="M 0 160 Q 100 120 200 140 T 300 80 T 400 90 T 500 40 L 500 200 L 0 200 Z" fill="url(#chartGrad)" />
                        
                        {/* Line */}
                        <path d="M 0 160 Q 100 120 200 140 T 300 80 T 400 90 T 500 40" fill="none" stroke="#ff4d4d" strokeWidth="3" />
                        
                        {/* Dots */}
                        <circle cx="200" cy="140" r="5" fill="#ff4d4d" />
                        <circle cx="300" cy="80" r="5" fill="#ff4d4d" />
                        <circle cx="500" cy="40" r="5" fill="#ff4d4d" />
                      </svg>
                      <div className="chart-x-labels">
                        <span>Jan</span>
                        <span>Feb</span>
                        <span>Mar</span>
                        <span>Apr</span>
                        <span>May (Live)</span>
                      </div>
                    </div>
                  </div>

                  <div className="traffic-distribution">
                    <h4>Sales Channels Distribution</h4>
                    <div className="progress-bars-list">
                      <div className="progress-item">
                        <div className="progress-labels">
                          <span>Direct Storefront</span>
                          <strong>74%</strong>
                        </div>
                        <div className="progress-track"><div className="progress-fill bg-blue" style={{ width: '74%' }}></div></div>
                      </div>
                      <div className="progress-item">
                        <div className="progress-labels">
                          <span>Affiliate Sellers</span>
                          <strong>18%</strong>
                        </div>
                        <div className="progress-track"><div className="progress-fill bg-purple" style={{ width: '18%' }}></div></div>
                      </div>
                      <div className="progress-item">
                        <div className="progress-labels">
                          <span>Email Campaigns</span>
                          <strong>8%</strong>
                        </div>
                        <div className="progress-track"><div className="progress-fill bg-amber" style={{ width: '8%' }}></div></div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* PANEL: PRODUCTS */}
            {activePanel === 'products' && (
              <div className="products-panel">
                <div className="products-table-card">
                  <div className="table-header-filters">
                    <h4>Catalog Items ({allStoreProducts.length})</h4>
                  </div>

                  <div className="table-responsive">
                    <table className="admin-table">
                      <thead>
                        <tr>
                          <th>Image</th>
                          <th>Product Title</th>
                          <th>Category</th>
                          <th>Price</th>
                          <th>Sales status</th>
                          <th className="text-right">Actions</th>
                        </tr>
                      </thead>
                      <tbody>
                        {allStoreProducts.map(product => (
                          <tr key={product.id}>
                            <td>
                              <div className="table-product-img-wrapper">
                                <img src={product.image} alt={product.title} />
                              </div>
                            </td>
                            <td>
                              <div className="table-product-title-group">
                                <strong>{product.title}</strong>
                                <span>ID: {product.id}</span>
                              </div>
                            </td>
                            <td><span className="category-tag">{product.category}</span></td>
                            <td>
                              <div className="table-price-group">
                                <strong className="curr-price">${product.price}</strong>
                                {product.oldPrice && <span className="old-price">${product.oldPrice}</span>}
                              </div>
                            </td>
                            <td>
                              {product.sale ? (
                                <span className="badge-status bg-red">SALE</span>
                              ) : (
                                <span className="badge-status bg-gray">Regular</span>
                              )}
                            </td>
                            <td className="text-right actions-column">
                              <button className="icon-action-btn edit" onClick={() => openEditModal(product)} title="Edit Product">
                                <Edit2 size={14} />
                              </button>
                              <button className="icon-action-btn delete" onClick={() => onDeleteProduct(product.id, product.category)} title="Delete Product">
                                <Trash2 size={14} />
                              </button>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              </div>
            )}

            {/* PANEL: ORDERS */}
            {activePanel === 'orders' && (
              <div className="orders-panel">
                <div className="orders-table-card">
                  <div className="table-responsive">
                    <table className="admin-table">
                      <thead>
                        <tr>
                          <th>Order ID</th>
                          <th>Customer</th>
                          <th>Items Purchased</th>
                          <th>Total Amount</th>
                          <th>Status</th>
                          <th className="text-right">Actions</th>
                        </tr>
                      </thead>
                      <tbody>
                        {orders.map(order => (
                          <tr key={order.id}>
                            <td><strong>{order.id}</strong><br/><span style={{ fontSize: '11px', color: '#64748b' }}>{order.date}</span></td>
                            <td><strong>{order.customer}</strong></td>
                            <td style={{ fontSize: '13px', color: '#334155' }}>{order.items}</td>
                            <td><strong>${order.amount}</strong></td>
                            <td>
                              <span className={`badge-status order-status-${order.status.toLowerCase()}`}>
                                {order.status}
                              </span>
                            </td>
                            <td className="text-right order-actions">
                              <select 
                                value={order.status}
                                onChange={(e) => handleOrderAction(order.id, e.target.value)}
                                className="order-status-selector"
                              >
                                <option value="Pending">Pending</option>
                                <option value="Shipped">Shipped</option>
                                <option value="Delivered">Delivered</option>
                              </select>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              </div>
            )}

            {/* PANEL: FEEDBACK */}
            {activePanel === 'feedback' && (
              <div className="feedback-panel">
                <div className="reviews-card-list">
                  {feedbacks.map(review => (
                    <div key={review.id} className="review-box">
                      <div className="review-box-header">
                        <div className="review-author-group">
                          <strong>{review.author}</strong>
                          <span>Reviewed: {review.product}</span>
                        </div>
                        <span className="review-date">{review.date}</span>
                      </div>
                      
                      <div className="review-rating-row">
                        {[...Array(5)].map((_, i) => (
                          <Star 
                            key={i} 
                            size={14} 
                            fill={i < review.rating ? "#ffb300" : "none"} 
                            color={i < review.rating ? "#ffb300" : "#cbd5e1"} 
                          />
                        ))}
                      </div>

                      <p className="review-comment">"{review.comment}"</p>

                      <div className="review-actions-row">
                        <span className={`status-badge-mini ${review.status.toLowerCase() === 'approved' ? 'green' : 'amber'}`}>
                          {review.status}
                        </span>
                        <button className="reply-btn">Reply to feedback</button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* PANEL: SETTINGS */}
            {activePanel === 'settings' && (
              <div className="settings-panel">
                <div className="settings-card">
                  <form onSubmit={handleSettingsSubmit} className="admin-form">
                    <div className="form-row">
                      <div className="form-group-half">
                        <label>Store Name</label>
                        <input 
                          type="text" 
                          value={storeSettings.name} 
                          onChange={(e) => setStoreSettings({ ...storeSettings, name: e.target.value })}
                        />
                      </div>
                      <div className="form-group-half">
                        <label>Contact Email</label>
                        <input 
                          type="email" 
                          value={storeSettings.email} 
                          onChange={(e) => setStoreSettings({ ...storeSettings, email: e.target.value })}
                        />
                      </div>
                    </div>

                    <div className="form-row">
                      <div className="form-group-half">
                        <label>Support Phone</label>
                        <input 
                          type="text" 
                          value={storeSettings.phone} 
                          onChange={(e) => setStoreSettings({ ...storeSettings, phone: e.target.value })}
                        />
                      </div>
                      <div className="form-group-half">
                        <label>Display Currency</label>
                        <select 
                          value={storeSettings.currency} 
                          onChange={(e) => setStoreSettings({ ...storeSettings, currency: e.target.value })}
                        >
                          <option value="USD ($)">USD ($)</option>
                          <option value="EUR (€)">EUR (€)</option>
                          <option value="INR (₹)">INR (₹)</option>
                        </select>
                      </div>
                    </div>

                    <div className="form-group-full">
                      <label>Physical Address</label>
                      <input 
                        type="text" 
                        value={storeSettings.address} 
                        onChange={(e) => setStoreSettings({ ...storeSettings, address: e.target.value })}
                      />
                    </div>

                    <div className="form-checkbox-row">
                      <input 
                        type="checkbox" 
                        id="maintMode"
                        checked={storeSettings.maintenance}
                        onChange={(e) => setStoreSettings({ ...storeSettings, maintenance: e.target.checked })}
                      />
                      <label htmlFor="maintMode">Enable Shop Maintenance Mode (blocks store access for buyers)</label>
                    </div>

                    <div className="settings-submit-container">
                      <button type="submit" className="settings-save-btn">Save Shop Changes</button>
                    </div>
                  </form>
                </div>
              </div>
            )}

          </div>
        </main>
      </div>

      {/* MODAL: ADD PRODUCT */}
      {addProductModal && (
        <div className="admin-modal-overlay" onClick={() => setAddProductModal(false)}>
          <div className="admin-modal-box" onClick={(e) => e.stopPropagation()}>
            <div className="modal-box-header">
              <h3>Create New Product Listing</h3>
              <button className="modal-close-icon-btn" onClick={() => setAddProductModal(false)}>
                <X size={20} />
              </button>
            </div>

            <form onSubmit={handleAddProductSubmit} className="modal-form">
              <div className="form-group">
                <label>Product Title *</label>
                <input 
                  type="text" 
                  value={newTitle} 
                  onChange={(e) => setNewTitle(e.target.value)} 
                  placeholder="e.g. Google Pixel 9 Pro"
                  required 
                />
              </div>

              <div className="form-row">
                <div className="form-group-half">
                  <label>Price ($) *</label>
                  <input 
                    type="number" 
                    step="0.01"
                    value={newPrice} 
                    onChange={(e) => setNewPrice(e.target.value)} 
                    placeholder="999"
                    required 
                  />
                </div>
                <div className="form-group-half">
                  <label>Old Price ($)</label>
                  <input 
                    type="number" 
                    step="0.01"
                    value={newOldPrice} 
                    onChange={(e) => setNewOldPrice(e.target.value)} 
                    placeholder="1199"
                  />
                </div>
              </div>

              <div className="form-row">
                <div className="form-group-half">
                  <label>Catalog Category *</label>
                  <select value={newCategory} onChange={(e) => setNewCategory(e.target.value)}>
                    <option value="smartphones">Smartphones</option>
                    <option value="watches">Watches</option>
                    <option value="furniture">Furniture</option>
                    <option value="kids">Kids Section</option>
                  </select>
                </div>
                <div className="form-group-half form-checkbox-wrapper">
                  <input 
                    type="checkbox" 
                    id="saleProd" 
                    checked={newSale} 
                    onChange={(e) => setNewSale(e.target.checked)} 
                  />
                  <label htmlFor="saleProd">Active Sale Deal</label>
                </div>
              </div>

              <div className="form-group">
                <label>Product Image Link</label>
                <input 
                  type="text" 
                  value={newImage} 
                  onChange={(e) => setNewImage(e.target.value)} 
                  placeholder="Paste image URL (or leave empty for stock photo)" 
                />
              </div>

              <div className="form-group">
                <label>Item Description</label>
                <textarea 
                  value={newDescription} 
                  onChange={(e) => setNewDescription(e.target.value)} 
                  placeholder="Describe your product specs, general information..."
                  rows="3"
                ></textarea>
              </div>

              <div className="modal-actions-container">
                <button type="button" className="modal-cancel-btn" onClick={() => setAddProductModal(false)}>
                  Cancel
                </button>
                <button type="submit" className="modal-submit-btn">
                  Publish Product
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MODAL: EDIT PRODUCT */}
      {editProductModal && (
        <div className="admin-modal-overlay" onClick={() => setEditProductModal(false)}>
          <div className="admin-modal-box" onClick={(e) => e.stopPropagation()}>
            <div className="modal-box-header">
              <h3>Edit Product Listing</h3>
              <button className="modal-close-icon-btn" onClick={() => setEditProductModal(false)}>
                <X size={20} />
              </button>
            </div>

            <form onSubmit={handleEditProductSubmit} className="modal-form">
              <div className="form-group">
                <label>Product Title *</label>
                <input 
                  type="text" 
                  value={newTitle} 
                  onChange={(e) => setNewTitle(e.target.value)} 
                  required 
                />
              </div>

              <div className="form-row">
                <div className="form-group-half">
                  <label>Price ($) *</label>
                  <input 
                    type="number" 
                    step="0.01"
                    value={newPrice} 
                    onChange={(e) => setNewPrice(e.target.value)} 
                    required 
                  />
                </div>
                <div className="form-group-half">
                  <label>Old Price ($)</label>
                  <input 
                    type="number" 
                    step="0.01"
                    value={newOldPrice} 
                    onChange={(e) => setNewOldPrice(e.target.value)} 
                  />
                </div>
              </div>

              <div className="form-row">
                <div className="form-group-half">
                  <label>Catalog Category *</label>
                  <select value={newCategory} disabled>
                    <option value="smartphones">Smartphones</option>
                    <option value="watches">Watches</option>
                    <option value="furniture">Furniture</option>
                    <option value="kids">Kids Section</option>
                  </select>
                </div>
                <div className="form-group-half form-checkbox-wrapper">
                  <input 
                    type="checkbox" 
                    id="editSaleProd" 
                    checked={newSale} 
                    onChange={(e) => setNewSale(e.target.checked)} 
                  />
                  <label htmlFor="editSaleProd">Active Sale Deal</label>
                </div>
              </div>

              <div className="form-group">
                <label>Product Image Link</label>
                <input 
                  type="text" 
                  value={newImage} 
                  onChange={(e) => setNewImage(e.target.value)} 
                />
              </div>

              <div className="form-group">
                <label>Item Description</label>
                <textarea 
                  value={newDescription} 
                  onChange={(e) => setNewDescription(e.target.value)} 
                  rows="3"
                ></textarea>
              </div>

              <div className="modal-actions-container">
                <button type="button" className="modal-cancel-btn" onClick={() => setEditProductModal(false)}>
                  Cancel
                </button>
                <button type="submit" className="modal-submit-btn">
                  Save Changes
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
};

export default AdminDashboard;
