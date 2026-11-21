import mongoose from 'mongoose';

export const CATEGORY_TYPES = ['INCOME', 'EXPENSE'];

const categorySchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
      index: true,
    },
    name: {
      type: String,
      required: [true, 'Category name is required'],
      trim: true,
      minlength: [2, 'Category name must be at least 2 characters'],
      maxlength: [40, 'Category name must be at most 40 characters'],
    },
    type: {
      type: String,
      enum: {
        values: CATEGORY_TYPES,
        message: 'Category type must be INCOME or EXPENSE',
      },
      required: true,
    },
    icon: {
      type: String,
      default: '🏷️',
      trim: true,
      maxlength: 8,
    },
    color: {
      type: String,
      default: '#64748B',
      trim: true,
      match: [/^#[0-9a-fA-F]{6}$/, 'Colour must be a hex value such as #10B981'],
    },
    isDefault: {
      type: Boolean,
      default: false,
    },
  },
  { timestamps: true },
);

// A user may not have two categories with the same name and type.
categorySchema.index({ userId: 1, name: 1, type: 1 }, { unique: true });
categorySchema.index({ userId: 1, type: 1 });

export default mongoose.model('Category', categorySchema);
