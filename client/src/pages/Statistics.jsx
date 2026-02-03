import { useState, useEffect } from 'react'
import { getStats, getActivities } from '../utils/api'
import { Line, Pie, Bar } from 'react-chartjs-2'
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  ArcElement,
  Title,
  Tooltip,
  Legend
} from 'chart.js'
import './Statistics.css'

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  ArcElement,
  Title,
  Tooltip,
  Legend
)

function Statistics() {
  const [stats, setStats] = useState(null)
  const [activities, setActivities] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchData()
  }, [])

  const fetchData = async () => {
    try {
      const [statsData, activitiesData] = await Promise.all([
        getStats(),
        getActivities()
      ])
      setStats(statsData)
      setActivities(activitiesData)
    } catch (error) {
      console.error('Error fetching data:', error)
    } finally {
      setLoading(false)
    }
  }

  if (loading) {
    return <div className="loading">Loading statistics...</div>
  }

  const pieData = {
    labels: Object.keys(stats.byType).map(t => t.charAt(0).toUpperCase() + t.slice(1)),
    datasets: [
      {
        data: Object.values(stats.byType),
        backgroundColor: [
          '#667eea',
          '#764ba2',
          '#f093fb',
          '#4facfe',
          '#43e97b'
        ],
        borderWidth: 2,
        borderColor: '#fff'
      }
    ]
  }

  const last7Days = activities
    .slice(0, 7)
    .reverse()
    .map(a => ({
      date: new Date(a.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
      footprint: a.carbonFootprint
    }))

  const lineData = {
    labels: last7Days.map(d => d.date),
    datasets: [
      {
        label: 'Daily Carbon Footprint (kg CO2)',
        data: last7Days.map(d => d.footprint),
        borderColor: '#667eea',
        backgroundColor: 'rgba(102, 126, 234, 0.1)',
        tension: 0.4,
        fill: true
      }
    ]
  }

  const typeBreakdown = Object.entries(stats.byType).map(([type, value]) => ({
    type: type.charAt(0).toUpperCase() + type.slice(1),
    value
  }))

  const barData = {
    labels: typeBreakdown.map(t => t.type),
    datasets: [
      {
        label: 'Carbon Footprint by Type (kg CO2)',
        data: typeBreakdown.map(t => t.value),
        backgroundColor: [
          'rgba(102, 126, 234, 0.8)',
          'rgba(118, 75, 162, 0.8)',
          'rgba(240, 147, 251, 0.8)',
          'rgba(79, 172, 254, 0.8)',
          'rgba(67, 233, 123, 0.8)'
        ],
        borderColor: [
          '#667eea',
          '#764ba2',
          '#f093fb',
          '#4facfe',
          '#43e97b'
        ],
        borderWidth: 2
      }
    ]
  }

  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'bottom'
      }
    }
  }

  return (
    <div className="statistics">
      <div className="statistics-container">
        <h1>Statistics & Analytics</h1>

        <div className="stats-overview">
          <div className="overview-card">
            <h3>Total Emissions</h3>
            <p className="big-number">{stats.totalFootprint.toFixed(2)}</p>
            <span>kg CO2</span>
          </div>
          <div className="overview-card">
            <h3>This Month</h3>
            <p className="big-number">{stats.monthlyFootprint.toFixed(2)}</p>
            <span>kg CO2</span>
          </div>
          <div className="overview-card">
            <h3>Average per Activity</h3>
            <p className="big-number">
              {(stats.totalFootprint / stats.activityCount || 0).toFixed(2)}
            </p>
            <span>kg CO2</span>
          </div>
        </div>

        <div className="charts-grid">
          <div className="chart-card">
            <h2>Emissions by Category</h2>
            <div className="chart-container">
              <Pie data={pieData} options={chartOptions} />
            </div>
          </div>

          <div className="chart-card">
            <h2>Category Breakdown</h2>
            <div className="chart-container">
              <Bar data={barData} options={chartOptions} />
            </div>
          </div>

          <div className="chart-card full-width">
            <h2>Recent Activity Trend</h2>
            <div className="chart-container">
              <Line data={lineData} options={chartOptions} />
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Statistics
