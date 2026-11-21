import { useState } from 'react';
import {
  Box,
  Button,
  Card,
  Chip,
  IconButton,
  LinearProgress,
  Stack,
  Tooltip,
  Typography,
} from '@mui/material';
import AddRoundedIcon from '@mui/icons-material/AddRounded';
import EditRoundedIcon from '@mui/icons-material/EditRounded';
import DeleteOutlineRoundedIcon from '@mui/icons-material/DeleteOutlineRounded';
import AccountBalanceWalletRoundedIcon from '@mui/icons-material/AccountBalanceWalletRounded';
import { toast } from 'react-toastify';
import PageHeader from '../components/common/PageHeader';
import ConfirmDialog from '../components/common/ConfirmDialog';
import { EmptyState, ErrorState, LoadingSkeleton } from '../components/common/States';
import SavingsGoalFormDialog from '../features/savingsGoals/components/SavingsGoalFormDialog';
import ContributeDialog from '../features/savingsGoals/components/ContributeDialog';
import { useSavingsGoals, useDeleteSavingsGoal } from '../features/savingsGoals/api';
import { formatCurrency } from '../utils/money';
import { formatDate } from '../utils/format';

/**
 * Savings goals screen — create goals, add contributions and track progress.
 */
export default function SavingsGoalsPage() {
  const { data, isLoading, isError, error, refetch } = useSavingsGoals();
  const deleteGoal = useDeleteSavingsGoal();

  const [formOpen, setFormOpen] = useState(false);
  const [editing, setEditing] = useState(null);
  const [contributing, setContributing] = useState(null);
  const [pendingDelete, setPendingDelete] = useState(null);

  // The list endpoint returns the array of goals directly.
  const goals = data || [];

  const handleDelete = async () => {
    try {
      await deleteGoal.mutateAsync(pendingDelete._id);
      toast.success('Savings goal deleted');
      setPendingDelete(null);
    } catch (requestError) {
      toast.error(requestError.message);
    }
  };

  return (
    <Stack spacing={3}>
      <PageHeader
        title="Savings goals"
        subtitle="Set a target, add money regularly and watch the progress."
        actions={
          <Button
            variant="contained"
            startIcon={<AddRoundedIcon />}
            onClick={() => {
              setEditing(null);
              setFormOpen(true);
            }}
          >
            New goal
          </Button>
        }
      />

      {isLoading ? (
        <LoadingSkeleton count={3} height={180} />
      ) : isError ? (
        <ErrorState message={error?.message} onRetry={refetch} />
      ) : goals.length === 0 ? (
        <Card>
          <EmptyState
            title="No savings goals yet"
            description="Create a goal for something you are saving towards — an emergency fund, a trip, a laptop."
            action={
              <Button
                variant="contained"
                startIcon={<AddRoundedIcon />}
                onClick={() => {
                  setEditing(null);
                  setFormOpen(true);
                }}
              >
                Create a goal
              </Button>
            }
          />
        </Card>
      ) : (
        <Box
          sx={{
            display: 'grid',
            gridTemplateColumns: { xs: '1fr', sm: 'repeat(2, 1fr)', lg: 'repeat(3, 1fr)' },
            gap: 2,
          }}
        >
          {goals.map((goal) => (
            <Card key={goal._id} sx={{ p: 2.5, display: 'flex', flexDirection: 'column' }}>
              <Stack direction="row" alignItems="flex-start" justifyContent="space-between" spacing={1}>
                <Box sx={{ minWidth: 0 }}>
                  <Stack direction="row" alignItems="center" spacing={1}>
                    <Typography variant="h5" noWrap>
                      {goal.name}
                    </Typography>
                    {goal.completed && <Chip label="Completed" size="small" color="success" />}
                  </Stack>
                  {goal.description && (
                    <Typography variant="body2" color="text.secondary" sx={{ mt: 0.25 }}>
                      {goal.description}
                    </Typography>
                  )}
                </Box>
                <Stack direction="row" spacing={0.5}>
                  <Tooltip title="Edit goal">
                    <IconButton
                      size="small"
                      onClick={() => {
                        setEditing(goal);
                        setFormOpen(true);
                      }}
                    >
                      <EditRoundedIcon fontSize="small" />
                    </IconButton>
                  </Tooltip>
                  <Tooltip title="Delete goal">
                    <IconButton size="small" color="error" onClick={() => setPendingDelete(goal)}>
                      <DeleteOutlineRoundedIcon fontSize="small" />
                    </IconButton>
                  </Tooltip>
                </Stack>
              </Stack>

              <Box sx={{ mt: 2.5 }}>
                <Stack direction="row" alignItems="baseline" justifyContent="space-between">
                  <Typography variant="h4">{goal.progressPercent.toFixed(0)}%</Typography>
                  <Typography variant="caption" color="text.secondary">
                    Target {formatDate(goal.targetDate)}
                  </Typography>
                </Stack>
                <LinearProgress
                  variant="determinate"
                  value={goal.progressPercent}
                  sx={{
                    mt: 1,
                    bgcolor: 'rgba(16,185,129,0.12)',
                    '& .MuiLinearProgress-bar': { bgcolor: goal.completed ? 'success.dark' : 'primary.main' },
                  }}
                />
                <Stack direction="row" justifyContent="space-between" sx={{ mt: 0.75 }}>
                  <Typography variant="caption" color="text.secondary">
                    {formatCurrency(goal.currentAmountPaise)} saved
                  </Typography>
                  <Typography variant="caption" color="text.secondary">
                    {formatCurrency(goal.targetAmountPaise)} target
                  </Typography>
                </Stack>
              </Box>

              <Box sx={{ flexGrow: 1 }} />

              <Button
                fullWidth
                variant="outlined"
                startIcon={<AccountBalanceWalletRoundedIcon />}
                sx={{ mt: 2 }}
                onClick={() => setContributing(goal)}
              >
                Add money
              </Button>
            </Card>
          ))}
        </Box>
      )}

      <SavingsGoalFormDialog
        open={formOpen}
        goal={editing}
        onClose={() => {
          setFormOpen(false);
          setEditing(null);
        }}
      />

      <ContributeDialog
        goal={contributing}
        onClose={() => setContributing(null)}
      />

      <ConfirmDialog
        open={Boolean(pendingDelete)}
        title="Delete savings goal"
        message={pendingDelete ? `Delete "${pendingDelete.name}"? This cannot be undone.` : ''}
        confirmLabel="Delete"
        destructive
        loading={deleteGoal.isPending}
        onConfirm={handleDelete}
        onClose={() => setPendingDelete(null)}
      />
    </Stack>
  );
}
