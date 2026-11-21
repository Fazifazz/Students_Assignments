import Budget from '../models/Budget.js';
import Category from '../models/Category.js';
import Transaction from '../models/Transaction.js';
import ApiError from '../utils/ApiError.js';

/** Builds the [start, end] Date window for a calendar month. */
export function monthRange(month, year) {
  const start = new Date(year, month - 1, 1, 0, 0, 0, 0);
  const end = new Date(year, month, 1, 0, 0, 0, 0);
  return { start, end };
}

/**
 * Actual expense totals per category for a month.
 *
 * Spending is derived from the transaction ledger with an aggregation
 * pipeline — it is never stored on the budget document, so it can never drift
 * out of sync with the underlying transactions.
 */
export async function spendingByCategory(userId, month, year) {
  const { start, end } = monthRange(month, year);

  const rows = await Transaction.aggregate([
    {
      $match: {
        userId,
        type: 'EXPENSE',
        date: { $gte: start, $lt: end },
      },
    },
    {
      $group: {
        _id: '$categoryId',
        spentPaise: { $sum: '$amountPaise' },
      },
    },
  ]);

  const totals = new Map();
  rows.forEach((row) => totals.set(String(row._id), row.spentPaise));
  return totals;
}

/** Adds the derived spend figures to a budget document. */
function withSpend(budget, spentPaise) {
  const amountPaise = budget.amountPaise;
  const usagePercent = amountPaise > 0 ? (spentPaise / amountPaise) * 100 : 0;
  const remainingPaise = amountPaise - spentPaise;

  let status = 'SAFE';
  if (usagePercent >= 100) status = 'EXCEEDED';
  else if (usagePercent >= 80) status = 'WARNING';

  return {
    _id: budget._id,
    categoryId: budget.categoryId?._id || budget.categoryId,
    category: budget.categoryId?.name
      ? {
          _id: budget.categoryId._id,
          name: budget.categoryId.name,
          icon: budget.categoryId.icon,
          color: budget.categoryId.color,
        }
      : null,
    amountPaise,
    month: budget.month,
    year: budget.year,
    spentPaise,
    remainingPaise,
    usagePercent,
    status,
    createdAt: budget.createdAt,
    updatedAt: budget.updatedAt,
  };
}

export async function listBudgets(userId, { month, year }) {
  const filter = { userId };
  if (month) filter.month = month;
  if (year) filter.year = year;

  const budgets = await Budget.find(filter)
    .sort({ year: -1, month: -1 })
    .populate('categoryId', 'name icon color type');

  const totals = await spendingByCategory(userId, month ?? budgets[0]?.month, year ?? budgets[0]?.year);

  return budgets.map((budget) =>
    withSpend(budget, totals.get(String(budget.categoryId?._id || budget.categoryId)) || 0),
  );
}

/** Ensures the category exists, is owned by the user and is an expense category. */
async function assertExpenseCategory(userId, categoryId) {
  const category = await Category.findOne({ _id: categoryId, userId });
  if (!category) throw ApiError.badRequest('Select a valid category');
  if (category.type !== 'EXPENSE') {
    throw ApiError.badRequest('Budgets can only be created for expense categories');
  }
  return category;
}

export async function createBudget(userId, payload) {
  await assertExpenseCategory(userId, payload.categoryId);

  const duplicate = await Budget.findOne({
    userId,
    categoryId: payload.categoryId,
    month: payload.month,
    year: payload.year,
  });
  if (duplicate) {
    throw ApiError.conflict('A budget already exists for that category and month');
  }

  const budget = await Budget.create({ ...payload, userId });
  await budget.populate('categoryId', 'name icon color type');

  // Report the spend that has already happened in that month.
  const totals = await spendingByCategory(userId, budget.month, budget.year);
  return withSpend(budget, totals.get(String(budget.categoryId._id)) || 0);
}

export async function updateBudget(userId, budgetId, payload) {
  const budget = await Budget.findOne({ _id: budgetId, userId });
  if (!budget) throw ApiError.notFound('Budget not found');

  const nextCategoryId = payload.categoryId ?? budget.categoryId;
  await assertExpenseCategory(userId, nextCategoryId);

  const nextMonth = payload.month ?? budget.month;
  const nextYear = payload.year ?? budget.year;

  const duplicate = await Budget.findOne({
    userId,
    _id: { $ne: budget._id },
    categoryId: nextCategoryId,
    month: nextMonth,
    year: nextYear,
  });
  if (duplicate) {
    throw ApiError.conflict('A budget already exists for that category and month');
  }

  if (payload.categoryId !== undefined) budget.categoryId = payload.categoryId;
  if (payload.amountPaise !== undefined) budget.amountPaise = payload.amountPaise;
  if (payload.month !== undefined) budget.month = payload.month;
  if (payload.year !== undefined) budget.year = payload.year;

  await budget.save();
  await budget.populate('categoryId', 'name icon color type');

  const totals = await spendingByCategory(userId, budget.month, budget.year);
  return withSpend(budget, totals.get(String(budget.categoryId._id)) || 0);
}

export async function deleteBudget(userId, budgetId) {
  const budget = await Budget.findOne({ _id: budgetId, userId });
  if (!budget) throw ApiError.notFound('Budget not found');
  await budget.deleteOne();
  return { message: 'Budget deleted' };
}
