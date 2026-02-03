import { useState, useEffect } from 'react'
import { getAIRecommendations, getAIInsights } from '../utils/api'
import './AIRecommendations.css'

function AIRecommendations() {
  const [recommendations, setRecommendations] = useState('')
  const [insights, setInsights] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const fetchRecommendations = async () => {
    setLoading(true)
    setError('')
    try {
      const data = await getAIRecommendations()
      setRecommendations(data.recommendations)
    } catch (err) {
      setError('Unable to get recommendations. Please try again later.')
    } finally {
      setLoading(false)
    }
  }

  const fetchInsights = async () => {
    setLoading(true)
    setError('')
    try {
      const data = await getAIInsights()
      setInsights(data.insights)
    } catch (err) {
      setError('Unable to get insights. Please try again later.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="ai-recommendations">
      <div className="ai-container">
        <h1>🤖 AI-Powered Insights</h1>

        <div className="ai-section">
          <div className="ai-card">
            <h2>Personalized Recommendations</h2>
            <p className="ai-description">
              Get AI-generated suggestions to reduce your carbon footprint based on your activity patterns.
            </p>
            <button 
              onClick={fetchRecommendations} 
              disabled={loading}
              className="ai-button"
            >
              {loading ? 'Generating...' : 'Get Recommendations'}
            </button>
            
            {recommendations && (
              <div className="ai-result">
                <h3>Your Recommendations:</h3>
                <div className="ai-content">
                  {recommendations.split('\n').map((line, index) => (
                    <p key={index}>{line}</p>
                  ))}
                </div>
              </div>
            )}
          </div>

          <div className="ai-card">
            <h2>Carbon Footprint Analysis</h2>
            <p className="ai-description">
              Get detailed insights about your emission patterns and areas for improvement.
            </p>
            <button 
              onClick={fetchInsights} 
              disabled={loading}
              className="ai-button"
            >
              {loading ? 'Analyzing...' : 'Get Insights'}
            </button>
            
            {insights && (
              <div className="ai-result">
                <h3>Your Analysis:</h3>
                <div className="ai-content">
                  {insights.split('\n').map((line, index) => (
                    <p key={index}>{line}</p>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>

        {error && (
          <div className="error-box">
            <p>{error}</p>
          </div>
        )}

        <div className="info-box">
          <h3>💡 About AI Integration</h3>
          <p>
            This feature can use AI (via OpenRouter) to analyze your carbon footprint data 
            and provide personalized, actionable recommendations. The AI considers your 
            activity patterns, emission sources, and trends to give you the most relevant 
            suggestions for reducing your environmental impact.
          </p>
          <p style={{ marginTop: '1rem', fontSize: '0.9rem', color: '#888' }}>
            Note: AI features work without an API key by providing general recommendations. 
            For personalized AI analysis, add your OpenRouter API key to the backend .env file.
          </p>
        </div>
      </div>
    </div>
  )
}

export default AIRecommendations
