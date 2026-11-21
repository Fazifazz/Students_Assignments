import { z } from 'zod';

export const monthYearSchema = z.object({
  month: z.coerce.number().int().min(1).max(12).optional(),
  year: z.coerce.number().int().min(2000).max(2100).optional(),
});

export const monthlyReportSchema = z.object({
  year: z.coerce.number().int().min(2000).max(2100).optional(),
  months: z.coerce.number().int().min(1).max(36).optional().default(12),
});

export const trendsSchema = z.object({
  months: z.coerce.number().int().min(2).max(36).optional().default(12),
});

export default { monthYearSchema, monthlyReportSchema, trendsSchema };
