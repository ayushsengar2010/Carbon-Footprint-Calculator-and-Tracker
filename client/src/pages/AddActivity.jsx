import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { addActivity } from '../utils/api'
import './AddActivity.css'

function AddActivity() {
  const [formData, setFormData] = useState({
    type: 'transportation',
    category: 'car',
    amount: '',
    unit: 'km',
    description: ''
  })
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const navigate = useNavigate()

  const categories = {
    transportation: {
      options: ['car', 'bus', 'train', 'flight', 'bike'],
      units: ['km', 'miles']
    },
    electricity: {
      options: ['kwh'],
      units: ['kwh']
    },
    food: {
      options: ['meat', 'dairy', 'vegetables', 'grains'],
      units: ['kg', 'servings']
    },
    waste: {
      options: ['landfill', 'recycling'],
      units: ['kg']
    },
    water: {
      options: ['liter'],
      units: ['liter', 'gallons']
    }
  }

  const handleChange = (e) => {
    const { name, value } = e.target
    
    if (name === 'type') {
      setFormData({
        ...formData,
        type: value,
        category: categories[value].options[0],
        unit: categories[value].units[0]
      })
    } else {
      setFormData({
        ...formData,
        [name]: value
      })
    }
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')
    setLoading(true)

    try {
      await addActivity({
        ...formData,
        amount: parseFloat(formData.amount)
      })
      navigate('/dashboard')
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to add activity')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="add-activity">
      <div className="add-activity-container">
        <div className="add-activity-card">
          <h1>Add New Activity</h1>
          {error && <div className="error-message">{error}</div>}
          
          <form onSubmit={handleSubmit}>
            <div className="form-group">
              <label>Activity Type</label>
              <select name="type" value={formData.type} onChange={handleChange}>
                <option value="transportation">Transportation</option>
                <option value="electricity">Electricity</option>
                <option value="food">Food</option>
                <option value="waste">Waste</option>
                <option value="water">Water</option>
              </select>
            </div>

            <div className="form-group">
              <label>Category</label>
              <select name="category" value={formData.category} onChange={handleChange}>
                {categories[formData.type].options.map(option => (
                  <option key={option} value={option}>
                    {option.charAt(0).toUpperCase() + option.slice(1)}
                  </option>
                ))}
              </select>
            </div>

            <div className="form-row">
              <div className="form-group">
                <label>Amount</label>
                <input
                  type="number"
                  name="amount"
                  value={formData.amount}
                  onChange={handleChange}
                  step="0.01"
                  min="0"
                  required
                />
              </div>

              <div className="form-group">
                <label>Unit</label>
                <select name="unit" value={formData.unit} onChange={handleChange}>
                  {categories[formData.type].units.map(unit => (
                    <option key={unit} value={unit}>{unit}</option>
                  ))}
                </select>
              </div>
            </div>

            <div className="form-group">
              <label>Description (Optional)</label>
              <textarea
                name="description"
                value={formData.description}
                onChange={handleChange}
                rows="3"
                placeholder="Add any additional notes..."
              />
            </div>

            <div className="form-actions">
              <button type="button" onClick={() => navigate('/dashboard')} className="cancel-btn">
                Cancel
              </button>
              <button type="submit" disabled={loading}>
                {loading ? 'Adding...' : 'Add Activity'}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  )
}

export default AddActivity
