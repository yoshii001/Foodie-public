import { useState, useEffect } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'
import { FaBars, FaBell, FaSignOutAlt, FaTimes } from 'react-icons/fa'
import './Header.css'

const Header = ({ toggleSidebar, sidebarOpen }) => {
  const location = useLocation()
  const navigate = useNavigate()
  const [pageTitle, setPageTitle] = useState('Overview')
  const [notifications, setNotifications] = useState([])
  const [showNotifications, setShowNotifications] = useState(false)
  const [unreadCount, setUnreadCount] = useState(0)
  
  useEffect(() => {
    // Update to handle nested routes
    const pathSegments = location.pathname.split('/')
    const currentPath = pathSegments.length > 2 ? pathSegments[2] : 'overview'
    
    const formatTitle = (str) => {
      if (!str) return 'Overview'
      return str.split('-').map(word => 
        word.charAt(0).toUpperCase() + word.slice(1)
      ).join(' ')
    }
    
    setPageTitle(formatTitle(currentPath))
    
    // Fetch notifications (mock data for example)
    const fetchNotifications = () => {
      // In a real app, you would fetch from an API
      const mockNotifications = [
        { id: 1, text: 'New order #1234 received', time: '10 minutes ago', read: false },
        { id: 2, text: 'Customer left a 5-star review', time: '1 hour ago', read: true },
        { id: 3, text: 'Inventory low for 3 items', time: '3 hours ago', read: false }
      ]
      setNotifications(mockNotifications)
      setUnreadCount(mockNotifications.filter(n => !n.read).length)
    }
    
    fetchNotifications()
  }, [location.pathname])
  
  const toggleNotifications = () => {
    setShowNotifications(!showNotifications)
    // Mark as read when opening
    if (!showNotifications && unreadCount > 0) {
      setNotifications(notifications.map(n => ({ ...n, read: true })))
      setUnreadCount(0)
    }
  }
  
  const handleLogout = () => {
    // Clear authentication tokens
    localStorage.removeItem('token')
    localStorage.removeItem('user')
    // Redirect to login
    navigate('/merchants')
  }

  return (
    <header className="dashboard-header">
      <div className="header-left">
        <button 
          className="sidebar-toggle" 
          onClick={toggleSidebar}
          aria-label={sidebarOpen ? 'Close sidebar' : 'Open sidebar'}
        >
          {sidebarOpen ? <FaTimes /> : <FaBars />}
        </button>
        <h1 className="page-title">{pageTitle}</h1>
      </div>
      
      <div className="header-right">
        <div className="notifications-wrapper">
          <button 
            className={`notification-btn ${unreadCount > 0 ? 'has-unread' : ''}`}
            onClick={toggleNotifications}
            aria-label="Notifications"
            aria-expanded={showNotifications}
          >
            <FaBell />
            {unreadCount > 0 && (
              <span className="notification-badge">{unreadCount}</span>
            )}
          </button>
          
          {showNotifications && (
            <div className="notifications-dropdown">
              <div className="dropdown-header">
                <h3>Notifications</h3>
                <button 
                  className="close-dropdown"
                  onClick={() => setShowNotifications(false)}
                  aria-label="Close notifications"
                >
                  <FaTimes />
                </button>
              </div>
              <div className="notifications-list-container">
                {notifications.length > 0 ? (
                  <ul className="notifications-list">
                    {notifications.map(notification => (
                      <li 
                        key={notification.id} 
                        className={`notification-item ${!notification.read ? 'unread' : ''}`}
                      >
                        <p className="notification-text">{notification.text}</p>
                        <span className="notification-time">{notification.time}</span>
                      </li>
                    ))}
                  </ul>
                ) : (
                  <p className="no-notifications">No new notifications</p>
                )}
              </div>
              {notifications.length > 0 && (
                <button className="view-all-btn">View All Notifications</button>
              )}
            </div>
          )}
        </div>
        
        <button 
          className="logout-btn" 
          onClick={handleLogout}
          aria-label="Log out"
        >
          <FaSignOutAlt />
          <span className="logout-text">Logout</span>
        </button>
      </div>
    </header>
  )
}

export default Header