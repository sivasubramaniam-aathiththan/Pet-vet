import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { cartAPI, orderAPI, productAPI } from '../services/api';
import { toast } from 'react-toastify';

/**
 * Cart Page
 * 
 * Displays user's shopping cart
 * Users can view items, update quantities, and place orders
 */
const Cart = () => {
  const navigate = useNavigate();
  const [cart, setCart] = useState(null);
  const [loading, setLoading] = useState(true);
  const [showCheckout, setShowCheckout] = useState(false);
  const [checkoutData, setCheckoutData] = useState({
    shippingAddress: '',
    shippingPhone: '',
    orderNotes: ''
  });
  const [placingOrder, setPlacingOrder] = useState(false);

  useEffect(() => {
    fetchCart();
  }, []);

  const fetchCart = async () => {
    try {
      setLoading(true);
      const response = await cartAPI.getCart();
      setCart(response.data.data);
    } catch (error) {
      toast.error('Failed to load cart');
      console.error('Error loading cart:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleUpdateQuantity = async (cartItemId, quantity) => {
    try {
      if (quantity < 1) {
        await handleRemoveItem(cartItemId);
        return;
      }
      const response = await cartAPI.updateQuantity(cartItemId, quantity);
      setCart(response.data.data);
      toast.success('Cart updated');
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to update quantity');
    }
  };

  const handleRemoveItem = async (cartItemId) => {
    try {
      const response = await cartAPI.removeItem(cartItemId);
      setCart(response.data.data);
      toast.success('Item removed from cart');
    } catch (error) {
      toast.error('Failed to remove item');
    }
  };

  const handleClearCart = async () => {
    if (!window.confirm('Are you sure you want to clear your cart?')) return;
    try {
      await cartAPI.clearCart();
      fetchCart();
      toast.success('Cart cleared');
    } catch (error) {
      toast.error('Failed to clear cart');
    }
  };

  const handleCheckoutChange = (e) => {
    setCheckoutData({
      ...checkoutData,
      [e.target.name]: e.target.value
    });
  };

  const handlePlaceOrder = async (e) => {
    e.preventDefault();
    try {
      setPlacingOrder(true);
      const response = await orderAPI.placeOrder(checkoutData);
      toast.success('Order placed successfully!');
      setShowCheckout(false);
      setCheckoutData({ shippingAddress: '', shippingPhone: '', orderNotes: '' });
      navigate('/orders');
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to place order');
    } finally {
      setPlacingOrder(false);
    }
  };

  if (loading) {
    return (
      <div className="container">
        <div className="spinner-container">
          <div className="spinner"></div>
          <p className="loading-text">Loading cart...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="container">
      <div className="page-header">
        <div>
          <h1>🛒 Shopping Cart</h1>
          <p style={{ color: '#666', marginTop: '0.5rem' }}>
            Review your items and proceed to checkout
          </p>
        </div>
        {cart && cart.cartItems && cart.cartItems.length > 0 && (
          <button className="btn btn-secondary" onClick={handleClearCart}>
            Clear Cart
          </button>
        )}
      </div>

      {/* Cart Summary */}
      {cart && cart.cartItems && cart.cartItems.length > 0 && (
        <div className="stats-grid">
          <div className="stat-card stat-card-info">
            <div className="stat-icon">📦</div>
            <div className="stat-value">{cart.totalItemCount}</div>
            <div className="stat-label">Total Items</div>
          </div>
          <div className="stat-card stat-card-success">
            <div className="stat-icon">💰</div>
            <div className="stat-value">${cart.totalAmount?.toFixed(2)}</div>
            <div className="stat-label">Total Amount</div>
          </div>
        </div>
      )}

      {/* Cart Items */}
      <div className="card">
        {!cart || !cart.cartItems || cart.cartItems.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '3rem' }}>
            <div style={{ fontSize: '4rem', marginBottom: '1rem' }}>🛒</div>
            <h2>Your cart is empty</h2>
            <p style={{ color: '#666', marginBottom: '1.5rem' }}>
              Start shopping to add items to your cart
            </p>
            <button className="btn btn-primary" onClick={() => navigate('/products')}>
              Browse Products
            </button>
          </div>
        ) : (
          <div>
            {cart.cartItems.map((item) => (
              <div
                key={item.cartItemId}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  padding: '1rem',
                  borderBottom: '1px solid #e0e0e0',
                  gap: '1rem'
                }}
              >
                {/* Product Image */}
                <div
                  style={{
                    width: '80px',
                    height: '80px',
                    borderRadius: '8px',
                    overflow: 'hidden',
                    backgroundColor: '#f5f5f5',
                    flexShrink: 0
                  }}
                >
                  {item.productImageUrl ? (
                    <img
                      src={item.productImageUrl}
                      alt={item.productName}
                      style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                    />
                  ) : (
                    <div style={{ fontSize: '2rem', textAlign: 'center', lineHeight: '80px' }}>
                      📦
                    </div>
                  )}
                </div>

                {/* Product Info */}
                <div style={{ flex: 1 }}>
                  <h3 style={{ margin: '0 0 0.5rem 0', fontSize: '1.1rem' }}>
                    {item.productName}
                  </h3>
                  <p style={{ margin: 0, color: '#666', fontSize: '0.9rem' }}>
                    ${item.unitPrice?.toFixed(2)} each
                  </p>
                </div>

                {/* Quantity Controls */}
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                  <button
                    className="btn btn-secondary btn-sm"
                    onClick={() => handleUpdateQuantity(item.cartItemId, item.quantity - 1)}
                  >
                    -
                  </button>
                  <span style={{ minWidth: '30px', textAlign: 'center' }}>{item.quantity}</span>
                  <button
                    className="btn btn-secondary btn-sm"
                    onClick={() => handleUpdateQuantity(item.cartItemId, item.quantity + 1)}
                  >
                    +
                  </button>
                </div>

                {/* Subtotal */}
                <div style={{ minWidth: '100px', textAlign: 'right' }}>
                  <p style={{ margin: 0, fontWeight: 'bold', fontSize: '1.1rem' }}>
                    ${item.subtotal?.toFixed(2)}
                  </p>
                </div>

                {/* Remove Button */}
                <button
                  className="btn btn-danger btn-sm"
                  onClick={() => handleRemoveItem(item.cartItemId)}
                  style={{ padding: '0.5rem' }}
                >
                  🗑️
                </button>
              </div>
            ))}

            {/* Checkout Button */}
            <div style={{ marginTop: '1.5rem', textAlign: 'right' }}>
              <button
                className="btn btn-primary"
                onClick={() => setShowCheckout(true)}
                style={{ padding: '1rem 2rem', fontSize: '1.1rem' }}
              >
                Proceed to Checkout 💳
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Checkout Modal */}
      {showCheckout && (
        <div
          style={{
            position: 'fixed',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            backgroundColor: 'rgba(0,0,0,0.5)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            zIndex: 1000
          }}
          onClick={() => setShowCheckout(false)}
        >
          <div
            className="card"
            style={{ maxWidth: '500px', width: '90%', maxHeight: '90vh', overflow: 'auto' }}
            onClick={(e) => e.stopPropagation()}
          >
            <h2 style={{ marginBottom: '1.5rem' }}>Checkout</h2>
            
            {/* Order Summary */}
            <div
              style={{
                backgroundColor: '#f5f5f5',
                padding: '1rem',
                borderRadius: '8px',
                marginBottom: '1.5rem'
              }}
            >
              <p style={{ margin: '0 0 0.5rem 0', fontWeight: 'bold' }}>Order Summary</p>
              <p style={{ margin: 0, fontSize: '1.2rem' }}>
                Total: <strong>${cart?.totalAmount?.toFixed(2)}</strong>
              </p>
              <p style={{ margin: '0.5rem 0 0 0', fontSize: '0.9rem', color: '#666' }}>
                {cart?.totalItemCount} items
              </p>
            </div>

            <form onSubmit={handlePlaceOrder}>
              <div style={{ marginBottom: '1rem' }}>
                <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: '500' }}>
                  Shipping Address *
                </label>
                <textarea
                  name="shippingAddress"
                  value={checkoutData.shippingAddress}
                  onChange={handleCheckoutChange}
                  required
                  rows={3}
                  style={{
                    width: '100%',
                    padding: '0.75rem',
                    borderRadius: '8px',
                    border: '1px solid #ddd',
                    fontSize: '1rem',
                    fontFamily: 'inherit'
                  }}
                  placeholder="Enter your shipping address"
                />
              </div>

              <div style={{ marginBottom: '1rem' }}>
                <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: '500' }}>
                  Phone Number *
                </label>
                <input
                  type="tel"
                  name="shippingPhone"
                  value={checkoutData.shippingPhone}
                  onChange={handleCheckoutChange}
                  required
                  style={{
                    width: '100%',
                    padding: '0.75rem',
                    borderRadius: '8px',
                    border: '1px solid #ddd',
                    fontSize: '1rem'
                  }}
                  placeholder="Enter your phone number"
                />
              </div>

              <div style={{ marginBottom: '1.5rem' }}>
                <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: '500' }}>
                  Order Notes (Optional)
                </label>
                <textarea
                  name="orderNotes"
                  value={checkoutData.orderNotes}
                  onChange={handleCheckoutChange}
                  rows={2}
                  style={{
                    width: '100%',
                    padding: '0.75rem',
                    borderRadius: '8px',
                    border: '1px solid #ddd',
                    fontSize: '1rem',
                    fontFamily: 'inherit'
                  }}
                  placeholder="Any special instructions"
                />
              </div>

              <div style={{ display: 'flex', gap: '1rem', justifyContent: 'flex-end' }}>
                <button
                  type="button"
                  className="btn btn-secondary"
                  onClick={() => setShowCheckout(false)}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="btn btn-primary"
                  disabled={placingOrder}
                >
                  {placingOrder ? 'Placing Order...' : 'Place Order'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default Cart;
