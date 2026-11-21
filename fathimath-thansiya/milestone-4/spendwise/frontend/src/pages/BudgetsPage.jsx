import { useMemo, useState } from 'react';
import {
  Avatar,
  Box,
  Button,
  Card,
  Chip,
  IconButton,
  LinearProgress,
  MenuItem,
  Stack,
  TextField,
  Tooltip,
  Typography,
} from '@mui/material';
import AddRoundedIcon from '@mui/icons-material/AddRounded';
import EditRoundedIcon from '@mui/icons-material/EditRounded';
import DeleteOutlineRoundedIcon from '@mui/icons-material/DeleteOutlineRounded';
import { toast } from 'react-toastify';
import PageHeader from '../components/common/PageHeader';
import ConfirmDialog from '../components/common/ConfirmDialog';
import { EmptyState, ErrorState, LoadingSkeleton } from '../components/common/States';
import BudgetFormDialog from '../features/budgets/components/BudgetFormDialog';
import { useBudgets, useDeleteBudget } from '../features/budgets/api';
import { formatCurrency } from '../utils/money';

const MONTHS = [
  'January', 'February', 'March', 'April', 'May', 'June',
  'July', 'August', 'September', 'October', 'November', 'December',
];

const STATUS_META = {
  SAFE: { label: 'On track', color: 'success.main' },
  WARNING: { label: 'Near limit', color: 'warning.main' },
  EXCEEDED: { label: 'Exceeded', color: 'error.main' },
};

/**
 * Monthly budget screen. Spend figures always come from the API — they are
 * derived from the transaction ledger, never stored on the budget itself.
 */
export default function BudgetsPage() {
  const now = useMemo(() => new Date(), []);
  const [selectedMonth, setSelectedMonth] = useState(now.getMonth() + 1);
  const [selectedYear, setSelectedYear] = useState(now.getFullYear());

  const [formOpen, setFormOpen] = useState(false);
  const [editing, setEditing] = useState(null);
  const [pendingDelete, setPendingDelete] = useState(null);

  const params = useMemo(
    () => ({ month: selectedMonth, year: selectedYear }),
    [selectedMonth, selectedYear],
  );

  const { data, isLoading, isError, error, refetch } = useBudgets(params);
  const deleteBudget = useDeleteBudget();

  // The list endpoint returns the array of budgets directly.
  const budgets = useMemo(() => data || [], [data]);

  const totals = useMemo(
    () =>
      budgets.reduce(
        (acc, budget) => ({
          budgeted: acc.budgeted + budget.amountPaise,
          spent: acc.spent + budget.spentPaise,
        }),
        { budgeted: 0, spent: 0 },
      ),
    [budgets],
  );

  const years = useMemo(() => {
    const current = now.getFullYear();
    return [current - 2, current - 1, current, current + 1];
  }, [now]);

  const handleDelete = async () => {
    try {
      await deleteBudget.mutateAsync(pendingDelete._id);
      toast.success('Budget deleted');
      setPendingDelete(null);
    } catch (requestError) {
      toast.error(requestError.message);
    }
  };

  return (
    <Stack spacing={3}>
      <PageHeader
        title="Budgets"
        subtitle="Set monthly category limits and track how much is left."
        actions={
          <Button
            variant="contained"
            startIcon={<AddRoundedIcon />}
            onClick={() => {
              setEditing(null);
              setFormOpen(true);
            }}
          >
            Add budget
          </Button>
        }
      />

      <Card sx={{ p: 2 }}>
        <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2}>
          <TextField
            size="small"
            select
            label="Month"
            value={selectedMonth}
            onChange={(event) => setSelectedMonth(Number(event.target.value))}
            sx={{ minWidth: 160 }}
          >
            {MONTHS.map((month, index) => (
              <MenuItem key={month} value={index + 1}>
                {month}
              </MenuItem>
            ))}
          </TextField>

          <TextField
            size="small"
            select
            label="Year"
            value={selectedYear}
            onChange={(event) => setSelectedYear(Number(event.target.value))}
            sx={{ minWidth: 120 }}
          >
            {years.map((year) => (
              <MenuItem key={year} value={year}>
                {year}
              </MenuItem>
            ))}
          </TextField>
        </Stack>
      </Card>

      {budgets.length > 0 && (
        <Box
          sx={{
            display: 'grid',
            gridTemplateColumns: { xs: '1fr', sm: 'repeat(3, 1fr)' },
            gap: 2,
          }}
        >
          <Card sx={{ p: 2 }}>
            <Typography variant="subtitle2" color="text.secondary">
              Total budgeted
            </Typography>
            <Typography variant="h4">{formatCurrency(totals.budgeted)}</Typography>
          </Card>
          <Card sx={{ p: 2 }}>
            <Typography variant="subtitle2" color="text.secondary">
              Total spent
            </Typography>
            <Typography variant="h4">{formatCurrency(totals.spent)}</Typography>
          </Card>
          <Card sx={{ p: 2 }}>
            <Typography variant="subtitle2" color="text.secondary">
              {totals.spent > totals.budgeted ? 'Over budget by' : 'Still available'}
            </Typography>
            <Typography
              variant="h4"
              sx={{ color: totals.spent > totals.budgeted ? 'error.main' : 'success.main' }}
            >
              {formatCurrency(Math.abs(totals.budgeted - totals.spent))}
            </Typography>
          </Card>
        </Box>
      )}

      {isLoading ? (
        <LoadingSkeleton count={4} height={140} />
      ) : isError ? (
        <ErrorState message={error?.message} onRetry={refetch} />
      ) : budgets.length === 0 ? (
        <Card>
          <EmptyState
            title="No budgets for this month"
            description="Create a category budget to keep monthly spending under control."
            action={
              <Button
                variant="contained"
                startIcon={<AddRoundedIcon />}
                onClick={() => {
                  setEditing(null);
                  setFormOpen(true);
                }}
              >
                Create a budget
              </Button>
            }
          />
        </Card>
      ) : (
        <Box
          sx={{
            display: 'grid',
            gridTemplateColumns: { xs: '1fr', md: 'repeat(2, 1fr)' },
            gap: 2,
          }}
        >
          {budgets.map((budget) => {
            const meta = STATUS_META[budget.status] || STATUS_META.SAFE;
            return (
              <Card key={budget._id} sx={{ p: 2.5 }}>
                <Stack direction="row" alignItems="center" spacing={1.5}>
                  <Avatar
                    variant="rounded"
                    sx={{
                      width: 42,
                      height: 42,
                      bgcolor: `${budget.category?.color || '#10B981'}1A`,
                      fontSize: 20,
                    }}
                  >
                    {budget.category?.icon || '💸'}
                  </Avatar>
                  <Box sx={{ minWidth: 0, flexGrow: 1 }}>
                    <Stack direction="row" alignItems="center" spacing={1}>
                      <Typography variant="body1" sx={{ fontWeight: 600 }} noWrap>
                        {budget.category?.name || 'Category'}
                      </Typography>
                      <Chip
                        label={meta.label}
                        size="small"
                        sx={{ bgcolor: `${meta.color}1F`, color: meta.color }}
                      />
                    </Stack>
                    <Typography variant="caption" color="text.secondary">
                      {formatCurrency(budget.spentPaise)} spent of {formatCurrency(budget.amountPaise)}
                    </Typography>
                  </Box>
                  <Stack direction="row" spacing={0.5}>
                    <Tooltip title="Edit budget">
                      <IconButton
                        size="small"
                        onClick={() => {
                          setEditing(budget);
                          setFormOpen(true);
                        }}
                      >
                        <EditRoundedIcon fontSize="small" />
                      </IconButton>
                    </Tooltip>
                    <Tooltip title="Delete budget">
                      <IconButton size="small" color="error" onClick={() => setPendingDelete(budget)}>
                        <DeleteOutlineRoundedIcon fontSize="small" />
                      </IconButton>
                    </Tooltip>
                  </Stack>
                </Stack>

                <LinearProgress
                  variant="determinate"
                  value={Math.min(100, budget.usagePercent)}
                  sx={{
                    mt: 2,
                    bgcolor: `${meta.color}1F`,
                    '& .MuiLinearProgress-bar': { bgcolor: meta.color },
                  }}
                />

                <Stack direction="row" justifyContent="space-between" sx={{ mt: 0.75 }}>
                  <Typography variant="caption" color="text.secondary">
                    {budget.usagePercent.toFixed(0)}% used
                  </Typography>
                  <Typography
                    variant="caption"
                    sx={{ color: budget.remainingPaise < 0 ? 'error.main' : 'text.secondary' }}
                  >
                    {budget.remainingPaise < 0
                      ? `${formatCurrency(Math.abs(budget.remainingPaise))} over budget`
                      : `${formatCurrency(budget.remainingPaise)} remaining`}
                  </Typography>
                </Stack>
              </Card>
            );
          })}
        </Box>
      )}

      <BudgetFormDialog
        open={formOpen}
        budget={editing}
        defaultMonth={selectedMonth}
        defaultYear={selectedYear}
        onClose={() => {
          setFormOpen(false);
          setEditing(null);
        }}
      />

      <ConfirmDialog
        open={Boolean(pendingDelete)}
        title="Delete budget"
        message={
          pendingDelete
            ? `Delete the ${pendingDelete.category?.name || ''} budget for ${MONTHS[pendingDelete.month - 1]} ${pendingDelete.year}?`
            : ''
        }
        confirmLabel="Delete"
        destructive
        loading={deleteBudget.isPending}
        onConfirm={handleDelete}
        onClose={() => setPendingDelete(null)}
      />
    </Stack>
  );
}
