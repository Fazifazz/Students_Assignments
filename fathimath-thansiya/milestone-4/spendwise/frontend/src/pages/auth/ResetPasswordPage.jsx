import { useState } from 'react';
import { Link as RouterLink, useNavigate, useSearchParams } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Alert, Box, Button, Card, CardContent, Link, Stack, TextField, Typography } from '@mui/material';
import LockResetRoundedIcon from '@mui/icons-material/LockResetRounded';
import { toast } from 'react-toastify';
import { resetPasswordSchema } from '../../utils/validation';
import { resetPassword } from '../../services/api/auth';

/**
 * Consumes the token from the reset link and sets a new password.
 */
export default function ResetPasswordPage() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const token = searchParams.get('token') || '';
  const [serverError, setServerError] = useState('');

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm({
    resolver: zodResolver(resetPasswordSchema),
    defaultValues: { password: '', confirmPassword: '' },
  });

  const onSubmit = async (values) => {
    setServerError('');
    try {
      await resetPassword({ token, password: values.password });
      toast.success('Password updated. Please sign in.');
      navigate('/login', { replace: true });
    } catch (error) {
      setServerError(error.message);
    }
  };

  return (
    <Box sx={{ minHeight: '100vh', display: 'grid', placeItems: 'center', p: { xs: 2, sm: 4 } }}>
      <Card sx={{ width: '100%', maxWidth: 460 }}>
        <CardContent sx={{ p: { xs: 3, sm: 4 } }}>
          <Stack direction="row" alignItems="center" spacing={1.25} sx={{ mb: 3 }}>
            <Box
              sx={{
                width: 38,
                height: 38,
                borderRadius: 2,
                display: 'grid',
                placeItems: 'center',
                bgcolor: 'rgba(16,185,129,0.12)',
                color: 'primary.main',
              }}
            >
              <LockResetRoundedIcon fontSize="small" />
            </Box>
            <Box>
              <Typography variant="h3">Choose a new password</Typography>
              <Typography variant="body2" color="text.secondary">
                This link can only be used once
              </Typography>
            </Box>
          </Stack>

          {!token && (
            <Alert severity="error" sx={{ mb: 2 }}>
              This reset link is missing its token. Request a new link from the forgot-password page.
            </Alert>
          )}

          {serverError && (
            <Alert severity="error" sx={{ mb: 2 }}>
              {serverError}
            </Alert>
          )}

          <Stack component="form" onSubmit={handleSubmit(onSubmit)} spacing={2} noValidate>
            <TextField
              label="New password"
              type="password"
              autoComplete="new-password"
              fullWidth
              disabled={!token}
              error={Boolean(errors.password)}
              helperText={errors.password?.message || 'At least 8 characters, with a letter and a number'}
              {...register('password')}
            />
            <TextField
              label="Confirm new password"
              type="password"
              autoComplete="new-password"
              fullWidth
              disabled={!token}
              error={Boolean(errors.confirmPassword)}
              helperText={errors.confirmPassword?.message}
              {...register('confirmPassword')}
            />
            <Button type="submit" variant="contained" size="large" disabled={isSubmitting || !token} fullWidth>
              {isSubmitting ? 'Updating…' : 'Update password'}
            </Button>
          </Stack>

          <Typography variant="body2" color="text.secondary" align="center" sx={{ mt: 3 }}>
            <Link component={RouterLink} to="/login" underline="hover" sx={{ fontWeight: 600 }}>
              Back to sign in
            </Link>
          </Typography>
        </CardContent>
      </Card>
    </Box>
  );
}
