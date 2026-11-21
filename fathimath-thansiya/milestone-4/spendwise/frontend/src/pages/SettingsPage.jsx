import { Box, Button, Card, MenuItem, Stack, Switch, TextField, Typography } from '@mui/material';
import LogoutRoundedIcon from '@mui/icons-material/LogoutRounded';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import PageHeader from '../components/common/PageHeader';
import { useAuth } from '../features/auth/useAuth';
import usePreferences from '../hooks/usePreferences';
import env from '../config/env';

/**
 * Application settings — display preferences and session information.
 */
export default function SettingsPage() {
  const navigate = useNavigate();
  const { logout } = useAuth();
  const { preferences, setPreference } = usePreferences();

  const handleSignOut = async () => {
    await logout();
    toast.success('Signed out');
    navigate('/login', { replace: true });
  };

  return (
    <Stack spacing={3}>
      <PageHeader title="Settings" subtitle="Preferences for how SpendWise looks and behaves." />

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
            Preferences
          </Typography>
          <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
            Display preferences are stored on this device.
          </Typography>

          <TextField
            select
            label="Currency"
            value={preferences.currency}
            onChange={(event) => setPreference('currency', event.target.value)}
            helperText="SpendWise stores every amount in paise and displays it in the selected currency."
            fullWidth
            sx={{ mb: 2 }}
          >
            <MenuItem value="INR">INR (₹) — Indian Rupee</MenuItem>
          </TextField>

          <Stack divider={<Box sx={{ borderBottom: '1px solid', borderColor: 'divider' }} />}>
            <Stack direction="row" alignItems="center" justifyContent="space-between" sx={{ py: 1.5 }}>
              <Box>
                <Typography variant="body1">Weekly spending summary</Typography>
                <Typography variant="caption" color="text.secondary">
                  A short recap of how last week went.
                </Typography>
              </Box>
              <Switch
                checked={preferences.weeklySummary}
                onChange={(event) => setPreference('weeklySummary', event.target.checked)}
                inputProps={{ 'aria-label': 'Weekly spending summary' }}
              />
            </Stack>

            <Stack direction="row" alignItems="center" justifyContent="space-between" sx={{ py: 1.5 }}>
              <Box>
                <Typography variant="body1">Budget limit warnings</Typography>
                <Typography variant="caption" color="text.secondary">
                  Alert me when a budget reaches 80% of its limit.
                </Typography>
              </Box>
              <Switch
                checked={preferences.budgetWarnings}
                onChange={(event) => setPreference('budgetWarnings', event.target.checked)}
                inputProps={{ 'aria-label': 'Budget limit warnings' }}
              />
            </Stack>
          </Stack>
        </Card>

        <Card sx={{ p: 2.5 }}>
          <Typography variant="h4" sx={{ mb: 0.5 }}>
            Security &amp; session
          </Typography>
          <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
            How this session is protected.
          </Typography>

          <Stack spacing={1.5} sx={{ mb: 2.5 }}>
            <Box>
              <Typography variant="subtitle2">Session cookie</Typography>
              <Typography variant="body2" color="text.secondary">
                Your session token is stored in an HTTP-only cookie that JavaScript cannot read. It is
                never written to localStorage.
              </Typography>
            </Box>
            <Box>
              <Typography variant="subtitle2">API endpoint</Typography>
              <Typography variant="body2" color="text.secondary" sx={{ wordBreak: 'break-all' }}>
                {env.apiUrl}
              </Typography>
            </Box>
          </Stack>

          <Button
            variant="outlined"
            color="error"
            startIcon={<LogoutRoundedIcon />}
            onClick={handleSignOut}
          >
            Sign out
          </Button>
        </Card>
      </Box>
    </Stack>
  );
}
