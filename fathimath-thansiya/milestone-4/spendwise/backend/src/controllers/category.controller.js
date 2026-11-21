import asyncHandler from '../utils/asyncHandler.js';
import { sendCreated, sendSuccess } from '../utils/apiResponse.js';
import {
  listCategories,
  createCategory,
  updateCategory,
  deleteCategory,
} from '../services/category.service.js';

export const list = asyncHandler(async (req, res) => {
  const categories = await listCategories(req.userId);
  sendSuccess(res, { items: categories });
});

export const create = asyncHandler(async (req, res) => {
  const category = await createCategory(req.userId, req.body);
  sendCreated(res, category);
});

export const update = asyncHandler(async (req, res) => {
  const category = await updateCategory(req.userId, req.params.id, req.body);
  sendSuccess(res, category);
});

export const remove = asyncHandler(async (req, res) => {
  const result = await deleteCategory(req.userId, req.params.id);
  sendSuccess(res, result);
});

export default { list, create, update, remove };
