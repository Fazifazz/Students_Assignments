import mongoose from 'mongoose';

const budgetSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
      index: true,
    },
    categoryId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Category',
      required: [true, 'Category is required'],
      index: true,
    },
    /** Budget limit in integer paise. */
    amountPaise: {
      type: Number,
      required: [true, 'Budget amount is required'],
      min: [1, 'Budget amount must be greater than zero'],
      validate: {
        validator: Number.isInteger,
        message: 'Budget amount must be an integer number of paise',
      },
    },
    month: {
      type: Number,
      required: [true, 'Month is required'],
      min: [1, 'Month must be between 1 and 12'],
      max: [12, 'Month must be between 1 and 12'],
    },
    year: {
      type: Number,
      required: [true, 'Year is required'],
      min: [2000, 'Year looks invalid'],
      max: [2100, 'Year looks invalid'],
    },
  },
  { timestamps: true },
);

// One budget per category per month — enforced by the database, not just the
// service layer, so concurrent requests cannot create duplicates.
budgetSchema.index({ userId: 1, categoryId: 1, month: 1, year: 1 }, { unique: true });

export default mongoose.model('Budget', budgetSchema);
