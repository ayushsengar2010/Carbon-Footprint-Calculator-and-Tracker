import { useState, useEffect } from 'react'
import { getAIRecommendations, getAIInsights } from '../utils/api'
import './AIRecommendations.css'

function AIRecommendations() {
  const [messages, setMessages] = useState([])
  const [loading, setLoading] = useState(false)
  const [activeTab, setActiveTab] = useState('recommendations')

  useEffect(() => {
    setMessages([{
      type: 'bot',
      content: 'Hello! I am your Carbon Footprint Assistant. Click the buttons below to get personalized recommendations or analyze your emission patterns.'
    }])
  }, [])

  const fetchRecommendations = async () => {
    setLoading(true)
    setMessages(prev => [...prev, { type: 'user', content: 'Show me recommendations to reduce my carbon footprint' }])
    
    try {
      const data = await getAIRecommendations()
      setMessages(prev => [...prev, { type: 'bot', content: data.recommendations }])
    } catch (err) {
      setMessages(prev => [...prev, { type: 'bot', content: 'Sorry, I could not fetch recommendations right now. Please try again later.' }])
    } finally {
      setLoading(false)
    }
  }

  const fetchInsights = async () => {
    setLoading(true)
    setMessages(prev => [...prev, { type: 'user', content: 'Analyze my carbon footprint data' }])
    
    try {
      const data = await getAIInsights()
      setMessages(prev => [...prev, { type: 'bot', content: data.insights }])
    } catch (err) {
      setMessages(prev => [...prev, { type: 'bot', content: 'Sorry, I could not analyze your data right now. Please try again later.' }])
    } finally {
      setLoading(false)
    }
  }

  const clearChat = () => {
    setMessages([{
      type: 'bot',
      content: 'Chat cleared. How can I help you with your carbon footprint today?'
    }])
  }

  return (
    <div className="ai-recommendations">
      <div className="ai-container">
        <h1>🤖 AI Carbon Assistant</h1>

        <div className="chat-wrapper">
          <div className="chat-tabs">
            <button 
              className={`tab-btn ${activeTab === 'recommendations' ? 'active' : ''}`}
              onClick={() => setActiveTab('recommendations')}
            >
              Recommendations
            </button>
            <button 
              className={`tab-btn ${activeTab === 'insights' ? 'active' : ''}`}
              onClick={() => setActiveTab('insights')}
            >
              Analysis
            </button>
          </div>

          <div className="chat-container">
            <div className="chat-messages">
              {messages.map((msg, index) => (
                <div key={index} className={`message ${msg.type}`}>
                  {msg.type === 'bot' && <span className="bot-icon">🤖</span>}
                  <div className="message-content">
                    {msg.content.split('\n').map((line, i) => (
                      <p key={i}>{line}</p>
                    ))}
                  </div>
                  {msg.type === 'user' && <span className="user-icon">👤</span>}
                </div>
              ))}
              {loading && (
                <div className="message bot">
                  <span className="bot-icon">🤖</span>
                  <div className="message-content typing">
                    <span></span><span></span><span></span>
                  </div>
                </div>
              )}
            </div>

            <div className="chat-actions">
              <button 
                onClick={fetchRecommendations} 
                disabled={loading}
                className="action-btn primary"
              >
                💡 Get Recommendations
              </button>
              <button 
                onClick={fetchInsights} 
                disabled={loading}
                className="action-btn secondary"
              >
                📊 Analyze My Data
              </button>
              <button 
                onClick={clearChat}
                disabled={loading}
                className="action-btn clear"
              >
                🗑️ Clear
              </button>
            </div>
          </div>
        </div>

        <div className="info-cards">
          <div className="info-card">
            <h3>💡 Smart Recommendations</h3>
            <p>Get personalized tips based on your activity patterns to reduce your environmental impact.</p>
          </div>
          <div className="info-card">
            <h3>📊 Data Analysis</h3>
            <p>Understand your emission breakdown and identify your biggest areas for improvement.</p>
          </div>
          <div className="info-card">
            <h3>🎯 Actionable Tips</h3>
            <p>Receive practical suggestions you can implement today to make a real difference.</p>
          </div>
        </div>
      </div>
    </div>
  )
}

export default AIRecommendations
