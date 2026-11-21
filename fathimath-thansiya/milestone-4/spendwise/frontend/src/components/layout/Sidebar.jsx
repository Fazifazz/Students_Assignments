import { useState } from 'react';
import { NavLink, useLocation } from 'react-router-dom';
import {
  Avatar,
  Box,
  Divider,
  IconButton,
  List,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Stack,
  Tooltip,
  Typography,
} from '@mui/material';
import ChevronLeftRoundedIcon from '@mui/icons-material/ChevronLeftRounded';
import ChevronRightRoundedIcon from '@mui/icons-material/ChevronRightRounded';
import { tokens } from '../../theme';
import { NAV_ITEMS, SECONDARY_NAV_ITEMS } from '../../config/navigation';
import { useAuth } from '../../features/auth/useAuth';
import { initials } from '../../utils/format';

function Brand({ collapsed }) {
  return (
    <Stack direction="row" alignItems="center" spacing={1.25} sx={{ px: collapsed ? 0 : 2.5, justifyContent: collapsed ? 'center' : 'flex-start' }}>
      <Box
        sx={{
          width: 34,
          height: 34,
          borderRadius: 2,
          display: 'grid',
          placeItems: 'center',
          bgcolor: tokens.color.primary,
          color: '#fff',
          fontWeight: 800,
          fontSize: 17,
          flexShrink: 0,
        }}
      >
        ₹
      </Box>
      {!collapsed && (
        <Box sx={{ minWidth: 0 }}>
          <Typography variant="h4" sx={{ lineHeight: 1.1 }}>
            SpendWise
          </Typography>
          <Typography variant="caption" color="text.secondary">
            Smart finance manager
          </Typography>
        </Box>
      )}
    </Stack>
  );
}

function NavSection({ items, collapsed, onNavigate }) {
  const { pathname } = useLocation();

  return (
    <List disablePadding sx={{ px: collapsed ? 1 : 1.5 }}>
      {items.map((item) => {
        const active = pathname === item.to || pathname.startsWith(`${item.to}/`);
        const Icon = item.icon;
        const button = (
          <ListItemButton
            component={NavLink}
            to={item.to}
            onClick={onNavigate}
            selected={active}
            sx={{
              borderRadius: 2,
              py: 1.1,
              mb: 0.25,
              justifyContent: collapsed ? 'center' : 'flex-start',
              color: active ? 'primary.dark' : 'text.secondary',
              '&.Mui-selected': {
                bgcolor: 'rgba(16, 185, 129, 0.10)',
                '&:hover': { bgcolor: 'rgba(16, 185, 129, 0.14)' },
              },
            }}
          >
            <ListItemIcon sx={{ minWidth: collapsed ? 0 : 38, justifyContent: 'center' }}>
              <Icon fontSize="small" />
            </ListItemIcon>
            {!collapsed && (
              <ListItemText
                primary={item.label}
                primaryTypographyProps={{ variant: 'body2', fontWeight: active ? 700 : 500, noWrap: true }}
              />
            )}
          </ListItemButton>
        );

        return (
          <li key={item.to}>
            {collapsed ? (
              <Tooltip title={item.label} placement="right">
                {button}
              </Tooltip>
            ) : (
              button
            )}
          </li>
        );
      })}
    </List>
  );
}

/**
 * Desktop sidebar with a collapsible rail. The mobile variant reuses the same
 * nav definition inside a temporary Drawer (see AppLayout).
 */
export default function Sidebar({ collapsed, onToggleCollapse }) {
  const { user } = useAuth();

  return (
    <Box
      component="aside"
      sx={{
        width: collapsed ? tokens.layout.sidebarCollapsedWidth : tokens.layout.sidebarWidth,
        flexShrink: 0,
        borderRight: '1px solid',
        borderColor: 'divider',
        bgcolor: 'background.paper',
        display: 'flex',
        flexDirection: 'column',
        transition: 'width 180ms ease',
        overflow: 'hidden',
      }}
    >
      <Box sx={{ py: 2.25, minHeight: tokens.layout.headerHeight, display: 'flex', alignItems: 'center' }}>
        <Brand collapsed={collapsed} />
      </Box>

      <Divider />

      <Box sx={{ flexGrow: 1, py: 2, overflowY: 'auto' }}>
        <NavSection items={NAV_ITEMS} collapsed={collapsed} />
        <Divider sx={{ my: 1.5 }} />
        <NavSection items={SECONDARY_NAV_ITEMS} collapsed={collapsed} />
      </Box>

      <Divider />

      <Stack direction="row" alignItems="center" spacing={1.25} sx={{ p: collapsed ? 1.5 : 2 }}>
        <Avatar sx={{ width: 34, height: 34, bgcolor: tokens.color.navy, fontSize: 13, fontWeight: 700 }}>
          {initials(user?.name || 'User')}
        </Avatar>
        {!collapsed && (
          <Box sx={{ minWidth: 0, flexGrow: 1 }}>
            <Typography variant="body2" noWrap sx={{ fontWeight: 600 }}>
              {user?.name || 'Guest'}
            </Typography>
            <Typography variant="caption" color="text.secondary" noWrap sx={{ display: 'block' }}>
              {user?.email || ''}
            </Typography>
          </Box>
        )}
      </Stack>

      <IconButton
        onClick={onToggleCollapse}
        aria-label={collapsed ? 'Expand sidebar' : 'Collapse sidebar'}
        sx={{
          position: 'absolute',
          right: -14,
          top: 92,
          bgcolor: 'background.paper',
          border: '1px solid',
          borderColor: 'divider',
          width: 28,
          height: 28,
          '&:hover': { bgcolor: 'background.paper' },
        }}
      >
        {collapsed ? <ChevronRightRoundedIcon fontSize="small" /> : <ChevronLeftRoundedIcon fontSize="small" />}
      </IconButton>
    </Box>
  );
}

export function MobileNavDrawer({ onClose }) {
  const { user } = useAuth();
  const [collapsed] = useState(false);

  return (
    <Box sx={{ width: tokens.layout.sidebarWidth, pt: 1 }}>
      <Brand collapsed={collapsed} />
      <Divider sx={{ my: 2 }} />
      <Box sx={{ flexGrow: 1, overflowY: 'auto' }}>
        <NavSection items={NAV_ITEMS} collapsed={collapsed} onNavigate={onClose} />
        <Divider sx={{ my: 1.5 }} />
        <NavSection items={SECONDARY_NAV_ITEMS} collapsed={collapsed} onNavigate={onClose} />
      </Box>
      <Divider sx={{ my: 2 }} />
      <Stack direction="row" alignItems="center" spacing={1.25} sx={{ px: 1, pb: 1 }}>
        <Avatar sx={{ width: 34, height: 34, bgcolor: tokens.color.navy, fontSize: 13, fontWeight: 700 }}>
          {initials(user?.name || 'User')}
        </Avatar>
        <Box sx={{ minWidth: 0 }}>
          <Typography variant="body2" noWrap sx={{ fontWeight: 600 }}>
            {user?.name || 'Guest'}
          </Typography>
          <Typography variant="caption" color="text.secondary" noWrap sx={{ display: 'block' }}>
            {user?.email || ''}
          </Typography>
        </Box>
      </Stack>
    </Box>
  );
}
