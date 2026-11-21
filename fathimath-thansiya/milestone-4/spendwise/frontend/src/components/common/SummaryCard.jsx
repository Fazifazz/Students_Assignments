import { Box, Card, CardContent, Skeleton, Stack, Typography } from '@mui/material';
import TrendingDownRoundedIcon from '@mui/icons-material/TrendingDownRounded';
import TrendingUpRoundedIcon from '@mui/icons-material/TrendingUpRounded';
import { formatCurrency } from '../../utils/money';

const TONES = {
  primary: { bg: 'rgba(16, 185, 129, 0.10)', color: 'primary.main' },
  navy: { bg: 'rgba(23, 43, 77, 0.08)', color: 'secondary.main' },
  warning: { bg: 'rgba(245, 158, 11, 0.12)', color: 'warning.main' },
  danger: { bg: 'rgba(239, 68, 68, 0.10)', color: 'error.main' },
};

/**
 * Financial summary tile — balance, income, expenses, savings.
 * `trend` is an optional { value, label } pair rendered as a delta chip.
 */
export default function SummaryCard({
  title,
  amountPaise,
  caption,
  icon: Icon,
  tone = 'primary',
  trend,
  loading = false,
}) {
  const palette = TONES[tone] || TONES.primary;
  const isPositive = trend ? trend.value >= 0 : true;

  return (
    <Card sx={{ height: '100%' }}>
      <CardContent sx={{ p: 2.5, '&:last-child': { pb: 2.5 } }}>
        <Stack direction="row" alignItems="flex-start" justifyContent="space-between" spacing={2}>
          <Box sx={{ minWidth: 0 }}>
            <Typography variant="subtitle2" color="text.secondary" noWrap>
              {title}
            </Typography>
            {loading ? (
              <Skeleton variant="text" width={140} height={38} />
            ) : (
              <Typography variant="h4" sx={{ mt: 0.75, fontWeight: 700 }}>
                {formatCurrency(amountPaise)}
              </Typography>
            )}
          </Box>
          {Icon && (
            <Box
              sx={{
                display: 'grid',
                placeItems: 'center',
                width: 42,
                height: 42,
                borderRadius: 2.5,
                flexShrink: 0,
                bgcolor: palette.bg,
                color: palette.color,
              }}
            >
              <Icon fontSize="small" />
            </Box>
          )}
        </Stack>

        <Stack direction="row" alignItems="center" spacing={1} sx={{ mt: 1.75, minHeight: 24 }}>
          {trend && (
            <Stack
              direction="row"
              alignItems="center"
              spacing={0.25}
              sx={{
                color: isPositive ? 'success.main' : 'error.main',
                bgcolor: isPositive ? 'rgba(16,185,129,0.10)' : 'rgba(239,68,68,0.10)',
                borderRadius: 999,
                px: 0.75,
                py: 0.25,
              }}
            >
              {isPositive ? (
                <TrendingUpRoundedIcon sx={{ fontSize: 15 }} />
              ) : (
                <TrendingDownRoundedIcon sx={{ fontSize: 15 }} />
              )}
              <Typography variant="caption" sx={{ fontWeight: 700 }}>
                {Math.abs(trend.value).toFixed(1)}%
              </Typography>
            </Stack>
          )}
          {caption && (
            <Typography variant="caption" color="text.secondary" noWrap>
              {caption}
            </Typography>
          )}
        </Stack>
      </CardContent>
    </Card>
  );
}
