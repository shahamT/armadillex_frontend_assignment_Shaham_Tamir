import dotenv from 'dotenv'
import path from 'path'
import { fileURLToPath } from 'url'
import fs from 'fs'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

export const parser = () => {
  console.log('🔹 Parser starting...')

  const isDocker = fs.existsSync('/.dockerenv') || process.env.HOSTNAME
  console.log('🔹 Running in Docker:', !!isDocker)

  const mode = process.env.MODE || 'development'
  console.log('🔹 Current mode:', mode)

  if (!isDocker) {
    const envFilePath = path.resolve(__dirname, `${mode}.env`)
    console.log('🔹 Loading env from:', envFilePath)
    dotenv.config({ path: envFilePath })
  } else {
    console.log('🔹 Running inside Docker, using process.env variables only')
  }

  const envVars = {
    ENV_MODE: mode,
    API_URL: process.env.API_URL || 'http://localhost:3000',
  }

  console.log('🔹 Loaded environment:', envVars)
  return envVars
}
