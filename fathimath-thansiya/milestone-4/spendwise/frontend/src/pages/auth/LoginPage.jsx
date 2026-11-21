import { useState } from 'react';
import { Link as RouterLink, useLocation, useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import {
  Alert,
  Box,
  Button,
  Card,
  CardContent,
  Checkbox,
  FormControlLabel,
  IconButton,
  InputAdornment,
  Link,
  Stack,
  TextField,
  Typography,
} from '@mui/material';
import VisibilityRoundedIcon from '@mui/icons-material/VisibilityRounded';
import VisibilityOffRoundedIcon from '@mui/icons-material/VisibilityOffRounded';
import AccountBalanceWalletRoundedIcon from '@mui/icons-material/AccountBalanceWalletRounded';
import { useAuth } from '../../features/auth/useAuth';
import { loginSchema } from '../../utils/validation';
import { tokens } from '../../theme';

export default function LoginPage() {
  const navigate = useNavigate();
  const location = useLocation();
  const { login } = useAuth();
  const [showPassword, setShowPassword] = useState(false);
  const [serverError, setServerError] = useState('');

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm({
    resolver: zodResolver(loginSchema),
    defaultValues: { email: '', password: '' },
  });

  const onSubmit = async (values) => {
    setServerError('');
    try {
      await login(values);
      const target = location.state?.from?.pathname || '/dashboard';
      navigate(target, { replace: true });
    } catch (error) {
      setServerError(error.message || 'Unable to sign in');
    }
  };

  return (
    <Box
      sx={{
        minHeight: '100vh',
        display: 'grid',
        gridTemplateColumns: { xs: '1fr', lg: '1.05fr 1fr' },
        bgcolor: 'background.default',
      }}
    >
      <Box
        sx={{
          display: { xs: 'none', lg: 'flex' },
          flexDirection: 'column',
          justifyContent: 'space-between',
          p: 6,
          bgcolor: tokens.color.navy,
          color: '#fff',
          position: 'relative',
          overflow: 'hidden',
        }}
      >
        <Stack direction="row" alignItems="center" spacing={1.25}>
          <Box
            sx={{
              width: 38,
              height: 38,
              borderRadius: 2,
              display: 'grid',
              placeItems: 'center',
              bgcolor: tokens.color.primary,
              fontWeight: 800,
              fontSize: 19,
            }}
          >
            ₹
          </Box>
          <Typography variant="h3">SpendWise</Typography>
        </Stack>

        <Box sx={{ maxWidth: 460, position: 'relative', zIndex: 1 }}>
          <Typography variant="h1" sx={{ color: '#fff', mb: 2 }}>
            Every rupee, one clear picture.
          </Typography>
          <Typography variant="body1" sx={{ color: 'rgba(255,255,255,0.72)' }}>
            Track income, control budgets, build savings goals and understand your spending habits — all
            from one calm dashboard.
          </Typography>

          <Stack spacing={1.5} sx={{ mt: 4 }}>
            {['Real-time budget utilisation', 'Category-wise spending insights', 'Savings goals that keep you honest'].map(
              (item) => (
                <Stack key={item} direction="row" alignItems="center" spacing={1.25}>
                  <Box sx={{ width: 8, height: 8, borderRadius: 999, bgcolor: tokens.color.primary }} />
                  <Typography variant="body2" sx={{ color: 'rgba(255,255,255,0.82)' }}>
                    {item}
                  </Typography>
                </Stack>
              ),
            )}
          </Stack>
        </Box>

        <Typography variant="caption" sx={{ color: 'rgba(255,255,255,0.45)' }}>
          © {new Date().getFullYear()} SpendWise. Built for people who like their numbers tidy.
        </Typography>
      </Box>

      <Box sx={{ display: 'grid', placeItems: 'center', p: { xs: 2, sm: 4 } }}>
        <Card sx={{ width: '100%', maxWidth: 440 }}>
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
                <AccountBalanceWalletRoundedIcon fontSize="small" />
              </Box>
              <Box>
                <Typography variant="h3">Welcome back</Typography>
                <Typography variant="body2" color="text.secondary">
                  Sign in to continue to your dashboard
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
                autoComplete="current-password"
                fullWidth
                error={Boolean(errors.password)}
                helperText={errors.password?.message}
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

              <Stack direction="row" alignItems="center" justifyContent="space-between">
                <FormControlLabel control={<Checkbox size="small" />} label="Remember me" />
                <Link component={RouterLink} to="/forgot-password" underline="hover" sx={{ fontSize: 13 }}>
                  Forgot password?
                </Link>
              </Stack>

              <Button type="submit" variant="contained" size="large" disabled={isSubmitting} fullWidth>
                {isSubmitting ? 'Signing in…' : 'Sign in'}
              </Button>
            </Stack>

            <Typography variant="body2" color="text.secondary" align="center" sx={{ mt: 3 }}>
              New to SpendWise?{' '}
              <Link component={RouterLink} to="/register" underline="hover" sx={{ fontWeight: 600 }}>
                Create an account
              </Link>
            </Typography>
          </CardContent>
        </Card>
      </Box>
    </Box>
  );
}
