import { Navigate } from 'react-router-dom'
import { useAuth, userRole } from '../context/AuthContext.jsx'

export default function ProtectedRoute({ children, role }) {
  const { user, loading } = useAuth()
  if (loading) return <div className="screen-loader"><span className="spinner" /> Verifying your session…</div>
  if (!user) return <Navigate to="/login" replace />
  if (role && userRole(user) !== role) return <Navigate to={userRole(user) === 'admin' ? '/admin/dashboard' : '/user/dashboard'} replace />
  return children
}
