import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { FaUtensils, FaShoppingCart, FaStar } from 'react-icons/fa'
import axios from 'axios'
import './Overview.css'
import StatusCard from '../UI/StatusCard'
import LineChart from '../UI/LineChart'

const Overview = () => {
  const [restaurant, setRestaurant] = useState({
    name: 'Loading...',
    rating: 4.8,
    totalOrders: 3,
    menuItems: 5
  })
  
  const [recentOrders, setRecentOrders] = useState([])
  const [loading, setLoading] = useState(true)
  const navigate = useNavigate()
  
  useEffect(() => {
    const fetchRestaurantData = async () => {
      try {
        const token = localStorage.getItem('token')
        const response = await axios.get(
          "http://localhost:8000/restaurants/my-restaurants", 
          {
            headers: {
              Authorization: `Bearer ${token}`
            }
          }
        )
    
        const restaurantData = response.data.restaurants[0]
        if (restaurantData) {
          setRestaurant(prev => ({
            ...prev,
            name: restaurantData.name
          }))
        }
      } catch (error) {
        console.error('Error fetching restaurant data:', error)
        setRestaurant(prev => ({
          ...prev,
          name: 'Error Loading'
        }))
      } finally {
        setLoading(false)
      }
    }
    
    const fetchRecentOrders = () => {
      // Simulate API call to fetch orders
      setTimeout(() => {
        setRecentOrders([
          { id: 1, customer: 'Chaveen Wijesinghe', items: 3, total: 42.50, status: 'Completed', time: '12:30 PM' },
          { id: 2, customer: 'Janith Takshila', items: 2, total: 28.75, status: 'In Progress', time: '12:45 PM' },
          { id: 3, customer: 'Wathsala Sinhalage', items: 4, total: 56.20, status: 'Completed', time: '1:15 PM' },
          { id: 4, customer: 'Chaveen Sewni', items: 1, total: 18.90, status: 'Pending', time: '1:30 PM' }
        ])
      }, 1000)
    }
    
    fetchRestaurantData()
    fetchRecentOrders()
  }, [])

  const cards = [
    {
      title: 'Total Orders',
      value: restaurant.totalOrders,
      icon: <FaShoppingCart />,
      color: 'var(--button)'
    },
    {
      title: 'Rating',
      value: restaurant.rating,
      icon: <FaStar />,
      color: 'var(--button-hover)'
    },
    {
      title: 'Menu Items',
      value: restaurant.menuItems,
      icon: <FaUtensils />,
      color: 'var(--hover)'
    }
  ]

  const handleOrderClick = () => {
    navigate('/restaurant/orders')
  }

  return (
    <div className="overview-container">
      <div className="welcome-section">
        <h2>Welcome to {restaurant.name}</h2>
        <p className="subtitle">Here's what's happening with your restaurant today</p>
      </div>
      
      <div className="stats-cards">
        {cards.map((card, index) => (
          <StatusCard 
            key={index}
            title={card.title}
            value={card.value}
            icon={card.icon}
            color={card.color}
          />
        ))}
      </div>
      
      <div className="overview-charts">
        <div className="chart-container">
          <h3>Weekly Sales</h3>
          <LineChart />
        </div>
      </div>
      
      <div className="recent-orders">
        <h3>Recent Orders</h3>
        {loading ? (
          <p>Loading recent orders...</p>
        ) : (
          <div className="orders-table-container">
            <table className="orders-table">
              <thead>
                <tr>
                  <th>Order ID</th>
                  <th>Customer</th>
                  <th>Items</th>
                  <th>Total</th>
                  <th>Status</th>
                  <th>Time</th>
                </tr>
              </thead>
              <tbody>
                {recentOrders.map(order => (
                  <tr key={order.id}>
                    <td>#{order.id}</td>
                    <td>{order.customer}</td>
                    <td>{order.items}</td>
                    <td>${order.total.toFixed(2)}</td>
                    <td>
                      <span className={`status-badge ${order.status.toLowerCase().replace(' ', '-')}`}>
                        {order.status}
                      </span>
                    </td>
                    <td>{order.time}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
        <button className="view-all-btn" onClick={handleOrderClick}>View All Orders</button>
      </div>
    </div>
  )
}

export default Overview