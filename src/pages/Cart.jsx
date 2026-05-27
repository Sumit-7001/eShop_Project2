import React from 'react';
import { Link } from 'react-router-dom';
import { Trash2, ShoppingBag, Minus, Plus, ChevronRight } from 'lucide-react';
import '../styles/Cart.css';

const Cart = ({ cartItems, removeFromCart, updateQuantity, clearCart }) => {
  const subtotal = cartItems.reduce((acc, item) => acc + (item.price * item.quantity), 0);
  const total = subtotal; // Simplified, you can add tax logic here if needed

  if (cartItems.length === 0) {
    return (
      <div className="cart-page">
        <div className="container">
          <div className="empty-cart">
            <ShoppingBag size={80} color="#ccc" style={{ marginBottom: '20px' }} />
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
                      <div className="cart-product-cell">
                        <img src={item.image} alt={item.title} className="cart-product-img" />
                        <div className="cart-product-info">
                          <h4>{item.title}</h4>
                          <p>{item.subtitle || 'Premium Quality'}</p>
                        </div>
                      </div>
                    </td>
                    <td data-label="Price"><div className="cart-price">${item.price.toLocaleString()}</div></td>
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
                    <td data-label="Subtotal"><div className="cart-subtotal">${(item.price * item.quantity).toLocaleString()}</div></td>
                    <td data-label="Actions">
                      <div className="cart-actions">
                        <Trash2 
                          className="action-icon delete-icon" 
                          size={18} 
                          onClick={() => removeFromCart(item.id)}
                        />
                        <ShoppingBag className="action-icon save-icon" size={18} />
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <div className="cart-sidebar">
            <div className="cart-total-card">
              <h3>Cart Total</h3>
              <div className="total-row">
                <span>Subtotal</span>
                <span>${subtotal.toLocaleString()}</span>
              </div>
              <div className="total-row grand-total">
                <span>Total</span>
                <span>${total.toLocaleString()}</span>
              </div>
              <Link to="/checkout" className="checkout-btn">Go To Checkout</Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Cart;
