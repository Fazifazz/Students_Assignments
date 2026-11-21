import { Box, Chip, Stack, Typography } from '@mui/material';
import TrendingUpRoundedIcon from '@mui/icons-material/TrendingUpRounded';
import TrendingDownRoundedIcon from '@mui/icons-material/TrendingDownRounded';
import WarningAmberRoundedIcon from '@mui/icons-material/WarningAmberRounded';
import CheckCircleRoundedIcon from '@mui/icons-material/CheckCircleRounded';
import InfoOutlinedIcon from '@mui/icons-material/InfoOutlined';
import { EmptyState } from '../../../components/common/States';
import { INSIGHT_SEVERITY } from '../../../utils/constants';

const SEVERITY_STYLE = {
  [INSIGHT_SEVERITY.SUCCESS]: { color: 'success.main', bg: 'rgba(16,185,129,0.10)', icon: CheckCircleRoundedIcon, chip: 'Positive' },
  [INSIGHT_SEVERITY.WARNING]: { color: 'warning.main', bg: 'rgba(245,158,11,0.12)', icon: WarningAmberRoundedIcon, chip: 'Watch out' },
  [INSIGHT_SEVERITY.DANGER]: { color: 'error.main', bg: 'rgba(239,68,68,0.10)', icon: TrendingDownRoundedIcon, chip: 'Action needed' },
  [INSIGHT_SEVERITY.INFO]: { color: 'info.main', bg: 'rgba(59,130,246,0.10)', icon: InfoOutlinedIcon, chip: 'Insight' },
};

/**
 * Rule-based spending insights rendered from the backend insight feed.
 */
export default function InsightsPanel({ insights = [] }) {
  if (!insights.length) {
    return (
      <EmptyState
        icon={TrendingUpRoundedIcon}
        title="No insights yet"
        description="Add a few transactions and SpendWise will start highlighting patterns in your spending."
      />
    );
  }

  return (
    <Stack spacing={1.25}>
      {insights.map((insight) => {
        const style = SEVERITY_STYLE[insight.severity] || SEVERITY_STYLE[INSIGHT_SEVERITY.INFO];
        const Icon = style.icon;
        return (
          <Stack
            key={insight.id}
            direction="row"
            spacing={1.5}
            sx={{
              p: 1.5,
              borderRadius: 2.5,
              bgcolor: style.bg,
              border: '1px solid',
              borderColor: 'transparent',
            }}
          >
            <Box sx={{ color: style.color, display: 'flex', pt: 0.25 }}>
              <Icon fontSize="small" />
            </Box>
            <Box sx={{ minWidth: 0, flexGrow: 1 }}>
              <Stack direction="row" alignItems="center" spacing={1} sx={{ mb: 0.25 }}>
                <Typography variant="subtitle2">{insight.title}</Typography>
                <Chip label={style.chip} size="small" sx={{ bgcolor: 'background.paper', color: style.color }} />
              </Stack>
              <Typography variant="body2" color="text.secondary">
                {insight.message}
              </Typography>
            </Box>
          </Stack>
        );
      })}
    </Stack>
  );
}
