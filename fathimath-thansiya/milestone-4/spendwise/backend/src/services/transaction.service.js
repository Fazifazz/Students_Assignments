import Transaction from '../models/Transaction.js';
import Category from '../models/Category.js';
import ApiError from '../utils/ApiError.js';

const SORT_OPTIONS = {
  date_desc: { date: -1 },
  date_asc: { date: 1 },
  amount_desc: { amountPaise: -1 },
  amount_asc: { amountPaise: 1 },
  title_asc: { title: 1 },
};

/**
 * Ensures the category exists, belongs to the user and matches the
 * transaction type — an income transaction cannot point at an expense
 * category.
 */
async function assertUsableCategory(userId, categoryId, type) {
  const category = await Category.findOne({ _id: categoryId, userId });
  if (!category) throw ApiError.badRequest('Select a valid category');
  if (category.type !== type) {
    throw ApiError.badRequest(
      `The selected category is a ${category.type.toLowerCase()} category but the transaction is ${type.toLowerCase()}`,
    );
  }
  return category;
}

/** Lists transactions with search, filters, sorting and pagination. */
export async function listTransactions(userId, query) {
  const {
    page = 1,
    limit = 10,
    type,
    categoryId,
    search,
    from,
    to,
    sort = 'date_desc',
  } = query;

  const filter = { userId };

  if (type) filter.type = type;
  if (categoryId) filter.categoryId = categoryId;

  if (from || to) {
    filter.date = {};
    if (from) filter.date.$gte = new Date(from);
    if (to) filter.date.$lte = new Date(to);
  }

  if (search) {
    // Escape user input so a query like "a.b" is not treated as a regex.
    const safe = search.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
    const pattern = new RegExp(safe, 'i');
    filter.$or = [{ title: pattern }, { description: pattern }];
  }

  const sortSpec = SORT_OPTIONS[sort] || SORT_OPTIONS.date_desc;

  const [items, total] = await Promise.all([
    Transaction.find(filter)
      .sort(sortSpec)
      .skip((page - 1) * limit)
      .limit(limit)
      .populate('categoryId', 'name icon color type'),
    Transaction.countDocuments(filter),
  ]);

  return {
    items: items.map(serialize),
    pagination: {
      page,
      limit,
      total,
      totalPages: Math.max(1, Math.ceil(total / limit)),
    },
  };
}

/** Converts a transaction document into the API shape. */
export function serialize(transaction) {
  const category = transaction.categoryId;
  const categoryData =
    category && category.name
      ? { _id: category._id, name: category.name, icon: category.icon, color: category.color, type: category.type }
      : null;

  return {
    _id: transaction._id,
    title: transaction.title,
    amountPaise: transaction.amountPaise,
    type: transaction.type,
    categoryId: transaction.categoryId?._id || transaction.categoryId,
    category: categoryData,
    description: transaction.description,
    paymentMethod: transaction.paymentMethod,
    date: transaction.date,
    createdAt: transaction.createdAt,
    updatedAt: transaction.updatedAt,
  };
}

export async function getTransaction(userId, transactionId) {
  const transaction = await Transaction.findOne({ _id: transactionId, userId }).populate(
    'categoryId',
    'name icon color type',
  );
  if (!transaction) throw ApiError.notFound('Transaction not found');
  return serialize(transaction);
}

export async function createTransaction(userId, payload) {
  await assertUsableCategory(userId, payload.categoryId, payload.type);

  const transaction = await Transaction.create({ ...payload, userId });
  await transaction.populate('categoryId', 'name icon color type');
  return serialize(transaction);
}

export async function updateTransaction(userId, transactionId, payload) {
  const transaction = await Transaction.findOne({ _id: transactionId, userId });
  if (!transaction) throw ApiError.notFound('Transaction not found');

  const nextType = payload.type ?? transaction.type;
  const nextCategoryId = payload.categoryId ?? transaction.categoryId;

  await assertUsableCategory(userId, nextCategoryId, nextType);

  if (payload.title !== undefined) transaction.title = payload.title;
  if (payload.amountPaise !== undefined) transaction.amountPaise = payload.amountPaise;
  if (payload.type !== undefined) transaction.type = payload.type;
  if (payload.categoryId !== undefined) transaction.categoryId = payload.categoryId;
  if (payload.description !== undefined) transaction.description = payload.description;
  if (payload.paymentMethod !== undefined) transaction.paymentMethod = payload.paymentMethod;
  if (payload.date !== undefined) transaction.date = payload.date;

  await transaction.save();
  await transaction.populate('categoryId', 'name icon color type');
  return serialize(transaction);
}

export async function deleteTransaction(userId, transactionId) {
  const transaction = await Transaction.findOne({ _id: transactionId, userId });
  if (!transaction) throw ApiError.notFound('Transaction not found');
  await transaction.deleteOne();
  return { message: 'Transaction deleted' };
}
