import { Box, LinearProgress, Stack, Typography } from '@mui/material';
import FlagRoundedIcon from '@mui/icons-material/FlagRounded';
import { EmptyState } from '../../../components/common/States';
import { formatCurrency } from '../../../utils/money';
import { formatDate } from '../../../utils/format';

/** Savings goals with completion percentage and progress bars. */
export default function SavingsGoalProgressList({ goals = [] }) {
  if (!goals.length) {
    return (
      <EmptyState
        icon={FlagRoundedIcon}
        title="No savings goals yet"
        description="Set a target and watch the bar fill as you save towards it."
      />
    );
  }

  return (
    <Stack spacing={2.25}>
      {goals.map((goal) => {
        const progress = Math.min(100, goal.progressPercent);
        const complete = goal.progressPercent >= 100;

        return (
          <Box key={goal._id}>
            <Stack direction="row" alignItems="flex-start" justifyContent="space-between" spacing={2}>
              <Box sx={{ minWidth: 0 }}>
                <Typography variant="body2" sx={{ fontWeight: 600 }} noWrap>
                  {goal.name}
                </Typography>
                <Typography variant="caption" color="text.secondary">
                  {complete ? 'Target reached 🎉' : `Target ${formatDate(goal.targetDate)}`}
                </Typography>
              </Box>
              <Typography variant="body2" sx={{ fontWeight: 700, whiteSpace: 'nowrap' }}>
                {goal.progressPercent.toFixed(0)}%
              </Typography>
            </Stack>

            <LinearProgress
              variant="determinate"
              value={progress}
              sx={{
                mt: 0.75,
                bgcolor: 'rgba(16,185,129,0.12)',
                '& .MuiLinearProgress-bar': { bgcolor: complete ? 'success.dark' : 'primary.main' },
              }}
            />

            <Stack direction="row" justifyContent="space-between" sx={{ mt: 0.5 }}>
              <Typography variant="caption" color="text.secondary">
                {formatCurrency(goal.currentAmountPaise)} saved
              </Typography>
              <Typography variant="caption" color="text.secondary">
                {formatCurrency(goal.targetAmountPaise)} target
              </Typography>
            </Stack>
          </Box>
        );
      })}
    </Stack>
  );
}
