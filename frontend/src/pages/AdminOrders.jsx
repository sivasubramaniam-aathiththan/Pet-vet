import { useEffect, useState } from 'react';
import { orderAPI } from '../services/api';
import { toast } from 'react-toastify';

/**
 * Admin Orders Page
 * 
 * Admin can view and manage all orders
 */
const AdminOrders = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [statusFilter, setStatusFilter] = useState('ALL');

  const orderStatuses = ['ALL', 'PENDING', 'CONFIRMED', 'PROCESSING', 'SHIPPED', 'DELIVERED', 'CANCELLED', 'REFUNDED'];

  useEffect(() => {
    fetchOrders();
  }, []);

  useEffect(() => {
    if (statusFilter === 'ALL') {
      fetchOrders();
    } else {
      fetchOrdersByStatus(statusFilter);
    }
  }, [statusFilter]);

  const fetchOrders = async () => {
    try {
      setLoading(true);
      const response = await orderAPI.getAllOrders();
      setOrders(response.data.data || []);
    } catch (error) {
      toast.error('Failed to load orders');
      console.error('Error loading orders:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchOrdersByStatus = async (status) => {
    try {
      setLoading(true);
      const response = await orderAPI.getOrdersByStatus(status);
      setOrders(response.data.data || []);
    } catch (error) {
      toast.error('Failed to load orders');
      console.error('Error loading orders:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleUpdateStatus = async (orderId, newStatus) => {
    try {
      await orderAPI.updateOrderStatus(orderId, { status: newStatus });
      toast.success('Order status updated');
      fetchOrders();
      setSelectedOrder(null);
    } catch (error) {
      toast.error('Failed to update order status');
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
          <h1>📦 Order Management</h1>
          <p style={{ color: '#666', marginTop: '0.5rem' }}>
            View and manage all customer orders
          </p>
        </div>
      </div>

      {/* Summary Stats */}
      <div className="stats-grid">
        <div className="stat-card stat-card-info">
          <div className="stat-icon">📋</div>
          <div className="stat-value">{orders.length}</div>
          <div className="stat-label">Total Orders</div>
        </div>
        <div className="stat-card stat-card-warning">
          <div className="stat-icon">⏳</div>
          <div className="stat-value">
            {orders.filter(o => o.status === 'PENDING').length}
          </div>
          <div className="stat-label">Pending</div>
        </div>
        <div className="stat-card stat-card-success">
          <div className="stat-icon">✅</div>
          <div className="stat-value">
            {orders.filter(o => o.status === 'DELIVERED').length}
          </div>
          <div className="stat-label">Delivered</div>
        </div>
        <div className="stat-card stat-card-danger">
          <div className="stat-icon">❌</div>
          <div className="stat-value">
            {orders.filter(o => o.status === 'CANCELLED').length}
          </div>
          <div className="stat-label">Cancelled</div>
        </div>
      </div>

      {/* Status Filter */}
      <div className="card">
        <div style={{ marginBottom: '1rem' }}>
          <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: '500' }}>
            Filter by Status
          </label>
          <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
            {orderStatuses.map((status) => (
              <button
                key={status}
                className={`btn ${statusFilter === status ? 'btn-primary' : 'btn-secondary'} btn-sm`}
                onClick={() => setStatusFilter(status)}
              >
                {status === 'ALL' ? 'All Orders' : status}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Orders Table */}
      <div className="card">
        {orders.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '2rem' }}>
            <p style={{ fontSize: '1.1rem', color: '#666' }}>
              No orders found
            </p>
          </div>
        ) : (
          <div style={{ overflowX: 'auto' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse' }}>
              <thead>
                <tr style={{ borderBottom: '2px solid #e0e0e0' }}>
                  <th style={{ padding: '1rem', textAlign: 'left' }}>Order ID</th>
                  <th style={{ padding: '1rem', textAlign: 'left' }}>Customer</th>
                  <th style={{ padding: '1rem', textAlign: 'left' }}>Items</th>
                  <th style={{ padding: '1rem', textAlign: 'left' }}>Total</th>
                  <th style={{ padding: '1rem', textAlign: 'left' }}>Status</th>
                  <th style={{ padding: '1rem', textAlign: 'left' }}>Date</th>
                  <th style={{ padding: '1rem', textAlign: 'left' }}>Actions</th>
                </tr>
              </thead>
              <tbody>
                {orders.map((order) => {
                  const statusColor = getStatusColor(order.status);
                  return (
                    <tr key={order.orderId} style={{ borderBottom: '1px solid #e0e0e0' }}>
                      <td style={{ padding: '1rem' }}>#{order.orderId}</td>
                      <td style={{ padding: '1rem' }}>
                        <p style={{ margin: 0, fontWeight: '500' }}>{order.userName}</p>
                        <p style={{ margin: '0.25rem 0 0 0', fontSize: '0.8rem', color: '#666' }}>
                          {order.userEmail}
                        </p>
                      </td>
                      <td style={{ padding: '1rem' }}>
                        {order.orderItems?.length || 0} item(s)
                      </td>
                      <td style={{ padding: '1rem', fontWeight: 'bold' }}>
                        ${order.totalAmount?.toFixed(2)}
                      </td>
                      <td style={{ padding: '1rem' }}>
                        <span
                          style={{
                            backgroundColor: statusColor.bg,
                            color: statusColor.text,
                            padding: '0.25rem 0.75rem',
                            borderRadius: '20px',
                            fontSize: '0.8rem',
                            fontWeight: '600'
                          }}
                        >
                          {order.status}
                        </span>
                      </td>
                      <td style={{ padding: '1rem', fontSize: '0.9rem', color: '#666' }}>
                        {new Date(order.createdAt).toLocaleDateString()}
                      </td>
                      <td style={{ padding: '1rem' }}>
                        <button
                          className="btn btn-secondary btn-sm"
                          onClick={() => setSelectedOrder(order)}
                        >
                          View & Manage
                        </button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
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
            style={{ maxWidth: '700px', width: '90%', maxHeight: '90vh', overflow: 'auto' }}
            onClick={(e) => e.stopPropagation()}
          >
            <h2 style={{ marginBottom: '1rem' }}>Order #{selectedOrder.orderId}</h2>
            
            {/* Customer Info */}
            <div style={{ marginBottom: '1.5rem' }}>
              <h3 style={{ fontSize: '1rem', marginBottom: '0.5rem', color: '#666' }}>Customer Information</h3>
              <p style={{ margin: 0, fontWeight: '500' }}>{selectedOrder.userName}</p>
              <p style={{ margin: '0.25rem 0 0 0', color: '#666' }}>{selectedOrder.userEmail}</p>
            </div>

            {/* Status */}
            <div style={{ marginBottom: '1.5rem' }}>
              <h3 style={{ fontSize: '1rem', marginBottom: '0.5rem', color: '#666' }}>Current Status</h3>
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

            {/* Update Status */}
            <div style={{ marginBottom: '1.5rem' }}>
              <h3 style={{ fontSize: '1rem', marginBottom: '0.5rem', color: '#666' }}>Update Status</h3>
              <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
                {orderStatuses.filter(s => s !== 'ALL').map((status) => (
                  <button
                    key={status}
                    className={`btn ${selectedOrder.status === status ? 'btn-primary' : 'btn-secondary'} btn-sm`}
                    onClick={() => handleUpdateStatus(selectedOrder.orderId, status)}
                    disabled={selectedOrder.status === status}
                  >
                    {status}
                  </button>
                ))}
              </div>
            </div>

            {/* Order Items */}
            <div style={{ marginBottom: '1.5rem' }}>
              <h3 style={{ fontSize: '1rem', marginBottom: '0.5rem', color: '#666' }}>Order Items</h3>
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
              <div style={{ marginTop: '1rem', textAlign: 'right' }}>
                <p style={{ margin: 0, fontSize: '1.2rem', fontWeight: 'bold' }}>
                  Total: ${selectedOrder.totalAmount?.toFixed(2)}
                </p>
              </div>
            </div>

            {/* Shipping Info */}
            <div style={{ marginBottom: '1.5rem' }}>
              <h3 style={{ fontSize: '1rem', marginBottom: '0.5rem', color: '#666' }}>Shipping Address</h3>
              <p style={{ margin: 0 }}>{selectedOrder.shippingAddress}</p>
              <p style={{ margin: '0.5rem 0 0 0' }}>📞 {selectedOrder.shippingPhone}</p>
            </div>

            {/* Order Notes */}
            {selectedOrder.orderNotes && (
              <div style={{ marginBottom: '1.5rem' }}>
                <h3 style={{ fontSize: '1rem', marginBottom: '0.5rem', color: '#666' }}>Order Notes</h3>
                <p style={{ margin: 0 }}>{selectedOrder.orderNotes}</p>
              </div>
            )}

            {/* Date */}
            <p style={{ color: '#666', fontSize: '0.9rem' }}>
              Ordered: {new Date(selectedOrder.createdAt).toLocaleString()}
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

export default AdminOrders;
