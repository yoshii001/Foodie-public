import React, { useState } from 'react';
import { 
  Menu, 
  Bell, 
  ShoppingCart,
  Search,
  X
} from 'lucide-react';
import './Dashboard.css';

const Header = ({ toggleSidebar, sidebarOpen, cartCount, toggleCart }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [showNotifications, setShowNotifications] = useState(false);
  const [notifications] = useState([
    { id: 1, text: 'Your order #1234 has been confirmed!', time: '10 minutes ago', read: false },
    { id: 2, text: 'Special discount on your favorite restaurant', time: '1 hour ago', read: true },
    { id: 3, text: '20% off on your next order with code FOODIE20', time: '3 hours ago', read: false }
  ]);

  const unreadCount = notifications.filter(n => !n.read).length;

  const handleSearch = (e) => {
    e.preventDefault();
    // Handle search logic here
    console.log('Searching for:', searchTerm);
  };

  const toggleNotifications = () => {
    setShowNotifications(!showNotifications);
  };

  return (
    <header className="client-header">
      <div className="header-left">
        <button 
          className="menu-toggle" 
          onClick={toggleSidebar}
          aria-label={sidebarOpen ? "Close menu" : "Open menu"}
        >
          <Menu size={24} />
        </button>

        <form className="search-form" onSubmit={handleSearch}>
          <div className="search-input-container">
            <Search size={18} className="search-icon" />
            <input
              type="text"
              placeholder="Search for restaurants or dishes..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="search-input"
            />
            {searchTerm && (
              <button 
                type="button" 
                className="clear-search" 
                onClick={() => setSearchTerm('')}
                aria-label="Clear search"
              >
                <X size={16} />
              </button>
            )}
          </div>
          <button type="submit" className="search-button">Search</button>
        </form>
      </div>

      <div className="header-right">
        <div className="notification-container">
          <button 
            className={`notification-btn ${unreadCount > 0 ? 'has-unread' : ''}`} 
            onClick={toggleNotifications}
            aria-label="Notifications"
          >
            <Bell size={24} />
            {unreadCount > 0 && <span className="notification-badge">{unreadCount}</span>}
          </button>

          {showNotifications && (
            <div className="notifications-dropdown">
              <div className="notifications-header">
                <h3>Notifications</h3>
                <button 
                  onClick={toggleNotifications}
                  aria-label="Close notifications"
                >
                  <X size={18} />
                </button>
              </div>
              <div className="notifications-list">
                {notifications.length > 0 ? (
                  notifications.map(notification => (
                    <div 
                      key={notification.id} 
                      className={`notification-item ${!notification.read ? 'unread' : ''}`}
                    >
                      <p>{notification.text}</p>
                      <span className="notification-time">{notification.time}</span>
                    </div>
                  ))
                ) : (
                  <p className="no-notifications">No new notifications</p>
                )}
              </div>
              {notifications.length > 0 && (
                <button className="view-all-btn">View All</button>
              )}
            </div>
          )}
        </div>

        <button 
          className="cart-btn" 
          onClick={toggleCart}
          aria-label="Shopping cart"
        >
          <ShoppingCart size={24} />
          {cartCount > 0 && <span className="cart-badge">{cartCount}</span>}
        </button>
      </div>
    </header>
  );
};

export default Header;