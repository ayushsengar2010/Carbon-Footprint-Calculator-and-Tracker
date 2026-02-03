import { Link, useNavigate } from 'react-router-dom'
import './Navbar.css'

function Navbar({ onLogout }) {
  const navigate = useNavigate()
  const user = JSON.parse(localStorage.getItem('user') || '{}')

  const handleLogout = () => {
    onLogout()
    navigate('/login')
  }

  return (
    <nav className="navbar">
      <div className="navbar-container">
        <Link to="/dashboard" className="navbar-logo">
          🌍 Carbon Tracker
        </Link>
        <div className="navbar-menu">
          <Link to="/dashboard" className="navbar-link">Dashboard</Link>
          <Link to="/add-activity" className="navbar-link">Add Activity</Link>
          <Link to="/statistics" className="navbar-link">Statistics</Link>
          <Link to="/ai-recommendations" className="navbar-link">AI Insights</Link>
          <div className="navbar-user">
            <span>👤 {user.name}</span>
            <button onClick={handleLogout} className="logout-btn">Logout</button>
          </div>
        </div>
      </div>
    </nav>
  )
}

export default Navbar
