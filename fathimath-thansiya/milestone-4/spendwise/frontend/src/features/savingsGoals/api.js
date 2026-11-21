import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import {
  createSavingsGoal,
  deleteSavingsGoal,
  fetchSavingsGoals,
  updateSavingsGoal,
} from '../../services/api/savingsGoals';

export const savingsGoalKeys = {
  all: ['savings-goals'],
};

export function useSavingsGoals() {
  return useQuery({
    queryKey: savingsGoalKeys.all,
    queryFn: fetchSavingsGoals,
    staleTime: 60 * 1000,
  });
}

function invalidate(queryClient) {
  queryClient.invalidateQueries({ queryKey: savingsGoalKeys.all });
  queryClient.invalidateQueries({ queryKey: ['dashboard'] });
}

export function useCreateSavingsGoal() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: createSavingsGoal,
    onSuccess: () => invalidate(queryClient),
  });
}

export function useUpdateSavingsGoal() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, payload }) => updateSavingsGoal(id, payload),
    onSuccess: () => invalidate(queryClient),
  });
}

export function useDeleteSavingsGoal() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id) => deleteSavingsGoal(id),
    onSuccess: () => invalidate(queryClient),
  });
}
