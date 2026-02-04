import axios from 'axios'

const API_URL = 'http://localhost:5000/api'

const getAuthHeader = () => {
  const token = localStorage.getItem('token')
  return token ? { Authorization: `Bearer ${token}` } : {}
}

export const register = async (userData) => {
  const response = await axios.post(`${API_URL}/users/register`, userData)
  return response.data
}

export const login = async (credentials) => {
  const response = await axios.post(`${API_URL}/users/login`, credentials)
  return response.data
}

export const addActivity = async (activityData) => {
  const response = await axios.post(`${API_URL}/activities`, activityData, {
    headers: getAuthHeader()
  })
  return response.data
}

export const getActivities = async () => {
  const response = await axios.get(`${API_URL}/activities`, {
    headers: getAuthHeader()
  })
  return response.data
}

export const getStats = async () => {
  const response = await axios.get(`${API_URL}/activities/stats`, {
    headers: getAuthHeader()
  })
  return response.data
}

export const deleteActivity = async (id) => {
  const response = await axios.delete(`${API_URL}/activities/${id}`, {
    headers: getAuthHeader()
  })
  return response.data
}

export const getAIRecommendations = async () => {
  const response = await axios.post(`${API_URL}/ai/recommendations`, {}, {
    headers: getAuthHeader()
  })
  return response.data
}

export const getAIInsights = async () => {
  const response = await axios.post(`${API_URL}/ai/insights`, {}, {
    headers: getAuthHeader()
  })
  return response.data
}

export const updateActivity = async (id, activityData) => {
  const response = await axios.put(`${API_URL}/activities/${id}`, activityData, {
    headers: getAuthHeader()
  })
  return response.data
}

export const getActivity = async (id) => {
  const response = await axios.get(`${API_URL}/activities/${id}`, {
    headers: getAuthHeader()
  })
  return response.data
}

export const getProfile = async () => {
  const response = await axios.get(`${API_URL}/users/profile`, {
    headers: getAuthHeader()
  })
  return response.data
}

export const updateProfile = async (profileData) => {
  const response = await axios.put(`${API_URL}/users/profile`, profileData, {
    headers: getAuthHeader()
  })
  return response.data
}

export const changePassword = async (passwordData) => {
  const response = await axios.put(`${API_URL}/users/change-password`, passwordData, {
    headers: getAuthHeader()
  })
  return response.data
}
