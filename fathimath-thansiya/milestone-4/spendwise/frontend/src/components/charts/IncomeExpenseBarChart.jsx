import {
  Bar,
  BarChart,
  CartesianGrid,
  Legend,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts';
import { formatCompactCurrency, formatCurrency } from '../../utils/money';
import { tokens } from '../../theme';

/**
 * Monthly income vs expense comparison.
 * Amounts arrive as paise and are converted only for display.
 */
export default function IncomeExpenseBarChart({ data = [], height = 300 }) {
  return (
    <ResponsiveContainer width="100%" height={height}>
      <BarChart data={data} margin={{ top: 8, right: 8, left: -12, bottom: 0 }} barGap={4}>
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
          cursor={{ fill: 'rgba(23, 43, 77, 0.04)' }}
          formatter={(value, name) => [formatCurrency(value), name === 'incomePaise' ? 'Income' : 'Expenses']}
          contentStyle={{
            borderRadius: 12,
            border: `1px solid ${tokens.color.border}`,
            boxShadow: tokens.shadow.card,
            fontSize: 12,
          }}
        />
        <Legend
          verticalAlign="top"
          align="right"
          height={28}
          iconType="circle"
          iconSize={8}
          formatter={(value) => (value === 'incomePaise' ? 'Income' : 'Expenses')}
          wrapperStyle={{ fontSize: 12, color: tokens.color.textMuted }}
        />
        <Bar
          dataKey="incomePaise"
          fill={tokens.color.primary}
          radius={[6, 6, 0, 0]}
          maxBarSize={26}
          isAnimationActive={false}
        />
        <Bar
          dataKey="expensePaise"
          fill={tokens.color.navy}
          radius={[6, 6, 0, 0]}
          maxBarSize={26}
          isAnimationActive={false}
        />
      </BarChart>
    </ResponsiveContainer>
  );
}
