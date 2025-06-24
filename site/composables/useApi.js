import axios from 'axios'

// Configure axios instance
const api = axios.create({
  baseURL: process.env.NODE_ENV === 'production' ? 'https://api.aris.pub' : 'http://localhost:8000',
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  }
})

// Request interceptor to log requests in development
api.interceptors.request.use(
  (config) => {
    if (process.env.NODE_ENV === 'development') {
      console.log(`API Request: ${config.method?.toUpperCase()} ${config.url}`, config.data)
    }
    return config
  },
  (error) => Promise.reject(error)
)

// Response interceptor to handle common error cases
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (process.env.NODE_ENV === 'development') {
      console.error('API Error:', error.response?.status, error.response?.data)
    }
    return Promise.reject(error)
  }
)

// Data structures matching backend API (JSDoc comments for documentation)
/**
 * @typedef {Object} SignupData
 * @property {string} email
 * @property {string} name
 * @property {string|null} [institution]
 * @property {string|null} [research_area]
 * @property {string|null} [interest_level]
 */

/**
 * @typedef {Object} SignupResponse
 * @property {number} id
 * @property {string} email
 * @property {string} name
 * @property {string|null} institution
 * @property {string|null} research_area
 * @property {string|null} interest_level
 * @property {string} status
 * @property {string} unsubscribe_token
 * @property {string} created_at
 */

/**
 * @typedef {Object} ApiError
 * @property {number} status
 * @property {string} error
 * @property {string} message
 * @property {any} [details]
 */

// Utility function to sanitize form data
function sanitizeSignupData(data) {
  return {
    email: data.email.trim(),
    name: data.name.trim(),
    institution: data.institution?.trim() || null,
    research_area: data.research_area?.trim() || null,
    interest_level: data.interest_level || null,
  }
}

// Utility function to normalize API errors
function normalizeApiError(error) {
  // Network error (no response)
  if (!error.response) {
    return {
      status: 0,
      error: 'network_error',
      message: 'Unable to connect to server. Please check your internet connection.'
    }
  }

  const { status, data } = error.response

  // Backend error with structured response
  if (data?.detail) {
    return {
      status,
      error: data.detail.error || 'api_error',
      message: data.detail.message || 'An error occurred',
      details: data.detail.details
    }
  }

  // Fallback for unexpected error formats
  return {
    status,
    error: 'unknown_error',
    message: data?.message || 'An unexpected error occurred'
  }
}

/**
 * Sign up a new user for early access
 * @param {SignupData} data - The signup data
 * @returns {Promise<SignupResponse>} The signup response
 */
export async function signupUser(data) {
  try {
    const sanitizedData = sanitizeSignupData(data)
    const response = await api.post('/api/signup/', sanitizedData)
    return response.data
  } catch (error) {
    throw normalizeApiError(error)
  }
}

/**
 * Check if an email is already registered
 * @param {string} email - Email to check
 * @returns {Promise<boolean>} Whether email exists
 */
export async function checkEmailExists(email) {
  try {
    const response = await api.get(`/api/signup/status?email=${encodeURIComponent(email)}`)
    return response.data.exists
  } catch (error) {
    throw normalizeApiError(error)
  }
}

export default api