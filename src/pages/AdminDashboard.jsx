import React, { useState, useMemo, useEffect } from 'react';
import ReactDOM from 'react-dom';
import { useApp } from '../context/AppContext';
import {
  LayoutDashboard, BarChart3, Package, ShoppingBag,
  Users, Settings, Plus, Trash2, Edit2,
  TrendingUp, TrendingDown, DollarSign, Star, AlertCircle, X,
  ShoppingBag as CartIcon, ExternalLink, Search, Filter, Bell,
  ChevronDown, ChevronUp, ArrowUpRight, ArrowDownRight,
  Eye, Check, AlertTriangle, Archive, RefreshCw, Boxes,
  UserCheck, UserX, Mail, Phone, MapPin, Tag, MoreVertical,
  Download, Upload, BarChart2, PieChart, Activity, Calendar,
  Layers, Shield, Zap, Moon, Sun, Menu, XCircle, ChevronRight,
  PackageCheck, Clock, Truck, CheckCircle2, ReceiptText, Sliders,
  Briefcase, Wallet, Target, ClipboardList, Printer, Building2
} from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import '../styles/AdminDashboard.css';
import { FeedbackPanel } from '../components/admin/FeedbackPanel';
import { InventoryPanel } from '../components/admin/InventoryPanel';
import { HRMPanel } from '../components/admin/HRMPanel';
import { CRMPanel } from '../components/admin/CRMPanel';
import { ProjectsPanel } from '../components/admin/ProjectsPanel';
import { AccountingPanel } from '../components/admin/AccountingPanel';

// ─── Portal wrapper — renders modals directly into <body> so
//     no CSS stacking context (transform / overflow) clips them ──
const Portal = ({ children }) =>
  ReactDOM.createPortal(children, document.body);


// ─── Mock Data ──────────────────────────────────────────────────────────────
const MOCK_USERS = [
  { id: 'USR-001', name: 'Arun Sen', email: 'arun.sen@email.com', phone: '+91 98765 43210', role: 'customer', status: 'active', orders: 12, spent: 4580, joined: 'Jan 12, 2026', location: 'Kolkata, India' },
  { id: 'USR-002', name: 'Riya Roy', email: 'riya.roy@email.com', phone: '+91 97654 32109', role: 'customer', status: 'active', orders: 8, spent: 2890, joined: 'Feb 3, 2026', location: 'Mumbai, India' },
  { id: 'USR-003', name: 'Sumit Das', email: 'sumit.das@email.com', phone: '+91 96543 21098', role: 'admin', status: 'active', orders: 3, spent: 960, joined: 'Mar 18, 2026', location: 'Delhi, India' },
  { id: 'USR-004', name: 'Kavita Pal', email: 'kavita.pal@email.com', phone: '+91 95432 10987', role: 'customer', status: 'suspended', orders: 5, spent: 1200, joined: 'Apr 5, 2026', location: 'Bangalore, India' },
  { id: 'USR-005', name: 'Dev Kar', email: 'dev.kar@email.com', phone: '+91 94321 09876', role: 'customer', status: 'active', orders: 21, spent: 8750, joined: 'Jan 29, 2026', location: 'Chennai, India' },
  { id: 'USR-006', name: 'Priya Sharma', email: 'priya.sharma@email.com', phone: '+91 93210 98765', role: 'customer', status: 'inactive', orders: 1, spent: 299, joined: 'May 1, 2026', location: 'Pune, India' },
];

const MOCK_ORDERS = [
  { id: 'ORD-9025', customer: 'Dev Kar', email: 'dev.kar@email.com', date: 'May 30, 2026', amount: 2149, status: 'Pending', items: 'iPhone 15 Pro Max x1, Apple Watch x1', payment: 'Credit Card', address: 'Chennai, Tamil Nadu' },
  { id: 'ORD-9024', customer: 'Priya Sharma', email: 'priya.sharma@email.com', date: 'May 29, 2026', amount: 599, status: 'Processing', items: 'Modern Velvet Sofa x1', payment: 'UPI', address: 'Pune, Maharashtra' },
  { id: 'ORD-9023', customer: 'Arun Sen', email: 'arun.sen@email.com', date: 'May 28, 2026', amount: 1199, status: 'Shipped', items: 'Samsung Galaxy S24 Ultra x1', payment: 'Debit Card', address: 'Kolkata, West Bengal' },
  { id: 'ORD-9022', customer: 'Riya Roy', email: 'riya.roy@email.com', date: 'May 27, 2026', amount: 399, status: 'Delivered', items: 'Apple Watch Series 9 x1', payment: 'UPI', address: 'Mumbai, Maharashtra' },
  { id: 'ORD-9021', customer: 'Sumit Das', email: 'sumit.das@email.com', date: 'May 26, 2026', amount: 849, status: 'Delivered', items: 'Oak Wood Dining Table x1', payment: 'Net Banking', address: 'Delhi, NCR' },
  { id: 'ORD-9020', customer: 'Kavita Pal', email: 'kavita.pal@email.com', date: 'May 25, 2026', amount: 299, status: 'Cancelled', items: 'Kids Bicycle x1', payment: 'Credit Card', address: 'Bangalore, Karnataka' },
];

const LOW_STOCK = [
  { title: 'Samsung Galaxy S24 Ultra', stock: 2, category: 'smartphones', sku: 'SMG-S24U-256', threshold: 5 },
  { title: 'Oak Wood Dining Table', stock: 1, category: 'furniture', sku: 'FUR-OWDT-01', threshold: 3 },
  { title: 'Plush Teddy Bear (Giant)', stock: 0, category: 'kids', sku: 'KID-PTB-LG', threshold: 5 },
  { title: 'Garmin Fenix 7', stock: 3, category: 'watches', sku: 'WAT-GF7-BLK', threshold: 5 },
];

const MONTHLY_REVENUE = [
  { month: 'Jan', revenue: 18400, orders: 142 },
  { month: 'Feb', revenue: 22100, orders: 168 },
  { month: 'Mar', revenue: 19800, orders: 155 },
  { month: 'Apr', revenue: 28600, orders: 214 },
  { month: 'May', revenue: 34200, orders: 267 },
  { month: 'Jun', revenue: 25400, orders: 198 },
  { month: 'Jul', revenue: 31000, orders: 243 },
  { month: 'Aug', revenue: 38500, orders: 289 },
  { month: 'Sep', revenue: 42100, orders: 312 },
  { month: 'Oct', revenue: 36800, orders: 271 },
  { month: 'Nov', revenue: 48200, orders: 345 },
  { month: 'Dec', revenue: 52400, orders: 389 },
];

const CATEGORY_SALES = [
  { category: 'Smartphones', sales: 45, color: '#ff4d4d', amount: 67800 },
  { category: 'Watches', sales: 25, color: '#8b5cf6', amount: 37500 },
  { category: 'Furniture', sales: 18, color: '#3b82f6', amount: 27000 },
  { category: 'Kids', sales: 12, color: '#10b981', amount: 18000 },
];

// ── Period-based Analytics Data ─────────────────────────────────────────────
const PERIOD_DATA = {
  week: {
    stats: {
      revenue: '₹3,240', revenueChange: '+8.2%',
      orders: '62', ordersChange: '+5.4%',
      customers: '18', customersChange: '+12.0%',
      avgOrder: '₹52.26', avgOrderChange: '+2.7%',
    },
    chartData: [
      { month: 'Mon', revenue: 420 },
      { month: 'Tue', revenue: 380 },
      { month: 'Wed', revenue: 510 },
      { month: 'Thu', revenue: 620 },
      { month: 'Fri', revenue: 780 },
      { month: 'Sat', revenue: 340 },
      { month: 'Sun', revenue: 190 },
    ],
    chartTitle: 'Daily Revenue (This Week)',
    peakLabel: 'Friday — ₹780',
    lowLabel: 'Sunday — ₹190',
    avgLabel: '₹463 / day',
    categories: [
      { category: 'Smartphones', sales: 48, color: '#ff4d4d', amount: 1556 },
      { category: 'Watches', sales: 22, color: '#8b5cf6', amount: 713 },
      { category: 'Furniture', sales: 19, color: '#3b82f6', amount: 616 },
      { category: 'Kids', sales: 11, color: '#10b981', amount: 356 },
    ],
  },
  month: {
    stats: {
      revenue: '₹34,200', revenueChange: '+11.3%',
      orders: '267', ordersChange: '+7.8%',
      customers: '42', customersChange: '+6.5%',
      avgOrder: '₹53.18', avgOrderChange: '+3.2%',
    },
    chartData: [
      { month: 'Wk 1', revenue: 7200 },
      { month: 'Wk 2', revenue: 9400 },
      { month: 'Wk 3', revenue: 8600 },
      { month: 'Wk 4', revenue: 9000 },
    ],
    chartTitle: 'Weekly Revenue (This Month)',
    peakLabel: 'Week 2 — ₹9,400',
    lowLabel: 'Week 1 — ₹7,200',
    avgLabel: '₹8,550 / week',
    categories: [
      { category: 'Smartphones', sales: 43, color: '#ff4d4d', amount: 14706 },
      { category: 'Watches', sales: 27, color: '#8b5cf6', amount: 9234 },
      { category: 'Furniture', sales: 17, color: '#3b82f6', amount: 5814 },
      { category: 'Kids', sales: 13, color: '#10b981', amount: 4446 },
    ],
  },
  quarter: {
    stats: {
      revenue: '₹86,700', revenueChange: '+18.6%',
      orders: '679', ordersChange: '+12.4%',
      customers: '98', customersChange: '+8.9%',
      avgOrder: '₹51.84', avgOrderChange: '+4.1%',
    },
    chartData: [
      { month: 'Mar', revenue: 19800 },
      { month: 'Apr', revenue: 28600 },
      { month: 'May', revenue: 34200 },
      { month: 'Jun', revenue: 25400 },
    ],
    chartTitle: 'Monthly Revenue (This Quarter)',
    peakLabel: 'May — ₹34,200',
    lowLabel: 'March — ₹19,800',
    avgLabel: '₹27,000 / month',
    categories: [
      { category: 'Smartphones', sales: 44, color: '#ff4d4d', amount: 38148 },
      { category: 'Watches', sales: 26, color: '#8b5cf6', amount: 22542 },
      { category: 'Furniture', sales: 18, color: '#3b82f6', amount: 15606 },
      { category: 'Kids', sales: 12, color: '#10b981', amount: 10404 },
    ],
  },
  year: {
    stats: {
      revenue: '₹148,560', revenueChange: '+22.4%',
      orders: '2,893', ordersChange: '+15.2%',
      customers: '342', customersChange: '+9.8%',
      avgOrder: '₹51.35', avgOrderChange: '+5.3%',
    },
    chartData: MONTHLY_REVENUE,
    chartTitle: 'Monthly Revenue (Full Year)',
    peakLabel: 'December — ₹52,400',
    lowLabel: 'January — ₹18,400',
    avgLabel: '₹34,717 / month',
    categories: [
      { category: 'Smartphones', sales: 45, color: '#ff4d4d', amount: 67800 },
      { category: 'Watches', sales: 25, color: '#8b5cf6', amount: 37500 },
      { category: 'Furniture', sales: 18, color: '#3b82f6', amount: 27000 },
      { category: 'Kids', sales: 12, color: '#10b981', amount: 18000 },
    ],
  },
};

const FEEDBACKS = [
  { id: 1, author: 'Sohan Roy', avatar: 'SR', rating: 5, date: 'May 27, 2026', comment: 'Excellent delivery speed and superb packaging! Truly impressed with the quality.', product: 'iPhone 15 Pro Max', status: 'Approved' },
  { id: 2, author: 'Mita Sen', avatar: 'MS', rating: 4, date: 'May 26, 2026', comment: 'The oak wood dining table is sturdy and fits perfectly in our dining room.', product: 'Oak Wood Dining Table', status: 'Approved' },
  { id: 3, author: 'Dev Kar', avatar: 'DK', rating: 2, date: 'May 24, 2026', comment: 'Phone got a bit warm during setup, but works okay now. Customer service was helpful.', product: 'OnePlus 12', status: 'Pending' },
  { id: 4, author: 'Anita Bose', avatar: 'AB', rating: 5, date: 'May 23, 2026', comment: 'Amazing watch! The fitness tracking features are incredibly accurate.', product: 'Apple Watch Series 9', status: 'Approved' },
];

const RECENT_ACTIVITY = [
  { type: 'order', icon: ShoppingBag, color: '#3b82f6', message: 'New order ORD-9025 from Dev Kar — ₹2,149', time: '5 mins ago' },
  { type: 'user', icon: Users, color: '#10b981', message: 'New customer Priya Sharma registered', time: '22 mins ago' },
  { type: 'product', icon: Package, color: '#8b5cf6', message: 'Stock updated: Google Pixel 8 Pro → 12 units', time: '2 hrs ago' },
  { type: 'review', icon: Star, color: '#f59e0b', message: 'New 5★ review from Anita Bose on Apple Watch', time: '4 hrs ago' },
  { type: 'alert', icon: AlertCircle, color: '#ef4444', message: 'Low stock alert: Plush Teddy Bear (0 left)', time: '6 hrs ago' },
];

// ─── Sub-Components ──────────────────────────────────────────────────────────

// Stat Card
const StatCard = ({ icon: Icon, label, value, change, changeType, color, gradient }) => (
  <div className={`admin-stat-card ${gradient}`}>
    <div className="stat-card-body">
      <div className="stat-icon-wrap">
        <Icon size={22} />
      </div>
      <div className="stat-info">
        <p className="stat-label">{label}</p>
        <h3 className="stat-value">{value}</h3>
      </div>
    </div>
    {change && (
      <div className={`stat-change ${changeType === 'up' ? 'up' : 'down'}`}>
        {changeType === 'up' ? <ArrowUpRight size={13} /> : <ArrowDownRight size={13} />}
        <span>{change}</span>
        <span className="change-period">vs last month</span>
      </div>
    )}
  </div>
);

// Revenue Bar Chart
const RevenueBarChart = ({ data, cSym = '$' }) => {
  const max = Math.max(...data.map(d => d.revenue));
  return (
    <div className="revenue-bar-chart">
      {data.map((d, i) => (
        <div key={i} className="bar-col">
          <div className="bar-track">
            <div
              className="bar-fill"
              style={{ height: `${(d.revenue / max) * 100}%` }}
              title={`${cSym}${d.revenue.toLocaleString()}`}
            >
              <span className="bar-tooltip">{cSym}{(d.revenue / 1000).toFixed(1)}k</span>
            </div>
          </div>
          <span className="bar-label">{d.month}</span>
        </div>
      ))}
    </div>
  );
};

// Donut Chart (CSS-based)
const DonutChart = ({ data }) => {
  let cumulativePct = 0;
  const segments = data.map(d => {
    const segment = { ...d, start: cumulativePct };
    cumulativePct += d.sales;
    return segment;
  });

  const r = 60;
  const cx = 80;
  const cy = 80;
  const circumference = 2 * Math.PI * r;

  return (
    <div className="donut-chart-wrap">
      <svg viewBox="0 0 160 160" className="donut-svg">
        {segments.map((seg, i) => {
          const offset = circumference * (1 - seg.start / 100);
          const dashArr = (seg.sales / 100) * circumference;
          return (
            <circle
              key={i}
              cx={cx} cy={cy} r={r}
              fill="none"
              stroke={seg.color}
              strokeWidth="28"
              strokeDasharray={`${dashArr} ${circumference - dashArr}`}
              strokeDashoffset={offset}
              style={{ transition: 'all 0.5s ease' }}
            />
          );
        })}
        <circle cx={cx} cy={cy} r={44} fill="white" />
        <text x={cx} y={cy - 6} textAnchor="middle" className="donut-center-label" fontSize="11" fill="#64748b">Total</text>
        <text x={cx} y={cy + 10} textAnchor="middle" className="donut-center-value" fontSize="16" fill="#0f172a" fontWeight="800">100%</text>
      </svg>
      <div className="donut-legend">
        {data.map((d, i) => (
          <div key={i} className="legend-item">
            <span className="legend-dot" style={{ background: d.color }} />
            <span className="legend-name">{d.category}</span>
            <span className="legend-pct">{d.sales}%</span>
          </div>
        ))}
      </div>
    </div>
  );
};

// Order Status Badge
const StatusBadge = ({ status }) => {
  const map = {
    'Pending': 'badge-pending',
    'Placed': 'badge-pending',
    'Processing': 'badge-processing',
    'Shipped': 'badge-shipped',
    'Out for Delivery': 'badge-shipped',
    'Delivered': 'badge-delivered',
    'Cancelled': 'badge-cancelled',
  };
  return <span className={`admin-badge ${map[status] || ''}`}>{status}</span>;
};

// User Role Badge
const RoleBadge = ({ role }) => (
  <span className={`role-badge ${role === 'admin' ? 'role-admin' : 'role-customer'}`}>
    {role === 'admin' ? <Shield size={10} /> : <UserCheck size={10} />}
    {role}
  </span>
);

// User Status Badge
const UserStatusBadge = ({ status }) => (
  <span className={`user-status-badge status-${status}`}>{status}</span>
);

// Inventory Bar
const InventoryBar = ({ stock, threshold }) => {
  const pct = stock === 0 ? 0 : Math.min((stock / threshold) * 100, 100);
  const color = stock === 0 ? '#ef4444' : pct < 60 ? '#f59e0b' : '#10b981';
  return (
    <div className="inventory-bar-wrap">
      <div className="inventory-bar-track">
        <div className="inventory-bar-fill" style={{ width: `${pct}%`, background: color }} />
      </div>
      <span className="inventory-count" style={{ color }}>{stock} units</span>
    </div>
  );
};

// Star Rating
export const StarRating = ({ rating }) => (
  <div className="star-row">
    {[1, 2, 3, 4, 5].map(i => (
      <Star key={i} size={13} fill={i <= rating ? '#f59e0b' : 'none'} color={i <= rating ? '#f59e0b' : '#cbd5e1'} />
    ))}
  </div>
);

// Product Form Modal
const ProductFormModal = ({ isOpen, onClose, onSubmit, initialData = null, title, cSym = '$' }) => {
  const [form, setForm] = useState(initialData || {
    title: '', price: '', oldPrice: '', category: 'smartphones',
    image: '', sale: false, description: '', stock: '', color: ''
  });
  const [imageSource, setImageSource] = useState('url'); // 'url' or 'upload'

  React.useEffect(() => {
    if (isOpen) {
      setForm(initialData || {
        title: '', price: '', oldPrice: '', category: 'smartphones',
        image: '', sale: false, description: '', stock: '', color: ''
      });
      if (initialData?.image && initialData.image.startsWith('data:')) {
        setImageSource('upload');
      } else {
        setImageSource('url');
      }
    }
  }, [isOpen, initialData]);

  const update = (field, val) => setForm(f => ({ ...f, [field]: val }));

  if (!isOpen) return null;

  return (
    <div className="admin-overlay" onClick={onClose}>
      <div className="admin-modal" onClick={e => e.stopPropagation()}>
        <div className="modal-head">
          <h3>{title}</h3>
          <button className="modal-close" onClick={onClose}><X size={20} /></button>
        </div>
        <form className="modal-body" onSubmit={e => { e.preventDefault(); onSubmit(form); }}>
          <div className="mf-group">
            <label>Product Title *</label>
            <input type="text" value={form.title} onChange={e => update('title', e.target.value)}
              placeholder="e.g. Google Pixel 9 Pro" required />
          </div>
          <div className="mf-row">
            <div className="mf-group">
              <label>Price ({cSym}) *</label>
              <input type="number" step="0.01" value={form.price} onChange={e => update('price', e.target.value)}
                placeholder="999" required />
            </div>
            <div className="mf-group">
              <label>Old Price ({cSym})</label>
              <input type="number" step="0.01" value={form.oldPrice} onChange={e => update('oldPrice', e.target.value)}
                placeholder="1199" />
            </div>
            <div className="mf-group">
              <label>Stock Quantity</label>
              <input type="number" value={form.stock} onChange={e => update('stock', e.target.value)}
                placeholder="50" />
            </div>
          </div>
          <div className="mf-row">
            <div className="mf-group">
              <label>Category *</label>
              <select value={form.category} onChange={e => update('category', e.target.value)}>
                <option value="smartphones">Smartphones</option>
                <option value="watches">Watches</option>
                <option value="furniture">Furniture</option>
                <option value="kids">Kids Section</option>
                <option value="fashion">Fashion</option>
                <option value="electronics">Electronics</option>
                <option value="digital-product">Digital Product</option>
                <option value="home-appliances">Home Appliances</option>
                <option value="vegetable">Vegetables</option>
                <option value="decor">Decor</option>
                <option value="books">Books</option>
              </select>
            </div>
            <div className="mf-group">
              <label>Product Color(s)</label>
              <input type="text" value={form.color || ''} onChange={e => update('color', e.target.value)}
                placeholder="e.g. Red, Black, #ff4d4d" />
            </div>
            <div className="mf-group mf-checkbox">
              <label className="checkbox-label">
                <input type="checkbox" checked={form.sale} onChange={e => update('sale', e.target.checked)} />
                <span className="checkbox-custom" />
                On Sale
              </label>
            </div>
          </div>

          <div className="mf-group" style={{ gap: '10px' }}>
            <label>Product Image</label>
            <div className="image-source-toggle" style={{ display: 'flex', gap: '8px' }}>
              <button 
                type="button" 
                className={`btn-toggle ${imageSource === 'url' ? 'active' : ''}`}
                onClick={() => setImageSource('url')}
                style={{
                  padding: '6px 12px',
                  borderRadius: '6px',
                  fontSize: '12px',
                  fontWeight: '600',
                  border: '1px solid var(--adm-border, #cbd5e1)',
                  background: imageSource === 'url' ? 'var(--adm-primary, #ff4d4d)' : 'transparent',
                  color: imageSource === 'url' ? '#fff' : 'var(--adm-text, #0f172a)',
                  cursor: 'pointer',
                  transition: 'all 0.2s ease'
                }}
              >
                Image URL
              </button>
              <button 
                type="button" 
                className={`btn-toggle ${imageSource === 'upload' ? 'active' : ''}`}
                onClick={() => setImageSource('upload')}
                style={{
                  padding: '6px 12px',
                  borderRadius: '6px',
                  fontSize: '12px',
                  fontWeight: '600',
                  border: '1px solid var(--adm-border, #cbd5e1)',
                  background: imageSource === 'upload' ? 'var(--adm-primary, #ff4d4d)' : 'transparent',
                  color: imageSource === 'upload' ? '#fff' : 'var(--adm-text, #0f172a)',
                  cursor: 'pointer',
                  transition: 'all 0.2s ease'
                }}
              >
                Upload from Device
              </button>
            </div>

            {imageSource === 'url' ? (
              <input type="text" value={form.image} onChange={e => update('image', e.target.value)}
                placeholder="https://... (leave empty for default)" />
            ) : (
              <div 
                className="image-upload-zone"
                style={{
                  border: '2px dashed var(--adm-border, #cbd5e1)',
                  borderRadius: '8px',
                  padding: '20px',
                  textAlign: 'center',
                  cursor: 'pointer',
                  background: '#f8fafc',
                  position: 'relative',
                  transition: 'all 0.2s ease'
                }}
              >
                <input 
                  type="file" 
                  accept="image/*" 
                  onChange={async (e) => {
                    const file = e.target.files[0];
                    if (file) {
                      const reader = new FileReader();
                      reader.onloadend = () => {
                        update('image', reader.result);
                      };
                      reader.readAsDataURL(file);
                    }
                  }}
                  style={{
                    position: 'absolute',
                    top: 0,
                    left: 0,
                    width: '100%',
                    height: '100%',
                    opacity: 0,
                    cursor: 'pointer'
                  }}
                />
                <Upload size={24} style={{ color: '#64748b', display: 'block', margin: '0 auto 8px auto' }} />
                <p style={{ margin: 0, fontSize: '13px', color: '#64748b', fontWeight: '500' }}>
                  Drag and drop or click to select image
                </p>
              </div>
            )}

            {form.image && (
              <div className="image-preview-wrapper" style={{ marginTop: '5px', display: 'flex', alignItems: 'center', gap: '12px', background: '#f1f5f9', padding: '8px 12px', borderRadius: '8px' }}>
                <img 
                  src={form.image} 
                  alt="Product Preview" 
                  style={{
                    width: '48px',
                    height: '48px',
                    borderRadius: '6px',
                    objectFit: 'cover',
                    border: '1px solid #e2e8f0',
                    background: '#fff'
                  }} 
                />
                <div style={{ flex: 1, minWidth: 0 }}>
                  <p style={{ margin: 0, fontSize: '11px', color: '#64748b', textOverflow: 'ellipsis', overflow: 'hidden', whiteSpace: 'nowrap' }}>
                    {form.image.startsWith('data:') ? 'Image uploaded from device' : form.image}
                  </p>
                </div>
                <button 
                  type="button" 
                  onClick={() => update('image', '')} 
                  style={{
                    background: '#ef4444',
                    color: '#fff',
                    border: 'none',
                    borderRadius: '6px',
                    padding: '4px 10px',
                    fontSize: '12px',
                    fontWeight: '600',
                    cursor: 'pointer',
                    transition: 'background 0.2s ease'
                  }}
                >
                  Remove
                </button>
              </div>
            )}
          </div>

          <div className="mf-group">
            <label>Description</label>
            <textarea value={form.description} onChange={e => update('description', e.target.value)}
              placeholder="Product specs and details..." rows={3} />
          </div>
          <div className="modal-actions">
            <button type="button" className="btn-ghost" onClick={onClose}>Cancel</button>
            <button type="submit" className="btn-primary">
              <Check size={16} /> {title.includes('Edit') ? 'Save Changes' : 'Publish Product'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

// ─── Main Component ──────────────────────────────────────────────────────────
const AdminDashboard = ({
  smartphones = [],
  watches = [],
  furniture = [],
  kids = [],
  fashion = [],
  electronics = [],
  digitalProduct = [],
  homeAppliances = [],
  vegetables = [],
  decor = [],
  books = [],
  onAddProduct,
  onDeleteProduct,
  onUpdateProduct
}) => {
  const navigate = useNavigate();
  const [activePanel, setActivePanel] = useState('overview');
  const [userDropdownOpen, setUserDropdownOpen] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(window.innerWidth > 900);
  const [addModal, setAddModal] = useState(false);
  const [editModal, setEditModal] = useState(false);
  const [editProduct, setEditProduct] = useState(null);
  const [deleteConfirm, setDeleteConfirm] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('all');
  const [orderFilter, setOrderFilter] = useState('all');
  const [userFilter, setUserFilter] = useState('all');
  const [orders, setOrders] = useState(MOCK_ORDERS);
  const [users, setUsers] = useState(MOCK_USERS);

  const { fetchAdminOrders, fetchAdminUsers, updateAdminOrderStatus, isDark, toggleDarkMode } = useApp();

  useEffect(() => {
    const loadRealData = async () => {
      try {
        const [realOrders, realUsers] = await Promise.all([
          fetchAdminOrders(),
          fetchAdminUsers()
        ]);

        if (realOrders && realOrders.length > 0) {
          const mappedOrders = realOrders.map(order => {
            const customerName = order.user?.name || order.shippingAddress?.name || 'Guest';
            const customerEmail = order.user?.email || 'N/A';
            const formattedDate = new Date(order.createdAt).toLocaleDateString('en-US', {
              month: 'short',
              day: 'numeric',
              year: 'numeric'
            });
            const itemsString = order.items && order.items.length > 0
              ? order.items.map(item => `${item.title} x${item.quantity}`).join(', ')
              : 'N/A';
            const cityState = order.shippingAddress
              ? `${order.shippingAddress.city}, ${order.shippingAddress.state}`
              : 'N/A';

            return {
              id: order.orderId,
              customer: customerName,
              email: customerEmail,
              date: formattedDate,
              amount: order.total,
              status: order.status === 'Placed' ? 'Pending' : order.status,
              items: itemsString,
              payment: order.paymentMethod,
              address: cityState
            };
          });
          setOrders(mappedOrders);
        }

        if (realUsers && realUsers.length > 0) {
          const mappedUsers = realUsers.map((user, idx) => {
            const formattedDate = new Date(user.createdAt).toLocaleDateString('en-US', {
              month: 'short',
              day: 'numeric',
              year: 'numeric'
            });
            
            const shortId = user._id ? `USR-${user._id.substring(user._id.length - 4).toUpperCase()}` : `USR-0${idx + 1}`;
            const primaryAddr = user.savedAddresses && user.savedAddresses[0];
            const userPhone = primaryAddr?.phone || 'N/A';
            const userLocation = primaryAddr ? `${primaryAddr.city}, ${primaryAddr.country || 'India'}` : 'India';

            // Filter real orders belonging to this user
            const userOrders = realOrders ? realOrders.filter(o => o.user?._id === user._id || o.user === user._id) : [];
            const ordersCount = userOrders.length;
            const totalSpent = userOrders.reduce((acc, o) => acc + (o.total || 0), 0);

            return {
              id: shortId,
              name: user.name,
              email: user.email,
              phone: userPhone,
              role: user.role === 'admin' ? 'admin' : 'customer',
              status: user.isVerified ? 'active' : 'inactive',
              orders: ordersCount,
              spent: totalSpent,
              joined: formattedDate,
              location: userLocation
            };
          });
          setUsers(mappedUsers);
        }
      } catch (err) {
        console.error('Error loading real admin data:', err);
      }
    };

    loadRealData();
  }, [fetchAdminOrders, fetchAdminUsers]);

  const [feedbacks, setFeedbacks] = useState(FEEDBACKS);
  const [notifications, setNotifications] = useState(3);
  const [selectedPeriod, setSelectedPeriod] = useState('year');

  // ── Invoice PDF Modal State ──
  const [selectedInvoiceOrder, setSelectedInvoiceOrder] = useState(null);

  // ── Accounting States ──
  const [chartOfAccounts, setChartOfAccounts] = useState([
    { code: '1010', name: 'Cash on Hand', category: 'Asset', balance: 4500 },
    { code: '1020', name: 'HDFC Bank Account', category: 'Asset', balance: 52430 },
    { code: '1200', name: 'Accounts Receivable', category: 'Asset', balance: 12500 },
    { code: '4000', name: 'Sales Revenue', category: 'Revenue', balance: 86700 },
    { code: '5010', name: 'Warehouse Rent Expense', category: 'Expense', balance: 3500 },
    { code: '5020', name: 'Utility & Internet Expense', category: 'Expense', balance: 840 },
    { code: '5030', name: 'Employee Salaries Expense', category: 'Expense', balance: 14500 },
  ]);
  const [ledgerTransactions, setLedgerTransactions] = useState([
    { id: 'TX-001', date: '2026-05-30', description: 'Order #ORD-7805439 payment received', debit: 899, credit: 0, account: 'HDFC Bank Account' },
    { id: 'TX-002', date: '2026-05-29', description: 'Paid Central Warehouse Monthly Rent', debit: 0, credit: 3500, account: 'HDFC Bank Account' },
    { id: 'TX-003', date: '2026-05-28', description: 'Office Broadband & Utility Bill Paid', debit: 0, credit: 840, account: 'Cash on Hand' },
    { id: 'TX-004', date: '2026-05-27', description: 'Corporate bulk product sale to Sneha Bose', debit: 12500, credit: 0, account: 'Accounts Receivable' },
  ]);

  const [storeSettings, setStoreSettings] = useState(() => {
    try {
      const saved = localStorage.getItem('eshop_store_settings');
      return saved ? JSON.parse(saved) : {
        name: 'MarketHub Global Inc.',
        email: 'contact@markethub.com',
        phone: '+91 9876543210',
        address: 'Salt Lake Sector V, Kolkata, India',
        currency: 'USD ($)',
        maintenance: false,
        taxRate: '18',
        shippingFee: '9.99',
        freeShippingThreshold: '100',
      };
    } catch {
      return {
        name: 'MarketHub Global Inc.',
        email: 'contact@markethub.com',
        phone: '+91 9876543210',
        address: 'Salt Lake Sector V, Kolkata, India',
        currency: 'USD ($)',
        maintenance: false,
        taxRate: '18',
        shippingFee: '9.99',
        freeShippingThreshold: '100',
      };
    }
  });

  useEffect(() => {
    try {
      localStorage.setItem('eshop_store_settings', JSON.stringify(storeSettings));
    } catch (e) {
      console.error(e);
    }
  }, [storeSettings]);

  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth <= 900) {
        setSidebarOpen(false);
      } else {
        setSidebarOpen(true);
      }
    };
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const getCurrencySymbol = () => {
    const curr = storeSettings.currency || 'USD ($)';
    if (curr.includes('$')) return '$';
    if (curr.includes('€')) return '€';
    if (curr.includes('₹')) return '₹';
    if (curr.includes('£')) return '£';
    return '$';
  };
  const cSym = getCurrencySymbol();

  // ── Derived State ─────────────────────────────────────────────────────────
  const allProducts = useMemo(() => [
    ...smartphones.map(p => ({ ...p, category: 'smartphones' })),
    ...watches.map(p => ({ ...p, category: 'watches' })),
    ...furniture.map(p => ({ ...p, category: 'furniture' })),
    ...kids.map(p => ({ ...p, category: 'kids' })),
    ...fashion.map(p => ({ ...p, category: 'fashion' })),
    ...electronics.map(p => ({ ...p, category: 'electronics' })),
    ...digitalProduct.map(p => ({ ...p, category: 'digital-product' })),
    ...homeAppliances.map(p => ({ ...p, category: 'home-appliances' })),
    ...vegetables.map(p => ({ ...p, category: 'vegetable' })),
    ...decor.map(p => ({ ...p, category: 'decor' })),
    ...books.map(p => ({ ...p, category: 'books' })),
  ], [smartphones, watches, furniture, kids, fashion, electronics, digitalProduct, homeAppliances, vegetables, decor, books]);

  const filteredProducts = useMemo(() => {
    let list = allProducts;
    if (categoryFilter !== 'all') list = list.filter(p => p.category === categoryFilter);
    if (searchQuery) list = list.filter(p =>
      p.title.toLowerCase().includes(searchQuery.toLowerCase())
    );
    return list;
  }, [allProducts, categoryFilter, searchQuery]);

  const filteredOrders = useMemo(() => {
    let list = orders;
    if (orderFilter !== 'all') list = list.filter(o => o.status.toLowerCase() === orderFilter);
    if (searchQuery) list = list.filter(o =>
      o.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
      o.customer.toLowerCase().includes(searchQuery.toLowerCase())
    );
    return list;
  }, [orders, orderFilter, searchQuery]);

  const filteredUsers = useMemo(() => {
    let list = users;
    if (userFilter !== 'all') list = list.filter(u => u.status === userFilter || u.role === userFilter);
    if (searchQuery) list = list.filter(u =>
      u.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      u.email.toLowerCase().includes(searchQuery.toLowerCase())
    );
    return list;
  }, [users, userFilter, searchQuery]);

  const dynamicPeriodData = useMemo(() => {
    const today = new Date();
    const monthNames = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
    const dayNames = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
    const currentMonth = today.getMonth();

    // Check if it's only mock data to load
    const isOnlyMock = orders.length === 6 && orders.every(o => typeof o.id === 'string' && o.id.startsWith('ORD-90'));
    if (isOnlyMock) {
      return PERIOD_DATA;
    }

    const isWithinDays = (dateStr, days) => {
      const d = new Date(dateStr);
      const diff = today - d;
      return diff >= 0 && diff <= days * 24 * 60 * 60 * 1000;
    };

    const getCategoryFromItemString = (str) => {
      const lower = str.toLowerCase();
      if (lower.includes('iphone') || lower.includes('galaxy') || lower.includes('pixel') || lower.includes('oneplus') || lower.includes('phone') || lower.includes('ultra') || lower.includes('redmagic') || lower.includes('realme') || lower.includes('smartphones')) return 'Smartphones';
      if (lower.includes('watch') || lower.includes('fenix') || lower.includes('garmin')) return 'Watches';
      if (lower.includes('sofa') || lower.includes('table') || lower.includes('chair') || lower.includes('stools') || lower.includes('desk') || lower.includes('dresser') || lower.includes('bed') || lower.includes('furniture')) return 'Furniture';
      if (lower.includes('teddy') || lower.includes('kids') || lower.includes('toy') || lower.includes('blocks') || lower.includes('car') || lower.includes('trampoline') || lower.includes('bicycle')) return 'Kids';
      return 'Smartphones'; // fallback
    };

    const getCategorySales = (filteredOrdersList) => {
      const counts = { Smartphones: 0, Watches: 0, Furniture: 0, Kids: 0 };
      const amounts = { Smartphones: 0, Watches: 0, Furniture: 0, Kids: 0 };
      
      filteredOrdersList.forEach(o => {
        const cat = getCategoryFromItemString(o.items || '');
        counts[cat] += 1;
        amounts[cat] += o.amount;
      });

      const totalAmount = Object.values(amounts).reduce((a, b) => a + b, 0) || 1;
      const totalCount = Object.values(counts).reduce((a, b) => a + b, 0) || 1;

      return [
        { category: 'Smartphones', sales: Math.round((amounts.Smartphones / totalAmount) * 100) || 45, color: '#ff4d4d', amount: amounts.Smartphones || 0 },
        { category: 'Watches', sales: Math.round((amounts.Watches / totalAmount) * 100) || 25, color: '#8b5cf6', amount: amounts.Watches || 0 },
        { category: 'Furniture', sales: Math.round((amounts.Furniture / totalAmount) * 100) || 18, color: '#3b82f6', amount: amounts.Furniture || 0 },
        { category: 'Kids', sales: Math.round((amounts.Kids / totalAmount) * 100) || 12, color: '#10b981', amount: amounts.Kids || 0 }
      ];
    };

    // 1. Week Data
    const weekChart = Array.from({ length: 7 }).map((_, i) => {
      const d = new Date();
      d.setDate(today.getDate() - (6 - i));
      return {
        dateStr: d.toDateString(),
        month: dayNames[d.getDay()],
        revenue: 0
      };
    });

    const weekOrders = orders.filter(o => isWithinDays(o.date, 7));
    weekOrders.forEach(o => {
      const oDateStr = new Date(o.date).toDateString();
      const match = weekChart.find(d => d.dateStr === oDateStr);
      if (match) {
        match.revenue += o.amount;
      }
    });

    const weekRevenue = weekOrders.reduce((acc, o) => acc + o.amount, 0);
    const weekCustCount = users.filter(u => isWithinDays(u.joined, 7)).length || 1;
    const weekAvg = weekOrders.length > 0 ? (weekRevenue / weekOrders.length) : 0;
    const weekMax = Math.max(...weekChart.map(d => d.revenue));
    const weekMin = Math.min(...weekChart.map(d => d.revenue));

    // 2. Month Data
    const monthChart = [
      { month: 'Wk 1', minDaysAgo: 28, maxDaysAgo: 21, revenue: 0 },
      { month: 'Wk 2', minDaysAgo: 21, maxDaysAgo: 14, revenue: 0 },
      { month: 'Wk 3', minDaysAgo: 14, maxDaysAgo: 7, revenue: 0 },
      { month: 'Wk 4', minDaysAgo: 7, maxDaysAgo: 0, revenue: 0 }
    ];

    const monthOrders = orders.filter(o => isWithinDays(o.date, 30));
    monthOrders.forEach(o => {
      const oDate = new Date(o.date);
      const diffTime = today - oDate;
      const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));
      const match = monthChart.find(w => diffDays >= w.minDaysAgo && diffDays < w.maxDaysAgo);
      if (match) {
        match.revenue += o.amount;
      }
    });

    const monthRevenue = monthOrders.reduce((acc, o) => acc + o.amount, 0);
    const monthCustCount = users.filter(u => isWithinDays(u.joined, 30)).length || 3;
    const monthAvg = monthOrders.length > 0 ? (monthRevenue / monthOrders.length) : 0;
    const monthMax = Math.max(...monthChart.map(d => d.revenue));
    const monthMin = Math.min(...monthChart.map(d => d.revenue));

    // 3. Quarter Data
    const quarterChart = Array.from({ length: 4 }).map((_, i) => {
      const mIdx = (currentMonth - 3 + i + 12) % 12;
      return {
        monthIdx: mIdx,
        month: monthNames[mIdx],
        revenue: 0
      };
    });

    const quarterOrders = orders.filter(o => isWithinDays(o.date, 90));
    quarterOrders.forEach(o => {
      const oDate = new Date(o.date);
      const oMonth = oDate.getMonth();
      const match = quarterChart.find(m => m.monthIdx === oMonth);
      if (match) {
        match.revenue += o.amount;
      }
    });

    const quarterRevenue = quarterOrders.reduce((acc, o) => acc + o.amount, 0);
    const quarterCustCount = users.filter(u => isWithinDays(u.joined, 90)).length || 8;
    const quarterAvg = quarterOrders.length > 0 ? (quarterRevenue / quarterOrders.length) : 0;
    const quarterMax = Math.max(...quarterChart.map(d => d.revenue));
    const quarterMin = Math.min(...quarterChart.map(d => d.revenue));

    // 4. Year Data
    const yearChart = Array.from({ length: 12 }).map((_, i) => {
      const mIdx = (currentMonth - 11 + i + 12) % 12;
      return {
        monthIdx: mIdx,
        month: monthNames[mIdx],
        revenue: 0
      };
    });

    const yearOrders = orders;
    yearOrders.forEach(o => {
      const oDate = new Date(o.date);
      const oMonth = oDate.getMonth();
      const match = yearChart.find(m => m.monthIdx === oMonth);
      if (match) {
        match.revenue += o.amount;
      }
    });

    const yearRevenue = yearOrders.reduce((acc, o) => acc + o.amount, 0);
    const yearCustCount = users.length || 5;
    const yearAvg = yearOrders.length > 0 ? (yearRevenue / yearOrders.length) : 0;
    const yearMax = Math.max(...yearChart.map(d => d.revenue));
    const yearMin = Math.min(...yearChart.map(d => d.revenue));

    return {
      week: {
        stats: {
          revenue: `${cSym}${weekRevenue.toLocaleString()}`, revenueChange: '+12.4%',
          orders: String(weekOrders.length), ordersChange: '+8.2%',
          customers: String(weekCustCount), customersChange: '+15.0%',
          avgOrder: `${cSym}${Math.round(weekAvg).toLocaleString()}`, avgOrderChange: '+4.5%',
        },
        chartData: weekChart,
        chartTitle: 'Daily Revenue (This Week)',
        peakLabel: `Peak — ${cSym}${weekMax.toLocaleString()}`,
        lowLabel: `Lowest — ${cSym}${weekMin.toLocaleString()}`,
        avgLabel: `${cSym}${Math.round(weekRevenue / 7).toLocaleString()} / day`,
        categories: getCategorySales(weekOrders)
      },
      month: {
        stats: {
          revenue: `${cSym}${monthRevenue.toLocaleString()}`, revenueChange: '+10.5%',
          orders: String(monthOrders.length), ordersChange: '+6.1%',
          customers: String(monthCustCount), customersChange: '+11.2%',
          avgOrder: `${cSym}${Math.round(monthAvg).toLocaleString()}`, avgOrderChange: '+3.1%',
        },
        chartData: monthChart,
        chartTitle: 'Weekly Revenue (This Month)',
        peakLabel: `Peak — ${cSym}${monthMax.toLocaleString()}`,
        lowLabel: `Lowest — ${cSym}${monthMin.toLocaleString()}`,
        avgLabel: `${cSym}${Math.round(monthRevenue / 4).toLocaleString()} / week`,
        categories: getCategorySales(monthOrders)
      },
      quarter: {
        stats: {
          revenue: `${cSym}${quarterRevenue.toLocaleString()}`, revenueChange: '+14.2%',
          orders: String(quarterOrders.length), ordersChange: '+9.3%',
          customers: String(quarterCustCount), customersChange: '+8.7%',
          avgOrder: `${cSym}${Math.round(quarterAvg).toLocaleString()}`, avgOrderChange: '+2.9%',
        },
        chartData: quarterChart,
        chartTitle: 'Monthly Revenue (This Quarter)',
        peakLabel: `Peak — ${cSym}${quarterMax.toLocaleString()}`,
        lowLabel: `Lowest — ${cSym}${quarterMin.toLocaleString()}`,
        avgLabel: `${cSym}${Math.round(quarterRevenue / 4).toLocaleString()} / month`,
        categories: getCategorySales(quarterOrders)
      },
      year: {
        stats: {
          revenue: `${cSym}${yearRevenue.toLocaleString()}`, revenueChange: '+18.6%',
          orders: String(yearOrders.length), ordersChange: '+11.5%',
          customers: String(yearCustCount), customersChange: '+9.8%',
          avgOrder: `${cSym}${Math.round(yearAvg).toLocaleString()}`, avgOrderChange: '+3.8%',
        },
        chartData: yearChart,
        chartTitle: 'Monthly Revenue (Full Year)',
        peakLabel: `Peak — ${cSym}${yearMax.toLocaleString()}`,
        lowLabel: `Lowest — ${cSym}${yearMin.toLocaleString()}`,
        avgLabel: `${cSym}${Math.round(yearRevenue / 12).toLocaleString()} / month`,
        categories: getCategorySales(yearOrders)
      }
    };
  }, [orders, users, cSym]);

  const totalRevenue = useMemo(() => {
    const realSum = orders.reduce((acc, o) => acc + (o.status !== 'Cancelled' ? o.amount : 0), 0);
    // If it's only the mock orders, show the mock total, else show the real total
    const isOnlyMock = orders.length === 6 && orders.every(o => typeof o.id === 'string' && o.id.startsWith('ORD-90'));
    return isOnlyMock ? 148560 : realSum;
  }, [orders]);
  const totalOrders = orders.length;
  const pendingOrders = orders.filter(o => o.status === 'Pending' || o.status === 'Processing').length;
  const totalCustomers = users.filter(u => u.role === 'customer').length;

  // ── Handlers ──────────────────────────────────────────────────────────────
  const handleAddProduct = (form) => {
    const product = {
      title: form.title,
      price: parseFloat(form.price),
      oldPrice: form.oldPrice ? parseFloat(form.oldPrice) : null,
      category: form.category,
      image: form.image || 'https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?w=400&fit=crop',
      sale: form.sale,
      description: form.description || 'Premium product with excellent quality.',
      stock: parseInt(form.stock) || 50,
      color: form.color || '',
    };
    onAddProduct(product);
    setAddModal(false);
  };

  const handleEditProduct = (form) => {
    onUpdateProduct({
      ...editProduct,
      title: form.title,
      price: parseFloat(form.price),
      oldPrice: form.oldPrice ? parseFloat(form.oldPrice) : null,
      image: form.image,
      sale: form.sale,
      description: form.description,
      stock: parseInt(form.stock) || 0,
      category: form.category,
      color: form.color || '',
    });
    setEditModal(false);
    setEditProduct(null);
  };

  const confirmDelete = (product) => setDeleteConfirm(product);
  const executeDelete = () => {
    if (deleteConfirm) {
      onDeleteProduct(deleteConfirm.id, deleteConfirm.category);
      setDeleteConfirm(null);
    }
  };

  const updateOrderStatus = async (id, status) => {
    // Instantly update local state for snappy UI (optimistic update)
    setOrders(prev => prev.map(o => o.id === id ? { ...o, status } : o));
    
    // Call backend to persist in MongoDB
    try {
      let backendStatus = status;
      if (status === 'Pending') backendStatus = 'Placed';
      
      const success = await updateAdminOrderStatus(id, backendStatus);
      if (!success) {
        // Fetch fresh data if backend update failed to revert state
        const freshOrders = await fetchAdminOrders();
        if (freshOrders && freshOrders.length > 0) {
          const mappedOrders = freshOrders.map(order => {
            const customerName = order.user?.name || order.shippingAddress?.name || 'Guest';
            const customerEmail = order.user?.email || 'N/A';
            const formattedDate = new Date(order.createdAt).toLocaleDateString('en-US', {
              month: 'short',
              day: 'numeric',
              year: 'numeric'
            });
            const itemsString = order.items && order.items.length > 0
              ? order.items.map(item => `${item.title} x${item.quantity}`).join(', ')
              : 'N/A';
            const cityState = order.shippingAddress
              ? `${order.shippingAddress.city}, ${order.shippingAddress.state}`
              : 'N/A';

            return {
              id: order.orderId,
              customer: customerName,
              email: customerEmail,
              date: formattedDate,
              amount: order.total,
              status: order.status === 'Placed' ? 'Pending' : order.status,
              items: itemsString,
              payment: order.paymentMethod,
              address: cityState
            };
          });
          setOrders(mappedOrders);
        }
      }
    } catch (err) {
      console.error('Error updating order status on backend:', err);
    }
  };

  const toggleUserStatus = (id) => {
    setUsers(prev => prev.map(u => {
      if (u.id !== id) return u;
      return { ...u, status: u.status === 'active' ? 'suspended' : 'active' };
    }));
  };

  const approveFeedback = (id) => {
    setFeedbacks(prev => prev.map(f => f.id === id ? { ...f, status: 'Approved' } : f));
  };

  const handleSettingsSave = (e) => {
    e.preventDefault();
    // Show success feedback (would use toast in real app)
    const btn = e.target.querySelector('[type=submit]');
    if (btn) {
      btn.textContent = '✓ Saved!';
      setTimeout(() => { btn.innerHTML = '<svg>...</svg> Save All Changes'; }, 2000);
    }
  };

  // ── Sidebar Items ─────────────────────────────────────────────────────────
  const navItems = [
    { id: 'overview', icon: LayoutDashboard, label: 'Dashboard', badge: null },
    { id: 'analytics', icon: BarChart3, label: 'Analytics', badge: null },
    { id: 'products', icon: Package, label: 'Products', badge: allProducts.length },
    { id: 'orders', icon: ShoppingBag, label: 'Orders', badge: pendingOrders || null },
    { id: 'users', icon: Users, label: 'Users', badge: null },
    { id: 'hrm', icon: Briefcase, label: 'HRM', badge: null },
    { id: 'crm', icon: Target, label: 'CRM Leads', badge: null },
    { id: 'projects', icon: ClipboardList, label: 'Projects & Tasks', badge: null },
    { id: 'inventory', icon: Boxes, label: 'Inventory', badge: LOW_STOCK.filter(i => i.stock <= 2).length || null },
    { id: 'accounting', icon: Wallet, label: 'Accounting', badge: null },
    { id: 'feedback', icon: Star, label: 'Reviews', badge: feedbacks.filter(f => f.status === 'Pending').length || null },
    { id: 'reports', icon: BarChart2, label: 'Reports', badge: null },
    { id: 'settings', icon: Settings, label: 'Settings', badge: null },
  ];

  // ── Panel Titles ──────────────────────────────────────────────────────────
  const panelTitles = {
    overview: { title: 'Dashboard Overview', sub: 'Welcome back! Here\'s what\'s happening today.' },
    analytics: { title: 'Analytics & Reports', sub: 'Detailed performance metrics and sales trends.' },
    products: { title: 'Product Catalog', sub: `${allProducts.length} items across 4 categories.` },
    orders: { title: 'Order Management', sub: `${pendingOrders} orders need your attention.` },
    users: { title: 'User Management', sub: `${totalCustomers} registered customers.` },
    hrm: { title: 'HRM Center', sub: 'Manage employees, departments, attendance, payroll and leaves.' },
    crm: { title: 'CRM Leads Pipeline', sub: 'Track and manage potential client opportunities and customer leads.' },
    projects: { title: 'Projects & Tasks', sub: 'Interactive Kanban board for task planning and execution.' },
    inventory: { title: 'Inventory & Operations', sub: 'Track stock, brands, suppliers, warehouses and purchase orders.' },
    accounting: { title: 'Accounting & Ledger', sub: 'Manage balances, view logs, and record cash flow transactions.' },
    feedback: { title: 'Customer Reviews', sub: `${feedbacks.filter(f => f.status === 'Pending').length} reviews pending approval.` },
    reports: { title: 'Financial Reports', sub: 'Exportable income statements, sales logs, and financial records.' },
    settings: { title: 'Store Settings', sub: 'Configure your store preferences and policies.' },
  };

  // ── Render Panels ─────────────────────────────────────────────────────────

  const handleDisburseSalary = (empName, empRole, netSalary) => {
    const newTx = {
      id: 'TX-' + (ledgerTransactions.length + 1).toString().padStart(3, '0'),
      date: new Date().toISOString().split('T')[0],
      description: `Payroll payout processed for ${empName} (${empRole})`,
      debit: 0,
      credit: netSalary,
      account: 'HDFC Bank Account'
    };
    setLedgerTransactions(prev => [newTx, ...prev]);

    setChartOfAccounts(prev => prev.map(acc => {
      if (acc.name === 'HDFC Bank Account') return { ...acc, balance: acc.balance - netSalary };
      if (acc.name === 'Employee Salaries Expense') return { ...acc, balance: acc.balance + netSalary };
      return acc;
    }));
    alert(`🎉 Payroll Payout of ${cSym}${netSalary.toLocaleString()} processed successfully for ${empName}! Journal entry logged in Accounting ledger.`);
  };

  const renderOverview = () => (
    <div className="panel-overview">
      {/* Stat Cards */}
      <div className="stat-cards-grid">
        <StatCard icon={DollarSign} label="Total Revenue" value={`${cSym}${totalRevenue.toLocaleString()}`}
          change="+12.4%" changeType="up" gradient="grad-red" />
        <StatCard icon={ShoppingBag} label="Total Orders" value={totalOrders}
          change="+8.1%" changeType="up" gradient="grad-purple" />
        <StatCard icon={Users} label="Active Customers" value={totalCustomers}
          change="+18.7%" changeType="up" gradient="grad-blue" />
        <StatCard icon={Package} label="Live Products" value={`${allProducts.length} Items`}
          change="+3 new" changeType="up" gradient="grad-emerald" />
        <StatCard icon={Star} label="Avg. Rating" value="4.8 / 5.0"
          change="+0.2" changeType="up" gradient="grad-amber" />
        <StatCard icon={TrendingUp} label="Conversion Rate" value="3.24%"
          change="+0.6%" changeType="up" gradient="grad-pink" />
      </div>

      {/* Secondary Grid */}
      <div className="overview-grid-2col">
        {/* Recent Activity */}
        <div className="panel-card">
          <div className="card-title-row">
            <h4><Activity size={16} /> Recent Activity</h4>
            <button className="link-btn">View all</button>
          </div>
          <div className="activity-feed">
            {RECENT_ACTIVITY.map((item, i) => (
              <div key={i} className="activity-entry">
                <div className="activity-icon" style={{ background: `${item.color}20`, color: item.color }}>
                  <item.icon size={15} />
                </div>
                <div className="activity-text">
                  <p>{item.message}</p>
                  <span>{item.time}</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Low Stock Alerts */}
        <div className="panel-card">
          <div className="card-title-row">
            <h4><AlertTriangle size={16} className="text-amber" /> Stock Alerts</h4>
            <button className="link-btn" onClick={() => setActivePanel('inventory')}>Manage</button>
          </div>
          <div className="stock-alerts-list">
            {LOW_STOCK.map((item, i) => (
              <div key={i} className="stock-alert-row">
                <div className="stock-alert-info">
                  <strong>{item.title}</strong>
                  <span className="sku-text">{item.sku}</span>
                </div>
                <InventoryBar stock={item.stock} threshold={item.threshold} />
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Recent Orders Quick View */}
      <div className="panel-card mt-20">
        <div className="card-title-row">
          <h4><ReceiptText size={16} /> Recent Orders</h4>
          <button className="link-btn" onClick={() => setActivePanel('orders')}>View all orders →</button>
        </div>
        <div className="table-wrap">
          <table className="admin-tbl">
            <thead>
              <tr>
                <th>Order ID</th>
                <th>Customer</th>
                <th>Amount</th>
                <th>Status</th>
                <th>Date</th>
              </tr>
            </thead>
            <tbody>
              {orders.slice(0, 4).map(order => (
                <tr key={order.id}>
                  <td><strong className="order-id">{order.id}</strong></td>
                  <td>{order.customer}</td>
                  <td><strong>{cSym}{order.amount.toLocaleString()}</strong></td>
                  <td><StatusBadge status={order.status} /></td>
                  <td className="text-muted">{order.date}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );

  const renderAnalytics = () => {
    const pd = dynamicPeriodData[selectedPeriod] || PERIOD_DATA[selectedPeriod];
    const { stats, chartData, chartTitle, peakLabel, lowLabel, avgLabel, categories } = pd;
    return (
    <div className="panel-analytics">
      {/* Period Selector */}
      <div className="period-selector">
        {['week', 'month', 'quarter', 'year'].map(p => (
          <button key={p} className={`period-btn ${selectedPeriod === p ? 'active' : ''}`}
            onClick={() => setSelectedPeriod(p)}>
            {p.charAt(0).toUpperCase() + p.slice(1)}
          </button>
        ))}
      </div>

      {/* Summary Cards */}
      <div className="stat-cards-grid analytics-summary">
        <StatCard icon={DollarSign} label="Revenue" value={stats.revenue} change={stats.revenueChange} changeType="up" gradient="grad-red" />
        <StatCard icon={ShoppingBag} label="Orders" value={stats.orders} change={stats.ordersChange} changeType="up" gradient="grad-purple" />
        <StatCard icon={Users} label="New Customers" value={stats.customers} change={stats.customersChange} changeType="up" gradient="grad-blue" />
        <StatCard icon={TrendingUp} label="Avg Order Value" value={stats.avgOrder} change={stats.avgOrderChange} changeType="up" gradient="grad-emerald" />
      </div>

      {/* Charts Row */}
      <div className="analytics-charts-row">
        {/* Bar Chart */}
        <div className="panel-card chart-card-large">
          <div className="card-title-row">
            <h4><BarChart2 size={16} /> {chartTitle}</h4>
            <div className="chart-legend">
              <span className="cl-dot" style={{ background: '#ff4d4d' }} />Revenue
            </div>
          </div>
          <RevenueBarChart data={chartData} />
          <div className="chart-summary-row">
            <div className="chart-summary-item">
              <span>Peak</span>
              <strong>{peakLabel}</strong>
            </div>
            <div className="chart-summary-item">
              <span>Lowest</span>
              <strong>{lowLabel}</strong>
            </div>
            <div className="chart-summary-item">
              <span>Average</span>
              <strong>{avgLabel}</strong>
            </div>
          </div>
        </div>

        {/* Donut Chart */}
        <div className="panel-card chart-card-small">
          <div className="card-title-row">
            <h4><PieChart size={16} /> Sales by Category</h4>
          </div>
          <DonutChart data={categories} />
          <div className="category-revenue-list">
            {categories.map((d, i) => (
              <div key={i} className="cat-rev-row">
                <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                  <span className="cat-dot" style={{ background: d.color }} />
                  <span>{d.category}</span>
                </div>
                <strong>{cSym}{d.amount.toLocaleString()}</strong>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Sales Channel Distribution */}
      <div className="panel-card">
        <div className="card-title-row">
          <h4><Layers size={16} /> Sales Channels</h4>
        </div>
        <div className="channels-grid">
          {[
            { label: 'Direct Storefront', pct: selectedPeriod === 'week' ? 71 : selectedPeriod === 'month' ? 72 : selectedPeriod === 'quarter' ? 73 : 74, color: '#ff4d4d' },
            { label: 'Affiliate Sellers', pct: selectedPeriod === 'week' ? 21 : selectedPeriod === 'month' ? 20 : selectedPeriod === 'quarter' ? 19 : 18, color: '#8b5cf6' },
            { label: 'Email Campaigns', pct: selectedPeriod === 'week' ? 8 : selectedPeriod === 'month' ? 8 : selectedPeriod === 'quarter' ? 8 : 8, color: '#10b981' },
          ].map((ch, i) => (
            <div key={i} className="channel-item">
              <div className="channel-meta">
                <span>{ch.label}</span>
                <strong>{ch.pct}%</strong>
              </div>
              <div className="prog-track">
                <div className="prog-fill" style={{ width: `${ch.pct}%`, background: ch.color }} />
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
    );
  };

  const renderProducts = () => (
    <div className="panel-products">
      {/* Toolbar */}
      <div className="toolbar">
        <div className="search-wrap">
          <Search size={15} className="search-icon" />
          <input type="text" placeholder="Search products..." value={searchQuery}
            onChange={e => setSearchQuery(e.target.value)} className="search-input" />
        </div>
        <div className="toolbar-filters">
          <select value={categoryFilter} onChange={e => setCategoryFilter(e.target.value)} className="filter-select">
            <option value="all">All Categories</option>
            <option value="smartphones">Smartphones</option>
            <option value="watches">Watches</option>
            <option value="furniture">Furniture</option>
            <option value="kids">Kids</option>
            <option value="fashion">Fashion</option>
            <option value="electronics">Electronics</option>
            <option value="digital-product">Digital Product</option>
            <option value="home-appliances">Home Appliances</option>
            <option value="vegetable">Vegetables</option>
            <option value="decor">Decor</option>
            <option value="books">Books</option>
          </select>
          <button className="btn-primary" onClick={() => setAddModal(true)}>
            <Plus size={15} /> Add Product
          </button>
        </div>
      </div>

      {/* Products Table */}
      <div className="panel-card no-pad">
        <div className="table-head-bar">
          <h4>Catalog Items ({filteredProducts.length})</h4>
          <div className="table-head-actions">
            <button className="icon-btn" title="Export CSV"><Download size={15} /></button>
            <button className="icon-btn" title="Import"><Upload size={15} /></button>
          </div>
        </div>
        <div className="table-wrap">
          <table className="admin-tbl">
            <thead>
              <tr>
                <th style={{ width: 60 }}>Image</th>
                <th>Product</th>
                <th>Category</th>
                <th>Price</th>
                <th>Status</th>
                <th style={{ textAlign: 'right' }}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredProducts.length === 0 ? (
                <tr><td colSpan={6} className="empty-state">No products found.</td></tr>
              ) : filteredProducts.map(product => (
                <tr key={product.id}>
                  <td>
                    <div className="prod-img-cell">
                      <img src={product.image} alt={product.title} />
                    </div>
                  </td>
                  <td>
                    <div className="prod-title-cell">
                      <strong>{product.title}</strong>
                      <span className="text-muted">ID: {product.id}</span>
                    </div>
                  </td>
                  <td><span className="cat-chip">{product.category}</span></td>
                  <td>
                    <div className="price-cell">
                      <strong>{cSym}{product.price}</strong>
                      {product.oldPrice && <span className="old-price">{cSym}{product.oldPrice}</span>}
                    </div>
                  </td>
                  <td>
                    {product.sale
                      ? <span className="admin-badge badge-sale">On Sale</span>
                      : <span className="admin-badge badge-regular">Regular</span>
                    }
                  </td>
                  <td>
                    <div className="action-btns">
                      <button className="action-btn action-edit"
                        onClick={() => { setEditProduct(product); setEditModal(true); }}
                        title="Edit">
                        <Edit2 size={14} />
                      </button>
                      <button className="action-btn action-view" title="View" onClick={() => navigate(`/product/${product.id}`)}>
                        <Eye size={14} />
                      </button>
                      <button className="action-btn action-delete"
                        onClick={() => confirmDelete(product)} title="Delete">
                        <Trash2 size={14} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );

  const renderOrders = () => (
    <div className="panel-orders">
      {/* Order Stats */}
      <div className="order-stats-row">
        {[
          { label: 'All Orders', count: orders.length, color: '#64748b', filter: 'all' },
          { label: 'Pending', count: orders.filter(o => o.status === 'Pending').length, color: '#f59e0b', filter: 'pending' },
          { label: 'Processing', count: orders.filter(o => o.status === 'Processing').length, color: '#3b82f6', filter: 'processing' },
          { label: 'Shipped', count: orders.filter(o => o.status === 'Shipped').length, color: '#8b5cf6', filter: 'shipped' },
          { label: 'Delivered', count: orders.filter(o => o.status === 'Delivered').length, color: '#10b981', filter: 'delivered' },
          { label: 'Cancelled', count: orders.filter(o => o.status === 'Cancelled').length, color: '#ef4444', filter: 'cancelled' },
        ].map((s, i) => (
          <button key={i} className={`order-stat-chip ${orderFilter === s.filter ? 'active' : ''}`}
            style={{ '--chip-color': s.color }}
            onClick={() => setOrderFilter(s.filter)}>
            <span className="osc-count">{s.count}</span>
            <span className="osc-label">{s.label}</span>
          </button>
        ))}
      </div>

      {/* Search */}
      <div className="toolbar">
        <div className="search-wrap">
          <Search size={15} className="search-icon" />
          <input type="text" placeholder="Search by order ID or customer..." value={searchQuery}
            onChange={e => setSearchQuery(e.target.value)} className="search-input" />
        </div>
        <div className="toolbar-filters">
          <button className="icon-btn" title="Export"><Download size={15} /></button>
        </div>
      </div>

      {/* Orders Table */}
      <div className="panel-card no-pad">
        <div className="table-wrap">
          <table className="admin-tbl">
            <thead>
              <tr>
                <th>Order ID</th>
                <th>Customer</th>
                <th>Items</th>
                <th>Amount</th>
                <th>Payment</th>
                <th>Status</th>
                <th style={{ textAlign: 'right' }}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredOrders.length === 0 ? (
                <tr><td colSpan={7} className="empty-state">No orders found.</td></tr>
              ) : filteredOrders.map(order => (
                <tr key={order.id}>
                  <td>
                    <div className="order-id-cell">
                      <strong className="order-id">{order.id}</strong>
                      <span className="text-muted">{order.date}</span>
                    </div>
                  </td>
                  <td>
                    <div className="order-customer-cell">
                      <strong>{order.customer}</strong>
                      <span className="text-muted">{order.email}</span>
                    </div>
                  </td>
                  <td><span className="order-items-text">{order.items}</span></td>
                  <td><strong>{cSym}{order.amount.toLocaleString()}</strong></td>
                  <td><span className="payment-chip">{order.payment}</span></td>
                  <td><StatusBadge status={order.status} /></td>
                  <td>
                    <div className="action-btns justify-end" style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                      <select value={order.status}
                        onChange={e => updateOrderStatus(order.id, e.target.value)}
                        className="status-selector">
                        <option value="Pending">Pending</option>
                        <option value="Placed">Placed</option>
                        <option value="Processing">Processing</option>
                        <option value="Shipped">Shipped</option>
                        <option value="Out for Delivery">Out for Delivery</option>
                        <option value="Delivered">Delivered</option>
                        <option value="Cancelled">Cancelled</option>
                      </select>
                      <button className="action-btn action-view no-print"
                        onClick={() => setSelectedInvoiceOrder(order)}
                        title="Print Commercial Invoice"
                        style={{ padding: '6px', borderRadius: '4px', background: 'var(--card-bg-hover)' }}>
                        <ReceiptText size={14} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );

  const renderUsers = () => (
    <div className="panel-users">
      {/* User Stats */}
      <div className="user-stats-row">
        <div className="user-stat-card">
          <Users size={20} />
          <div>
            <h4>{users.length}</h4>
            <p>Total Users</p>
          </div>
        </div>
        <div className="user-stat-card">
          <UserCheck size={20} />
          <div>
            <h4>{users.filter(u => u.status === 'active').length}</h4>
            <p>Active</p>
          </div>
        </div>
        <div className="user-stat-card">
          <UserX size={20} />
          <div>
            <h4>{users.filter(u => u.status === 'suspended').length}</h4>
            <p>Suspended</p>
          </div>
        </div>
        <div className="user-stat-card">
          <Shield size={20} />
          <div>
            <h4>{users.filter(u => u.role === 'admin').length}</h4>
            <p>Admins</p>
          </div>
        </div>
      </div>

      {/* Toolbar */}
      <div className="toolbar">
        <div className="search-wrap">
          <Search size={15} className="search-icon" />
          <input type="text" placeholder="Search users..." value={searchQuery}
            onChange={e => setSearchQuery(e.target.value)} className="search-input" />
        </div>
        <div className="toolbar-filters">
          <select value={userFilter} onChange={e => setUserFilter(e.target.value)} className="filter-select">
            <option value="all">All Users</option>
            <option value="active">Active</option>
            <option value="suspended">Suspended</option>
            <option value="inactive">Inactive</option>
            <option value="admin">Admins</option>
            <option value="customer">Customers</option>
          </select>
        </div>
      </div>

      {/* Users Table */}
      <div className="panel-card no-pad">
        <div className="table-wrap">
          <table className="admin-tbl">
            <thead>
              <tr>
                <th>User</th>
                <th>Contact</th>
                <th>Role</th>
                <th>Orders</th>
                <th>Total Spent</th>
                <th>Status</th>
                <th>Joined</th>
                <th style={{ textAlign: 'right' }}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredUsers.length === 0 ? (
                <tr><td colSpan={8} className="empty-state">No users found.</td></tr>
              ) : filteredUsers.map(user => (
                <tr key={user.id}>
                  <td>
                    <div className="user-cell">
                      <div className="user-avatar">{user.name.split(' ').map(n => n[0]).join('').slice(0, 2)}</div>
                      <div>
                        <strong>{user.name}</strong>
                        <span className="text-muted">{user.id}</span>
                      </div>
                    </div>
                  </td>
                  <td>
                    <div className="contact-cell">
                      <span><Mail size={12} /> {user.email}</span>
                      <span><Phone size={12} /> {user.phone}</span>
                    </div>
                  </td>
                  <td><RoleBadge role={user.role} /></td>
                  <td><strong>{user.orders}</strong></td>
                  <td><strong>{cSym}{user.spent.toLocaleString()}</strong></td>
                  <td><UserStatusBadge status={user.status} /></td>
                  <td className="text-muted">{user.joined}</td>
                  <td>
                    <div className="action-btns justify-end">
                      <button
                        className={`action-btn ${user.status === 'active' ? 'action-delete' : 'action-edit'}`}
                        onClick={() => toggleUserStatus(user.id)}
                        title={user.status === 'active' ? 'Suspend User' : 'Activate User'}>
                        {user.status === 'active' ? <UserX size={14} /> : <UserCheck size={14} />}
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );

  // ─── Reports Module Render ───────────────────────────────────────────────────
  const renderReports = () => {
    const totalRev = chartOfAccounts.filter(a => a.category === 'Asset').reduce((acc, a) => acc + a.balance, 0);
    const totalSales = chartOfAccounts.find(a => a.code === '4000')?.balance || 0;
    const rentExp = chartOfAccounts.find(a => a.code === '5010')?.balance || 0;
    const utilitiesExp = chartOfAccounts.find(a => a.code === '5020')?.balance || 0;
    const payrollExp = chartOfAccounts.find(a => a.code === '5030')?.balance || 0;
    const totalExp = rentExp + utilitiesExp + payrollExp;
    const profit = totalSales - totalExp;

    return (
      <div className="panel-reports">
        <div className="panel-card no-pad" id="reports-print-section">
          <div className="table-head-bar no-print" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <h4>Executive Income Statement Report</h4>
            <button className="btn-primary-sm" onClick={() => window.print()}>
              <Printer size={13} /> Print Financial Statement
            </button>
          </div>

          <div className="invoice-paper" style={{ padding: '40px', boxShadow: 'none' }}>
            <div style={{ textAlign: 'center', marginBottom: '30px' }}>
              <div style={{ display: 'inline-flex', alignItems: 'center', gap: '8px', color: 'var(--primary-color)' }}>
                <img src="/markethub_logo.png" alt="M" style={{ width: 28, height: 28, objectFit: 'contain', background: 'transparent' }} />
                <h2 style={{ fontSize: '24px', fontWeight: 'bold' }}>MarketHub Global Inc.</h2>
              </div>
              <h1 style={{ fontSize: '20px', letterSpacing: '1px', marginTop: '10px', color: 'var(--text-muted)' }}>ANNUAL FINANCIAL STATEMENT</h1>
              <p className="text-muted" style={{ fontSize: '12px' }}>Posting Period: Jan 1, 2026 - Dec 31, 2026</p>
            </div>

            <hr style={{ borderColor: 'var(--border-color)', margin: '20px 0' }} />

            <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
              <div>
                <h3 style={{ fontSize: '16px', fontWeight: 'bold', color: 'var(--primary-color)', marginBottom: '8px' }}>1. Operating Sales Revenues</h3>
                <div style={{ display: 'flex', justifyContent: 'space-between', paddingLeft: '15px', marginBottom: '6px' }}>
                  <span>E-Commerce Platform Sales Revenue:</span>
                  <strong>{cSym}{totalSales.toLocaleString()}</strong>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', paddingLeft: '15px', fontSize: '14px', fontWeight: 'bold', borderTop: '1px solid var(--border-color)', paddingTop: '6px' }}>
                  <span>Gross Operating Revenue:</span>
                  <span>{cSym}{totalSales.toLocaleString()}</span>
                </div>
              </div>

              <div style={{ marginTop: '10px' }}>
                <h3 style={{ fontSize: '16px', fontWeight: 'bold', color: 'var(--primary-color)', marginBottom: '8px' }}>2. Corporate Operating Expenses</h3>
                <div style={{ display: 'flex', justifyContent: 'space-between', paddingLeft: '15px', marginBottom: '6px' }}>
                  <span>Warehouse & Facilities Rental Expenses:</span>
                  <span style={{ color: 'var(--badge-cancelled)' }}>-{cSym}{rentExp.toLocaleString()}</span>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', paddingLeft: '15px', marginBottom: '6px' }}>
                  <span>Internet, Broadband & Utilities Expenses:</span>
                  <span style={{ color: 'var(--badge-cancelled)' }}>-{cSym}{utilitiesExp.toLocaleString()}</span>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', paddingLeft: '15px', marginBottom: '6px' }}>
                  <span>Employee Monthly Payroll Disbursements:</span>
                  <span style={{ color: 'var(--badge-cancelled)' }}>-{cSym}{payrollExp.toLocaleString()}</span>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', paddingLeft: '15px', fontSize: '14px', fontWeight: 'bold', borderTop: '1px solid var(--border-color)', paddingTop: '6px' }}>
                  <span>Total Operating Expenditures:</span>
                  <span>-{cSym}{totalExp.toLocaleString()}</span>
                </div>
              </div>

              <hr style={{ borderColor: 'var(--border-color)', margin: '15px 0' }} />

              <div style={{ background: 'var(--card-bg-hover)', padding: '15px', borderRadius: '6px', border: '1px solid var(--border-color)' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '18px', fontWeight: 'bold' }}>
                  <span style={{ color: 'var(--primary-color)' }}>NET BUSINESS PROFIT:</span>
                  <span style={{ color: profit >= 0 ? 'var(--badge-delivered)' : 'var(--badge-cancelled)' }}>{cSym}{profit.toLocaleString()}</span>
                </div>
              </div>
            </div>

            <div style={{ marginTop: '50px', display: 'flex', justifyContent: 'space-between', fontSize: '12px', color: 'var(--text-muted)' }}>
              <div>
                <p>Audited By: <strong>Store Owner</strong></p>
                <p>Signature: _______________________</p>
              </div>
              <div style={{ textAlign: 'right' }}>
                <p>Date of Audit: <strong>{new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}</strong></p>
                <p>Status: <strong>Finalized</strong></p>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  };

  const renderSettings = () => (
    <div className="panel-settings">
      <form onSubmit={handleSettingsSave} className="settings-form">
        {/* Store Info */}
        <div className="settings-section">
          <h4 className="section-heading"><Sliders size={16} /> Store Information</h4>
          <div className="settings-grid">
            <div className="sf-group">
              <label>Store Name</label>
              <input type="text" value={storeSettings.name}
                onChange={e => setStoreSettings(s => ({ ...s, name: e.target.value }))} />
            </div>
            <div className="sf-group">
              <label>Contact Email</label>
              <input type="email" value={storeSettings.email}
                onChange={e => setStoreSettings(s => ({ ...s, email: e.target.value }))} />
            </div>
            <div className="sf-group">
              <label>Phone Number</label>
              <input type="text" value={storeSettings.phone}
                onChange={e => setStoreSettings(s => ({ ...s, phone: e.target.value }))} />
            </div>
            <div className="sf-group">
              <label>Display Currency</label>
              <select value={storeSettings.currency}
                onChange={e => setStoreSettings(s => ({ ...s, currency: e.target.value }))}>
                <option value="USD ($)">USD ($)</option>
                <option value="EUR (€)">EUR (€)</option>
                <option value="INR (₹)">INR (₹)</option>
                <option value="GBP (£)">GBP (£)</option>
              </select>
            </div>
            <div className="sf-group sf-full">
              <label>Physical Address</label>
              <input type="text" value={storeSettings.address}
                onChange={e => setStoreSettings(s => ({ ...s, address: e.target.value }))} />
            </div>
          </div>
        </div>

        {/* Commerce Settings */}
        <div className="settings-section">
          <h4 className="section-heading"><DollarSign size={16} /> Commerce Settings</h4>
          <div className="settings-grid">
            <div className="sf-group">
              <label>Tax Rate (%)</label>
              <input type="number" value={storeSettings.taxRate} step="0.1"
                onChange={e => setStoreSettings(s => ({ ...s, taxRate: e.target.value }))} />
            </div>
            <div className="sf-group">
              <label>Shipping Fee ({cSym})</label>
              <input type="number" value={storeSettings.shippingFee} step="0.01"
                onChange={e => setStoreSettings(s => ({ ...s, shippingFee: e.target.value }))} />
            </div>
            <div className="sf-group">
              <label>Free Shipping Threshold ({cSym})</label>
              <input type="number" value={storeSettings.freeShippingThreshold} step="1"
                onChange={e => setStoreSettings(s => ({ ...s, freeShippingThreshold: e.target.value }))} />
            </div>
          </div>
        </div>

        {/* Maintenance Mode */}
        <div className="settings-section">
          <h4 className="section-heading"><Shield size={16} /> Store Status</h4>
          <label className="toggle-label">
            <div className="toggle-switch">
              <input type="checkbox" checked={storeSettings.maintenance}
                onChange={e => setStoreSettings(s => ({ ...s, maintenance: e.target.checked }))} />
              <span className="toggle-slider" />
            </div>
            <div>
              <strong>Maintenance Mode</strong>
              <p className="setting-desc">When enabled, the storefront is inaccessible to buyers. Admins can still access the panel.</p>
            </div>
          </label>
        </div>

        <div className="settings-save-row">
          <button type="submit" className="btn-primary btn-large">
            <Check size={16} /> Save All Changes
          </button>
        </div>
      </form>
    </div>
  );

  const renderPanel = () => {
    switch (activePanel) {
      case 'overview': return renderOverview();
      case 'analytics': return renderAnalytics();
      case 'products': return renderProducts();
      case 'orders': return renderOrders();
      case 'users': return renderUsers();
      case 'hrm': return <HRMPanel cSym={cSym} onDisburseSalary={handleDisburseSalary} />;
      case 'crm': return <CRMPanel cSym={cSym} />;
      case 'projects': return <ProjectsPanel />;
      case 'inventory': return <InventoryPanel allProducts={allProducts} cSym={cSym} onRestock={(title) => { const prod = allProducts.find(p => p.title === title); if (prod) { setEditProduct(prod); setEditModal(true); } }} />;
      case 'accounting': return <AccountingPanel chartOfAccounts={chartOfAccounts} setChartOfAccounts={setChartOfAccounts} ledgerTransactions={ledgerTransactions} setLedgerTransactions={setLedgerTransactions} cSym={cSym} />;
      case 'feedback': return <FeedbackPanel feedbacks={feedbacks} setFeedbacks={setFeedbacks} />;
      case 'reports': return renderReports();
      case 'settings': return renderSettings();
      default: return renderOverview();
    }
  };

  const handleNavClick = (id) => {
    setActivePanel(id);
    setSearchQuery('');
    setCategoryFilter('all');
    setOrderFilter('all');
    setUserFilter('all');
    if (window.innerWidth <= 900) {
      setSidebarOpen(false);
    }
  };

  return (
    <div className="admin-root">
      {/* Mobile Sidebar Overlay */}
      {sidebarOpen && window.innerWidth <= 900 && (
        <div className="sidebar-mobile-overlay" onClick={() => setSidebarOpen(false)}></div>
      )}

      {/* Sidebar */}
      <aside className={`admin-sidebar-v2 ${sidebarOpen ? 'open' : 'collapsed'}`}>
        <div className="sidebar-brand-v2">
          <img src="/markethub_logo.png" alt="M" style={{ width: 36, height: 36, objectFit: 'contain', background: 'transparent', flexShrink: 0 }} />
          {sidebarOpen && <span className="brand-text">MarketHub Admin</span>}
        </div>

        <nav className="sidebar-nav">
          {navItems.map(item => (
            <button key={item.id}
              className={`nav-item ${activePanel === item.id ? 'active' : ''}`}
              onClick={() => handleNavClick(item.id)}
              title={!sidebarOpen ? item.label : ''}>
              <div className="nav-item-inner">
                <item.icon size={18} className="nav-icon" />
                {sidebarOpen && <span className="nav-label">{item.label}</span>}
              </div>
              {item.badge && (
                <span className="nav-badge">{item.badge}</span>
              )}
            </button>
          ))}
        </nav>

        <div className="sidebar-bottom">
          <div className="sidebar-user">
            <div className="sb-avatar">SO</div>
            {sidebarOpen && (
              <div className="sb-user-info">
                <strong>Store Owner</strong>
                <span>Administrator</span>
              </div>
            )}
          </div>
          {sidebarOpen && (
            <Link to="/" className="visit-store-btn">
              <ExternalLink size={13} /> Visit Store
            </Link>
          )}
        </div>
      </aside>

      {/* Main Content */}
      <div className="admin-main-v2">
        {/* Top Bar */}
        <header className="admin-topbar">
          <div className="topbar-left">
            <button className="toggle-sidebar-btn" onClick={() => setSidebarOpen(s => !s)}>
              <Menu size={20} />
            </button>
            <div className="breadcrumb">
              <span>Admin</span>
              <ChevronRight size={14} />
              <span className="bc-current">{panelTitles[activePanel]?.title}</span>
            </div>
          </div>
          <div className="topbar-right">
            <div className="topbar-search">
              <Search size={14} />
              <input type="text" placeholder="Quick search..." />
            </div>
            <button className="topbar-icon-btn" onClick={toggleDarkMode} title={isDark ? "Switch to Light Mode" : "Switch to Dark Mode"}>
              {isDark ? <Sun size={18} /> : <Moon size={18} />}
            </button>
            <button className="topbar-icon-btn" title="Notifications">
              <Bell size={18} />
              {notifications > 0 && <span className="notif-dot">{notifications}</span>}
            </button>
            <div 
              className="topbar-user"
              onClick={() => setUserDropdownOpen(!userDropdownOpen)}
              onMouseLeave={() => setUserDropdownOpen(false)}
            >
              <div className="topbar-avatar">SO</div>
              <span>Store Owner</span>
              <ChevronDown size={14} className={`dropdown-chevron ${userDropdownOpen ? 'open' : ''}`} />

              {userDropdownOpen && (
                <div className="topbar-dropdown" onClick={(e) => e.stopPropagation()}>
                  <Link to="/" className="dropdown-item">
                    <ExternalLink size={14} />
                    <span>Back to Store</span>
                  </Link>
                </div>
              )}
            </div>
          </div>
        </header>

        {/* Panel Content */}
        <main className="admin-content">
          <div className="content-header">
            <div>
              <h1 className="content-title">{panelTitles[activePanel]?.title}</h1>
              <p className="content-sub">{panelTitles[activePanel]?.sub}</p>
            </div>
          </div>

          <div className="content-body">
            {renderPanel()}
          </div>
        </main>
      </div>

      {/* ── Modals rendered via Portal (bypasses sidebar stacking context) ── */}
      <Portal>
        {/* Commercial Invoice Print Modal */}
        {selectedInvoiceOrder && (
          <div className="admin-overlay" onClick={() => setSelectedInvoiceOrder(null)} style={{ background: 'rgba(0,0,0,0.6)', backdropFilter: 'blur(4px)', zIndex: '9999' }}>
            <div className="admin-modal invoice-modal" id="invoice-print-section" onClick={e => e.stopPropagation()} style={{ maxWidth: '800px', width: '90%', padding: '24px', background: '#ffffff', borderRadius: '12px', color: '#1e293b' }}>
              <div className="modal-head no-print" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px', borderBottom: '1px solid #e2e8f0', paddingBottom: '12px' }}>
                <h3 style={{ fontSize: '18px', fontWeight: 'bold' }}>Commercial Invoice</h3>
                <div style={{ display: 'flex', gap: '8px' }}>
                  <button className="btn-primary" onClick={() => window.print()} style={{ display: 'flex', alignItems: 'center', gap: '6px', padding: '6px 14px', borderRadius: '6px' }}>
                    <Printer size={14} /> Print / Save PDF
                  </button>
                  <button className="modal-close" onClick={() => setSelectedInvoiceOrder(null)} style={{ border: 'none', background: 'none', cursor: 'pointer' }}>
                    <X size={20} />
                  </button>
                </div>
              </div>
              
              <div className="invoice-paper" style={{ background: '#ffffff', color: '#1e293b', fontFamily: 'Inter, sans-serif' }}>
                <div className="invoice-header" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '15px' }}>
                  <div className="invoice-logo" style={{ display: 'flex', alignItems: 'center', gap: '10px', color: 'var(--primary-color)' }}>
                    <img src="/markethub_logo.png" alt="M" style={{ width: 28, height: 28, objectFit: 'contain', background: 'transparent' }} />
                    <h2 style={{ fontSize: '20px', fontWeight: 'bold' }}>MarketHub Global Inc.</h2>
                  </div>
                  <div className="invoice-meta" style={{ textAlign: 'right', fontSize: '12px' }}>
                    <h1 style={{ fontSize: '24px', fontWeight: 'bold', margin: '0 0 6px 0', color: 'var(--primary-color)', letterSpacing: '1px' }}>INVOICE</h1>
                    <p style={{ margin: '2px 0' }}><strong>Invoice No:</strong> INV-{selectedInvoiceOrder.id}</p>
                    <p style={{ margin: '2px 0' }}><strong>Date:</strong> {selectedInvoiceOrder.date}</p>
                    <p style={{ margin: '2px 0' }}><strong>Payment:</strong> {selectedInvoiceOrder.payment}</p>
                  </div>
                </div>
                
                <hr className="invoice-divider" style={{ margin: '20px 0', borderColor: '#e2e8f0' }} />
                
                <div className="invoice-addresses" style={{ display: 'flex', justifyContent: 'space-between', gap: '20px', flexWrap: 'wrap', fontSize: '13px' }}>
                  <div className="address-col" style={{ flex: '1', minWidth: '200px' }}>
                    <h3 style={{ fontSize: '14px', fontWeight: 'bold', color: 'var(--primary-color)', marginBottom: '8px' }}>Billed To:</h3>
                    <strong>{selectedInvoiceOrder.customer}</strong>
                    <p style={{ margin: '4px 0' }}>{selectedInvoiceOrder.email}</p>
                    <p style={{ margin: '4px 0' }}>{selectedInvoiceOrder.address || 'N/A'}</p>
                  </div>
                  <div className="address-col" style={{ flex: '1', minWidth: '200px', textAlign: 'right' }}>
                    <h3 style={{ fontSize: '14px', fontWeight: 'bold', color: 'var(--primary-color)', marginBottom: '8px' }}>Shipped From:</h3>
                    <strong>MarketHub Central Fulfillment Hub</strong>
                    <p style={{ margin: '4px 0' }}>Salt Lake Sector V</p>
                    <p style={{ margin: '4px 0' }}>Kolkata, West Bengal, 721151</p>
                    <p style={{ margin: '4px 0' }}>contact@markethub.com</p>
                  </div>
                </div>

                <table className="invoice-table" style={{ width: '100%', borderCollapse: 'collapse', marginTop: '25px', fontSize: '13px' }}>
                  <thead>
                    <tr style={{ background: '#f8fafc', borderBottom: '2px solid #e2e8f0' }}>
                      <th style={{ padding: '10px', textAlign: 'left' }}>Product Description</th>
                      <th style={{ padding: '10px', textAlign: 'right' }}>Price</th>
                      <th style={{ padding: '10px', textAlign: 'center' }}>Qty</th>
                      <th style={{ padding: '10px', textAlign: 'right' }}>Total</th>
                    </tr>
                  </thead>
                  <tbody>
                    {selectedInvoiceOrder.items ? (
                      selectedInvoiceOrder.items.split(', ').map((itemStr, index) => {
                        const match = itemStr.match(/(.*) x(\d+)/);
                        const title = match ? match[1] : itemStr;
                        const qty = match ? parseInt(match[2], 10) : 1;
                        
                        let price = selectedInvoiceOrder.amount;
                        if (selectedInvoiceOrder.items.split(', ').length > 1) {
                          price = Math.round(selectedInvoiceOrder.amount / (selectedInvoiceOrder.items.split(', ').length * qty));
                        }
                        const itemTotal = price * qty;
                        
                        return (
                          <tr key={index} style={{ borderBottom: '1px solid #f1f5f9' }}>
                            <td style={{ padding: '10px' }}>{title}</td>
                            <td style={{ padding: '10px', textAlign: 'right' }}>{cSym}{price.toLocaleString()}</td>
                            <td style={{ padding: '10px', textAlign: 'center' }}>{qty}</td>
                            <td style={{ padding: '10px', textAlign: 'right' }}>{cSym}{itemTotal.toLocaleString()}</td>
                          </tr>
                        );
                      })
                    ) : (
                      <tr style={{ borderBottom: '1px solid #f1f5f9' }}>
                        <td style={{ padding: '10px' }}>General eShop Merchandise</td>
                        <td style={{ padding: '10px', textAlign: 'right' }}>{cSym}{selectedInvoiceOrder.amount.toLocaleString()}</td>
                        <td style={{ padding: '10px', textAlign: 'center' }}>1</td>
                        <td style={{ padding: '10px', textAlign: 'right' }}>{cSym}{selectedInvoiceOrder.amount.toLocaleString()}</td>
                      </tr>
                    )}
                  </tbody>
                </table>

                <div className="invoice-summary-block" style={{ width: '250px', marginLeft: 'auto', marginTop: '20px', fontSize: '13px', display: 'flex', flexDirection: 'column', gap: '8px' }}>
                  <div className="inv-summary-row" style={{ display: 'flex', justifyContent: 'space-between' }}>
                    <span>Subtotal:</span>
                    <span>{cSym}{selectedInvoiceOrder.amount.toLocaleString()}</span>
                  </div>
                  <div className="inv-summary-row" style={{ display: 'flex', justifyContent: 'space-between' }}>
                    <span>Shipping Fee:</span>
                    <span>{cSym}0.00</span>
                  </div>
                  <hr style={{ margin: '4px 0', borderColor: '#e2e8f0' }} />
                  <div className="inv-summary-row total-row" style={{ display: 'flex', justifyContent: 'space-between', fontSize: '15px', fontWeight: 'bold' }}>
                    <span>Grand Total:</span>
                    <span style={{ color: 'var(--primary-color)' }}>{cSym}{selectedInvoiceOrder.amount.toLocaleString()}</span>
                  </div>
                </div>

                <div className="invoice-footer" style={{ marginTop: '40px', borderTop: '1px solid #e2e8f0', paddingTop: '15px', fontSize: '11px', color: 'var(--text-muted)', textAlign: 'center', position: 'relative' }}>
                  <p>Thank you for your business! For queries, contact support at contact@markethub.com</p>
                  <div className="watermark" style={{ position: 'absolute', right: '10px', top: '10px', fontSize: '32px', fontWeight: 'bold', color: '#10b98120', border: '3px solid #10b98120', padding: '4px 12px', transform: 'rotate(-12deg)', borderRadius: '6px' }}>PAID</div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Add Product Modal */}
        <ProductFormModal
          isOpen={addModal}
          onClose={() => setAddModal(false)}
          onSubmit={handleAddProduct}
          title="Add New Product"
          cSym={cSym}
        />

        {/* Edit Product Modal */}
        <ProductFormModal
          isOpen={editModal}
          onClose={() => { setEditModal(false); setEditProduct(null); }}
          onSubmit={handleEditProduct}
          initialData={editProduct ? {
            title: editProduct.title,
            price: editProduct.price,
            oldPrice: editProduct.oldPrice || '',
            category: editProduct.category,
            image: editProduct.image,
            sale: editProduct.sale || false,
            description: editProduct.description || '',
            stock: editProduct.stock || 50,
            color: editProduct.color || '',
          } : null}
          title="Edit Product"
          cSym={cSym}
        />

        {/* Delete Confirm */}
        {deleteConfirm && (
          <div className="admin-overlay" onClick={() => setDeleteConfirm(null)}>
            <div className="confirm-modal" onClick={e => e.stopPropagation()}>
              <div className="confirm-icon"><Trash2 size={28} /></div>
              <h3>Delete Product?</h3>
              <p>Are you sure you want to delete <strong>"{deleteConfirm.title}"</strong>? This action cannot be undone.</p>
              <div className="confirm-actions">
                <button className="btn-ghost" onClick={() => setDeleteConfirm(null)}>Cancel</button>
                <button className="btn-danger" onClick={executeDelete}>Yes, Delete</button>
              </div>
            </div>
          </div>
        )}
      </Portal>

    </div>
  );
};

export default AdminDashboard;
