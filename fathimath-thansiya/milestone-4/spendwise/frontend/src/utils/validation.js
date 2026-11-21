import { z } from 'zod';
import { parseAmountToMinorUnits } from './money';

const email = z
  .string()
  .trim()
  .min(1, 'Email is required')
  .email('Enter a valid email address');

const password = z
  .string()
  .min(8, 'Password must be at least 8 characters')
  .max(72, 'Password must be at most 72 characters')
  .regex(/[a-zA-Z]/, 'Password must contain a letter')
  .regex(/[0-9]/, 'Password must contain a number');

export const loginSchema = z.object({
  email,
  password: z.string().min(1, 'Password is required'),
});

export const registerSchema = z.object({
  name: z.string().trim().min(2, 'Name must be at least 2 characters').max(60, 'Name is too long'),
  email,
  password,
  confirmPassword: z.string().min(1, 'Please confirm your password'),
}).refine((values) => values.password === values.confirmPassword, {
  path: ['confirmPassword'],
  message: 'Passwords do not match',
});

export const forgotPasswordSchema = z.object({ email });

export const resetPasswordSchema = z
  .object({
    password,
    confirmPassword: z.string().min(1, 'Please confirm your password'),
  })
  .refine((values) => values.password === values.confirmPassword, {
    path: ['confirmPassword'],
    message: 'Passwords do not match',
  });

export const amountField = z
  .string()
  .trim()
  .min(1, 'Amount is required')
  .refine((value) => parseAmountToMinorUnits(value) !== null, 'Enter a valid amount')
  .refine((value) => (parseAmountToMinorUnits(value) || 0) > 0, 'Amount must be greater than zero');

export const transactionSchema = z.object({
  title: z.string().trim().min(2, 'Title must be at least 2 characters').max(80, 'Title is too long'),
  amount: amountField,
  type: z.enum(['INCOME', 'EXPENSE'], { message: 'Select a transaction type' }),
  categoryId: z.string().min(1, 'Select a category'),
  description: z.string().trim().max(240, 'Description is too long').optional().or(z.literal('')),
  paymentMethod: z.enum(
    ['CASH', 'UPI', 'CREDIT_CARD', 'DEBIT_CARD', 'BANK_TRANSFER', 'OTHER'],
    { message: 'Select a payment method' },
  ),
  date: z.string().min(1, 'Pick a date'),
});

export const categorySchema = z.object({
  name: z.string().trim().min(2, 'Name must be at least 2 characters').max(40, 'Name is too long'),
  type: z.enum(['INCOME', 'EXPENSE'], { message: 'Select a category type' }),
  icon: z.string().trim().max(8, 'Icon is too long').optional().or(z.literal('')),
  color: z
    .string()
    .trim()
    .regex(/^#[0-9a-fA-F]{6}$/, 'Use a hex colour such as #10B981'),
});

export const budgetSchema = z.object({
  categoryId: z.string().min(1, 'Select a category'),
  amount: amountField,
  month: z.coerce.number().int().min(1, 'Pick a month').max(12, 'Pick a month'),
  year: z.coerce.number().int().min(2000, 'Pick a year').max(2100, 'Pick a year'),
});

export const savingsGoalSchema = z.object({
  name: z.string().trim().min(2, 'Name must be at least 2 characters').max(60, 'Name is too long'),
  targetAmount: amountField,
  currentAmount: z
    .string()
    .trim()
    .refine((value) => value === '' || parseAmountToMinorUnits(value) !== null, 'Enter a valid amount')
    .optional()
    .or(z.literal('')),
  targetDate: z.string().min(1, 'Pick a target date'),
  description: z.string().trim().max(240, 'Description is too long').optional().or(z.literal('')),
});
