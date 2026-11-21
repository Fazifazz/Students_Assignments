import asyncHandler from '../utils/asyncHandler.js';
import { sendCreated, sendSuccess } from '../utils/apiResponse.js';
import {
  listBudgets,
  createBudget,
  updateBudget,
  deleteBudget,
} from '../services/budget.service.js';

export const list = asyncHandler(async (req, res) => {
  const budgets = await listBudgets(req.userId, req.validatedQuery);
  sendSuccess(res, { items: budgets });
});

export const create = asyncHandler(async (req, res) => {
  const budget = await createBudget(req.userId, req.body);
  sendCreated(res, budget);
});

export const update = asyncHandler(async (req, res) => {
  const budget = await updateBudget(req.userId, req.params.id, req.body);
  sendSuccess(res, budget);
});

export const remove = asyncHandler(async (req, res) => {
  const result = await deleteBudget(req.userId, req.params.id);
  sendSuccess(res, result);
});

export default { list, create, update, remove };
