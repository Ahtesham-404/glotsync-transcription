import axios, {
  type AxiosInstance,
  type InternalAxiosRequestConfig,
  type AxiosResponse,
  AxiosError,
} from 'axios'
import { auth } from './firebase'
import { keysToCamel } from './caseTransform'

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8000'

const apiClient: AxiosInstance = axios.create({
  baseURL: API_BASE_URL,
  timeout: 60000,
  headers: {
    'Content-Type': 'application/json',
  },
})

// Request interceptor: attach Firebase ID token and keep multipart intact
apiClient.interceptors.request.use(
  async (config: InternalAxiosRequestConfig) => {
    const user = auth.currentUser
    if (user) {
      try {
        // Force token refresh if it will expire within 5 minutes
        const token = await user.getIdToken(false)
        config.headers.Authorization = `Bearer ${token}`
      } catch {
        // Token refresh failed — 401 handler below will sign the user out
      }
    }
    return config
  },
  (error: AxiosError) => Promise.reject(error)
)

// Response interceptor: transform snake_case → camelCase and handle 401
apiClient.interceptors.response.use(
  (response: AxiosResponse) => {
    // Transform response data keys to camelCase
    const contentType = response.headers['content-type']
    const isJson =
      typeof contentType === 'string'
        ? contentType.includes('application/json')
        : Array.isArray(contentType)
          ? contentType.some((v) => typeof v === 'string' && v.includes('application/json'))
          : false

    if (response.data && typeof response.data === 'object' && isJson) {
      response.data = keysToCamel(response.data)
    }
    return response
  },
  async (error: AxiosError) => {
    if (error.response?.status === 401) {
      // Firebase token expired or invalid — sign out and redirect to login
      try {
        await auth.signOut()
      } catch {
        // ignore sign out errors
      }
      window.location.href = '/login'
    }
    return Promise.reject(error)
  }
)

export default apiClient
