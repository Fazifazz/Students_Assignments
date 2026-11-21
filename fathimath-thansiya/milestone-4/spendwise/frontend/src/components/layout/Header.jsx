import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Avatar,
  Box,
  Divider,
  IconButton,
  InputAdornment,
  ListItemIcon,
  Menu,
  MenuItem,
  Stack,
  TextField,
  Tooltip,
  Typography,
} from '@mui/material';
import MenuRoundedIcon from '@mui/icons-material/MenuRounded';
import SearchRoundedIcon from '@mui/icons-material/SearchRounded';
import NotificationsNoneRoundedIcon from '@mui/icons-material/NotificationsNoneRounded';
import LogoutRoundedIcon from '@mui/icons-material/LogoutRounded';
import PersonRoundedIcon from '@mui/icons-material/PersonRounded';
import SettingsRoundedIcon from '@mui/icons-material/SettingsRounded';
import AddRoundedIcon from '@mui/icons-material/AddRounded';
import Button from '@mui/material/Button';
import { tokens } from '../../theme';
import { useAuth } from '../../features/auth/useAuth';
import { initials } from '../../utils/format';

export default function Header({ onOpenDrawer, onQuickAdd }) {
  const navigate = useNavigate();
  const { user, logout } = useAuth();
  const [anchorEl, setAnchorEl] = useState(null);
  const [query, setQuery] = useState('');

  const handleLogout = async () => {
    setAnchorEl(null);
    await logout();
    navigate('/login', { replace: true });
  };

  return (
    <Box
      component="header"
      sx={{
        height: tokens.layout.headerHeight,
        display: 'flex',
        alignItems: 'center',
        gap: 1.5,
        px: { xs: 2, md: 3 },
        bgcolor: 'background.paper',
        borderBottom: '1px solid',
        borderColor: 'divider',
        position: 'sticky',
        top: 0,
        zIndex: 10,
      }}
    >
      <IconButton onClick={onOpenDrawer} sx={{ display: { md: 'none' } }} aria-label="Open navigation">
        <MenuRoundedIcon />
      </IconButton>

      <TextField
        size="small"
        placeholder="Search transactions…"
        value={query}
        onChange={(event) => {
          setQuery(event.target.value);
          if (event.target.value) navigate(`/transactions?search=${encodeURIComponent(event.target.value)}`);
        }}
        sx={{
          width: { xs: '100%', sm: 320 },
          '& .MuiOutlinedInput-root': { bgcolor: 'background.default' },
        }}
        InputProps={{
          startAdornment: (
            <InputAdornment position="start">
              <SearchRoundedIcon fontSize="small" sx={{ color: 'text.secondary' }} />
            </InputAdornment>
          ),
        }}
      />

      <Stack direction="row" alignItems="center" spacing={1} sx={{ ml: 'auto' }}>
        <Button
          variant="contained"
          startIcon={<AddRoundedIcon />}
          onClick={onQuickAdd}
          sx={{ display: { xs: 'none', sm: 'inline-flex' } }}
        >
          Quick add
        </Button>

        <Tooltip title="Notifications">
          <IconButton aria-label="Notifications">
            <NotificationsNoneRoundedIcon />
          </IconButton>
        </Tooltip>

        <Divider orientation="vertical" flexItem sx={{ my: 1.5, display: { xs: 'none', sm: 'block' } }} />

        <IconButton onClick={(event) => setAnchorEl(event.currentTarget)} sx={{ p: 0.5 }}>
          <Avatar sx={{ width: 34, height: 34, bgcolor: tokens.color.navy, fontSize: 13, fontWeight: 700 }}>
            {initials(user?.name || 'User')}
          </Avatar>
        </IconButton>
      </Stack>

      <Menu anchorEl={anchorEl} open={Boolean(anchorEl)} onClose={() => setAnchorEl(null)}>
        <Box sx={{ px: 2, py: 1 }}>
          <Typography variant="body2" sx={{ fontWeight: 600 }}>
            {user?.name}
          </Typography>
          <Typography variant="caption" color="text.secondary">
            {user?.email}
          </Typography>
        </Box>
        <Divider />
        <MenuItem
          onClick={() => {
            setAnchorEl(null);
            navigate('/profile');
          }}
        >
          <ListItemIcon>
            <PersonRoundedIcon fontSize="small" />
          </ListItemIcon>
          Profile
        </MenuItem>
        <MenuItem
          onClick={() => {
            setAnchorEl(null);
            navigate('/settings');
          }}
        >
          <ListItemIcon>
            <SettingsRoundedIcon fontSize="small" />
          </ListItemIcon>
          Settings
        </MenuItem>
        <Divider />
        <MenuItem onClick={handleLogout} sx={{ color: 'error.main' }}>
          <ListItemIcon>
            <LogoutRoundedIcon fontSize="small" color="error" />
          </ListItemIcon>
          Log out
        </MenuItem>
      </Menu>
    </Box>
  );
}
