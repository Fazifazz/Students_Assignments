import { Box, Stack, Typography } from '@mui/material';
import { Cell, Pie, PieChart, ResponsiveContainer, Tooltip } from 'recharts';
import { formatCurrency, toPercentage } from '../../utils/money';
import { tokens } from '../../theme';

/**
 * Expense split by category. The legend is rendered outside the chart so the
 * category names stay readable on small screens.
 */
export default function CategoryPieChart({ data = [], height = 260 }) {
  const total = data.reduce((acc, item) => acc + item.valuePaise, 0);

  if (!data.length) {
    return (
      <Stack alignItems="center" justifyContent="center" sx={{ height }} spacing={1}>
        <Typography variant="body2" color="text.secondary">
          No expenses recorded yet
        </Typography>
      </Stack>
    );
  }

  return (
    <Stack spacing={2}>
      <Box sx={{ width: '100%', height, maxWidth: 260, mx: 'auto' }}>
        <ResponsiveContainer width="100%" height="100%">
          <PieChart>
            <Pie
              data={data}
              dataKey="valuePaise"
              nameKey="name"
              innerRadius="62%"
              outerRadius="92%"
              paddingAngle={2}
              stroke="none"
              isAnimationActive={false}
            >
              {data.map((entry) => (
                <Cell key={entry.name} fill={entry.color} />
              ))}
            </Pie>
            <Tooltip
              formatter={(value, name) => [formatCurrency(value), name]}
              contentStyle={{
                borderRadius: 12,
                border: `1px solid ${tokens.color.border}`,
                boxShadow: tokens.shadow.card,
                fontSize: 12,
              }}
            />
          </PieChart>
        </ResponsiveContainer>
      </Box>

      <Box
        sx={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))',
          columnGap: 2,
          rowGap: 0.75,
        }}
      >
        {data.slice(0, 6).map((item) => (
          <Stack key={item.name} direction="row" alignItems="center" spacing={1}>
            <Box
              sx={{
                width: 10,
                height: 10,
                borderRadius: '3px',
                bgcolor: item.color,
                flexShrink: 0,
              }}
            />
            <Typography variant="body2" noWrap sx={{ flexGrow: 1, minWidth: 0 }}>
              {item.name}
            </Typography>
            <Typography variant="caption" color="text.secondary" sx={{ flexShrink: 0 }}>
              {toPercentage(item.valuePaise, total).toFixed(0)}%
            </Typography>
            <Typography
              variant="body2"
              sx={{ fontWeight: 600, whiteSpace: 'nowrap', flexShrink: 0, minWidth: 84, textAlign: 'right' }}
            >
              {formatCurrency(item.valuePaise)}
            </Typography>
          </Stack>
        ))}
      </Box>
    </Stack>
  );
}
