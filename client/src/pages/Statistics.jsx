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
  Legend,
  Filler
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
  Legend,
  Filler
)

function Statistics() {
  const [stats, setStats] = useState(null)
  const [activities, setActivities] = useState([])
  const [loading, setLoading] = useState(true)
  const [timeRange, setTimeRange] = useState('week')

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

  const getDateRange = (range) => {
    const now = new Date()
    const dates = []
    const days = range === 'week' ? 7 : range === 'month' ? 30 : 90
    
    for (let i = days - 1; i >= 0; i--) {
      const date = new Date(now)
      date.setDate(date.getDate() - i)
      dates.push(date.toISOString().split('T')[0])
    }
    return dates
  }

  const aggregateByDate = (dates) => {
    const aggregated = {}
    dates.forEach(d => aggregated[d] = 0)
    
    activities.forEach(a => {
      const date = new Date(a.date).toISOString().split('T')[0]
      if (aggregated.hasOwnProperty(date)) {
        aggregated[date] += a.carbonFootprint
      }
    })
    
    return dates.map(d => aggregated[d])
  }

  const calculateComparison = () => {
    const now = new Date()
    const oneWeekAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000)
    const twoWeeksAgo = new Date(now.getTime() - 14 * 24 * 60 * 60 * 1000)
    
    const thisWeek = activities
      .filter(a => new Date(a.date) >= oneWeekAgo)
      .reduce((sum, a) => sum + a.carbonFootprint, 0)
    
    const lastWeek = activities
      .filter(a => new Date(a.date) >= twoWeeksAgo && new Date(a.date) < oneWeekAgo)
      .reduce((sum, a) => sum + a.carbonFootprint, 0)
    
    if (lastWeek === 0) return { change: 0, trend: 'neutral' }
    
    const change = ((thisWeek - lastWeek) / lastWeek * 100).toFixed(1)
    const trend = thisWeek < lastWeek ? 'down' : thisWeek > lastWeek ? 'up' : 'neutral'
    
    return { change: Math.abs(change), trend }
  }

  if (loading) {
    return <div className="loading">Loading statistics...</div>
  }

  if (!stats || activities.length === 0) {
    return (
      <div className="statistics">
        <div className="statistics-container">
          <h1>Statistics & Analytics</h1>
          <div className="no-data-card">
            <h2>No Data Yet</h2>
            <p>Start logging activities to see your carbon footprint statistics and trends.</p>
          </div>
        </div>
      </div>
    )
  }

  const comparison = calculateComparison()
  const dateRange = getDateRange(timeRange)
  const dailyData = aggregateByDate(dateRange)

  const pieData = {
    labels: Object.keys(stats.byType).map(t => t.charAt(0).toUpperCase() + t.slice(1)),
    datasets: [{
      data: Object.values(stats.byType),
      backgroundColor: ['#667eea', '#764ba2', '#f093fb', '#4facfe', '#43e97b'],
      borderWidth: 2,
      borderColor: '#fff'
    }]
  }

  const lineData = {
    labels: dateRange.map(d => {
      const date = new Date(d)
      return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })
    }),
    datasets: [{
      label: 'Daily Carbon Footprint (kg CO2)',
      data: dailyData,
      borderColor: '#667eea',
      backgroundColor: 'rgba(102, 126, 234, 0.15)',
      tension: 0.4,
      fill: true,
      pointBackgroundColor: '#667eea',
      pointBorderColor: '#fff',
      pointBorderWidth: 2
    }]
  }

  const barData = {
    labels: Object.keys(stats.byType).map(t => t.charAt(0).toUpperCase() + t.slice(1)),
    datasets: [{
      label: 'Carbon Footprint by Category (kg CO2)',
      data: Object.values(stats.byType),
      backgroundColor: [
        'rgba(102, 126, 234, 0.85)',
        'rgba(118, 75, 162, 0.85)',
        'rgba(240, 147, 251, 0.85)',
        'rgba(79, 172, 254, 0.85)',
        'rgba(67, 233, 123, 0.85)'
      ],
      borderColor: ['#667eea', '#764ba2', '#f093fb', '#4facfe', '#43e97b'],
      borderWidth: 2,
      borderRadius: 8
    }]
  }

  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: { position: 'bottom', labels: { padding: 20 } }
    },
    scales: {
      y: { beginAtZero: true, grid: { color: 'rgba(0,0,0,0.05)' } },
      x: { grid: { display: false } }
    }
  }

  const pieOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: { legend: { position: 'right', labels: { padding: 15 } } }
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
            <h3>Weekly Trend</h3>
            <p className={`big-number trend-${comparison.trend}`}>
              {comparison.trend === 'down' ? '↓' : comparison.trend === 'up' ? '↑' : '→'} {comparison.change}%
            </p>
            <span>{comparison.trend === 'down' ? 'Lower than last week' : comparison.trend === 'up' ? 'Higher than last week' : 'Same as last week'}</span>
          </div>
          <div className="overview-card">
            <h3>Average per Activity</h3>
            <p className="big-number">
              {(stats.totalFootprint / stats.activityCount || 0).toFixed(2)}
            </p>
            <span>kg CO2</span>
          </div>
        </div>

        <div className="time-filter">
          <button className={timeRange === 'week' ? 'active' : ''} onClick={() => setTimeRange('week')}>7 Days</button>
          <button className={timeRange === 'month' ? 'active' : ''} onClick={() => setTimeRange('month')}>30 Days</button>
          <button className={timeRange === 'quarter' ? 'active' : ''} onClick={() => setTimeRange('quarter')}>90 Days</button>
        </div>

        <div className="charts-grid">
          <div className="chart-card">
            <h2>Emissions by Category</h2>
            <div className="chart-container">
              <Pie data={pieData} options={pieOptions} />
            </div>
          </div>

          <div className="chart-card">
            <h2>Category Breakdown</h2>
            <div className="chart-container">
              <Bar data={barData} options={chartOptions} />
            </div>
          </div>

          <div className="chart-card full-width">
            <h2>Emissions Over Time</h2>
            <div className="chart-container line-chart">
              <Line data={lineData} options={chartOptions} />
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Statistics
