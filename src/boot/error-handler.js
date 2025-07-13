import { boot } from 'quasar/wrappers'
import { log } from 'src/services/log.service'

// Error types enum
export const ERROR_TYPES = {
  VALIDATION: 'validation_error',
  AUTHENTICATION: 'authentication_error',
  NETWORK: 'network_error',
  PERMISSION: 'permission_error',
  UNKNOWN: 'unknown_error',
}

// Set to prevent duplicate error reports within a time window
const errorCooldown = new Set()

/**
 * Formats error details into a structured object
 */
function formatErrorDetails(error, context = {}) {
  const errorDetails = {
    timestamp: new Date().toISOString(),
    type: context.errorType || ERROR_TYPES.UNKNOWN,
    component: context.component || 'unknown',
    message: error.message || 'Unknown error',
    error_name: error.name || 'Error',
    stack_trace: error.stack || 'No stack trace available',
  }

  // Add optional fields only if they exist
  if (context.lifecycleHook) errorDetails.lifecycle_hook = context.lifecycleHook
  if (context.url) errorDetails.url = context.url
  if (context.source) errorDetails.source = context.source
  if (context.line) errorDetails.line = context.line
  if (context.column) errorDetails.column = context.column

  return errorDetails
}

/**
 * Reports an error with cooldown to prevent spam
 */
export function reportError(error, context = {}) {
  // Ensure error is an object
  if (!(error instanceof Error)) {
    error = new Error(error || 'Unknown error')
  }

  // Create a unique key for this error to avoid spam
  const key = `${error.message}-${context.component || ''}-${error.name}`
  if (errorCooldown.has(key)) return

  const errorDetails = formatErrorDetails(error, context)

  // Log the error using our log service
  log.error('Error Report:', errorDetails)

  // Add error to cooldown set and remove after 1 min
  errorCooldown.add(key)
  setTimeout(() => errorCooldown.delete(key), 60000)
}

/**
 * Global Vue error handler
 */
function errorHandler(error, instance, info) {
  // Determine error type based on error name
  let errorType = ERROR_TYPES.UNKNOWN

  if (error.name === 'ValidationError') {
    errorType = ERROR_TYPES.VALIDATION
  } else if (error.name === 'AuthenticationError') {
    errorType = ERROR_TYPES.AUTHENTICATION
  } else if (error.name === 'NetworkError' || !navigator.onLine) {
    errorType = ERROR_TYPES.NETWORK
  } else if (error.name === 'PermissionError') {
    errorType = ERROR_TYPES.PERMISSION
  }

  // Report the error with context
  reportError(error, {
    errorType,
    component: instance?.$options?.name || 'unknown',
    lifecycleHook: info,
  })
}

// Quasar boot file export
export default boot(({ app }) => {
  // Set up global error handler
  app.config.errorHandler = errorHandler

  if (typeof window !== 'undefined') {
    // Handle unhandled promise rejections
    window.addEventListener('unhandledrejection', (event) => {
      const error = event.reason
      reportError(error, {
        errorType: ERROR_TYPES.UNKNOWN,
        component: 'unhandled_promise_rejection',
      })
    })

    // Global runtime error handler
    window.onerror = (message, source, lineno, colno, error) => {
      reportError(error || new Error(message), {
        errorType: ERROR_TYPES.UNKNOWN,
        component: 'window.onerror',
        source,
        line: lineno,
        column: colno,
        url: window.location.href,
      })
    }
  }

  // Make reportError available globally
  app.config.globalProperties.$reportError = reportError

  // Make reportError and test utility available for composition API
  app.provide('reportError', reportError)
})
