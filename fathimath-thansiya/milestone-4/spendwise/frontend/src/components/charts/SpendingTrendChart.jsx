import {
  CartesianGrid,
  Line,
  LineChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts';
import { formatCompactCurrency, formatCurrency } from '../../utils/money';
import { tokens } from '../../theme';

/** Monthly spending trend line. */
export default function SpendingTrendChart({ data = [], height = 260 }) {
  return (
    <ResponsiveContainer width="100%" height={height}>
      <LineChart data={data} margin={{ top: 8, right: 12, left: -12, bottom: 0 }}>
        <CartesianGrid strokeDasharray="4 4" vertical={false} stroke={tokens.color.border} />
        <XAxis
          dataKey="label"
          axisLine={false}
          tickLine={false}
          tick={{ fill: tokens.color.textMuted, fontSize: 12 }}
          dy={6}
        />
        <YAxis
          axisLine={false}
          tickLine={false}
          width={64}
          tick={{ fill: tokens.color.textMuted, fontSize: 12 }}
          tickFormatter={formatCompactCurrency}
        />
        <Tooltip
          formatter={(value) => [formatCurrency(value), 'Spent']}
          contentStyle={{
            borderRadius: 12,
            border: `1px solid ${tokens.color.border}`,
            boxShadow: tokens.shadow.card,
            fontSize: 12,
          }}
        />
        <Line
          type="monotone"
          dataKey="expensePaise"
          stroke={tokens.color.primary}
          strokeWidth={2.5}
          dot={{ r: 3, fill: tokens.color.primary, strokeWidth: 0 }}
          activeDot={{ r: 5 }}
          isAnimationActive={false}
        />
      </LineChart>
    </ResponsiveContainer>
  );
}
