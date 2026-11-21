import { useQuery } from '@tanstack/react-query';
import {
  fetchCategoryAnalytics,
  fetchMonthlyAnalytics,
  fetchTrends,
} from '../../services/api/analytics';

export const analyticsKeys = {
  all: ['analytics'],
  monthly: (params) => ['analytics', 'monthly', params],
  categories: (params) => ['analytics', 'categories', params],
  trends: (params) => ['analytics', 'trends', params],
};

export function useMonthlyAnalytics(params = {}) {
  return useQuery({
    queryKey: analyticsKeys.monthly(params),
    queryFn: () => fetchMonthlyAnalytics(params),
    staleTime: 60 * 1000,
  });
}

export function useCategoryAnalytics(params = {}) {
  return useQuery({
    queryKey: analyticsKeys.categories(params),
    queryFn: () => fetchCategoryAnalytics(params),
    staleTime: 60 * 1000,
  });
}

export function useTrends(params = {}) {
  return useQuery({
    queryKey: analyticsKeys.trends(params),
    queryFn: () => fetchTrends(params),
    staleTime: 60 * 1000,
  });
}
