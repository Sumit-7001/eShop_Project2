import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Boxes, Tag, Truck, Building2, ReceiptText, PackageCheck,
  AlertTriangle, XCircle, Archive, AlertCircle, RefreshCw,
  Plus, Eye
} from 'lucide-react';

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

const LOW_STOCK = [
  { title: 'Samsung Galaxy S24 Ultra', stock: 2, category: 'smartphones', sku: 'SMG-S24U-256', threshold: 5 },
  { title: 'Oak Wood Dining Table', stock: 1, category: 'furniture', sku: 'FUR-OWDT-01', threshold: 3 },
  { title: 'Plush Teddy Bear (Giant)', stock: 0, category: 'kids', sku: 'KID-PTB-LG', threshold: 5 },
  { title: 'Garmin Fenix 7', stock: 3, category: 'watches', sku: 'WAT-GF7-BLK', threshold: 5 },
];

export const InventoryPanel = ({ allProducts = [], cSym = '$', onRestock }) => {
  const navigate = useNavigate();
  const [activeInventoryTab, setActiveInventoryTab] = useState('stock');
  const [brandsList, setBrandsList] = useState([
    { id: 'BR-01', name: 'Apple', code: 'APL', productsCount: 15, status: 'Active' },
    { id: 'BR-02', name: 'Samsung', code: 'SAM', productsCount: 22, status: 'Active' },
    { id: 'BR-03', name: 'Google', code: 'GOG', productsCount: 8, status: 'Active' },
    { id: 'BR-04', name: 'Nike', code: 'NKE', productsCount: 12, status: 'Active' },
    { id: 'BR-05', name: 'IKEA', code: 'IKE', productsCount: 31, status: 'Active' },
  ]);
  const [newBrandForm, setNewBrandForm] = useState({ name: '', code: '' });
  const [suppliersList, setSuppliersList] = useState([
    { id: 'SPL-01', name: 'Supreme Tech Distributors', contact: 'Karan Malhotra', email: 'orders@supremetech.com', phone: '+91 98888 77777', items: 'Smartphones & Electronics' },
    { id: 'SPL-02', name: 'Royal Furniture Crafts', contact: 'Vijay Mistry', email: 'vijay@royalfurniture.com', phone: '+91 97777 66666', items: 'Sofa, Dining Tables & Chairs' },
    { id: 'SPL-03', name: 'Rainbow Kids Toys', contact: 'Alka Roy', email: 'sales@rainbowkids.co.in', phone: '+91 96666 55555', items: 'Educational Toys & Bicycles' },
  ]);
  const [newSupplierForm, setNewSupplierForm] = useState({ name: '', contact: '', email: '', phone: '', items: '' });
  const [warehousesList, setWarehousesList] = useState([
    { id: 'WH-01', name: 'Central Logistics Hub', location: 'Salt Lake Sec V, Kolkata', capacity: '85% Filled', manager: 'Amit Roy', contact: '+91 99009 90099' },
    { id: 'WH-02', name: 'Delhi NCR Fulfillment Center', location: 'Okhla Phase III, New Delhi', capacity: '42% Filled', manager: 'Raman Sharma', contact: '+91 88008 88008' },
    { id: 'WH-03', name: 'Mumbai Delivery Node', location: 'Andheri East, Mumbai', capacity: '60% Filled', manager: 'Ketan Patel', contact: '+91 77007 77007' },
  ]);
  const [newWarehouseForm, setNewWarehouseForm] = useState({ name: '', location: '', capacity: '0% Filled', manager: '', contact: '' });
  const [purchaseOrdersList, setPurchaseOrdersList] = useState([
    { id: 'PO-4501', supplier: 'Supreme Tech Distributors', date: 'May 30, 2026', total: 15400, items: 'iPhone 15 Pro Max x10, Garmin Fenix 7 x5', status: 'Ordered' },
    { id: 'PO-4502', supplier: 'Royal Furniture Crafts', date: 'May 28, 2026', total: 3200, items: 'Modern Velvet Sofa x3, Oak Wood Table x2', status: 'Delivered' },
    { id: 'PO-4503', supplier: 'Rainbow Kids Toys', date: 'May 25, 2026', total: 1800, items: 'Magnetic Building Tiles x20, RC Stunt Car x30', status: 'Processing' },
  ]);
  const [newPurchaseOrderForm, setNewPurchaseOrderForm] = useState({ supplierId: 'SPL-01', itemsString: '', amount: '' });

  return (
    <div className="panel-inventory">
      {/* Operations Sub-navigation tabs */}
      <div className="erp-tabs-nav no-print" style={{ display: 'flex', gap: '8px', marginBottom: '20px', borderBottom: '1px solid var(--border-color)', paddingBottom: '10px', overflowX: 'auto' }}>
        {[
          { id: 'stock', label: 'Stock Levels', icon: Boxes },
          { id: 'brands', label: 'Brands', icon: Tag },
          { id: 'suppliers', label: 'Suppliers', icon: Truck },
          { id: 'warehouses', label: 'Warehouses', icon: Building2 },
          { id: 'purchase', label: 'Purchase Orders', icon: ReceiptText },
        ].map(tab => (
          <button
            key={tab.id}
            onClick={() => setActiveInventoryTab(tab.id)}
            className={`erp-tab-btn ${activeInventoryTab === tab.id ? 'active' : ''}`}
            style={{
              padding: '8px 16px',
              borderRadius: '6px',
              border: 'none',
              background: activeInventoryTab === tab.id ? 'var(--primary-color)' : 'transparent',
              color: activeInventoryTab === tab.id ? '#ffffff' : 'var(--text-muted)',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: '6px',
              fontWeight: '600',
              whiteSpace: 'nowrap',
              transition: 'all 0.2s'
            }}
          >
            <tab.icon size={15} />
            {tab.label}
          </button>
        ))}
      </div>

      {activeInventoryTab === 'stock' && (
        <>
          {/* Inventory Summary */}
          <div className="inv-summary-grid">
            <div className="inv-summary-card green">
              <PackageCheck size={24} />
              <div>
                <h4>{allProducts.length - LOW_STOCK.filter(i => i.stock === 0).length}</h4>
                <p>In Stock</p>
              </div>
            </div>
            <div className="inv-summary-card amber">
              <AlertTriangle size={24} />
              <div>
                <h4>{LOW_STOCK.filter(i => i.stock > 0 && i.stock <= i.threshold).length}</h4>
                <p>Low Stock</p>
              </div>
            </div>
            <div className="inv-summary-card red">
              <XCircle size={24} />
              <div>
                <h4>{LOW_STOCK.filter(i => i.stock === 0).length}</h4>
                <p>Out of Stock</p>
              </div>
            </div>
            <div className="inv-summary-card blue">
              <Archive size={24} />
              <div>
                <h4>{allProducts.length}</h4>
                <p>Total SKUs</p>
              </div>
            </div>
          </div>

          {/* Critical Stock Alerts */}
          <div className="panel-card">
            <div className="card-title-row">
              <h4><AlertCircle size={16} className="text-red" /> Critical Stock Alerts</h4>
              <button className="btn-ghost-sm"><RefreshCw size={14} /> Refresh</button>
            </div>
            <div className="inv-alerts-grid">
              {LOW_STOCK.map((item, i) => (
                <div key={i} className={`inv-alert-card ${item.stock === 0 ? 'out-of-stock' : 'low-stock'}`}>
                  <div className="inv-alert-header">
                    <div>
                      <strong>{item.title}</strong>
                      <span className="sku-text">SKU: {item.sku}</span>
                      <span className="cat-chip" style={{ marginTop: 4 }}>{item.category}</span>
                    </div>
                    <div className={`inv-stock-badge ${item.stock === 0 ? 'out' : 'low'}`}>
                      {item.stock === 0 ? 'OUT' : `${item.stock}`}
                    </div>
                  </div>
                  <div className="inv-progress">
                    <InventoryBar stock={item.stock} threshold={item.threshold} />
                    <span className="threshold-text">Threshold: {item.threshold} units</span>
                  </div>
                  <div className="inv-alert-actions">
                    <button className="btn-primary-sm" onClick={() => onRestock && onRestock(item.title)}>
                      <Plus size={13} /> Restock
                    </button>
                    <button className="btn-ghost-sm" onClick={() => {
                      const prod = allProducts.find(p => p.title === item.title);
                      if (prod) navigate(`/product/${prod.id}`);
                    }}>
                      <Eye size={13} /> View
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Full Product Inventory Table */}
          <div className="panel-card no-pad mt-20">
            <div className="table-head-bar">
              <h4>Full Product Inventory ({allProducts.length})</h4>
            </div>
            <div className="table-wrap">
              <table className="admin-tbl">
                <thead>
                  <tr>
                    <th>Product</th>
                    <th>Category</th>
                    <th>Price</th>
                    <th>Sale Status</th>
                  </tr>
                </thead>
                <tbody>
                  {allProducts.map(p => (
                    <tr key={p.id}>
                      <td>
                        <div className="prod-title-cell">
                          <strong>{p.title}</strong>
                          <span className="text-muted">ID: {p.id}</span>
                        </div>
                      </td>
                      <td><span className="cat-chip">{p.category}</span></td>
                      <td><strong>{cSym}{p.price}</strong></td>
                      <td>
                        {p.sale
                          ? <span className="admin-badge badge-sale">On Sale</span>
                          : <span className="admin-badge badge-regular">Regular</span>
                        }
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </>
      )}

      {activeInventoryTab === 'brands' && (
        <div className="overview-grid-2col">
          <div className="panel-card">
            <h4>Active Brands Catalog</h4>
            <div className="table-wrap" style={{ marginTop: '15px' }}>
              <table className="admin-tbl">
                <thead>
                  <tr>
                    <th>Brand Code</th>
                    <th>Brand Name</th>
                    <th>Live Products</th>
                    <th>Status</th>
                  </tr>
                </thead>
                <tbody>
                  {brandsList.map(b => (
                    <tr key={b.id}>
                      <td><strong style={{ color: 'var(--primary-color)' }}>{b.code}</strong></td>
                      <td><strong>{b.name}</strong></td>
                      <td>{b.productsCount} items</td>
                      <td>
                        <span className="user-status-badge status-active">{b.status}</span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          <div className="panel-card">
            <h4>Register Brand Partner</h4>
            <form onSubmit={e => {
              e.preventDefault();
              if (!newBrandForm.name || !newBrandForm.code) return;
              const nB = {
                id: 'BR-' + (brandsList.length + 1).toString().padStart(2, '0'),
                name: newBrandForm.name,
                code: newBrandForm.code.toUpperCase(),
                productsCount: 0,
                status: 'Active'
              };
              setBrandsList(prev => [...prev, nB]);
              setNewBrandForm({ name: '', code: '' });
            }} style={{ marginTop: '20px', display: 'flex', flexDirection: 'column', gap: '12px' }}>
              <div className="mf-group">
                <label>Brand Partner Name *</label>
                <input type="text" value={newBrandForm.name} onChange={e => setNewBrandForm(prev => ({ ...prev, name: e.target.value }))} placeholder="e.g. Adidas" required className="search-input" style={{ width: '100%' }} />
              </div>
              <div className="mf-group">
                <label>Brand Prefix Code *</label>
                <input type="text" value={newBrandForm.code} onChange={e => setNewBrandForm(prev => ({ ...prev, code: e.target.value }))} maxLength={3} placeholder="e.g. ADI" required className="search-input" style={{ width: '100%' }} />
              </div>
              <button type="submit" className="btn-primary" style={{ marginTop: '10px' }}><Plus size={16} /> Add Brand Partner</button>
            </form>
          </div>
        </div>
      )}

      {activeInventoryTab === 'suppliers' && (
        <div className="overview-grid-2col">
          <div className="panel-card" style={{ flex: '2' }}>
            <h4>B2B Suppliers Ledger</h4>
            <div className="table-wrap" style={{ marginTop: '15px' }}>
              <table className="admin-tbl">
                <thead>
                  <tr>
                    <th>Supplier</th>
                    <th>Account Manager</th>
                    <th>Contact Info</th>
                    <th>Supplies Categories</th>
                  </tr>
                </thead>
                <tbody>
                  {suppliersList.map(s => (
                    <tr key={s.id}>
                      <td><strong>{s.name}</strong></td>
                      <td>{s.contact}</td>
                      <td>
                        <div style={{ display: 'flex', flexDirection: 'column', fontSize: '12px' }}>
                          <span>{s.email}</span>
                          <span className="text-muted">{s.phone}</span>
                        </div>
                      </td>
                      <td><span className="cat-chip">{s.items}</span></td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          <div className="panel-card">
            <h4>Onboard New Supplier</h4>
            <form onSubmit={e => {
              e.preventDefault();
              if (!newSupplierForm.name || !newSupplierForm.email) return;
              const nS = {
                id: 'SPL-' + (suppliersList.length + 1).toString().padStart(2, '0'),
                name: newSupplierForm.name,
                contact: newSupplierForm.contact || 'N/A',
                email: newSupplierForm.email,
                phone: newSupplierForm.phone || 'N/A',
                items: newSupplierForm.items || 'General Merchandise'
              };
              setSuppliersList(prev => [...prev, nS]);
              setNewSupplierForm({ name: '', contact: '', email: '', phone: '', items: '' });
            }} style={{ marginTop: '20px', display: 'flex', flexDirection: 'column', gap: '12px' }}>
              <div className="mf-group">
                <label>Company Name *</label>
                <input type="text" value={newSupplierForm.name} onChange={e => setNewSupplierForm(prev => ({ ...prev, name: e.target.value }))} placeholder="e.g. Global Tech Importers" required className="search-input" style={{ width: '100%' }} />
              </div>
              <div className="mf-group">
                <label>Account Executive Name</label>
                <input type="text" value={newSupplierForm.contact} onChange={e => setNewSupplierForm(prev => ({ ...prev, contact: e.target.value }))} placeholder="e.g. Ramesh Kumar" className="search-input" style={{ width: '100%' }} />
              </div>
              <div className="mf-group">
                <label>Corporate Email *</label>
                <input type="email" value={newSupplierForm.email} onChange={e => setNewSupplierForm(prev => ({ ...prev, email: e.target.value }))} placeholder="e.g. accounts@globaltech.com" required className="search-input" style={{ width: '100%' }} />
              </div>
              <div className="mf-group">
                <label>Corporate Telephone</label>
                <input type="text" value={newSupplierForm.phone} onChange={e => setNewSupplierForm(prev => ({ ...prev, phone: e.target.value }))} placeholder="e.g. +91 99000 88000" className="search-input" style={{ width: '100%' }} />
              </div>
              <div className="mf-group">
                <label>Supply Domain Scope</label>
                <input type="text" value={newSupplierForm.items} onChange={e => setNewSupplierForm(prev => ({ ...prev, items: e.target.value }))} placeholder="e.g. Apparel & Footwear" className="search-input" style={{ width: '100%' }} />
              </div>
              <button type="submit" className="btn-primary" style={{ marginTop: '10px' }}><Plus size={16} /> Register B2B Partner</button>
            </form>
          </div>
        </div>
      )}

      {activeInventoryTab === 'warehouses' && (
        <div className="overview-grid-2col">
          <div className="panel-card" style={{ flex: '2' }}>
            <h4>Active Warehouses & Logistics Nodes</h4>
            <div className="table-wrap" style={{ marginTop: '15px' }}>
              <table className="admin-tbl">
                <thead>
                  <tr>
                    <th>Facility Code</th>
                    <th>Warehouse Address</th>
                    <th>Operating Load</th>
                    <th>Hub Administrator</th>
                  </tr>
                </thead>
                <tbody>
                  {warehousesList.map(w => (
                    <tr key={w.id}>
                      <td><strong style={{ color: 'var(--primary-color)' }}>{w.id}</strong></td>
                      <td>
                        <div style={{ display: 'flex', flexDirection: 'column' }}>
                          <strong>{w.name}</strong>
                          <span className="text-muted" style={{ fontSize: '11px' }}>{w.location}</span>
                        </div>
                      </td>
                      <td>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                          <span style={{ fontSize: '12px', fontWeight: 'bold' }}>{w.capacity}</span>
                          <div className="inventory-bar-track" style={{ width: '60px', height: '6px', margin: 0 }}>
                            <div className="inventory-bar-fill" style={{ width: w.capacity, background: parseInt(w.capacity) > 80 ? 'var(--badge-cancelled)' : 'var(--badge-delivered)' }} />
                          </div>
                        </div>
                      </td>
                      <td>
                        <div style={{ display: 'flex', flexDirection: 'column', fontSize: '12px' }}>
                          <span>{w.manager}</span>
                          <span className="text-muted">{w.contact}</span>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          <div className="panel-card">
            <h4>Onboard Warehouse Node</h4>
            <form onSubmit={e => {
              e.preventDefault();
              if (!newWarehouseForm.name || !newWarehouseForm.location) return;
              const nW = {
                id: 'WH-' + (warehousesList.length + 1).toString().padStart(2, '0'),
                name: newWarehouseForm.name,
                location: newWarehouseForm.location,
                capacity: '15% Filled',
                manager: newWarehouseForm.manager || 'N/A',
                contact: newWarehouseForm.contact || 'N/A'
              };
              setWarehousesList(prev => [...prev, nW]);
              setNewWarehouseForm({ name: '', location: '', capacity: '0% Filled', manager: '', contact: '' });
            }} style={{ marginTop: '20px', display: 'flex', flexDirection: 'column', gap: '12px' }}>
              <div className="mf-group">
                <label>Facility Nickname *</label>
                <input type="text" value={newWarehouseForm.name} onChange={e => setNewWarehouseForm(prev => ({ ...prev, name: e.target.value }))} placeholder="e.g. Bangalore Distribution Hub" required className="search-input" style={{ width: '100%' }} />
              </div>
              <div className="mf-group">
                <label>Geographic Location Address *</label>
                <input type="text" value={newWarehouseForm.location} onChange={e => setNewWarehouseForm(prev => ({ ...prev, location: e.target.value }))} placeholder="e.g. Whitefield Industrial Area, Bangalore" required className="search-input" style={{ width: '100%' }} />
              </div>
              <div className="mf-group">
                <label>Facility Manager Name</label>
                <input type="text" value={newWarehouseForm.manager} onChange={e => setNewWarehouseForm(prev => ({ ...prev, manager: e.target.value }))} placeholder="e.g. Satish Hegde" className="search-input" style={{ width: '100%' }} />
              </div>
              <div className="mf-group">
                <label>Facility Contact Telephone</label>
                <input type="text" value={newWarehouseForm.contact} onChange={e => setNewWarehouseForm(prev => ({ ...prev, contact: e.target.value }))} placeholder="e.g. +91 99888 11223" className="search-input" style={{ width: '100%' }} />
              </div>
              <button type="submit" className="btn-primary" style={{ marginTop: '10px' }}><Plus size={16} /> Commission Warehouse</button>
            </form>
          </div>
        </div>
      )}

      {activeInventoryTab === 'purchase' && (
        <div className="overview-grid-2col">
          <div className="panel-card" style={{ flex: '2' }}>
            <h4>B2B Purchase Orders Log</h4>
            <div className="table-wrap" style={{ marginTop: '15px' }}>
              <table className="admin-tbl">
                <thead>
                  <tr>
                    <th>PO ID</th>
                    <th>Supplier Partner</th>
                    <th>Items Ordered</th>
                    <th>Transaction Cost</th>
                    <th>Fulfillment Status</th>
                  </tr>
                </thead>
                <tbody>
                  {purchaseOrdersList.map(po => (
                    <tr key={po.id}>
                      <td><strong style={{ color: 'var(--primary-color)' }}>{po.id}</strong><br /><span className="text-muted" style={{ fontSize: '11px' }}>{po.date}</span></td>
                      <td><strong>{po.supplier}</strong></td>
                      <td><span className="order-items-text">{po.items}</span></td>
                      <td><strong>{cSym}{po.total.toLocaleString()}</strong></td>
                      <td>
                        <span className={`admin-badge ${po.status === 'Delivered' ? 'badge-delivered' : po.status === 'Ordered' ? 'badge-pending' : po.status === 'Processing'}`}>{po.status}</span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          <div className="panel-card">
            <h4>Draft Purchase Order</h4>
            <form onSubmit={e => {
              e.preventDefault();
              if (!newPurchaseOrderForm.itemsString || !newPurchaseOrderForm.amount) return;
              const sup = suppliersList.find(s => s.id === newPurchaseOrderForm.supplierId) || suppliersList[0];
              const nPO = {
                id: 'PO-' + (4500 + purchaseOrdersList.length + 1).toString(),
                supplier: sup.name,
                date: new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }),
                total: parseInt(newPurchaseOrderForm.amount, 10),
                items: newPurchaseOrderForm.itemsString,
                status: 'Ordered'
              };
              setPurchaseOrdersList(prev => [nPO, ...prev]);
              setNewPurchaseOrderForm({ supplierId: 'SPL-01', itemsString: '', amount: '' });
            }} style={{ marginTop: '20px', display: 'flex', flexDirection: 'column', gap: '12px' }}>
              <div className="mf-group">
                <label>Select B2B Supplier Partner *</label>
                <select value={newPurchaseOrderForm.supplierId} onChange={e => setNewPurchaseOrderForm(prev => ({ ...prev, supplierId: e.target.value }))} className="status-selector" style={{ width: '100%', height: '38px' }}>
                  {suppliersList.map(s => (
                    <option key={s.id} value={s.id}>{s.name}</option>
                  ))}
                </select>
              </div>
              <div className="mf-group">
                <label>Inventory Items & Quantities *</label>
                <textarea rows={3} value={newPurchaseOrderForm.itemsString} onChange={e => setNewPurchaseOrderForm(prev => ({ ...prev, itemsString: e.target.value }))} placeholder="e.g. Garmin Fenix 7 Pro x15, Apple Watch Ultra 2 x8" required className="search-input" style={{ width: '100%', height: 'auto', padding: '10px' }} />
              </div>
              <div className="mf-group">
                <label>Total Quotation Cost ({cSym}) *</label>
                <input type="number" value={newPurchaseOrderForm.amount} onChange={e => setNewPurchaseOrderForm(prev => ({ ...prev, amount: e.target.value }))} placeholder="e.g. 12500" required className="search-input" style={{ width: '100%' }} />
              </div>
              <button type="submit" className="btn-primary" style={{ marginTop: '10px' }}><ReceiptText size={16} /> Place Purchase Order</button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
