import { useState } from 'react';
import { Outlet } from 'react-router-dom';
import { Box, Drawer } from '@mui/material';
import Sidebar, { MobileNavDrawer } from '../components/layout/Sidebar';
import Header from '../components/layout/Header';
import { useQuickAdd } from '../features/transactions/useQuickAdd';
import { tokens } from '../theme';

/**
 * Application shell: collapsible desktop sidebar, mobile drawer and the
 * sticky header. Feature pages render through the <Outlet />.
 */
export default function AppLayout() {
  const [collapsed, setCollapsed] = useState(false);
  const [drawerOpen, setDrawerOpen] = useState(false);
  const { openQuickAdd } = useQuickAdd();

  return (
    <Box sx={{ display: 'flex', minHeight: '100vh', bgcolor: 'background.default' }}>
      <Box sx={{ display: { xs: 'none', md: 'block' }, position: 'relative' }}>
        <Sidebar collapsed={collapsed} onToggleCollapse={() => setCollapsed((value) => !value)} />
      </Box>

      <Drawer
        open={drawerOpen}
        onClose={() => setDrawerOpen(false)}
        variant="temporary"
        ModalProps={{ keepMounted: true }}
        sx={{
          display: { xs: 'block', md: 'none' },
          '& .MuiDrawer-paper': { width: tokens.layout.sidebarWidth, borderRight: '1px solid', borderColor: 'divider' },
        }}
      >
        <MobileNavDrawer onClose={() => setDrawerOpen(false)} />
      </Drawer>

      <Box sx={{ flexGrow: 1, minWidth: 0, display: 'flex', flexDirection: 'column' }}>
        <Header onOpenDrawer={() => setDrawerOpen(true)} onQuickAdd={() => openQuickAdd()} />
        <Box component="main" sx={{ flexGrow: 1, p: { xs: 2, md: 3 } }}>
          <Outlet />
        </Box>
      </Box>
    </Box>
  );
}
