import { useState, useEffect } from 'react'
import { getActivities, deleteActivity, getStats } from '../utils/api'
import './Dashboard.css'

function Dashboard() {
  const [activities, setActivities] = useState([])
  const [stats, setStats] = useState(null)
  const [loading, setLoading] = useState(true)

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

  const formatDate = (date) => {
    return new Date(date).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    })
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
          </div>
        )}

        <div className="activities-section">
          <h2>Recent Activities</h2>
          {activities.length === 0 ? (
            <p className="no-data">No activities logged yet. Start tracking your carbon footprint!</p>
          ) : (
            <div className="activities-list">
              {activities.map(activity => (
                <div key={activity._id} className="activity-card">
                  <div className="activity-header">
                    <span className="activity-type">{activity.type}</span>
                    <span className="activity-date">{formatDate(activity.date)}</span>
                  </div>
                  <div className="activity-details">
                    <p><strong>{activity.category}</strong></p>
                    <p>{activity.amount} {activity.unit}</p>
                    {activity.description && <p className="activity-description">{activity.description}</p>}
                  </div>
                  <div className="activity-footer">
                    <span className="activity-footprint">
                      {activity.carbonFootprint.toFixed(2)} kg CO2
                    </span>
                    <button 
                      onClick={() => handleDelete(activity._id)}
                      className="delete-btn"
                    >
                      Delete
                    </button>
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
