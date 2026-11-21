import Transaction from '../models/Transaction.js';
import Category from '../models/Category.js';
import { monthlySeries, categoryBreakdown } from './dashboard.service.js';

const DEFAULT_MONTHS = 12;

/** Per-month income, expense and savings report for a calendar year. */
export async function monthlyReport(userId, { year, months = DEFAULT_MONTHS }) {
  const now = new Date();
  const targetYear = year ?? now.getFullYear();

  const series = await monthlySeries(userId, months);

  const items = series.map((entry) => {
    const netSavingsPaise = entry.incomePaise - entry.expensePaise;
    return {
      month: entry.month,
      label: entry.label,
      incomePaise: entry.incomePaise,
      expensePaise: entry.expensePaise,
      netSavingsPaise,
      savingsRatePercent:
        entry.incomePaise > 0 ? (netSavingsPaise / entry.incomePaise) * 100 : 0,
    };
  });

  const incomePaise = items.reduce((acc, item) => acc + item.incomePaise, 0);
  const expensePaise = items.reduce((acc, item) => acc + item.expensePaise, 0);
  const netSavingsPaise = incomePaise - expensePaise;

  return {
    year: targetYear,
    items,
    totals: {
      incomePaise,
      expensePaise,
      netSavingsPaise,
      savingsRatePercent: incomePaise > 0 ? (netSavingsPaise / incomePaise) * 100 : 0,
    },
  };
}

/** Category-wise expense analysis for a month, with share of total. */
export async function categoryReport(userId, { month, year }) {
  const now = new Date();
  const targetMonth = month ?? now.getMonth() + 1;
  const targetYear = year ?? now.getFullYear();

  const breakdown = await categoryBreakdown(userId, targetMonth, targetYear);
  const totalPaise = breakdown.reduce((acc, item) => acc + item.valuePaise, 0);

  const items = breakdown.map((item) => ({
    ...item,
    percentage: totalPaise > 0 ? (item.valuePaise / totalPaise) * 100 : 0,
  }));

  const highest = items[0] || null;

  return { month: targetMonth, year: targetYear, items, totalPaise, highest };
}

/**
 * Spending trend over the trailing months, with the month-over-month delta
 * and the overall savings rate.
 */
export async function spendingTrends(userId, { months = DEFAULT_MONTHS } = {}) {
  const series = await monthlySeries(userId, months);

  let cumulativePaise = 0;
  const items = series.map((entry) => {
    cumulativePaise += entry.expensePaise;
    return {
      month: entry.month,
      label: entry.label,
      expensePaise: entry.expensePaise,
      incomePaise: entry.incomePaise,
      cumulativePaise,
    };
  });

  const current = items[items.length - 1];
  const previous = items[items.length - 2];

  const changePercent =
    current && previous && previous.expensePaise > 0
      ? ((current.expensePaise - previous.expensePaise) / previous.expensePaise) * 100
      : null;

  const totalIncome = items.reduce((acc, item) => acc + item.incomePaise, 0);
  const totalExpense = items.reduce((acc, item) => acc + item.expensePaise, 0);

  return {
    items,
    monthOverMonth: {
      currentMonth: current?.month ?? null,
      previousMonth: previous?.month ?? null,
      changePercent,
    },
    savingsPercentage: totalIncome > 0 ? ((totalIncome - totalExpense) / totalIncome) * 100 : 0,
  };
}

/** Counts of the user's records, used by the profile page. */
export async function activityCounts(userId) {
  const [transactions, categories, income, expenses] = await Promise.all([
    Transaction.countDocuments({ userId }),
    Category.countDocuments({ userId }),
    Transaction.countDocuments({ userId, type: 'INCOME' }),
    Transaction.countDocuments({ userId, type: 'EXPENSE' }),
  ]);
  return { transactions, categories, income, expenses };
}
