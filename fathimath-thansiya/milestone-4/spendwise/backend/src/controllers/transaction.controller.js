import asyncHandler from '../utils/asyncHandler.js';
import { sendCreated, sendSuccess } from '../utils/apiResponse.js';
import {
  listTransactions,
  getTransaction,
  createTransaction,
  updateTransaction,
  deleteTransaction,
} from '../services/transaction.service.js';

export const list = asyncHandler(async (req, res) => {
  const result = await listTransactions(req.userId, req.validatedQuery);
  sendSuccess(res, result);
});

export const getById = asyncHandler(async (req, res) => {
  const transaction = await getTransaction(req.userId, req.params.id);
  sendSuccess(res, transaction);
});

export const create = asyncHandler(async (req, res) => {
  const transaction = await createTransaction(req.userId, req.body);
  sendCreated(res, transaction);
});

export const update = asyncHandler(async (req, res) => {
  const transaction = await updateTransaction(req.userId, req.params.id, req.body);
  sendSuccess(res, transaction);
});

export const remove = asyncHandler(async (req, res) => {
  const result = await deleteTransaction(req.userId, req.params.id);
  sendSuccess(res, result);
});

export default { list, getById, create, update, remove };
