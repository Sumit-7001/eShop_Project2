import React from 'react';
import { Link } from 'react-router-dom';
import { Trash2, ShoppingBag, Minus, Plus, ChevronRight } from 'lucide-react';
import { useApp } from '../context/AppContext';
import '../styles/Cart.css';

const Cart = () => {
  const { cartItems, removeFromCart, updateQuantity, clearCart, savedForLaterItems, moveToSavedForLater, moveToCartFromSaved, removeFromSavedForLater } = useApp();
  const subtotal = cartItems.reduce((acc, item) => acc + (item.price * item.quantity), 0);
  const total = subtotal; // Simplified, you can add tax logic here if needed

  if (cartItems.length === 0 && savedForLaterItems.length === 0) {
    return (
      <div className="cart-page">
        <div className="container">
          <div className="empty-cart">
            <ShoppingBag size={80} color="#ccc" style={{ display: 'block', margin: '0 auto 20px' }} />
            <h2>Your cart is empty</h2>
            <p style={{ color: '#888', marginBottom: '30px' }}>Looks like you haven't added anything to your cart yet.</p>
            <Link to="/" className="continue-shopping">Continue Shopping</Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="cart-page">
      <div className="container">
        <div className="cart-breadcrumb">
          <ul>
            <li><Link to="/">Home</Link> <ChevronRight size={14} /></li>
            <li className="active">Cart</li>
          </ul>
        </div>

        <div className="cart-container">
          <div className="cart-main">
            {cartItems.length > 0 ? (
              <>
                <div className="cart-header-actions">
                  <button className="clear-cart-btn" onClick={clearCart}>Clear Cart</button>
                </div>
                <table className="cart-table">
              <thead>
                <tr>
                  <th>Product</th>
                  <th>Price</th>
                  <th>Tax(%)</th>
                  <th>Quantity</th>
                  <th>Subtotal</th>
                  <th></th>
                </tr>
              </thead>
              <tbody>
                {cartItems.map((item) => (
                  <tr key={item.id}>
                    <td data-label="Product">
                      <Link to={`/product/${item.id >= 1000 ? item.id - 1000 : item.id}`} className="cart-product-link">
                        <div className="cart-product-cell">
                          <img src={item.image} alt={item.title} className="cart-product-img" />
                          <div className="cart-product-info">
                            <h4>{item.title}</h4>
                            <p>{item.subtitle || 'Premium Quality'}</p>
                          </div>
                        </div>
                      </Link>
                    </td>
                    <td data-label="Price"><div className="cart-price">₹{item.price.toLocaleString()}</div></td>
                    <td data-label="Tax(%)"><div className="cart-tax">-</div></td>
                    <td data-label="Quantity">
                      <div className="cart-quantity-selector">
                        <button 
                          className="qty-btn" 
                          onClick={() => updateQuantity(item.id, item.quantity - 1)}
                        >
                          <Minus size={14} />
                        </button>
                        <span className="qty-val">{item.quantity}</span>
                        <button 
                          className="qty-btn" 
                          onClick={() => updateQuantity(item.id, item.quantity + 1)}
                        >
                          <Plus size={14} />
                        </button>
                      </div>
                    </td>
                    <td data-label="Subtotal"><div className="cart-subtotal">₹{(item.price * item.quantity).toLocaleString()}</div></td>
                    <td data-label="Actions">
                      <div className="cart-actions">
                        <Trash2 
                          className="action-icon delete-icon" 
                          size={18} 
                          onClick={() => removeFromCart(item.id)}
                        />
                        <ShoppingBag 
                          className="action-icon save-icon" 
                          size={18} 
                          title="Save for Later"
                          onClick={() => moveToSavedForLater(item.id)}
                        />
                      </div>
                    </td>
                  </tr>
                ))}
                </tbody>
              </table>
              </>
            ) : (
              <div className="empty-cart" style={{ padding: '40px 20px', borderBottom: '1px solid var(--admin-border-color)' }}>
                <ShoppingBag size={50} color="var(--text-gray)" style={{ display: 'block', margin: '0 auto 15px', opacity: 0.5 }} />
                <h2>Your cart is empty</h2>
                <p style={{ color: 'var(--text-gray)', marginBottom: '25px' }}>Looks like you haven't added anything to your cart yet.</p>
                <Link to="/" className="continue-shopping">Continue Shopping</Link>
              </div>
            )}

            {savedForLaterItems.length > 0 && (
              <div className="saved-for-later-section" style={{ marginTop: '50px' }}>
                <h3 style={{ marginBottom: '20px', fontSize: '1.5rem', fontWeight: '700', color: 'var(--text-dark)' }}>
                  Saved for Later ({savedForLaterItems.length})
                </h3>
                <table className="cart-table">
                  <thead>
                    <tr>
                      <th>Product</th>
                      <th>Price</th>
                      <th>Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {savedForLaterItems.map((item) => (
                      <tr key={item.id}>
                        <td data-label="Product">
                          <Link to={`/product/${item.id >= 1000 ? item.id - 1000 : item.id}`} className="cart-product-link">
                            <div className="cart-product-cell">
                              <img src={item.image} alt={item.title} className="cart-product-img" />
                              <div className="cart-product-info">
                                <h4>{item.title}</h4>
                                <p>{item.subtitle || 'Premium Quality'}</p>
                              </div>
                            </div>
                          </Link>
                        </td>
                        <td data-label="Price"><div className="cart-price">₹{item.price.toLocaleString()}</div></td>
                        <td data-label="Actions">
                          <div className="cart-actions" style={{ justifyContent: 'flex-start', gap: '15px' }}>
                            <button 
                              className="move-to-cart-btn" 
                              style={{
                                background: 'transparent', border: '1px solid var(--primary-color)', color: 'var(--primary-color)',
                                padding: '6px 15px', borderRadius: '20px', cursor: 'pointer', fontSize: '13px', fontWeight: '600'
                              }}
                              onClick={() => moveToCartFromSaved(item.id)}
                            >
                              Move to Cart
                            </button>
                            <Trash2 
                              className="action-icon delete-icon" 
                              size={18} 
                              onClick={() => removeFromSavedForLater(item.id)}
                            />
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>

          {cartItems.length > 0 && (
            <div className="cart-sidebar">
            <div className="cart-total-card">
              <h3>Cart Total</h3>
              <div className="total-row">
                <span>Subtotal</span>
                <span>₹{subtotal.toLocaleString()}</span>
              </div>
              <div className="total-row grand-total">
                <span>Total</span>
                <span>₹{total.toLocaleString()}</span>
              </div>
              <Link to="/checkout" className="checkout-btn">Go To Checkout</Link>
            </div>
          </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Cart;
