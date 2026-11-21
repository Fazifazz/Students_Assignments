import { useEffect, useMemo } from 'react';
import { Controller, useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Box, MenuItem, Stack, TextField, Typography } from '@mui/material';
import { toast } from 'react-toastify';
import FormDialog from '../../../components/common/FormDialog';
import { budgetSchema } from '../../../utils/validation';
import { parseAmountToMinorUnits } from '../../../utils/money';
import { useCategories } from '../../categories/api';
import { useCreateBudget, useUpdateBudget } from '../api';

const MONTHS = [
  'January', 'February', 'March', 'April', 'May', 'June',
  'July', 'August', 'September', 'October', 'November', 'December',
];

const YEARS = Array.from({ length: 4 }, (_, index) => new Date().getFullYear() + index - 2);

/**
 * Create / edit dialog for a monthly category budget.
 */
export default function BudgetFormDialog({ open, budget, defaultMonth, defaultYear, onClose }) {
  const isEdit = Boolean(budget);
  const { data: categories = [] } = useCategories();
  const createBudget = useCreateBudget();
  const updateBudget = useUpdateBudget();

  const expenseCategories = useMemo(
    () => categories.filter((category) => category.type === 'EXPENSE'),
    [categories],
  );

  const {
    control,
    handleSubmit,
    reset,
    watch,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(budgetSchema),
    defaultValues: { categoryId: '', amount: '', month: defaultMonth, year: defaultYear },
  });

  useEffect(() => {
    if (!open) return;
    reset(
      budget
        ? {
            categoryId: budget.categoryId,
            amount: String(budget.amountPaise / 100),
            month: budget.month,
            year: budget.year,
          }
        : {
            categoryId: '',
            amount: '',
            month: defaultMonth,
            year: defaultYear,
          },
    );
  }, [open, budget, defaultMonth, defaultYear, reset]);

  const selectedCategoryId = watch('categoryId');

  const onSubmit = async (values) => {
    const payload = {
      categoryId: values.categoryId,
      amountPaise: parseAmountToMinorUnits(values.amount),
      month: Number(values.month),
      year: Number(values.year),
    };

    try {
      if (isEdit) {
        await updateBudget.mutateAsync({ id: budget._id, payload });
        toast.success('Budget updated');
      } else {
        await createBudget.mutateAsync(payload);
        toast.success('Budget created');
      }
      onClose();
    } catch (error) {
      toast.error(error.message);
    }
  };

  const isSaving = createBudget.isPending || updateBudget.isPending;

  return (
    <FormDialog
      open={open}
      title={isEdit ? 'Edit budget' : 'New budget'}
      subtitle="Budgets are tracked against real expense transactions."
      submitLabel={isEdit ? 'Save changes' : 'Create budget'}
      loading={isSaving}
      error={createBudget.error?.message || updateBudget.error?.message}
      onSubmit={handleSubmit(onSubmit)}
      onClose={onClose}
    >
      <Stack spacing={2}>
        <Controller
          control={control}
          name="categoryId"
          render={({ field }) => (
            <TextField
              {...field}
              select
              label="Category"
              error={Boolean(errors.categoryId)}
              helperText={errors.categoryId?.message || 'Only expense categories can have a budget'}
              fullWidth
            >
              {expenseCategories.map((category) => (
                <MenuItem key={category._id} value={category._id}>
                  {category.icon} {category.name}
                </MenuItem>
              ))}
            </TextField>
          )}
        />

        <Controller
          control={control}
          name="amount"
          render={({ field }) => (
            <TextField
              {...field}
              label="Monthly limit"
              placeholder="5000"
              inputMode="decimal"
              error={Boolean(errors.amount)}
              helperText={errors.amount?.message}
              fullWidth
              InputProps={{
                startAdornment: <Box sx={{ mr: 1, color: 'text.secondary' }}>₹</Box>,
              }}
            />
          )}
        />

        <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2}>
          <Controller
            control={control}
            name="month"
            render={({ field }) => (
              <TextField {...field} select label="Month" fullWidth>
                {MONTHS.map((month, index) => (
                  <MenuItem key={month} value={index + 1}>
                    {month}
                  </MenuItem>
                ))}
              </TextField>
            )}
          />
          <Controller
            control={control}
            name="year"
            render={({ field }) => (
              <TextField {...field} select label="Year" fullWidth>
                {YEARS.map((year) => (
                  <MenuItem key={year} value={year}>
                    {year}
                  </MenuItem>
                ))}
              </TextField>
            )}
          />
        </Stack>

        {selectedCategoryId && (
          <Typography variant="caption" color="text.secondary">
            Spending against this category is calculated from your transactions automatically.
          </Typography>
        )}
      </Stack>
    </FormDialog>
  );
}
