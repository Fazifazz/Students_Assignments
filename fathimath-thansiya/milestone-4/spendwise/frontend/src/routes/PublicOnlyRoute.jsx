import { Navigate, Outlet } from 'react-router-dom';
import { useAuth } from '../features/auth/useAuth';

/** Keeps signed-in users away from /login, /register and /forgot-password. */
export default function PublicOnlyRoute() {
  const { isAuthenticated } = useAuth();

  if (isAuthenticated) {
    return <Navigate to="/dashboard" replace />;
  }

  return <Outlet />;
}
