import axios from 'axios'
import { useState, useEffect } from 'react'
import { FaMapMarkedAlt, FaMapPin } from 'react-icons/fa'
import './Location.css'

const Location = () => {
  const [restaurant, setRestaurant] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchLocationData = async () => {
      try {
        const token = localStorage.getItem("token")
        const response = await axios.get("http://localhost:8000/restaurants/my-restaurants", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        })

        const restaurant = response.data.restaurants[0] 
        if (restaurant) {
          setRestaurant(restaurant)
        } else {
          setRestaurant(null)
        }
      } catch (error) {
        console.error("Failed to fetch restaurant location:", error)
        setRestaurant(null)
      } finally {
        setLoading(false)
      }
    }

    fetchLocationData()

    // Load Leaflet CSS (for later real map integration)
    const link = document.createElement('link')
    link.rel = 'stylesheet'
    link.href = 'https://unpkg.com/leaflet@1.9.4/dist/leaflet.css'
    document.head.appendChild(link)

    return () => {
      document.head.removeChild(link)
    }
  }, [])

  const MapPlaceholder = ({ lat, lng }) => (
    <div className="map-placeholder">
      <div className="map-pin">
        <FaMapPin />
      </div>
      <div className="map-info">
        <p>Map centered at coordinates: {lat}, {lng}</p>
        <p>This is a placeholder for a real map.</p>
      </div>
    </div>
  )

  const formatAddress = (address) => {
    if (!address) return "Address not available"
    return `${address.street}, ${address.city}, ${address.state} ${address.zipCode}, ${address.country}`
  }

  if (loading) return <div className="loading">Loading location information...</div>
  if (!restaurant) return <div className="loading">No restaurant location found.</div>

  return (
    <div className="location-container">
      <div className="location-header">
        <h2>
          <FaMapMarkedAlt /> Restaurant Location
        </h2>
      </div>

      <div className="location-content">
        <div className="address-card">
          <h3>Address Information</h3>
          <p className="full-address">{restaurant.address}</p>
          <div className="coords">
            <span>Coordinates: </span>
            <span>{restaurant.location?.latitude}, {restaurant.location?.longitude}</span>
          </div>
        </div>

        <div className="delivery-card">
          <h3>Delivery Information</h3>
          <div className="delivery-info">
            <div className="info-item">
              <label>Delivery Radius</label>
              <p>{restaurant.deliveryArea || "N/A"}</p>
            </div>
            <div className="info-item">
              <label>Delivery Fee</label>
              <p>${(restaurant.deliveryFee || 0).toFixed(2)}</p>
            </div>
            <div className="info-item">
              <label>Free Delivery Minimum</label>
              <p>${(restaurant.minimumOrderForFreeDelivery || 0).toFixed(2)}</p>
            </div>
          </div>
        </div>

        <div className="map-card">
          <h3>Map View</h3>
          <div className="map-container">
            <MapPlaceholder 
              lat={restaurant.location?.latitude} 
              lng={restaurant.location?.longitude} 
            />
          </div>
        </div>
      </div>
    </div>
  )
}

export default Location
