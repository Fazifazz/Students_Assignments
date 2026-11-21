import { useMemo, useState } from 'react';
import {
  Avatar,
  Box,
  Card,
  LinearProgress,
  MenuItem,
  Stack,
  TextField,
  Typography,
} from '@mui/material';
import TrendingUpRoundedIcon from '@mui/icons-material/TrendingUpRounded';
import TrendingDownRoundedIcon from '@mui/icons-material/TrendingDownRounded';
import SavingsRoundedIcon from '@mui/icons-material/SavingsRounded';
import AccountBalanceWalletRoundedIcon from '@mui/icons-material/AccountBalanceWalletRounded';
import PageHeader from '../components/common/PageHeader';
import SectionCard from '../components/common/Card';
import SummaryCard from '../components/common/SummaryCard';
import IncomeExpenseBarChart from '../components/charts/IncomeExpenseBarChart';
import CategoryPieChart from '../components/charts/CategoryPieChart';
import SpendingTrendChart from '../components/charts/SpendingTrendChart';
import { EmptyState, ErrorState, LoadingSkeleton } from '../components/common/States';
import { useMonthlyAnalytics, useCategoryAnalytics, useTrends } from '../features/analytics/api';
import { formatCurrency } from '../utils/money';

const MONTHS = [
  'January', 'February', 'March', 'April', 'May', 'June',
  'July', 'August', 'September', 'October', 'November', 'December',
];

/**
 * Analytics page — monthly reports, category analysis and spending trends,
 * all computed by the backend from the transaction ledger.
 */
export default function AnalyticsPage() {
  const now = useMemo(() => new Date(), []);
  const [selectedMonth, setSelectedMonth] = useState(now.getMonth() + 1);
  const [selectedYear, setSelectedYear] = useState(now.getFullYear());

  const monthlyParams = useMemo(() => ({ year: selectedYear }), [selectedYear]);
  const categoryParams = useMemo(
    () => ({ month: selectedMonth, year: selectedYear }),
    [selectedMonth, selectedYear],
  );

  const monthlyQuery = useMonthlyAnalytics(monthlyParams);
  const categoryQuery = useCategoryAnalytics(categoryParams);
  const trendsQuery = useTrends({ months: 12 });

  const monthlyItems = monthlyQuery.data?.items || [];
  const currentKey = `${selectedYear}-${String(selectedMonth).padStart(2, '0')}`;
  const currentMonth = monthlyItems.find((item) => item.month === currentKey);

  const barData = monthlyItems.map((item) => ({
    label: item.label,
    incomePaise: item.incomePaise,
    expensePaise: item.expensePaise,
  }));

  const pieData = (categoryQuery.data?.items || []).map((item) => ({
    name: item.name,
    valuePaise: item.valuePaise,
    color: item.color,
    icon: item.icon,
  }));

  const trendData = (trendsQuery.data?.items || []).map((item) => ({
    label: item.label,
    expensePaise: item.expensePaise,
  }));

  const changePercent = trendsQuery.data?.monthOverMonth?.changePercent;
  const savingsPercentage = trendsQuery.data?.savingsPercentage;
  const highest = categoryQuery.data?.highest;

  const years = [selectedYear - 2, selectedYear - 1, selectedYear];

  const isLoading = monthlyQuery.isLoading || categoryQuery.isLoading || trendsQuery.isLoading;
  const isError = monthlyQuery.isError || categoryQuery.isError || trendsQuery.isError;
  const error = monthlyQuery.error || categoryQuery.error || trendsQuery.error;
  const refetch = () => {
    monthlyQuery.refetch();
    categoryQuery.refetch();
    trendsQuery.refetch();
  };

  return (
    <Stack spacing={3}>
      <PageHeader
        title="Analytics"
        subtitle="Understand where your money goes and how your habits are changing."
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

      {isLoading ? (
        <LoadingSkeleton count={4} height={110} />
      ) : isError ? (
        <ErrorState message={error?.message} onRetry={refetch} />
      ) : (
        <>
          <Box
            sx={{
              display: 'grid',
              gridTemplateColumns: { xs: '1fr', sm: 'repeat(2, 1fr)', lg: 'repeat(4, 1fr)' },
              gap: 2,
            }}
          >
            <SummaryCard
              title="Income"
              amountPaise={currentMonth?.incomePaise ?? 0}
              caption={MONTHS[selectedMonth - 1]}
              icon={TrendingUpRoundedIcon}
              tone="primary"
            />
            <SummaryCard
              title="Expenses"
              amountPaise={currentMonth?.expensePaise ?? 0}
              caption={MONTHS[selectedMonth - 1]}
              icon={TrendingDownRoundedIcon}
              tone="warning"
            />
            <SummaryCard
              title="Net savings"
              amountPaise={currentMonth?.netSavingsPaise ?? 0}
              caption="Income minus expenses"
              icon={SavingsRoundedIcon}
              tone="navy"
            />
            <Card sx={{ p: 2.5 }}>
              <Stack direction="row" alignItems="flex-start" justifyContent="space-between" spacing={2}>
                <Box>
                  <Typography variant="subtitle2" color="text.secondary">
                    Savings rate
                  </Typography>
                  <Typography variant="h4" sx={{ mt: 0.75 }}>
                    {(currentMonth?.savingsRatePercent ?? 0).toFixed(0)}%
                  </Typography>
                </Box>
                <Box
                  sx={{
                    display: 'grid',
                    placeItems: 'center',
                    width: 42,
                    height: 42,
                    borderRadius: 2.5,
                    bgcolor: 'rgba(16,185,129,0.10)',
                    color: 'primary.main',
                    flexShrink: 0,
                  }}
                >
                  <AccountBalanceWalletRoundedIcon fontSize="small" />
                </Box>
              </Stack>
              <Typography variant="caption" color="text.secondary" sx={{ display: 'block', mt: 1.75 }}>
                Share of this month&apos;s income that you kept
              </Typography>
            </Card>
          </Box>

          <Box
            sx={{
              display: 'grid',
              gridTemplateColumns: { xs: '1fr', lg: '2fr 1fr' },
              gap: 2.5,
            }}
          >
            <SectionCard title="Income vs expenses" subtitle="Monthly comparison for the selected year">
              {barData.length ? (
                <IncomeExpenseBarChart data={barData} />
              ) : (
                <EmptyState title="No data yet" description="Add transactions to see monthly comparisons." />
              )}
            </SectionCard>

            <SectionCard title="Expense by category" subtitle={MONTHS[selectedMonth - 1]}>
              {pieData.length ? (
                <CategoryPieChart data={pieData} />
              ) : (
                <EmptyState title="No expenses" description="No expenses recorded for this month." />
              )}
            </SectionCard>
          </Box>

          <Box
            sx={{
              display: 'grid',
              gridTemplateColumns: { xs: '1fr', lg: '2fr 1fr' },
              gap: 2.5,
            }}
          >
            <SectionCard title="Spending trend" subtitle="Monthly outflow over the last 12 months">
              {trendData.length ? (
                <SpendingTrendChart data={trendData} height={280} />
              ) : (
                <EmptyState title="No trend yet" description="Add transactions to build your trend." />
              )}
            </SectionCard>

            <SectionCard title="Highlights" subtitle="How this month compares">
              <Stack spacing={2}>
                <Box>
                  <Typography variant="subtitle2" color="text.secondary">
                    Highest spending category
                  </Typography>
                  {highest ? (
                    <Stack direction="row" alignItems="center" spacing={1} sx={{ mt: 0.75 }}>
                      <Avatar
                        variant="rounded"
                        sx={{ width: 36, height: 36, bgcolor: `${highest.color}1A`, fontSize: 17 }}
                      >
                        {highest.icon}
                      </Avatar>
                      <Box>
                        <Typography variant="body1" sx={{ fontWeight: 600 }}>
                          {highest.name}
                        </Typography>
                        <Typography variant="caption" color="text.secondary">
                          {formatCurrency(highest.valuePaise)} · {highest.percentage.toFixed(0)}% of spend
                        </Typography>
                      </Box>
                    </Stack>
                  ) : (
                    <Typography variant="body2" color="text.secondary" sx={{ mt: 0.75 }}>
                      No spending recorded this month.
                    </Typography>
                  )}
                </Box>

                <Box>
                  <Typography variant="subtitle2" color="text.secondary">
                    Month over month
                  </Typography>
                  <Typography variant="body1" sx={{ mt: 0.5 }}>
                    {changePercent === null || changePercent === undefined
                      ? 'Not enough history to compare yet.'
                      : `Spending ${changePercent >= 0 ? 'increased' : 'decreased'} by ${Math.abs(changePercent).toFixed(0)}% versus last month.`}
                  </Typography>
                </Box>

                <Box>
                  <Typography variant="subtitle2" color="text.secondary">
                    Savings rate over 12 months
                  </Typography>
                  <Typography variant="body1" sx={{ mt: 0.5 }}>
                    {savingsPercentage === undefined
                      ? '—'
                      : `${savingsPercentage.toFixed(1)}% of your income was kept.`}
                  </Typography>
                </Box>
              </Stack>
            </SectionCard>
          </Box>

          <SectionCard title="Category breakdown" subtitle={`Every expense in ${MONTHS[selectedMonth - 1]} ${selectedYear}`}>
            {categoryQuery.data?.items?.length ? (
              <Stack spacing={1.75}>
                {categoryQuery.data.items.map((item) => (
                  <Box key={item.name}>
                    <Stack direction="row" alignItems="center" spacing={1} sx={{ mb: 0.5 }}>
                      <Typography variant="body2" sx={{ fontWeight: 600, flexGrow: 1 }} noWrap>
                        {item.icon} {item.name}
                      </Typography>
                      <Typography variant="caption" color="text.secondary">
                        {item.percentage.toFixed(0)}%
                      </Typography>
                      <Typography variant="body2" sx={{ fontWeight: 600, minWidth: 96, textAlign: 'right' }}>
                        {formatCurrency(item.valuePaise)}
                      </Typography>
                    </Stack>
                    <LinearProgress
                      variant="determinate"
                      value={Math.min(100, item.percentage)}
                      sx={{
                        bgcolor: `${item.color}1F`,
                        '& .MuiLinearProgress-bar': { bgcolor: item.color },
                      }}
                    />
                  </Box>
                ))}
              </Stack>
            ) : (
              <EmptyState title="No expenses" description="No expenses recorded for this month." />
            )}
          </SectionCard>
        </>
      )}
    </Stack>
  );
}
