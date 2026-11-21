import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { CssBaseline, ThemeProvider } from '@mui/material';
import { BrowserRouter } from 'react-router-dom';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import theme from '../theme';
import { AuthProvider } from '../features/auth/AuthContext';
import { QuickAddProvider } from '../features/transactions/QuickAddProvider';
import AppRouter from '../routes/AppRouter';

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: 1,
      refetchOnWindowFocus: false,
      staleTime: 30 * 1000,
    },
  },
});

export default function App() {
  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <QueryClientProvider client={queryClient}>
        <BrowserRouter>
          <AuthProvider>
            <QuickAddProvider>
              <AppRouter />
            </QuickAddProvider>
          </AuthProvider>
        </BrowserRouter>
      </QueryClientProvider>
      <ToastContainer position="bottom-right" theme="colored" autoClose={3500} />
    </ThemeProvider>
  );
}
