import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { getActivities, deleteActivity, getStats, addActivity } from '../utils/api'
import './Dashboard.css'

function Dashboard() {
  const [activities, setActivities] = useState([])
  const [stats, setStats] = useState(null)
  const [loading, setLoading] = useState(true)
  const [quickAddLoading, setQuickAddLoading] = useState(false)
  const navigate = useNavigate()

  useEffect(() => {
    fetchData()
  }, [])

  const fetchData = async () => {
    try {
      const [activitiesData, statsData] = await Promise.all([
        getActivities(),
        getStats()
      ])
      setActivities(activitiesData)
      setStats(statsData)
    } catch (error) {
      console.error('Error fetching data:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this activity?')) {
      try {
        await deleteActivity(id)
        fetchData()
      } catch (error) {
        console.error('Error deleting activity:', error)
      }
    }
  }

  const handleEdit = (id) => {
    navigate(`/edit-activity/${id}`)
  }

  const quickAdd = async (type, category, amount, unit) => {
    setQuickAddLoading(true)
    try {
      await addActivity({ type, category, amount, unit })
      fetchData()
    } catch (error) {
      console.error('Error adding activity:', error)
    } finally {
      setQuickAddLoading(false)
    }
  }

  const formatDate = (date) => {
    return new Date(date).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    })
  }

  const getTypeIcon = (type) => {
    const icons = {
      transportation: '🚗',
      electricity: '⚡',
      food: '🍽️',
      waste: '🗑️',
      water: '💧'
    }
    return icons[type] || '📊'
  }

  if (loading) {
    return <div className="loading">Loading...</div>
  }

  return (
    <div className="dashboard">
      <div className="dashboard-container">
        <h1>Dashboard</h1>
        
        {stats && (
          <div className="stats-grid">
            <div className="stat-card">
              <h3>Total Footprint</h3>
              <p className="stat-value">{stats.totalFootprint.toFixed(2)}</p>
              <span className="stat-unit">kg CO2</span>
            </div>
            <div className="stat-card">
              <h3>This Month</h3>
              <p className="stat-value">{stats.monthlyFootprint.toFixed(2)}</p>
              <span className="stat-unit">kg CO2</span>
            </div>
            <div className="stat-card">
              <h3>Activities Logged</h3>
              <p className="stat-value">{stats.activityCount}</p>
              <span className="stat-unit">total</span>
            </div>
            <div className="stat-card">
              <h3>Average per Activity</h3>
              <p className="stat-value">{stats.activityCount > 0 ? (stats.totalFootprint / stats.activityCount).toFixed(2) : '0.00'}</p>
              <span className="stat-unit">kg CO2</span>
            </div>
          </div>
        )}

        <div className="quick-add-section">
          <h2>Quick Add</h2>
          <div className="quick-add-buttons">
            <button 
              onClick={() => quickAdd('transportation', 'car', 10, 'km')}
              disabled={quickAddLoading}
              className="quick-btn"
            >
              🚗 10km Drive
            </button>
            <button 
              onClick={() => quickAdd('transportation', 'bus', 15, 'km')}
              disabled={quickAddLoading}
              className="quick-btn"
            >
              🚌 15km Bus
            </button>
            <button 
              onClick={() => quickAdd('electricity', 'kwh', 5, 'kwh')}
              disabled={quickAddLoading}
              className="quick-btn"
            >
              ⚡ 5 kWh
            </button>
            <button 
              onClick={() => quickAdd('food', 'meat', 0.3, 'kg')}
              disabled={quickAddLoading}
              className="quick-btn"
            >
              🥩 Meat Meal
            </button>
            <button 
              onClick={() => quickAdd('food', 'vegetables', 0.5, 'kg')}
              disabled={quickAddLoading}
              className="quick-btn"
            >
              🥗 Veggie Meal
            </button>
            <button 
              onClick={() => navigate('/add-activity')}
              className="quick-btn add-custom"
            >
              ➕ Custom
            </button>
          </div>
        </div>

        <div className="activities-section">
          <h2>Recent Activities</h2>
          {activities.length === 0 ? (
            <p className="no-data">No activities logged yet. Start tracking your carbon footprint!</p>
          ) : (
            <div className="activities-list">
              {activities.map(activity => (
                <div key={activity._id} className="activity-card">
                  <div className="activity-header">
                    <span className="activity-type">
                      {getTypeIcon(activity.type)} {activity.type}
                    </span>
                    <span className="activity-date">{formatDate(activity.date)}</span>
                  </div>
                  <div className="activity-details">
                    <p><strong>{activity.category.charAt(0).toUpperCase() + activity.category.slice(1)}</strong></p>
                    <p>{activity.amount} {activity.unit}</p>
                    {activity.description && <p className="activity-description">{activity.description}</p>}
                  </div>
                  <div className="activity-footer">
                    <span className="activity-footprint">
                      {activity.carbonFootprint.toFixed(2)} kg CO2
                    </span>
                    <div className="activity-actions">
                      <button 
                        onClick={() => handleEdit(activity._id)}
                        className="edit-btn"
                      >
                        Edit
                      </button>
                      <button 
                        onClick={() => handleDelete(activity._id)}
                        className="delete-btn"
                      >
                        Delete
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

export default Dashboard
