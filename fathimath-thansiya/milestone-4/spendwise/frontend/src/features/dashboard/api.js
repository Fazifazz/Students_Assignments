import { useQuery } from '@tanstack/react-query';
import {
  fetchDashboardSummary,
  fetchRecentTransactions,
  fetchSpendingOverview,
} from '../../services/api/dashboard';

export const dashboardKeys = {
  all: ['dashboard'],
  summary: ['dashboard', 'summary'],
  recent: (limit) => ['dashboard', 'recent', limit],
  overview: ['dashboard', 'overview'],
};

export function useDashboardSummary() {
  return useQuery({
    queryKey: dashboardKeys.summary,
    queryFn: fetchDashboardSummary,
    staleTime: 60 * 1000,
  });
}

export function useRecentTransactions(limit = 8) {
  return useQuery({
    queryKey: dashboardKeys.recent(limit),
    queryFn: () => fetchRecentTransactions(limit),
    staleTime: 30 * 1000,
  });
}

export function useSpendingOverview() {
  return useQuery({
    queryKey: dashboardKeys.overview,
    queryFn: fetchSpendingOverview,
    staleTime: 60 * 1000,
  });
}
