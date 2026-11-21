import Transaction from '../models/Transaction.js';
import Category from '../models/Category.js';
import { monthRange } from './budget.service.js';

/**
 * Rule-based spending insights.
 *
 * Every insight is derived from the user's own transactions and budgets.
 * The service is intentionally stateless and side-effect free so it can later
 * be replaced by an AI-backed implementation without touching the callers —
 * the response shape stays the same.
 */

/** Expense totals per category for one month. */
async function categorySpend(userId, month, year) {
  const { start, end } = monthRange(month, year);

  const rows = await Transaction.aggregate([
    { $match: { userId, type: 'EXPENSE', date: { $gte: start, $lt: end } } },
    { $group: { _id: '$categoryId', valuePaise: { $sum: '$amountPaise' } } },
  ]);

  const categories = await Category.find({
    userId,
    _id: { $in: rows.map((row) => row._id) },
  });
  const metadata = new Map(categories.map((category) => [String(category._id), category]));

  return rows.map((row) => ({
    categoryId: row._id,
    name: metadata.get(String(row._id))?.name || 'Uncategorised',
    valuePaise: row.valuePaise,
  }));
}

/** Income and expense totals for one month. */
async function monthTotals(userId, month, year) {
  const { start, end } = monthRange(month, year);

  const [row] = await Transaction.aggregate([
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

  return {
    incomePaise: row?.incomePaise ?? 0,
    expensePaise: row?.expensePaise ?? 0,
  };
}

/** Percentage change, guarding against a zero baseline. */
function percentChange(current, previous) {
  if (!previous || previous <= 0) return null;
  return ((current - previous) / previous) * 100;
}

function formatRupees(paise) {
  return `₹${(paise / 100).toLocaleString('en-IN', { maximumFractionDigits: 0 })}`;
}

/**
 * Generates the insight list for a user.
 * Returns an empty array when there is not enough data to say anything
 * meaningful, rather than producing misleading hints.
 */
export async function generateInsights(userId, { month, year }) {
  const now = new Date();
  const currentMonth = month ?? now.getMonth() + 1;
  const currentYear = year ?? now.getFullYear();

  const previousDate = new Date(currentYear, currentMonth - 2, 1);
  const previousMonth = previousDate.getMonth() + 1;
  const previousYear = previousDate.getFullYear();

  const [currentTotals, previousTotals, currentCategories, previousCategories] = await Promise.all([
    monthTotals(userId, currentMonth, currentYear),
    monthTotals(userId, previousMonth, previousYear),
    categorySpend(userId, currentMonth, currentYear),
    categorySpend(userId, previousMonth, previousYear),
  ]);

  const insights = [];

  if (currentTotals.incomePaise === 0 && currentTotals.expensePaise === 0) {
    return insights;
  }

  // 1. Category spending up by 20% or more.
  const previousByName = new Map(previousCategories.map((item) => [item.name, item.valuePaise]));
  currentCategories.forEach((item) => {
    const previous = previousByName.get(item.name);
    const change = percentChange(item.valuePaise, previous);
    if (change !== null && change >= 20) {
      insights.push({
        id: `category-increase-${item.name}`,
        severity: 'WARNING',
        title: `${item.name} expenses increased`,
        message: `Your ${item.name.toLowerCase()} spending rose ${change.toFixed(0)}% compared with last month (${formatRupees(
          item.valuePaise,
        )} vs ${formatRupees(previous)}).`,
      });
    }
  });

  // 2. Category spending down significantly — a positive signal.
  const currentByName = new Map(currentCategories.map((item) => [item.name, item.valuePaise]));
  previousCategories.forEach((item) => {
    const current = currentByName.get(item.name);
    if (current === undefined) return;
    const change = percentChange(current, item.valuePaise);
    if (change !== null && change <= -20) {
      insights.push({
        id: `category-decrease-${item.name}`,
        severity: 'SUCCESS',
        title: `${item.name} spending is down`,
        message: `You spent ${Math.abs(change).toFixed(0)}% less on ${item.name.toLowerCase()} than last month.`,
      });
    }
  });

  // 3. Highest spending category.
  const top = currentCategories[0];
  if (top && currentTotals.expensePaise > 0) {
    const share = (top.valuePaise / currentTotals.expensePaise) * 100;
    insights.push({
      id: 'highest-category',
      severity: 'INFO',
      title: `${top.name} is your highest expense`,
      message: `${top.name} accounts for ${share.toFixed(0)}% of your spending this month (${formatRupees(
        top.valuePaise,
      )}).`,
    });
  }

  // 4. Savings this month.
  const netSavings = currentTotals.incomePaise - currentTotals.expensePaise;
  if (currentTotals.incomePaise > 0) {
    const rate = (netSavings / currentTotals.incomePaise) * 100;
    if (netSavings > 0) {
      insights.push({
        id: 'savings-positive',
        severity: 'SUCCESS',
        title: 'Your savings improved this month',
        message: `You saved ${formatRupees(netSavings)} (${rate.toFixed(0)}% of income) in ${now.toLocaleString('en-US', {
          month: 'long',
        })}.`,
      });
    } else {
      insights.push({
        id: 'savings-negative',
        severity: 'WARNING',
        title: 'You spent more than you earned',
        message: `Expenses exceeded income by ${formatRupees(Math.abs(netSavings))} this month.`,
      });
    }
  }

  // 5. Spending above the monthly average.
  const monthsWithSpend = await Transaction.aggregate([
    {
      $match: {
        userId,
        type: 'EXPENSE',
        date: { $gte: new Date(currentYear, currentMonth - 6, 1) },
      },
    },
    {
      $group: {
        _id: { $dateToString: { format: '%Y-%m', date: '$date' } },
        expensePaise: { $sum: '$amountPaise' },
      },
    },
  ]);

  if (monthsWithSpend.length >= 2) {
    const total = monthsWithSpend.reduce((acc, row) => acc + row.expensePaise, 0);
    const average = total / monthsWithSpend.length;
    if (average > 0 && currentTotals.expensePaise > average) {
      const above = ((currentTotals.expensePaise - average) / average) * 100;
      insights.push({
        id: 'above-average',
        severity: 'WARNING',
        title: 'Spending above your monthly average',
        message: `You spent ${above.toFixed(0)}% more than your ${monthsWithSpend.length}-month average of ${formatRupees(
          average,
        )}.`,
      });
    }
  }

  // 6. Month-over-month comparison.
  const totalChange = percentChange(currentTotals.expensePaise, previousTotals.expensePaise);
  if (totalChange !== null) {
    insights.push({
      id: 'mom-total',
      severity: totalChange > 0 ? 'WARNING' : 'SUCCESS',
      title: totalChange > 0 ? 'Overall spending increased' : 'Overall spending decreased',
      message: `Total expenses moved ${Math.abs(totalChange).toFixed(0)}% ${
        totalChange > 0 ? 'up' : 'down'
      } versus last month.`,
    });
  }

  return insights;
}

export default { generateInsights };
