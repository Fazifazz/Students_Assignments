import mongoose from 'mongoose';

const savingsGoalSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
      index: true,
    },
    name: {
      type: String,
      required: [true, 'Goal name is required'],
      trim: true,
      minlength: [2, 'Goal name must be at least 2 characters'],
      maxlength: [60, 'Goal name must be at most 60 characters'],
    },
    targetAmountPaise: {
      type: Number,
      required: [true, 'Target amount is required'],
      min: [1, 'Target amount must be greater than zero'],
      validate: {
        validator: Number.isInteger,
        message: 'Target amount must be an integer number of paise',
      },
    },
    currentAmountPaise: {
      type: Number,
      default: 0,
      min: [0, 'Saved amount cannot be negative'],
      validate: {
        validator: Number.isInteger,
        message: 'Saved amount must be an integer number of paise',
      },
    },
    targetDate: {
      type: Date,
      required: [true, 'Target date is required'],
    },
    description: {
      type: String,
      trim: true,
      maxlength: [240, 'Description must be at most 240 characters'],
      default: '',
    },
    completed: {
      type: Boolean,
      default: false,
    },
  },
  { timestamps: true },
);

savingsGoalSchema.index({ userId: 1, createdAt: -1 });

export default mongoose.model('SavingsGoal', savingsGoalSchema);
