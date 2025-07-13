import { devMode } from 'src/config'

const COLORS = {
  info: '#2196F3', // Blue
  success: '#4CAF50', // Green
  warning: '#FFC107', // Amber
  error: '#FF5252', // Red
  scope: '#9C27B0', // Purple
  file: '#607D8B', // Blue Grey
}

// Get caller information
const getCallerInfo = () => {
  const error = new Error()
  const stack = error.stack.split('\n')
  // Get the caller line (index 4 because we need to go deeper in the stack)
  // 0 is error message, 1 is getCallerInfo, 2 is logMessage, 3 is log method, 4 is actual caller
  const caller = stack[4]
  if (!caller) return { scope: null, file: null, line: null }

  // Extract file path and line number
  const match =
    caller.match(/at\s+(.+?)\s+\((.+?):(\d+):(\d+)\)/) || caller.match(/at\s+(.+?):(\d+):(\d+)/)

  if (!match) return { scope: null, file: null, line: null }

  let scope, filePath, line

  if (match.length === 5) {
    // Format: "at Function (file:line:column)"
    ;[, scope, filePath, line] = match
  } else {
    // Format: "at file:line:column"
    scope = null
    filePath = match[1]
    line = match[2]
  }

  // Get just the filename and remove query parameters
  const file = filePath.split('/').pop().split('?')[0]

  return { scope, file, line }
}

// Check if we're in local development

const logMessage = (type, ...args) => {
  if (!devMode) return

  const { scope, file, line } = getCallerInfo()

  // Build source info string, only including available parts
  const sourceInfo = []
  if (scope) sourceInfo.push(`Scope: ${scope}`)
  if (file) sourceInfo.push(`File: ${file}`)
  if (line) sourceInfo.push(`Line: ${line}`)

  // Log the main message with type
  // Only log source info if we have any
  if (sourceInfo.length > 0) {
    console.log(
      `\n %c${sourceInfo.join(' | ')}`,
      `color: #888; font-size: 0.9em; padding-left: 10px;`,
    )
  }

  const typeStyle = `color: ${COLORS[type]}; font-weight: bold; font-size: 1.1em;`
  console.log(`%c[${type?.toUpperCase()}] \n`, typeStyle, ...args)
}

export const log = {
  info: (...args) => logMessage('info', ...args),
  success: (...args) => logMessage('success', ...args),
  warning: (...args) => logMessage('warning', ...args),
  error: (...args) => logMessage('error', ...args),
}
