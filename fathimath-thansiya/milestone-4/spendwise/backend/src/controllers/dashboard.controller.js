import asyncHandler from '../utils/asyncHandler.js';
import { sendSuccess } from '../utils/apiResponse.js';
import {
  getSummary,
  recentTransactions,
  getSpendingOverview,
} from '../services/dashboard.service.js';

export const summary = asyncHandler(async (req, res) => {
  const data = await getSummary(req.userId, req.validatedQuery);
  sendSuccess(res, data);
});

export const recent = asyncHandler(async (req, res) => {
  const items = await recentTransactions(req.userId, req.query.limit ? Number(req.query.limit) : 8);
  sendSuccess(res, { items });
});

export const overview = asyncHandler(async (req, res) => {
  const data = await getSpendingOverview(req.userId, req.validatedQuery);
  sendSuccess(res, data);
});

export default { summary, recent, overview };
