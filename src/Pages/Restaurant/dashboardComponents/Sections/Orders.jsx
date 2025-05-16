import { useState, useEffect } from 'react';
import { FaFilter, FaCheck, FaTimes, FaSpinner, FaSave } from 'react-icons/fa';
import axios from 'axios';
import './Orders.css';
import { jwtDecode } from 'jwt-decode';

const Orders = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('all');
  const [error, setError] = useState(null);
  const [userNames, setUserNames] = useState({}); // Map userId -> name
  const [statusUpdates, setStatusUpdates] = useState({}); // Map orderId -> new status

  const STATUS_OPTIONS = ["pending", "confirmed", "preparing", "delivering", "delivered", "completed", "cancelled"];

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        setLoading(true);
        setError(null);

        const token = localStorage.getItem('token');
        const decoded = jwtDecode(token);

        const restaurantRes = await axios.get('http://localhost:8000/restaurants/my-restaurants', {
          headers: { Authorization: `Bearer ${token}` }
        });

        const restaurant = restaurantRes.data.restaurants?.[0];
        if (!restaurant) {
          setError('No restaurant found for this user.');
          setLoading(false);
          return;
        }

        const ordersRes = await axios.get(`http://localhost:8000/orders/orders-by-restaurant/${restaurant._id}`, {
          headers: { Authorization: `Bearer ${token}` }
        });

        setOrders(ordersRes.data);

        // Fetch user names
        const userIds = [...new Set(ordersRes.data.map(order => order.userId))];
        const userNameMap = {};
        for (const id of userIds) {
          try {
            const userRes = await axios.get(`http://localhost:8000/users/${id}`, {
              headers: { Authorization: `Bearer ${token}` }
            });
            userNameMap[id] = userRes.data.name;
          } catch {
            userNameMap[id] = 'Unknown User';
          }
        }
        setUserNames(userNameMap);
      } catch (err) {
        console.error('Failed to load orders:', err);
        setError('Failed to load orders.');
      } finally {
        setLoading(false);
      }
    };

    fetchOrders();
  }, []);

  const handleFilterChange = (newFilter) => setFilter(newFilter);

  const handleStatusChange = (orderId, newStatus) => {
    setStatusUpdates(prev => ({ ...prev, [orderId]: newStatus }));
  };

  const handleUpdateStatus = async (orderId) => {
    const token = localStorage.getItem('token');
    const newStatus = statusUpdates[orderId];
    try {
      const res = await axios.put(
        `http://localhost:8000/orders/update-status/${orderId}`,
        { orderStatus: newStatus },
        {
          headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json'
          }
        }
      );
      setOrders(prev =>
        prev.map(order => (order._id === orderId ? res.data : order))
      );
      alert('Order status updated!');
    } catch (err) {
      console.error('Update failed:', err);
      alert('Failed to update status.');
    }
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleString('en-US', {
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case 'completed':
        return <FaCheck className="status-icon completed" />;
      case 'in-progress':
      case 'preparing':
      case 'confirmed':
      case 'delivering':
        return <FaSpinner className="status-icon in-progress" />;
      case 'pending':
        return <FaSpinner className="status-icon pending" />;
      case 'cancelled':
        return <FaTimes className="status-icon cancelled" />;
      default:
        return null;
    }
  };

  const filteredOrders = filter === 'all'
    ? orders
    : orders.filter(order => order.orderStatus === filter);

  return (
    <div className="orders-container">
      <div className="orders-header">
        <h2>Order Management</h2>
        <div className="filter-dropdown">
          <button className="filter-btn">
            <FaFilter /> Filter <span className="current-filter">{filter}</span>
          </button>
          <div className="filter-options">
            {["all", ...STATUS_OPTIONS].map(status => (
              <button
                key={status}
                className={`filter-option ${filter === status ? 'active' : ''}`}
                onClick={() => handleFilterChange(status)}
              >
                {status.charAt(0).toUpperCase() + status.slice(1)}
              </button>
            ))}
          </div>
        </div>
      </div>

      {loading ? (
        <div className="loading">Loading orders...</div>
      ) : error ? (
        <div className="error">{error}</div>
      ) : (
        <div className="orders-list">
          {filteredOrders.length > 0 ? (
            filteredOrders.map(order => (
              <div key={order._id} className={`order-card ${order.orderStatus}`}>
                <div className="order-header">
                  <div className="order-id-date">
                    <h3 className="order-id">#{order._id.slice(-5)}</h3>
                    <p className="order-date">{formatDate(order.createdAt)}</p>
                  </div>
                  <div className="order-status">
                    {getStatusIcon(order.orderStatus)}
                    <span className="status-text">{order.orderStatus}</span>
                  </div>
                </div>
                <div className="order-customer">
                  <p><strong>Customer:</strong> {userNames[order.userId] || order.userId}</p>
                  <p><strong>Payment:</strong> {order.paymentMethod}</p>
                </div>
                <div className="order-items">
                  <h4>Items</h4>
                  <ul className="item-list">
                    {order.items.map((item, index) => (
                      <li key={index} className="order-item">
                        <span className="item-quantity">{item.quantity}x</span>
                        <span className="item-name">{item.name}</span>
                        <span className="item-price">Rs. {(item.price * item.quantity).toFixed(2)}</span>
                      </li>
                    ))}
                  </ul>
                </div>
                <div className="order-footer">
                  <p className="order-total">
                    <strong>Total:</strong> Rs. {order.totalAmount.toFixed(2)}
                  </p>
                  <div className="order-actions">
                    <select
                      value={statusUpdates[order._id] || order.orderStatus}
                      onChange={(e) => handleStatusChange(order._id, e.target.value)}
                      className="status-select"
                    >
                      {STATUS_OPTIONS.map(status => (
                        <option key={status} value={status}>
                          {status.charAt(0).toUpperCase() + status.slice(1)}
                        </option>
                      ))}
                    </select>
                    <button
                      className="order-action-btn save"
                      onClick={() => handleUpdateStatus(order._id)}
                    >
                      <FaSave /> Update
                    </button>
                  </div>
                </div>
              </div>
            ))
          ) : (
            <div className="no-orders">
              No orders found matching the selected filter.
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default Orders;
