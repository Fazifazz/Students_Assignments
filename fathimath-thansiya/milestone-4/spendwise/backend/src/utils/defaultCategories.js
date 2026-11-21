/**
 * Categories seeded for every newly registered user.
 * Kept identical to the frontend's `utils/constants.js` so both sides agree
 * on names, icons and colours.
 */
export const DEFAULT_CATEGORIES = [
  // Income
  { name: 'Salary', type: 'INCOME', icon: '💼', color: '#10B981' },
  { name: 'Freelance', type: 'INCOME', icon: '🧑‍💻', color: '#3B82F6' },
  { name: 'Business', type: 'INCOME', icon: '🏢', color: '#8B5CF6' },
  { name: 'Investments', type: 'INCOME', icon: '📈', color: '#14B8A6' },
  { name: 'Other Income', type: 'INCOME', icon: '✨', color: '#64748B' },
  // Expenses
  { name: 'Food', type: 'EXPENSE', icon: '🍔', color: '#F59E0B' },
  { name: 'Shopping', type: 'EXPENSE', icon: '🛍️', color: '#EC4899' },
  { name: 'Transportation', type: 'EXPENSE', icon: '🚗', color: '#3B82F6' },
  { name: 'Rent', type: 'EXPENSE', icon: '🏠', color: '#172B4D' },
  { name: 'Bills', type: 'EXPENSE', icon: '🧾', color: '#8B5CF6' },
  { name: 'Healthcare', type: 'EXPENSE', icon: '🩺', color: '#EF4444' },
  { name: 'Education', type: 'EXPENSE', icon: '🎓', color: '#0EA5E9' },
  { name: 'Entertainment', type: 'EXPENSE', icon: '🎬', color: '#F97316' },
  { name: 'Travel', type: 'EXPENSE', icon: '✈️', color: '#06B6D4' },
  { name: 'Other', type: 'EXPENSE', icon: '📦', color: '#64748B' },
];

export default DEFAULT_CATEGORIES;
