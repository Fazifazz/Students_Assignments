import { Navigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext.jsx'

export default function RoleRedirect() {
  const { role } = useAuth()
  const destinations = { patient: '/patient', doctor: '/doctor', admin: '/admin' }
  return <Navigate to={destinations[role] || '/login'} replace />
}
