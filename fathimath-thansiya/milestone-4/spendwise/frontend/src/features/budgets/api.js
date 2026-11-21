import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import {
  createBudget,
  deleteBudget,
  fetchBudgets,
  updateBudget,
} from '../../services/api/budgets';

export const budgetKeys = {
  all: ['budgets'],
  list: (params) => ['budgets', 'list', params],
};

export function useBudgets(params = {}) {
  return useQuery({
    queryKey: budgetKeys.list(params),
    queryFn: () => fetchBudgets(params),
    staleTime: 60 * 1000,
  });
}

function invalidate(queryClient) {
  queryClient.invalidateQueries({ queryKey: budgetKeys.all });
  queryClient.invalidateQueries({ queryKey: ['dashboard'] });
}

export function useCreateBudget() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: createBudget,
    onSuccess: () => invalidate(queryClient),
  });
}

export function useUpdateBudget() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, payload }) => updateBudget(id, payload),
    onSuccess: () => invalidate(queryClient),
  });
}

export function useDeleteBudget() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id) => deleteBudget(id),
    onSuccess: () => invalidate(queryClient),
  });
}
