import { z } from 'zod';
import { objectId } from './auth.validator.js';

export const createBudgetSchema = z.object({
  categoryId: objectId,
  amountPaise: z
    .number({ invalid_type_error: 'Amount must be a number' })
    .int('Amount must be an integer number of paise')
    .positive('Amount must be greater than zero'),
  month: z.coerce.number().int().min(1).max(12),
  year: z.coerce.number().int().min(2000).max(2100),
});

export const updateBudgetSchema = createBudgetSchema.partial();

export const listBudgetsSchema = z.object({
  month: z.coerce.number().int().min(1).max(12).optional(),
  year: z.coerce.number().int().min(2000).max(2100).optional(),
});

export const budgetIdSchema = z.object({ id: objectId });

export default { createBudgetSchema, updateBudgetSchema, listBudgetsSchema, budgetIdSchema };
