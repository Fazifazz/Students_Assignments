import { useMemo } from 'react';
import { Box, Stack, Typography } from '@mui/material';
import AccountBalanceWalletRoundedIcon from '@mui/icons-material/AccountBalanceWalletRounded';
import TrendingUpRoundedIcon from '@mui/icons-material/TrendingUpRounded';
import TrendingDownRoundedIcon from '@mui/icons-material/TrendingDownRounded';
import SavingsRoundedIcon from '@mui/icons-material/SavingsRounded';
import AddRoundedIcon from '@mui/icons-material/AddRounded';
import Button from '@mui/material/Button';
import SectionCard from '../components/common/Card';
import SummaryCard from '../components/common/SummaryCard';
import IncomeExpenseBarChart from '../components/charts/IncomeExpenseBarChart';
import CategoryPieChart from '../components/charts/CategoryPieChart';
import SpendingTrendChart from '../components/charts/SpendingTrendChart';
import TransactionTable from '../components/transactions/TransactionTable';
import { ErrorState, LoadingSkeleton } from '../components/common/States';
import InsightsPanel from '../features/dashboard/components/InsightsPanel';
import BudgetProgressList from '../features/dashboard/components/BudgetProgressList';
import SavingsGoalProgressList from '../features/dashboard/components/SavingsGoalProgressList';
import {
  useDashboardSummary,
  useRecentTransactions,
  useSpendingOverview,
} from '../features/dashboard/api';
import { formatCurrency } from '../utils/money';
import { useQuickAdd } from '../features/transactions/useQuickAdd';

/**
 * CSS-grid layouts instead of MUI Grid: MUI's spacing relies on negative
 * margins, which overflows the viewport on narrow screens.
 */
function GridRow({ columns, children, sx }) {
  return (
    <Box
      sx={{
        display: 'grid',
        gridTemplateColumns: columns,
        gap: { xs: 2, md: 2.5 },
        alignItems: 'stretch',
        ...sx,
      }}
    >
      {children}
    </Box>
  );
}

export default function DashboardPage() {
  const { openQuickAdd } = useQuickAdd();
  const summaryQuery = useDashboardSummary();
  const recentQuery = useRecentTransactions(8);
  const overviewQuery = useSpendingOverview();

  const overview = overviewQuery.data;
  const monthly = useMemo(() => overview?.monthly || [], [overview]);
  const trend = useMemo(
    () => monthly.map((item) => ({ label: item.label, expensePaise: item.expensePaise })),
    [monthly],
  );

  const overviewError = overviewQuery.error?.message;
  const reloadOverview = () => overviewQuery.refetch();

  return (
    <Stack spacing={3}>
      <Stack
        direction={{ xs: 'column', sm: 'row' }}
        alignItems={{ xs: 'flex-start', sm: 'center' }}
        justifyContent="space-between"
        spacing={2}
      >
        <Box>
          <Typography variant="h2">Financial overview</Typography>
          <Typography variant="body2" color="text.secondary">
            Your balance, spending and savings at a glance.
          </Typography>
        </Box>
        <Button
          variant="contained"
          startIcon={<AddRoundedIcon />}
          onClick={() => openQuickAdd()}
          sx={{ display: { xs: 'inline-flex', sm: 'none' } }}
        >
          Add transaction
        </Button>
      </Stack>

      <GridRow columns={{ xs: '1fr', sm: 'repeat(2, 1fr)', lg: 'repeat(4, 1fr)' }}>
        <SummaryCard
          title="Total balance"
          amountPaise={summaryQuery.data?.balancePaise}
          caption="Income minus expenses"
          icon={AccountBalanceWalletRoundedIcon}
          tone="navy"
          loading={summaryQuery.isLoading}
        />
        <SummaryCard
          title="Total income"
          amountPaise={summaryQuery.data?.totalIncomePaise}
          caption="All recorded income"
          icon={TrendingUpRoundedIcon}
          tone="primary"
          loading={summaryQuery.isLoading}
        />
        <SummaryCard
          title="Total expenses"
          amountPaise={summaryQuery.data?.totalExpensesPaise}
          caption="All recorded spending"
          icon={TrendingDownRoundedIcon}
          tone="warning"
          loading={summaryQuery.isLoading}
        />
        <SummaryCard
          title="Savings this month"
          amountPaise={summaryQuery.data?.totalSavingsPaise}
          caption={
            summaryQuery.data
              ? `${summaryQuery.data.savingsRatePercent.toFixed(0)}% savings rate`
              : 'Income minus expenses'
          }
          icon={SavingsRoundedIcon}
          tone="primary"
          loading={summaryQuery.isLoading}
        />
      </GridRow>

      <GridRow columns={{ xs: '1fr', lg: '2fr 1fr' }}>
        <SectionCard title="Income vs expenses" subtitle="Monthly comparison over the last six months">
          {overviewQuery.isLoading ? (
            <LoadingSkeleton variant="chart" height={300} />
          ) : overviewQuery.isError ? (
            <ErrorState message={overviewError} onRetry={reloadOverview} />
          ) : (
            <IncomeExpenseBarChart data={monthly} />
          )}
        </SectionCard>

        <SectionCard title="Spending by category" subtitle="Where your money went this month">
          {overviewQuery.isLoading ? (
            <LoadingSkeleton variant="chart" height={260} />
          ) : overviewQuery.isError ? (
            <ErrorState message={overviewError} onRetry={reloadOverview} />
          ) : (
            <CategoryPieChart data={overview?.categories || []} />
          )}
        </SectionCard>
      </GridRow>

      <GridRow columns={{ xs: '1fr', lg: '7fr 5fr' }}>
        <SectionCard
          title="Recent transactions"
          subtitle="Your latest activity"
          action={
            <Button size="small" onClick={() => openQuickAdd()}>
              Add new
            </Button>
          }
        >
          {recentQuery.isLoading ? (
            <LoadingSkeleton variant="row" count={5} />
          ) : recentQuery.isError ? (
            <ErrorState message={recentQuery.error?.message} onRetry={recentQuery.refetch} />
          ) : (
            <TransactionTable transactions={recentQuery.data || []} compact />
          )}
        </SectionCard>

        <SectionCard title="Spending insights" subtitle="Rules derived from your transactions">
          {overviewQuery.isLoading ? (
            <LoadingSkeleton count={4} height={64} />
          ) : overviewQuery.isError ? (
            <ErrorState message={overviewError} onRetry={reloadOverview} />
          ) : (
            <InsightsPanel insights={overview?.insights || []} />
          )}
        </SectionCard>
      </GridRow>

      <GridRow columns={{ xs: '1fr', md: 'repeat(2, 1fr)', lg: '5fr 4fr 3fr' }}>
        <SectionCard title="Monthly budgets" subtitle="Utilisation against your category limits">
          {overviewQuery.isLoading ? (
            <LoadingSkeleton count={4} height={56} />
          ) : overviewQuery.isError ? (
            <ErrorState message={overviewError} onRetry={reloadOverview} />
          ) : (
            <BudgetProgressList budgets={overview?.budgets || []} />
          )}
        </SectionCard>

        <SectionCard title="Savings goals" subtitle="Progress towards each target">
          {overviewQuery.isLoading ? (
            <LoadingSkeleton count={3} height={64} />
          ) : overviewQuery.isError ? (
            <ErrorState message={overviewError} onRetry={reloadOverview} />
          ) : (
            <SavingsGoalProgressList goals={overview?.goals || []} />
          )}
        </SectionCard>

        <SectionCard title="Spending trend" subtitle="Monthly outflow">
          {overviewQuery.isLoading ? (
            <LoadingSkeleton variant="chart" height={240} />
          ) : overviewQuery.isError ? (
            <ErrorState message={overviewError} onRetry={reloadOverview} />
          ) : (
            <SpendingTrendChart data={trend} height={240} />
          )}
        </SectionCard>
      </GridRow>

      <Typography variant="caption" color="text.secondary" sx={{ textAlign: 'center' }}>
        Balance {formatCurrency(summaryQuery.data?.balancePaise || 0)} · Figures update as you add transactions.
      </Typography>
    </Stack>
  );
}
