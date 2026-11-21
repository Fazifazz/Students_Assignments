import { Navigate, Outlet, useLocation } from 'react-router-dom';
import { Box, CircularProgress, Stack, Typography } from '@mui/material';
import { useAuth } from '../features/auth/useAuth';

/**
 * Guards the application routes. Unauthenticated visitors are redirected to
 * /login while preserving the attempted location for post-login redirect.
 */
export default function ProtectedRoute() {
  const { isAuthenticated, isLoading } = useAuth();
  const location = useLocation();

  if (isLoading) {
    return (
      <Box sx={{ minHeight: '100vh', display: 'grid', placeItems: 'center' }}>
        <Stack alignItems="center" spacing={2}>
          <CircularProgress size={30} />
          <Typography variant="body2" color="text.secondary">
            Loading your workspace…
          </Typography>
        </Stack>
      </Box>
    );
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" replace state={{ from: location }} />;
  }

  return <Outlet />;
}
