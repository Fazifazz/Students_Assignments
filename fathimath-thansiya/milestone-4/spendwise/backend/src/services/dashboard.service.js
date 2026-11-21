import Transaction from '../models/Transaction.js';
import Category from '../models/Category.js';
import SavingsGoal from '../models/SavingsGoal.js';
import { listBudgets } from './budget.service.js';
import { generateInsights } from './insights.service.js';

/** Default number of months shown in the dashboard charts. */
const TREND_MONTHS = 6;

/**
 * Lifetime totals for a user, computed with a single aggregation.
 * `balancePaise` is lifetime income minus lifetime expenses — the money the
 * user currently has across all recorded activity.
 */
export async function lifetimeTotals(userId) {
  const [rows] = await Transaction.aggregate([
    { $match: { userId } },
    {
      $group: {
        _id: null,
        incomePaise: {
          $sum: { $cond: [{ $eq: ['$type', 'INCOME'] }, '$amountPaise', 0] },
        },
        expensePaise: {
          $sum: { $cond: [{ $eq: ['$type', 'EXPENSE'] }, '$amountPaise', 0] },
        },
      },
    },
  ]);

  const incomePaise = rows?.incomePaise ?? 0;
  const expensePaise = rows?.expensePaise ?? 0;

  return { incomePaise, expensePaise, balancePaise: incomePaise - expensePaise };
}

/** Totals restricted to a calendar month. */
export async function periodTotals(userId, month, year) {
  const start = new Date(year, month - 1, 1);
  const end = new Date(year, month, 1);

  const [rows] = await Transaction.aggregate([
    { $match: { userId, date: { $gte: start, $lt: end } } },
    {
      $group: {
        _id: null,
        incomePaise: {
          $sum: { $cond: [{ $eq: ['$type', 'INCOME'] }, '$amountPaise', 0] },
        },
        expensePaise: {
          $sum: { $cond: [{ $eq: ['$type', 'EXPENSE'] }, '$amountPaise', 0] },
        },
      },
    },
  ]);

  const incomePaise = rows?.incomePaise ?? 0;
  const expensePaise = rows?.expensePaise ?? 0;

  return {
    incomePaise,
    expensePaise,
    netSavingsPaise: incomePaise - expensePaise,
    savingsRatePercent: incomePaise > 0 ? ((incomePaise - expensePaise) / incomePaise) * 100 : 0,
  };
}

/** Monthly income/expense series for the trailing `months` months. */
export async function monthlySeries(userId, months = TREND_MONTHS) {
  const now = new Date();
  const start = new Date(now.getFullYear(), now.getMonth() - (months - 1), 1);

  const rows = await Transaction.aggregate([
    { $match: { userId, date: { $gte: start } } },
    {
      $group: {
        _id: { $dateToString: { format: '%Y-%m', date: '$date' } },
        incomePaise: {
          $sum: { $cond: [{ $eq: ['$type', 'INCOME'] }, '$amountPaise', 0] },
        },
        expensePaise: {
          $sum: { $cond: [{ $eq: ['$type', 'EXPENSE'] }, '$amountPaise', 0] },
        },
      },
    },
    { $sort: { _id: 1 } },
  ]);

  const byMonth = new Map(rows.map((row) => [row._id, row]));

  // Build a continuous series so months without transactions still appear.
  const series = [];
  for (let i = 0; i < months; i += 1) {
    const date = new Date(start.getFullYear(), start.getMonth() + i, 1);
    const key = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}`;
    const row = byMonth.get(key);
    series.push({
      month: key,
      label: date.toLocaleString('en-US', { month: 'short' }),
      incomePaise: row?.incomePaise ?? 0,
      expensePaise: row?.expensePaise ?? 0,
    });
  }

  return series;
}

/** Expense totals per category for the period, joined with category metadata. */
export async function categoryBreakdown(userId, month, year) {
  const start = new Date(year, month - 1, 1);
  const end = new Date(year, month, 1);

  const rows = await Transaction.aggregate([
    { $match: { userId, type: 'EXPENSE', date: { $gte: start, $lt: end } } },
    { $group: { _id: '$categoryId', valuePaise: { $sum: '$amountPaise' } } },
    { $sort: { valuePaise: -1 } },
  ]);

  if (!rows.length) return [];

  const categories = await Category.find({
    userId,
    _id: { $in: rows.map((row) => row._id) },
  });

  const metadata = new Map(categories.map((category) => [String(category._id), category]));

  return rows.map((row) => {
    const category = metadata.get(String(row._id));
    return {
      name: category?.name || 'Uncategorised',
      valuePaise: row.valuePaise,
      color: category?.color || '#64748B',
      icon: category?.icon || '📦',
    };
  });
}

export async function recentTransactions(userId, limit = 8) {
  const transactions = await Transaction.find({ userId })
    .sort({ date: -1, createdAt: -1 })
    .limit(limit)
    .populate('categoryId', 'name icon color type');

  const { serialize } = await import('./transaction.service.js');
  return transactions.map(serialize);
}

export async function goalsWithProgress(userId) {
  const goals = await SavingsGoal.find({ userId }).sort({ createdAt: -1 });
  return goals.map((goal) => {
    const progressPercent =
      goal.targetAmountPaise > 0 ? (goal.currentAmountPaise / goal.targetAmountPaise) * 100 : 0;
    return {
      _id: goal._id,
      name: goal.name,
      targetAmountPaise: goal.targetAmountPaise,
      currentAmountPaise: goal.currentAmountPaise,
      targetDate: goal.targetDate,
      description: goal.description,
      completed: goal.completed || progressPercent >= 100,
      progressPercent: Math.min(100, progressPercent),
      remainingPaise: Math.max(0, goal.targetAmountPaise - goal.currentAmountPaise),
    };
  });
}

/**
 * The dashboard payload.
 *
 * "Total balance" is the lifetime net balance. "Savings" is the net savings of
 * the selected month — these are different measures and are labelled
 * separately in the UI.
 */
export async function getSummary(userId, { month, year }) {
  const now = new Date();
  const targetMonth = month ?? now.getMonth() + 1;
  const targetYear = year ?? now.getFullYear();

  const [lifetime, period] = await Promise.all([
    lifetimeTotals(userId),
    periodTotals(userId, targetMonth, targetYear),
  ]);

  return {
    balancePaise: lifetime.balancePaise,
    totalIncomePaise: lifetime.incomePaise,
    totalExpensesPaise: lifetime.expensePaise,
    totalSavingsPaise: period.netSavingsPaise,
    monthIncomePaise: period.incomePaise,
    monthExpensesPaise: period.expensePaise,
    savingsRatePercent: period.savingsRatePercent,
    period: { month: targetMonth, year: targetYear },
    currency: 'INR',
  };
}

export async function getSpendingOverview(userId, { month, year }) {
  const now = new Date();
  const targetMonth = month ?? now.getMonth() + 1;
  const targetYear = year ?? now.getFullYear();

  const [monthly, categories, budgets, goals] = await Promise.all([
    monthlySeries(userId, TREND_MONTHS),
    categoryBreakdown(userId, targetMonth, targetYear),
    listBudgets(userId, { month: targetMonth, year: targetYear }),
    goalsWithProgress(userId),
  ]);

  const insights = await generateInsights(userId, { month: targetMonth, year: targetYear });

  return { monthly, categories, budgets, goals, insights };
}
