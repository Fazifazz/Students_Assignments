import { useState } from 'react';
import { Link as RouterLink } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Alert, Box, Button, Card, CardContent, Link, Stack, TextField, Typography } from '@mui/material';
import MarkEmailReadRoundedIcon from '@mui/icons-material/MarkEmailReadRounded';
import { forgotPasswordSchema } from '../../utils/validation';
import { forgotPassword } from '../../services/api/auth';

export default function ForgotPasswordPage() {
  const [sent, setSent] = useState(false);
  const [serverError, setServerError] = useState('');

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm({
    resolver: zodResolver(forgotPasswordSchema),
    defaultValues: { email: '' },
  });

  const onSubmit = async (values) => {
    setServerError('');
    try {
      await forgotPassword(values);
      setSent(true);
    } catch (error) {
      setServerError(error.message || 'Unable to process the request');
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
              <MarkEmailReadRoundedIcon fontSize="small" />
            </Box>
            <Box>
              <Typography variant="h3">Reset your password</Typography>
              <Typography variant="body2" color="text.secondary">
                We will email you a secure reset link
              </Typography>
            </Box>
          </Stack>

          {sent ? (
            <Alert severity="success">
              If an account exists for that email, a password reset link is on its way. Check your inbox.
            </Alert>
          ) : (
            <>
              {serverError && (
                <Alert severity="error" sx={{ mb: 2 }}>
                  {serverError}
                </Alert>
              )}
              <Stack component="form" onSubmit={handleSubmit(onSubmit)} spacing={2} noValidate>
                <TextField
                  label="Email"
                  type="email"
                  autoComplete="email"
                  fullWidth
                  error={Boolean(errors.email)}
                  helperText={errors.email?.message}
                  {...register('email')}
                />
                <Button type="submit" variant="contained" size="large" disabled={isSubmitting} fullWidth>
                  {isSubmitting ? 'Sending…' : 'Send reset link'}
                </Button>
              </Stack>
            </>
          )}

          <Typography variant="body2" color="text.secondary" align="center" sx={{ mt: 3 }}>
            Remembered it?{' '}
            <Link component={RouterLink} to="/login" underline="hover" sx={{ fontWeight: 600 }}>
              Back to sign in
            </Link>
          </Typography>
        </CardContent>
      </Card>
    </Box>
  );
}
