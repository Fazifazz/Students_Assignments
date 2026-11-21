import mongoose from 'mongoose';

export const TRANSACTION_TYPES = ['INCOME', 'EXPENSE'];

export const PAYMENT_METHODS = [
  'CASH',
  'UPI',
  'CREDIT_CARD',
  'DEBIT_CARD',
  'BANK_TRANSFER',
  'OTHER',
];

const transactionSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
      index: true,
    },
    title: {
      type: String,
      required: [true, 'Title is required'],
      trim: true,
      minlength: [2, 'Title must be at least 2 characters'],
      maxlength: [80, 'Title must be at most 80 characters'],
    },
    /**
     * Money is stored as integer paise. A MongoDB/Node number is a double,
     * but integers below 2^53 are exact, so paise amounts never drift.
     */
    amountPaise: {
      type: Number,
      required: [true, 'Amount is required'],
      min: [1, 'Amount must be greater than zero'],
      validate: {
        validator: Number.isInteger,
        message: 'Amount must be an integer number of paise',
      },
    },
    type: {
      type: String,
      enum: {
        values: TRANSACTION_TYPES,
        message: 'Type must be INCOME or EXPENSE',
      },
      required: true,
      index: true,
    },
    categoryId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Category',
      required: [true, 'Category is required'],
      index: true,
    },
    description: {
      type: String,
      trim: true,
      maxlength: [240, 'Description must be at most 240 characters'],
      default: '',
    },
    paymentMethod: {
      type: String,
      enum: {
        values: PAYMENT_METHODS,
        message: 'Unsupported payment method',
      },
      required: true,
      default: 'OTHER',
    },
    date: {
      type: Date,
      required: [true, 'Date is required'],
      default: Date.now,
    },
  },
  { timestamps: true },
);

// Listing queries always filter by user and sort by date.
transactionSchema.index({ userId: 1, date: -1 });
transactionSchema.index({ userId: 1, type: 1, date: -1 });
transactionSchema.index({ userId: 1, categoryId: 1, date: -1 });

export default mongoose.model('Transaction', transactionSchema);
