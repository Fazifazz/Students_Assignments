import { Box, LinearProgress, Stack, Typography } from '@mui/material';
import { EmptyState } from '../../../components/common/States';
import { formatCurrency } from '../../../utils/money';
import { budgetStatus } from '../../../utils/budget';
import AccountBalanceWalletRoundedIcon from '@mui/icons-material/AccountBalanceWalletRounded';

/**
 * Monthly budget utilisation list — actual spend vs limit, with remaining
 * amount and a status colour scale.
 */
export default function BudgetProgressList({ budgets = [] }) {
  if (!budgets.length) {
    return (
      <EmptyState
        icon={AccountBalanceWalletRoundedIcon}
        title="No budgets this month"
        description="Create a category budget to keep monthly spending under control."
      />
    );
  }

  return (
    <Stack spacing={2}>
      {budgets.map((budget) => {
        const { color, label } = budgetStatus(budget.usagePercent);
        const remaining = budget.remainingPaise;

        return (
          <Box key={budget._id}>
            <Stack direction="row" alignItems="center" justifyContent="space-between" sx={{ mb: 0.75 }}>
              <Stack direction="row" alignItems="center" spacing={1} sx={{ minWidth: 0 }}>
                <Typography variant="body2" sx={{ fontWeight: 600 }} noWrap>
                  {budget.category?.icon} {budget.category?.name}
                </Typography>
                <Typography variant="caption" sx={{ color, fontWeight: 700 }}>
                  {label}
                </Typography>
              </Stack>
              <Typography variant="caption" color="text.secondary">
                {formatCurrency(budget.spentPaise)} / {formatCurrency(budget.amountPaise)}
              </Typography>
            </Stack>

            <LinearProgress
              variant="determinate"
              value={Math.min(100, budget.usagePercent)}
              sx={{ bgcolor: `${color}1F`, '& .MuiLinearProgress-bar': { bgcolor: color } }}
            />

            <Stack direction="row" justifyContent="space-between" sx={{ mt: 0.5 }}>
              <Typography variant="caption" color="text.secondary">
                {budget.usagePercent.toFixed(0)}% used
              </Typography>
              <Typography variant="caption" sx={{ color: remaining < 0 ? 'error.main' : 'text.secondary' }}>
                {remaining < 0
                  ? `${formatCurrency(Math.abs(remaining))} over budget`
                  : `${formatCurrency(remaining)} remaining`}
              </Typography>
            </Stack>
          </Box>
        );
      })}
    </Stack>
  );
}
