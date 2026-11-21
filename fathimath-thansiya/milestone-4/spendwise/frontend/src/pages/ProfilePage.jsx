import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Controller, useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import {
  Alert,
  Avatar,
  Box,
  Button,
  Card,
  Stack,
  TextField,
  Typography,
} from '@mui/material';
import { toast } from 'react-toastify';
import PageHeader from '../components/common/PageHeader';
import { useAuth } from '../features/auth/useAuth';
import { initials } from '../utils/format';
import { formatDate } from '../utils/format';
import { tokens } from '../theme';

const profileSchema = z.object({
  name: z
    .string()
    .trim()
    .min(2, 'Name must be at least 2 characters')
    .max(60, 'Name must be at most 60 characters'),
});

const passwordSchema = z
  .object({
    currentPassword: z.string().min(1, 'Enter your current password'),
    password: z
      .string()
      .min(8, 'Password must be at least 8 characters')
      .regex(/[a-zA-Z]/, 'Password must contain a letter')
      .regex(/[0-9]/, 'Password must contain a number'),
    confirmPassword: z.string().min(1, 'Please confirm your new password'),
  })
  .refine((values) => values.password === values.confirmPassword, {
    path: ['confirmPassword'],
    message: 'Passwords do not match',
  });

/**
 * Profile management — personal details and password changes.
 */
export default function ProfilePage() {
  const navigate = useNavigate();
  const { user, updateProfile, changePassword } = useAuth();

  const [profileError, setProfileError] = useState('');
  const [passwordError, setPasswordError] = useState('');

  const profileForm = useForm({
    resolver: zodResolver(profileSchema),
    defaultValues: { name: user?.name || '' },
  });

  const passwordForm = useForm({
    resolver: zodResolver(passwordSchema),
    defaultValues: { currentPassword: '', password: '', confirmPassword: '' },
  });

  const handleProfileSubmit = async (values) => {
    setProfileError('');
    try {
      await updateProfile(values);
      toast.success('Profile updated');
    } catch (error) {
      setProfileError(error.message);
      toast.error(error.message);
    }
  };

  const handlePasswordSubmit = async (values) => {
    setPasswordError('');
    try {
      await changePassword({
        currentPassword: values.currentPassword,
        password: values.password,
      });
      toast.success('Password updated. Please sign in again.');
      navigate('/login', { replace: true });
    } catch (error) {
      setPasswordError(error.message);
      toast.error(error.message);
    }
  };

  return (
    <Stack spacing={3}>
      <PageHeader title="Profile" subtitle="Your account details and security settings." />

      <Card sx={{ p: 2.5 }}>
        <Stack direction="row" alignItems="center" spacing={2}>
          <Avatar sx={{ width: 56, height: 56, bgcolor: tokens.color.navy, fontWeight: 700 }}>
            {initials(user?.name || 'User')}
          </Avatar>
          <Box>
            <Typography variant="h4">{user?.name}</Typography>
            <Typography variant="body2" color="text.secondary">
              {user?.email}
            </Typography>
            <Typography variant="caption" color="text.secondary">
              Member since {formatDate(user?.createdAt)}
            </Typography>
          </Box>
        </Stack>
      </Card>

      <Box
        sx={{
          display: 'grid',
          gridTemplateColumns: { xs: '1fr', md: 'repeat(2, 1fr)' },
          gap: 2.5,
          alignItems: 'start',
        }}
      >
        <Card sx={{ p: 2.5 }}>
          <Typography variant="h4" sx={{ mb: 0.5 }}>
            Edit profile
          </Typography>
          <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
            Update the name shown across the app.
          </Typography>

          <Controller
            control={profileForm.control}
            name="name"
            render={({ field }) => (
              <TextField
                {...field}
                label="Full name"
                error={Boolean(profileForm.formState.errors.name)}
                helperText={profileForm.formState.errors.name?.message}
                fullWidth
                sx={{ mb: 2 }}
              />
            )}
          />

          {profileError && (
            <Alert severity="error" sx={{ mb: 2 }}>
              {profileError}
            </Alert>
          )}

          <Button
            variant="contained"
            onClick={profileForm.handleSubmit(handleProfileSubmit)}
            disabled={profileForm.formState.isSubmitting}
          >
            Save changes
          </Button>
        </Card>

        <Card sx={{ p: 2.5 }}>
          <Typography variant="h4" sx={{ mb: 0.5 }}>
            Change password
          </Typography>
          <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
            Changing your password signs you out of every device.
          </Typography>

          <Stack spacing={2}>
            <Controller
              control={passwordForm.control}
              name="currentPassword"
              render={({ field }) => (
                <TextField
                  {...field}
                  label="Current password"
                  type="password"
                  error={Boolean(passwordForm.formState.errors.currentPassword)}
                  helperText={passwordForm.formState.errors.currentPassword?.message}
                  fullWidth
                />
              )}
            />
            <Controller
              control={passwordForm.control}
              name="password"
              render={({ field }) => (
                <TextField
                  {...field}
                  label="New password"
                  type="password"
                  error={Boolean(passwordForm.formState.errors.password)}
                  helperText={
                    passwordForm.formState.errors.password?.message ||
                    'At least 8 characters, with a letter and a number'
                  }
                  fullWidth
                />
              )}
            />
            <Controller
              control={passwordForm.control}
              name="confirmPassword"
              render={({ field }) => (
                <TextField
                  {...field}
                  label="Confirm new password"
                  type="password"
                  error={Boolean(passwordForm.formState.errors.confirmPassword)}
                  helperText={passwordForm.formState.errors.confirmPassword?.message}
                  fullWidth
                />
              )}
            />
          </Stack>

          <Button
            variant="contained"
            sx={{ mt: 2 }}
            onClick={passwordForm.handleSubmit(handlePasswordSubmit)}
            disabled={passwordForm.formState.isSubmitting}
          >
            Update password
          </Button>

          {passwordError && (
            <Alert severity="error" sx={{ mt: 2 }}>
              {passwordError}
            </Alert>
          )}
        </Card>
      </Box>
    </Stack>
  );
}
