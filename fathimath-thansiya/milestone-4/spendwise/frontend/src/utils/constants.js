export const TRANSACTION_TYPES = {
  INCOME: 'INCOME',
  EXPENSE: 'EXPENSE',
};

export const TRANSACTION_TYPE_OPTIONS = [
  { value: TRANSACTION_TYPES.EXPENSE, label: 'Expense' },
  { value: TRANSACTION_TYPES.INCOME, label: 'Income' },
];

export const PAYMENT_METHODS = [
  { value: 'CASH', label: 'Cash' },
  { value: 'UPI', label: 'UPI' },
  { value: 'CREDIT_CARD', label: 'Credit Card' },
  { value: 'DEBIT_CARD', label: 'Debit Card' },
  { value: 'BANK_TRANSFER', label: 'Bank Transfer' },
  { value: 'OTHER', label: 'Other' },
];

export const PAYMENT_METHOD_LABELS = PAYMENT_METHODS.reduce((acc, method) => {
  acc[method.value] = method.label;
  return acc;
}, {});

export const DEFAULT_CATEGORIES = [
  // Income
  { name: 'Salary', type: 'INCOME', icon: '💼', color: '#10B981', isDefault: true },
  { name: 'Freelance', type: 'INCOME', icon: '🧑‍💻', color: '#3B82F6', isDefault: true },
  { name: 'Business', type: 'INCOME', icon: '🏢', color: '#8B5CF6', isDefault: true },
  { name: 'Investments', type: 'INCOME', icon: '📈', color: '#14B8A6', isDefault: true },
  { name: 'Other Income', type: 'INCOME', icon: '✨', color: '#64748B', isDefault: true },
  // Expense
  { name: 'Food', type: 'EXPENSE', icon: '🍔', color: '#F59E0B', isDefault: true },
  { name: 'Shopping', type: 'EXPENSE', icon: '🛍️', color: '#EC4899', isDefault: true },
  { name: 'Transportation', type: 'EXPENSE', icon: '🚗', color: '#3B82F6', isDefault: true },
  { name: 'Rent', type: 'EXPENSE', icon: '🏠', color: '#172B4D', isDefault: true },
  { name: 'Bills', type: 'EXPENSE', icon: '🧾', color: '#8B5CF6', isDefault: true },
  { name: 'Healthcare', type: 'EXPENSE', icon: '🩺', color: '#EF4444', isDefault: true },
  { name: 'Education', type: 'EXPENSE', icon: '🎓', color: '#0EA5E9', isDefault: true },
  { name: 'Entertainment', type: 'EXPENSE', icon: '🎬', color: '#F97316', isDefault: true },
  { name: 'Travel', type: 'EXPENSE', icon: '✈️', color: '#06B6D4', isDefault: true },
  { name: 'Other', type: 'EXPENSE', icon: '📦', color: '#64748B', isDefault: true },
];

export const SORT_OPTIONS = [
  { value: 'date_desc', label: 'Newest first' },
  { value: 'date_asc', label: 'Oldest first' },
  { value: 'amount_desc', label: 'Highest amount' },
  { value: 'amount_asc', label: 'Lowest amount' },
  { value: 'title_asc', label: 'Title (A–Z)' },
];

export const PAGE_SIZE_OPTIONS = [10, 25, 50];

export const BUDGET_STATUS = {
  SAFE: 'SAFE',
  WARNING: 'WARNING',
  EXCEEDED: 'EXCEEDED',
};

export const INSIGHT_SEVERITY = {
  INFO: 'INFO',
  SUCCESS: 'SUCCESS',
  WARNING: 'WARNING',
  DANGER: 'DANGER',
};
