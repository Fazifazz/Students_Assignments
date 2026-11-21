import { z } from 'zod';
import { objectId } from './auth.validator.js';

export const TRANSACTION_TYPES = ['INCOME', 'EXPENSE'];

export const PAYMENT_METHODS = [
  'CASH',
  'UPI',
  'CREDIT_CARD',
  'DEBIT_CARD',
  'BANK_TRANSFER',
  'OTHER',
];

/** Amounts arrive in paise and must be positive whole numbers. */
const amountPaise = z
  .number({ invalid_type_error: 'Amount must be a number' })
  .int('Amount must be an integer number of paise')
  .positive('Amount must be greater than zero')
  .max(1_000_000_000_00, 'Amount is unrealistically large');

export const createTransactionSchema = z.object({
  title: z
    .string()
    .trim()
    .min(2, 'Title must be at least 2 characters')
    .max(80, 'Title must be at most 80 characters'),
  amountPaise,
  type: z.enum(TRANSACTION_TYPES, { message: 'Type must be INCOME or EXPENSE' }),
  categoryId: objectId,
  description: z
    .string()
    .trim()
    .max(240, 'Description must be at most 240 characters')
    .optional()
    .default(''),
  paymentMethod: z.enum(PAYMENT_METHODS, { message: 'Unsupported payment method' }),
  date: z.coerce.date({ invalid_type_error: 'Date is invalid' }),
});

export const updateTransactionSchema = createTransactionSchema.partial();

export const listTransactionsSchema = z.object({
  page: z.coerce.number().int().positive().default(1),
  limit: z.coerce.number().int().positive().max(100).default(10),
  type: z.enum(TRANSACTION_TYPES).optional(),
  categoryId: objectId.optional(),
  search: z.string().trim().max(120).optional(),
  from: z.coerce.date({ invalid_type_error: 'Start date is invalid' }).optional(),
  to: z.coerce.date({ invalid_type_error: 'End date is invalid' }).optional(),
  sort: z
    .enum(['date_desc', 'date_asc', 'amount_desc', 'amount_asc', 'title_asc'])
    .default('date_desc'),
});

export const transactionIdSchema = z.object({ id: objectId });

export default {
  createTransactionSchema,
  updateTransactionSchema,
  listTransactionsSchema,
  transactionIdSchema,
};
