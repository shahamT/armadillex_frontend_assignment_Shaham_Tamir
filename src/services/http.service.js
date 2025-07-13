import axios from 'axios'
import { log } from './log.service'
import { apiUrl } from 'src/config'

// let gIsAuthenticating = false
// Create axios instance
const httpClient = axios.create({
  baseURL: apiUrl,
  timeout: 30000,
  headers: {
    'Content-Type': 'application/json',
  },
})

// Request interceptor
httpClient.interceptors.request.use(
  async (config) => {
    log.info('Making request', { data: config.data, url: config.url, method: config.method })
    return config
  },
  (error) => {
    log.error('Request error', error)
    return Promise.reject(error)
  },
)

// Response interceptor
httpClient.interceptors.response.use(
  (response) => {
    log.success('Request successful', {
      url: response.config.url,
      status: response.status,
    })
    return response.data
  },
  (error) => {
    const { response } = error

    // Handle different error scenarios
    if (response) {
      log.error('Response error', {
        url: response.config.url,
        status: response.status,
        data: response.data,
      })

      switch (response.status) {
        case 401:
          // Handle unauthorized
          break
        case 403:
          // Handle forbidden
          break
        case 404:
          // Handle not found
          break
        case 500:
          // Handle server error
          break
        default:
        // Handle other errors
      }
      log.error('Response error', { error })
    } else {
      if (error.isAuthError) {
        return
      }
      log.error('Network Error', { error })
    }

    return Promise.reject(error)
  },
)

// API methods
export const httpService = {
  get: (url, config = {}) => httpClient.get(url, config),
  post: (url, data = {}, config = {}) => httpClient.post(url, data, config),
  put: (url, data = {}, config = {}) => httpClient.put(url, data, config),
  delete: (url, config = {}) => httpClient.delete(url, config),
  patch: (url, data = {}, config = {}) => httpClient.patch(url, data, config),
}

export default httpService
