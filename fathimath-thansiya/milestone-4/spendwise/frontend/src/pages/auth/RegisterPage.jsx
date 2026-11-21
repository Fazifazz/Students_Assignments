import { useState } from 'react';
import { Link as RouterLink, useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import {
  Alert,
  Box,
  Button,
  Card,
  CardContent,
  IconButton,
  InputAdornment,
  Link,
  Stack,
  TextField,
  Typography,
} from '@mui/material';
import VisibilityRoundedIcon from '@mui/icons-material/VisibilityRounded';
import VisibilityOffRoundedIcon from '@mui/icons-material/VisibilityOffRounded';
import PersonAddAltRoundedIcon from '@mui/icons-material/PersonAddAltRounded';
import { useAuth } from '../../features/auth/useAuth';
import { registerSchema } from '../../utils/validation';

export default function RegisterPage() {
  const navigate = useNavigate();
  const { register: signUp } = useAuth();
  const [showPassword, setShowPassword] = useState(false);
  const [serverError, setServerError] = useState('');

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm({
    resolver: zodResolver(registerSchema),
    defaultValues: { name: '', email: '', password: '', confirmPassword: '' },
  });

  const onSubmit = async (values) => {
    setServerError('');
    try {
      await signUp({ name: values.name, email: values.email, password: values.password });
      navigate('/dashboard', { replace: true });
    } catch (error) {
      setServerError(error.message || 'Unable to create the account');
    }
  };

  return (
    <Box sx={{ minHeight: '100vh', display: 'grid', placeItems: 'center', p: { xs: 2, sm: 4 } }}>
      <Card sx={{ width: '100%', maxWidth: 480 }}>
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
              <PersonAddAltRoundedIcon fontSize="small" />
            </Box>
            <Box>
              <Typography variant="h3">Create your account</Typography>
              <Typography variant="body2" color="text.secondary">
                Start tracking your money in under a minute
              </Typography>
            </Box>
          </Stack>

          {serverError && (
            <Alert severity="error" sx={{ mb: 2 }}>
              {serverError}
            </Alert>
          )}

          <Stack component="form" onSubmit={handleSubmit(onSubmit)} spacing={2} noValidate>
            <TextField
              label="Full name"
              autoComplete="name"
              fullWidth
              error={Boolean(errors.name)}
              helperText={errors.name?.message}
              {...register('name')}
            />
            <TextField
              label="Email"
              type="email"
              autoComplete="email"
              fullWidth
              error={Boolean(errors.email)}
              helperText={errors.email?.message}
              {...register('email')}
            />
            <TextField
              label="Password"
              type={showPassword ? 'text' : 'password'}
              autoComplete="new-password"
              fullWidth
              error={Boolean(errors.password)}
              helperText={errors.password?.message || 'At least 8 characters, with a letter and a number'}
              InputProps={{
                endAdornment: (
                  <InputAdornment position="end">
                    <IconButton onClick={() => setShowPassword((value) => !value)} edge="end" aria-label="Toggle password visibility">
                      {showPassword ? <VisibilityOffRoundedIcon /> : <VisibilityRoundedIcon />}
                    </IconButton>
                  </InputAdornment>
                ),
              }}
              {...register('password')}
            />
            <TextField
              label="Confirm password"
              type={showPassword ? 'text' : 'password'}
              autoComplete="new-password"
              fullWidth
              error={Boolean(errors.confirmPassword)}
              helperText={errors.confirmPassword?.message}
              {...register('confirmPassword')}
            />
            <Button type="submit" variant="contained" size="large" disabled={isSubmitting} fullWidth>
              {isSubmitting ? 'Creating account…' : 'Create account'}
            </Button>
          </Stack>

          <Typography variant="body2" color="text.secondary" align="center" sx={{ mt: 3 }}>
            Already have an account?{' '}
            <Link component={RouterLink} to="/login" underline="hover" sx={{ fontWeight: 600 }}>
              Sign in
            </Link>
          </Typography>
        </CardContent>
      </Card>
    </Box>
  );
}
