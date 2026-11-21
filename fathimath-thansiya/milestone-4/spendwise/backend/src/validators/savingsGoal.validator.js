import { z } from 'zod';
import { objectId } from './auth.validator.js';

const amountPaise = z
  .number({ invalid_type_error: 'Amount must be a number' })
  .int('Amount must be an integer number of paise')
  .positive('Amount must be greater than zero');

export const createSavingsGoalSchema = z.object({
  name: z
    .string()
    .trim()
    .min(2, 'Name must be at least 2 characters')
    .max(60, 'Name must be at most 60 characters'),
  targetAmountPaise: amountPaise,
  currentAmountPaise: z
    .number()
    .int()
    .min(0, 'Saved amount cannot be negative')
    .optional()
    .default(0),
  targetDate: z.coerce.date({ invalid_type_error: 'Target date is invalid' }),
  description: z
    .string()
    .trim()
    .max(240, 'Description must be at most 240 characters')
    .optional()
    .default(''),
});

export const updateSavingsGoalSchema = z.object({
  name: z.string().trim().min(2).max(60).optional(),
  targetAmountPaise: amountPaise.optional(),
  currentAmountPaise: z.number().int().min(0).optional(),
  targetDate: z.coerce.date({ invalid_type_error: 'Target date is invalid' }).optional(),
  description: z.string().trim().max(240).optional(),
  completed: z.boolean().optional(),
  /** Adds money to the goal. */
  contributionPaise: z
    .number({ invalid_type_error: 'Contribution must be a number' })
    .int()
    .positive('Contribution must be greater than zero')
    .optional(),
  allowOvershoot: z.boolean().optional().default(false),
});

export const savingsGoalIdSchema = z.object({ id: objectId });

export default {
  createSavingsGoalSchema,
  updateSavingsGoalSchema,
  savingsGoalIdSchema,
};
