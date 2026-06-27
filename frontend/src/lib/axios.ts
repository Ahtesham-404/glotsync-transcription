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
  // 5 minute timeout — needed for large file uploads and long transcription waits
  timeout: 300000,
  headers: {
    'Content-Type': 'application/json',
  },
})

// Request interceptor: attach Firebase ID token
// For multipart/form-data (file uploads) we delete the Content-Type header so
// the browser sets it automatically with the correct boundary string.
apiClient.interceptors.request.use(
  async (config: InternalAxiosRequestConfig) => {
    // Remove Content-Type for multipart so browser adds the correct boundary
    if (config.data instanceof FormData) {
      delete config.headers['Content-Type']
    }

    const user = auth.currentUser
    if (user) {
      try {
        const token = await user.getIdToken(false)
        config.headers.Authorization = `Bearer ${token}`
      } catch {
        // Token refresh failed — 401 handler will redirect to login
      }
    }
    return config
  },
  (error: AxiosError) => Promise.reject(error)
)

// Response interceptor: camelCase transform + 401 handler
apiClient.interceptors.response.use(
  (response: AxiosResponse) => {
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
      try {
        await auth.signOut()
      } catch {
        // ignore
      }
      window.location.href = '/login'
    }
    return Promise.reject(error)
  }
)

export default apiClient
