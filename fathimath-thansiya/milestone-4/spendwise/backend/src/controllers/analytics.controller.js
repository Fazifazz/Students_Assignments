import asyncHandler from '../utils/asyncHandler.js';
import { sendSuccess } from '../utils/apiResponse.js';
import {
  monthlyReport,
  categoryReport,
  spendingTrends,
} from '../services/analytics.service.js';

export const monthly = asyncHandler(async (req, res) => {
  const data = await monthlyReport(req.userId, req.validatedQuery);
  sendSuccess(res, data);
});

export const categories = asyncHandler(async (req, res) => {
  const data = await categoryReport(req.userId, req.validatedQuery);
  sendSuccess(res, data);
});

export const trends = asyncHandler(async (req, res) => {
  const data = await spendingTrends(req.userId, req.validatedQuery);
  sendSuccess(res, data);
});

export default { monthly, categories, trends };
