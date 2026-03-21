/**
 * API base URL - adapts to development and production
 * Set VITE_API_URL in .env for production (e.g. https://your-api.onrender.com)
 * Falls back to localhost:8080 when not set
 */
export const API_BASE =
  import.meta.env.VITE_API_URL || 'https://psycology-backend.onrender.com'

export const getApiUrl = (path) => {
  const base = API_BASE.replace(/\/$/, '')
  const p = path.startsWith('/') ? path : `/${path}`
  return `${base}${p}`
}
