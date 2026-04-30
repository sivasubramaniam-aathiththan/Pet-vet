import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { orderAPI } from '../services/api';
import { toast } from 'react-toastify';

/**
 * Orders Page
 * 
 * Displays user's order history
 */
const Orders = () => {
  const navigate = useNavigate();
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedOrder, setSelectedOrder] = useState(null);

  useEffect(() => {
    fetchOrders();
  }, []);

  const fetchOrders = async () => {
    try {
      setLoading(true);
      const response = await orderAPI.getUserOrders();
      setOrders(response.data.data || []);
    } catch (error) {
      toast.error('Failed to load orders');
      console.error('Error loading orders:', error);
    } finally {
      setLoading(false);
    }
  };

  const getStatusColor = (status) => {
    const colors = {
      PENDING: { bg: '#fff3e0', text: '#e65100' },
      CONFIRMED: { bg: '#e3f2fd', text: '#1565c0' },
      PROCESSING: { bg: '#f3e5f5', text: '#7b1fa2' },
      SHIPPED: { bg: '#e8f5e9', text: '#2e7d32' },
      DELIVERED: { bg: '#c8e6c9', text: '#1b5e20' },
      CANCELLED: { bg: '#ffebee', text: '#c62828' },
      REFUNDED: { bg: '#fce4ec', text: '#ad1457' }
    };
    return colors[status] || { bg: '#f5f5f5', text: '#666' };
  };

  if (loading) {
    return (
      <div className="container">
        <div className="spinner-container">
          <div className="spinner"></div>
          <p className="loading-text">Loading orders...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="container">
      <div className="page-header">
        <div>
          <h1>📋 My Orders</h1>
          <p style={{ color: '#666', marginTop: '0.5rem' }}>
            View and track your order history
          </p>
        </div>
        <button className="btn btn-primary" onClick={() => navigate('/products')}>
          Continue Shopping
        </button>
      </div>

      {/* Orders List */}
      <div className="card">
        {orders.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '3rem' }}>
            <div style={{ fontSize: '4rem', marginBottom: '1rem' }}>📋</div>
            <h2>No orders yet</h2>
            <p style={{ color: '#666', marginBottom: '1.5rem' }}>
              Start shopping to see your orders here
            </p>
            <button className="btn btn-primary" onClick={() => navigate('/products')}>
              Browse Products
            </button>
          </div>
        ) : (
          <div>
            {orders.map((order) => {
              const statusColor = getStatusColor(order.status);
              return (
                <div
                  key={order.orderId}
                  style={{
                    border: '1px solid #e0e0e0',
                    borderRadius: '12px',
                    marginBottom: '1rem',
                    overflow: 'hidden'
                  }}
                >
                  {/* Order Header */}
                  <div
                    style={{
                      backgroundColor: '#f5f5f5',
                      padding: '1rem',
                      display: 'flex',
                      justifyContent: 'space-between',
                      alignItems: 'center',
                      flexWrap: 'wrap',
                      gap: '1rem'
                    }}
                  >
                    <div>
                      <p style={{ margin: 0, fontWeight: 'bold', fontSize: '1.1rem' }}>
                        Order #{order.orderId}
                      </p>
                      <p style={{ margin: '0.25rem 0 0 0', color: '#666', fontSize: '0.9rem' }}>
                        {new Date(order.createdAt).toLocaleDateString('en-US', {
                          year: 'numeric',
                          month: 'long',
                          day: 'numeric',
                          hour: '2-digit',
                          minute: '2-digit'
                        })}
                      </p>
                    </div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                      <span
                        style={{
                          backgroundColor: statusColor.bg,
                          color: statusColor.text,
                          padding: '0.5rem 1rem',
                          borderRadius: '20px',
                          fontWeight: '600',
                          fontSize: '0.9rem'
                        }}
                      >
                        {order.status}
                      </span>
                      <span style={{ fontWeight: 'bold', fontSize: '1.2rem' }}>
                        ${order.totalAmount?.toFixed(2)}
                      </span>
                    </div>
                  </div>

                  {/* Order Items */}
                  <div style={{ padding: '1rem' }}>
                    <div style={{ marginBottom: '0.5rem' }}>
                      <strong>{order.orderItems?.length || 0} item(s)</strong>
                    </div>
                    {order.orderItems?.slice(0, 2).map((item, index) => (
                      <div
                        key={index}
                        style={{
                          display: 'flex',
                          alignItems: 'center',
                          gap: '1rem',
                          padding: '0.5rem 0'
                        }}
                      >
                        <div
                          style={{
                            width: '40px',
                            height: '40px',
                            borderRadius: '4px',
                            overflow: 'hidden',
                            backgroundColor: '#f5f5f5'
                          }}
                        >
                          {item.productImageUrl ? (
                            <img
                              src={item.productImageUrl}
                              alt={item.productName}
                              style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                            />
                          ) : (
                            <div style={{ fontSize: '1.2rem', textAlign: 'center', lineHeight: '40px' }}>
                              📦
                            </div>
                          )}
                        </div>
                        <div style={{ flex: 1 }}>
                          <p style={{ margin: 0, fontSize: '0.9rem' }}>{item.productName}</p>
                          <p style={{ margin: 0, color: '#666', fontSize: '0.8rem' }}>
                            Qty: {item.quantity} × ${item.unitPrice?.toFixed(2)}
                          </p>
                        </div>
                        <p style={{ margin: 0, fontWeight: 'bold' }}>
                          ${item.subtotal?.toFixed(2)}
                        </p>
                      </div>
                    ))}
                    {order.orderItems?.length > 2 && (
                      <p style={{ margin: '0.5rem 0 0 0', color: '#666', fontSize: '0.9rem' }}>
                        + {order.orderItems.length - 2} more item(s)
                      </p>
                    )}
                  </div>

                  {/* Order Actions */}
                  <div
                    style={{
                      padding: '1rem',
                      borderTop: '1px solid #e0e0e0',
                      display: 'flex',
                      justifyContent: 'space-between',
                      alignItems: 'center'
                    }}
                  >
                    <div>
                      <p style={{ margin: 0, fontSize: '0.9rem', color: '#666' }}>
                        📍 {order.shippingAddress}
                      </p>
                      <p style={{ margin: '0.25rem 0 0 0', fontSize: '0.9rem', color: '#666' }}>
                        📞 {order.shippingPhone}
                      </p>
                    </div>
                    <button
                      className="btn btn-secondary btn-sm"
                      onClick={() => setSelectedOrder(order)}
                    >
                      View Details
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* Order Details Modal */}
      {selectedOrder && (
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
          onClick={() => setSelectedOrder(null)}
        >
          <div
            className="card"
            style={{ maxWidth: '600px', width: '90%', maxHeight: '90vh', overflow: 'auto' }}
            onClick={(e) => e.stopPropagation()}
          >
            <h2 style={{ marginBottom: '1rem' }}>Order Details #{selectedOrder.orderId}</h2>
            
            {/* Status */}
            <div style={{ marginBottom: '1.5rem' }}>
              <span
                style={{
                  backgroundColor: getStatusColor(selectedOrder.status).bg,
                  color: getStatusColor(selectedOrder.status).text,
                  padding: '0.5rem 1rem',
                  borderRadius: '20px',
                  fontWeight: '600'
                }}
              >
                {selectedOrder.status}
              </span>
            </div>

            {/* Order Items */}
            <div style={{ marginBottom: '1.5rem' }}>
              <h3 style={{ fontSize: '1.1rem', marginBottom: '1rem' }}>Items</h3>
              {selectedOrder.orderItems?.map((item, index) => (
                <div
                  key={index}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '1rem',
                    padding: '0.75rem 0',
                    borderBottom: '1px solid #e0e0e0'
                  }}
                >
                  <div
                    style={{
                      width: '50px',
                      height: '50px',
                      borderRadius: '4px',
                      overflow: 'hidden',
                      backgroundColor: '#f5f5f5'
                    }}
                  >
                    {item.productImageUrl ? (
                      <img
                        src={item.productImageUrl}
                        alt={item.productName}
                        style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                      />
                    ) : (
                      <div style={{ fontSize: '1.5rem', textAlign: 'center', lineHeight: '50px' }}>
                        📦
                      </div>
                    )}
                  </div>
                  <div style={{ flex: 1 }}>
                    <p style={{ margin: 0, fontWeight: '500' }}>{item.productName}</p>
                    <p style={{ margin: 0, color: '#666', fontSize: '0.9rem' }}>
                      {item.quantity} × ${item.unitPrice?.toFixed(2)}
                    </p>
                  </div>
                  <p style={{ margin: 0, fontWeight: 'bold' }}>${item.subtotal?.toFixed(2)}</p>
                </div>
              ))}
            </div>

            {/* Shipping Info */}
            <div style={{ marginBottom: '1.5rem' }}>
              <h3 style={{ fontSize: '1.1rem', marginBottom: '0.5rem' }}>Shipping Address</h3>
              <p style={{ margin: 0, color: '#666' }}>{selectedOrder.shippingAddress}</p>
              <p style={{ margin: '0.5rem 0 0 0', color: '#666' }}>📞 {selectedOrder.shippingPhone}</p>
            </div>

            {/* Order Notes */}
            {selectedOrder.orderNotes && (
              <div style={{ marginBottom: '1.5rem' }}>
                <h3 style={{ fontSize: '1.1rem', marginBottom: '0.5rem' }}>Order Notes</h3>
                <p style={{ margin: 0, color: '#666' }}>{selectedOrder.orderNotes}</p>
              </div>
            )}

            {/* Total */}
            <div
              style={{
                backgroundColor: '#f5f5f5',
                padding: '1rem',
                borderRadius: '8px',
                textAlign: 'right'
              }}
            >
              <p style={{ margin: 0, fontSize: '1.3rem', fontWeight: 'bold' }}>
                Total: ${selectedOrder.totalAmount?.toFixed(2)}
              </p>
            </div>

            {/* Date */}
            <p style={{ marginTop: '1rem', color: '#666', fontSize: '0.9rem' }}>
              Ordered on: {new Date(selectedOrder.createdAt).toLocaleDateString('en-US', {
                year: 'numeric',
                month: 'long',
                day: 'numeric',
                hour: '2-digit',
                minute: '2-digit'
              })}
            </p>

            <div style={{ marginTop: '1.5rem', textAlign: 'right' }}>
              <button className="btn btn-secondary" onClick={() => setSelectedOrder(null)}>
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Orders;
