import axios from 'axios'

const apiBaseUrl = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8000/api'

const api = axios.create({
  baseURL: apiBaseUrl,
  headers: { 'Content-Type': 'application/json' },
})

api.interceptors.request.use((config) => {
  const token = window.sessionStorage.getItem('resolveit_token')
  if (token) config.headers.Authorization = `Bearer ${token}`
  return config
})

api.interceptors.response.use(
  (response) => response,
  (error) => {
    const token = window.sessionStorage.getItem('resolveit_token')
    const url = error.config?.url || ''
    const isAuthRequest = url.includes('/auth/login') || url.includes('/auth/register')
    if (error.response?.status === 401 && token && !isAuthRequest) {
      window.dispatchEvent(new Event('resolveit:auth-expired'))
    }
    return Promise.reject(error)
  },
)

export function getErrorMessage(error, fallback = 'Something went wrong. Please try again.') {
  const body = error?.response?.data
  if (typeof body?.message === 'string') return body.message
  if (typeof body?.error === 'string') return body.error
  if (error?.message === 'Network Error') {
    return `Could not connect to the API at ${apiBaseUrl}. Confirm the Express backend is listening there and allows requests from this frontend.`
  }
  return fallback
}

export function unwrap(response) {
  const body = response?.data
  return body?.data ?? body
}

export function asArray(value, keys = []) {
  if (Array.isArray(value)) return value
  for (const key of keys) {
    if (Array.isArray(value?.[key])) return value[key]
  }
  return []
}

export async function downloadAttachment(complaintId, attachment) {
  const response = await api.get(
    `/complaints/${encodeURIComponent(complaintId)}/attachments/${encodeURIComponent(attachment.id)}`,
    { responseType: 'blob' },
  )
  const url = URL.createObjectURL(response.data)
  const link = document.createElement('a')
  link.href = url
  link.download = attachment.name || 'complaint-attachment'
  document.body.appendChild(link)
  link.click()
  link.remove()
  window.setTimeout(() => URL.revokeObjectURL(url), 1000)
}

export default api
