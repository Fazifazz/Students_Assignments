import asyncHandler from '../utils/asyncHandler.js';
import { sendCreated, sendSuccess } from '../utils/apiResponse.js';
import {
  listGoals,
  createGoal,
  updateGoal,
  deleteGoal,
} from '../services/savingsGoal.service.js';

export const list = asyncHandler(async (req, res) => {
  const goals = await listGoals(req.userId);
  sendSuccess(res, { items: goals });
});

export const create = asyncHandler(async (req, res) => {
  const goal = await createGoal(req.userId, req.body);
  sendCreated(res, goal);
});

export const update = asyncHandler(async (req, res) => {
  const goal = await updateGoal(req.userId, req.params.id, req.body);
  sendSuccess(res, goal);
});

export const remove = asyncHandler(async (req, res) => {
  const result = await deleteGoal(req.userId, req.params.id);
  sendSuccess(res, result);
});

export default { list, create, update, remove };
