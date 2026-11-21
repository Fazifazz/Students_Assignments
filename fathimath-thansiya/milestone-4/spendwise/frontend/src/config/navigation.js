import DashboardRoundedIcon from '@mui/icons-material/DashboardRounded';
import ReceiptLongRoundedIcon from '@mui/icons-material/ReceiptLongRounded';
import CategoryRoundedIcon from '@mui/icons-material/CategoryRounded';
import AccountBalanceWalletRoundedIcon from '@mui/icons-material/AccountBalanceWalletRounded';
import FlagRoundedIcon from '@mui/icons-material/FlagRounded';
import InsightsRoundedIcon from '@mui/icons-material/InsightsRounded';
import PersonRoundedIcon from '@mui/icons-material/PersonRounded';
import SettingsRoundedIcon from '@mui/icons-material/SettingsRounded';

/** Primary application navigation. */
export const NAV_ITEMS = [
  { label: 'Dashboard', to: '/dashboard', icon: DashboardRoundedIcon },
  { label: 'Transactions', to: '/transactions', icon: ReceiptLongRoundedIcon },
  { label: 'Categories', to: '/categories', icon: CategoryRoundedIcon },
  { label: 'Budgets', to: '/budgets', icon: AccountBalanceWalletRoundedIcon },
  { label: 'Savings Goals', to: '/savings-goals', icon: FlagRoundedIcon },
  { label: 'Analytics', to: '/analytics', icon: InsightsRoundedIcon },
];

export const SECONDARY_NAV_ITEMS = [
  { label: 'Profile', to: '/profile', icon: PersonRoundedIcon },
  { label: 'Settings', to: '/settings', icon: SettingsRoundedIcon },
];
