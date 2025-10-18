import React, { useState, useEffect } from 'react';
import './Cart.css';
import API_URL from '../config';

const Cart = ({ user, onClose }) => {
  const [cartItems, setCartItems] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    // Load cart from localStorage
    const savedCart = localStorage.getItem(`cart_${user.email}`);
    if (savedCart) {
      setCartItems(JSON.parse(savedCart));
    }
  }, [user.email]);

  // Save cart to localStorage whenever it changes
  useEffect(() => {
    localStorage.setItem(`cart_${user.email}`, JSON.stringify(cartItems));
  }, [cartItems, user.email]);

  const updateQuantity = (productId, newQuantity) => {
    if (newQuantity <= 0) {
      removeFromCart(productId);
      return;
    }

    setCartItems(items =>
      items.map(item =>
        item.id === productId ? { ...item, quantity: newQuantity } : item
      )
    );
  };

  const removeFromCart = (productId) => {
    setCartItems(items => items.filter(item => item.id !== productId));
  };

  const clearCart = () => {
    if (window.confirm('Are you sure you want to clear your cart?')) {
      setCartItems([]);
    }
  };

  const calculateTotal = () => {
    return cartItems.reduce((total, item) => {
      return total + (parseFloat(item.price) * item.quantity);
    }, 0).toFixed(2);
  };

  const handleCheckout = () => {
    if (cartItems.length === 0) {
      alert('Your cart is empty!');
      return;
    }

    setLoading(true);
    
    // Simulate checkout process
    setTimeout(() => {
      alert(`🎉 Order placed successfully!\n\nTotal: $${calculateTotal()}\n\nThank you for your purchase, ${user.name}!`);
      setCartItems([]);
      setLoading(false);
      onClose();
    }, 1500);
  };

  return (
    <div className="cart-overlay" onClick={onClose}>
      <div className="cart-container" onClick={(e) => e.stopPropagation()}>
        <div className="cart-header">
          <h2>🛒 Shopping Cart</h2>
          <button className="btn-close" onClick={onClose}>✕</button>
        </div>

        {cartItems.length === 0 ? (
          <div className="empty-cart">
            <p>🛒 Your cart is empty</p>
            <p className="empty-cart-subtitle">Start adding some fresh products!</p>
          </div>
        ) : (
          <>
            <div className="cart-items">
              {cartItems.map(item => (
                <div key={item.id} className="cart-item">
                  <div className="cart-item-image">
                    {item.image_path ? (
                      <img src={`${API_URL}${item.image_path}`} alt={item.product_name} />
                    ) : (
                      <div className="no-image">📷</div>
                    )}
                  </div>
                  
                  <div className="cart-item-details">
                    <h3>{item.product_name}</h3>
                    <p className="cart-item-category">{item.category}</p>
                    <p className="cart-item-price">${item.price} per {item.unit}</p>
                  </div>

                  <div className="cart-item-actions">
                    <div className="quantity-controls">
                      <button 
                        onClick={() => updateQuantity(item.id, item.quantity - 1)}
                        className="btn-quantity"
                      >
                        −
                      </button>
                      <span className="quantity-display">{item.quantity}</span>
                      <button 
                        onClick={() => updateQuantity(item.id, item.quantity + 1)}
                        className="btn-quantity"
                      >
                        +
                      </button>
                    </div>
                    
                    <p className="item-total">${(item.price * item.quantity).toFixed(2)}</p>
                    
                    <button 
                      onClick={() => removeFromCart(item.id)}
                      className="btn-remove"
                      title="Remove from cart"
                    >
                      🗑️
                    </button>
                  </div>
                </div>
              ))}
            </div>

            <div className="cart-footer">
              <div className="cart-summary">
                <div className="summary-row">
                  <span>Subtotal:</span>
                  <span>${calculateTotal()}</span>
                </div>
                <div className="summary-row">
                  <span>Delivery Fee:</span>
                  <span>$5.00</span>
                </div>
                <div className="summary-row total">
                  <span>Total:</span>
                  <span>${(parseFloat(calculateTotal()) + 5).toFixed(2)}</span>
                </div>
              </div>

              <div className="cart-actions">
                <button onClick={clearCart} className="btn-clear">
                  Clear Cart
                </button>
                <button 
                  onClick={handleCheckout} 
                  className="btn-checkout"
                  disabled={loading}
                >
                  {loading ? 'Processing...' : 'Checkout'}
                </button>
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default Cart;
