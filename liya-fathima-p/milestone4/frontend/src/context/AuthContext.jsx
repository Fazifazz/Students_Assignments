import { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import api, { unwrap } from '../services/api.js'

const AuthContext = createContext(null)

function extractAuth(data) {
  const payload = data?.data ?? data
  return {
    token: payload?.token ?? data?.token,
    user: payload?.user ?? data?.user ?? payload,
  }
}

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(() => Boolean(window.sessionStorage.getItem('resolveit_token')))
  const navigate = useNavigate()

  const logout = useCallback((redirect = true) => {
    window.sessionStorage.removeItem('resolveit_token')
    setUser(null)
    if (redirect) navigate('/login', { replace: true })
  }, [navigate])

  useEffect(() => {
    const expire = () => logout(true)
    window.addEventListener('resolveit:auth-expired', expire)
    return () => window.removeEventListener('resolveit:auth-expired', expire)
  }, [logout])

  useEffect(() => {
    const token = window.sessionStorage.getItem('resolveit_token')
    if (!token) return
    api.get('/auth/me')
      .then((response) => {
        const payload = unwrap(response)
        setUser(payload?.user ?? payload)
      })
      .catch(() => {
        window.sessionStorage.removeItem('resolveit_token')
        setUser(null)
      })
      .finally(() => setLoading(false))
  }, [])

  const authenticate = useCallback(async (endpoint, credentials) => {
    const response = await api.post(endpoint, credentials)
    const { token, user: authenticatedUser } = extractAuth(response.data)
    if (!token || !authenticatedUser) throw new Error('The server response did not include a token and user.')
    window.sessionStorage.setItem('resolveit_token', token)
    setUser(authenticatedUser)
    return authenticatedUser
  }, [])

  const value = useMemo(() => ({ user, loading, login: (values) => authenticate('/auth/login', values), register: (values) => authenticate('/auth/register', values), logout }), [user, loading, authenticate, logout])
  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (!context) throw new Error('useAuth must be used within AuthProvider')
  return context
}

export function userRole(user) {
  const role = String(user?.role ?? '').toLowerCase()
  return role === 'admin' || role === 'administrator' ? 'admin' : 'user'
}
