import { Navigate, Outlet, useLocation } from 'react-router-dom'
import { useAuth } from '../context/AuthContext.jsx'

export default function ProtectedRoute({ roles, doctors = [] }) {
  const { isAuthenticated, role, user } = useAuth()
  const location = useLocation()
  if (!isAuthenticated) {
    const requestedPath = `${location.pathname}${location.search}`
    return <Navigate to={`/login?next=${encodeURIComponent(requestedPath)}`} replace />
  }
  if (roles && !roles.includes(role)) return <Navigate to="/dashboard" replace />
  if (role === 'doctor' && doctors.length) {
    const doctor = doctors.find((item) => item.id === user.id)
    if (!doctor || doctor.isActive === false) return <Navigate to="/login" replace />
  }
  return <Outlet />
}
