import { z } from 'zod';
import { objectId } from './auth.validator.js';

export const CATEGORY_TYPES = ['INCOME', 'EXPENSE'];

export const createCategorySchema = z.object({
  name: z
    .string()
    .trim()
    .min(2, 'Name must be at least 2 characters')
    .max(40, 'Name must be at most 40 characters'),
  type: z.enum(CATEGORY_TYPES, { message: 'Type must be INCOME or EXPENSE' }),
  icon: z.string().trim().max(8, 'Icon is too long').optional().default('🏷️'),
  color: z
    .string()
    .trim()
    .regex(/^#[0-9a-fA-F]{6}$/, 'Colour must be a hex value such as #10B981')
    .optional()
    .default('#64748B'),
});

export const updateCategorySchema = createCategorySchema.partial();

export const categoryIdSchema = z.object({ id: objectId });

export default { createCategorySchema, updateCategorySchema, categoryIdSchema };
