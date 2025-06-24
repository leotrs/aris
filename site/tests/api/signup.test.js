import { describe, it, expect, vi, beforeEach } from 'vitest'
import axios from 'axios'

// Create mock axios instance
const mockAxiosInstance = {
  post: vi.fn(),
  get: vi.fn(),
  interceptors: {
    request: { use: vi.fn() },
    response: { use: vi.fn() }
  }
}

// Mock axios
vi.mock('axios', () => ({
  default: {
    create: vi.fn(() => mockAxiosInstance),
  }
}))

// Import after mocking
const { signupUser } = await import('../../composables/useApi.js')

describe('Signup API Service', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  describe('signupUser', () => {
    const validSignupData = {
      email: 'test@example.com',
      name: 'Dr. Jane Doe',
      institution: 'University of Science',
      research_area: 'Computational Biology',
      interest_level: 'ready'
    }

    it('should make POST request to correct endpoint with proper data', async () => {
      const mockResponse = {
        data: {
          id: 1,
          email: 'test@example.com',
          name: 'Dr. Jane Doe',
          institution: 'University of Science',
          research_area: 'Computational Biology',
          interest_level: 'ready',
          status: 'active',
          unsubscribe_token: 'abc123',
          created_at: '2025-01-15T10:30:00Z'
        }
      }

      mockAxiosInstance.post.mockResolvedValueOnce(mockResponse)

      const result = await signupUser(validSignupData)

      expect(mockAxiosInstance.post).toHaveBeenCalledWith('/api/signup/', validSignupData)
      expect(result).toEqual(mockResponse.data)
    })

    it('should handle duplicate email error (409)', async () => {
      const errorResponse = {
        response: {
          status: 409,
          data: {
            detail: {
              error: 'duplicate_email',
              message: 'This email address is already registered for early access',
              details: { field: 'email' }
            }
          }
        }
      }

      mockAxiosInstance.post.mockRejectedValueOnce(errorResponse)

      await expect(signupUser(validSignupData)).rejects.toMatchObject({
        status: 409,
        error: 'duplicate_email',
        message: 'This email address is already registered for early access'
      })
    })

    it('should handle validation errors (400)', async () => {
      const errorResponse = {
        response: {
          status: 400,
          data: {
            detail: {
              error: 'validation_error',
              message: 'Name is required',
              details: { field: 'name' }
            }
          }
        }
      }

      mockAxiosInstance.post.mockRejectedValueOnce(errorResponse)

      await expect(signupUser(validSignupData)).rejects.toMatchObject({
        status: 400,
        error: 'validation_error',
        message: 'Name is required'
      })
    })

    it('should handle network errors', async () => {
      const networkError = new Error('Network Error')
      mockAxiosInstance.post.mockRejectedValueOnce(networkError)

      await expect(signupUser(validSignupData)).rejects.toMatchObject({
        status: 0,
        error: 'network_error',
        message: 'Unable to connect to server. Please check your internet connection.'
      })
    })

    it('should handle server errors (500)', async () => {
      const errorResponse = {
        response: {
          status: 500,
          data: {
            detail: {
              error: 'internal_error',
              message: 'An unexpected error occurred. Please try again later.'
            }
          }
        }
      }

      mockAxiosInstance.post.mockRejectedValueOnce(errorResponse)

      await expect(signupUser(validSignupData)).rejects.toMatchObject({
        status: 500,
        error: 'internal_error',
        message: 'An unexpected error occurred. Please try again later.'
      })
    })

    it('should sanitize null values in request data', async () => {
      const dataWithNulls = {
        email: 'test@example.com',
        name: 'Dr. Jane Doe',
        institution: '',
        research_area: '',
        interest_level: ''
      }

      const expectedSanitizedData = {
        email: 'test@example.com',
        name: 'Dr. Jane Doe',
        institution: null,
        research_area: null,
        interest_level: null
      }

      const mockResponse = { data: { id: 1 } }
      mockAxiosInstance.post.mockResolvedValueOnce(mockResponse)

      await signupUser(dataWithNulls)

      expect(mockAxiosInstance.post).toHaveBeenCalledWith('/api/signup/', expectedSanitizedData)
    })
  })
})