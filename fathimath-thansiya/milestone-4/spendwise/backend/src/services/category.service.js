import Category from '../models/Category.js';
import Transaction from '../models/Transaction.js';
import Budget from '../models/Budget.js';
import ApiError from '../utils/ApiError.js';

/** Lists every category belonging to the user, income first then expense. */
export async function listCategories(userId) {
  const categories = await Category.find({ userId }).sort({ type: 1, name: 1 });
  return categories;
}

export async function getCategory(userId, categoryId) {
  const category = await Category.findOne({ _id: categoryId, userId });
  if (!category) throw ApiError.notFound('Category not found');
  return category;
}

export async function createCategory(userId, payload) {
  const duplicate = await Category.findOne({
    userId,
    name: payload.name,
    type: payload.type,
  });
  if (duplicate) {
    throw ApiError.conflict(`A ${payload.type.toLowerCase()} category named "${payload.name}" already exists`);
  }

  return Category.create({
    ...payload,
    userId,
    isDefault: false,
  });
}

export async function updateCategory(userId, categoryId, payload) {
  const category = await getCategory(userId, categoryId);

  const name = payload.name ?? category.name;
  const type = payload.type ?? category.type;

  const duplicate = await Category.findOne({
    userId,
    _id: { $ne: category._id },
    name,
    type,
  });
  if (duplicate) {
    throw ApiError.conflict(`A ${type.toLowerCase()} category named "${name}" already exists`);
  }

  category.name = name;
  category.type = type;
  if (payload.icon !== undefined) category.icon = payload.icon;
  if (payload.color !== undefined) category.color = payload.color;

  await category.save();
  return category;
}

/**
 * Deletes a custom category.
 *
 * Default categories are protected, and a category still referenced by
 * transactions or budgets cannot be deleted — the caller must reassign those
 * records first. Silently orphaning financial history would corrupt reports.
 */
export async function deleteCategory(userId, categoryId) {
  const category = await getCategory(userId, categoryId);

  if (category.isDefault) {
    throw ApiError.badRequest('Default categories cannot be deleted');
  }

  const [transactionCount, budgetCount] = await Promise.all([
    Transaction.countDocuments({ userId, categoryId: category._id }),
    Budget.countDocuments({ userId, categoryId: category._id }),
  ]);

  if (transactionCount > 0 || budgetCount > 0) {
    throw ApiError.conflict(
      `This category is still used by ${transactionCount} transaction(s) and ${budgetCount} budget(s). ` +
        'Reassign them before deleting the category.',
    );
  }

  await category.deleteOne();
  return { message: 'Category deleted' };
}
