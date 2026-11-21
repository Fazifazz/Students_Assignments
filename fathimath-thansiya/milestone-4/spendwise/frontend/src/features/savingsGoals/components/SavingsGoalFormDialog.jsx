import { useEffect } from 'react';
import { Controller, useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Box, Stack, TextField } from '@mui/material';
import dayjs from 'dayjs';
import { toast } from 'react-toastify';
import FormDialog from '../../../components/common/FormDialog';
import { savingsGoalSchema } from '../../../utils/validation';
import { parseAmountToMinorUnits } from '../../../utils/money';
import { useCreateSavingsGoal, useUpdateSavingsGoal } from '../api';

/**
 * Create / edit dialog for a savings goal.
 */
export default function SavingsGoalFormDialog({ open, goal, onClose }) {
  const isEdit = Boolean(goal);
  const createGoal = useCreateSavingsGoal();
  const updateGoal = useUpdateSavingsGoal();

  const {
    control,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(savingsGoalSchema),
    defaultValues: {
      name: '',
      targetAmount: '',
      currentAmount: '',
      targetDate: dayjs().add(6, 'month').format('YYYY-MM-DD'),
      description: '',
    },
  });

  useEffect(() => {
    if (!open) return;
    reset(
      goal
        ? {
            name: goal.name,
            targetAmount: String(goal.targetAmountPaise / 100),
            currentAmount: String(goal.currentAmountPaise / 100),
            targetDate: dayjs(goal.targetDate).format('YYYY-MM-DD'),
            description: goal.description || '',
          }
        : {
            name: '',
            targetAmount: '',
            currentAmount: '',
            targetDate: dayjs().add(6, 'month').format('YYYY-MM-DD'),
            description: '',
          },
    );
  }, [open, goal, reset]);

  const onSubmit = async (values) => {
    const payload = {
      name: values.name,
      targetAmountPaise: parseAmountToMinorUnits(values.targetAmount),
      currentAmountPaise: parseAmountToMinorUnits(values.currentAmount || '0') || 0,
      targetDate: dayjs(values.targetDate).toISOString(),
      description: values.description || '',
    };

    try {
      if (isEdit) {
        await updateGoal.mutateAsync({ id: goal._id, payload });
        toast.success('Savings goal updated');
      } else {
        await createGoal.mutateAsync(payload);
        toast.success('Savings goal created');
      }
      onClose();
    } catch (error) {
      toast.error(error.message);
    }
  };

  const isSaving = createGoal.isPending || updateGoal.isPending;

  return (
    <FormDialog
      open={open}
      title={isEdit ? 'Edit savings goal' : 'New savings goal'}
      subtitle="Give your goal a name, a target amount and a date."
      submitLabel={isEdit ? 'Save changes' : 'Create goal'}
      loading={isSaving}
      error={createGoal.error?.message || updateGoal.error?.message}
      onSubmit={handleSubmit(onSubmit)}
      onClose={onClose}
    >
      <Stack spacing={2}>
        <Controller
          control={control}
          name="name"
          render={({ field }) => (
            <TextField
              {...field}
              label="Goal name"
              placeholder="Emergency fund"
              error={Boolean(errors.name)}
              helperText={errors.name?.message}
              autoFocus
              fullWidth
            />
          )}
        />

        <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2}>
          <Controller
            control={control}
            name="targetAmount"
            render={({ field }) => (
              <TextField
                {...field}
                label="Target amount"
                placeholder="50000"
                inputMode="decimal"
                error={Boolean(errors.targetAmount)}
                helperText={errors.targetAmount?.message}
                fullWidth
                InputProps={{
                  startAdornment: <Box sx={{ mr: 1, color: 'text.secondary' }}>₹</Box>,
                }}
              />
            )}
          />
          <Controller
            control={control}
            name="currentAmount"
            render={({ field }) => (
              <TextField
                {...field}
                label="Already saved"
                placeholder="0"
                inputMode="decimal"
                error={Boolean(errors.currentAmount)}
                helperText={errors.currentAmount?.message}
                fullWidth
                InputProps={{
                  startAdornment: <Box sx={{ mr: 1, color: 'text.secondary' }}>₹</Box>,
                }}
              />
            )}
          />
        </Stack>

        <Controller
          control={control}
          name="targetDate"
          render={({ field }) => (
            <TextField
              {...field}
              label="Target date"
              type="date"
              InputLabelProps={{ shrink: true }}
              error={Boolean(errors.targetDate)}
              helperText={errors.targetDate?.message}
              fullWidth
            />
          )}
        />

        <Controller
          control={control}
          name="description"
          render={({ field }) => (
            <TextField
              {...field}
              label="Description"
              placeholder="Optional note about this goal"
              error={Boolean(errors.description)}
              helperText={errors.description?.message}
              multiline
              minRows={2}
              fullWidth
            />
          )}
        />
      </Stack>
    </FormDialog>
  );
}
