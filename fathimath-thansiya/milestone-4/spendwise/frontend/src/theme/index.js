import { alpha, createTheme } from '@mui/material/styles';

/**
 * SpendWise design tokens.
 * Single source of truth for colours, radii and shadows — components read from
 * the MUI theme so a token change propagates everywhere.
 */
export const tokens = {
  color: {
    primary: '#10B981',
    primaryDark: '#059669',
    primaryLight: '#D1FAE5',
    navy: '#172B4D',
    navyLight: '#243B63',
    background: '#F8FAFC',
    surface: '#FFFFFF',
    text: '#0F172A',
    textMuted: '#64748B',
    border: '#E2E8F0',
    success: '#10B981',
    warning: '#F59E0B',
    danger: '#EF4444',
    info: '#3B82F6',
  },
  radius: {
    sm: 8,
    md: 12,
    lg: 16,
    pill: 999,
  },
  shadow: {
    card: '0 1px 2px rgba(15, 23, 42, 0.04), 0 8px 24px -12px rgba(15, 23, 42, 0.12)',
    raised: '0 12px 32px -16px rgba(15, 23, 42, 0.28)',
  },
  layout: {
    sidebarWidth: 264,
    sidebarCollapsedWidth: 84,
    headerHeight: 72,
  },
};

/** Chart series palette — muted, brand-consistent, colour-blind safe ordering. */
export const chartPalette = [
  tokens.color.primary,
  tokens.color.navy,
  tokens.color.warning,
  tokens.color.info,
  '#8B5CF6',
  '#EC4899',
  '#14B8A6',
  '#F97316',
];

const theme = createTheme({
  palette: {
    mode: 'light',
    primary: {
      main: tokens.color.primary,
      dark: tokens.color.primaryDark,
      light: tokens.color.primaryLight,
      contrastText: '#FFFFFF',
    },
    secondary: { main: tokens.color.navy, dark: '#0F1F3A', light: tokens.color.navyLight },
    success: { main: tokens.color.success },
    warning: { main: tokens.color.warning },
    error: { main: tokens.color.danger },
    info: { main: tokens.color.info },
    background: { default: tokens.color.background, paper: tokens.color.surface },
    text: { primary: tokens.color.text, secondary: tokens.color.textMuted },
    divider: tokens.color.border,
  },
  shape: { borderRadius: tokens.radius.md },
  typography: {
    fontFamily: '"Inter", "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif',
    h1: { fontSize: '2rem', fontWeight: 700, letterSpacing: '-0.02em' },
    h2: { fontSize: '1.5rem', fontWeight: 700, letterSpacing: '-0.01em' },
    h3: { fontSize: '1.25rem', fontWeight: 600 },
    h4: { fontSize: '1.125rem', fontWeight: 600 },
    h5: { fontSize: '1rem', fontWeight: 600 },
    h6: { fontSize: '0.9375rem', fontWeight: 600 },
    subtitle1: { fontSize: '0.9375rem', fontWeight: 500 },
    subtitle2: { fontSize: '0.8125rem', fontWeight: 600, letterSpacing: '0.02em' },
    body1: { fontSize: '0.9375rem' },
    body2: { fontSize: '0.8125rem' },
    caption: { fontSize: '0.75rem' },
    button: { fontWeight: 600, textTransform: 'none', letterSpacing: 0 },
  },
  components: {
    MuiCssBaseline: {
      styleOverrides: {
        body: {
          backgroundColor: tokens.color.background,
          color: tokens.color.text,
          WebkitFontSmoothing: 'antialiased',
        },
        '*::-webkit-scrollbar': { width: 8, height: 8 },
        '*::-webkit-scrollbar-thumb': {
          backgroundColor: alpha(tokens.color.navy, 0.18),
          borderRadius: tokens.radius.pill,
        },
        '*::-webkit-scrollbar-track': { backgroundColor: 'transparent' },
      },
    },
    MuiPaper: {
      styleOverrides: {
        root: { backgroundImage: 'none' },
        outlined: { borderColor: tokens.color.border },
      },
    },
    MuiCard: {
      styleOverrides: {
        root: {
          borderRadius: tokens.radius.lg,
          border: `1px solid ${tokens.color.border}`,
          boxShadow: tokens.shadow.card,
          backgroundImage: 'none',
        },
      },
    },
    MuiButton: {
      defaultProps: { disableElevation: true },
      styleOverrides: {
        root: { borderRadius: tokens.radius.sm, paddingInline: 16, minHeight: 40 },
        sizeSmall: { minHeight: 32 },
        containedPrimary: {
          boxShadow: `0 6px 16px -8px ${alpha(tokens.color.primary, 0.9)}`,
          '&:hover': { boxShadow: `0 8px 20px -8px ${alpha(tokens.color.primary, 0.9)}` },
        },
      },
    },
    MuiIconButton: {
      styleOverrides: { root: { borderRadius: tokens.radius.sm } },
    },
    MuiChip: {
      styleOverrides: {
        root: { borderRadius: tokens.radius.pill, fontWeight: 600 },
        sizeSmall: { height: 24, fontSize: '0.6875rem' },
      },
    },
    MuiOutlinedInput: {
      styleOverrides: {
        root: {
          borderRadius: tokens.radius.sm,
          backgroundColor: tokens.color.surface,
          '& fieldset': { borderColor: tokens.color.border },
          '&:hover fieldset': { borderColor: alpha(tokens.color.navy, 0.35) },
        },
        input: { paddingTop: 12, paddingBottom: 12 },
      },
    },
    MuiTableCell: {
      styleOverrides: {
        head: {
          fontWeight: 600,
          fontSize: '0.75rem',
          textTransform: 'uppercase',
          letterSpacing: '0.04em',
          color: tokens.color.textMuted,
          backgroundColor: tokens.color.background,
          whiteSpace: 'nowrap',
        },
        root: { borderColor: tokens.color.border },
      },
    },
    MuiLinearProgress: {
      styleOverrides: {
        root: { height: 8, borderRadius: tokens.radius.pill, backgroundColor: alpha(tokens.color.navy, 0.08) },
        bar: { borderRadius: tokens.radius.pill },
      },
    },
    MuiTooltip: {
      styleOverrides: {
        tooltip: { backgroundColor: tokens.color.navy, fontSize: '0.75rem', borderRadius: 8 },
      },
    },
    MuiDialog: {
      styleOverrides: { paper: { borderRadius: tokens.radius.lg } },
    },
    MuiDrawer: {
      styleOverrides: { paper: { backgroundImage: 'none' } },
    },
  },
});

export default theme;
