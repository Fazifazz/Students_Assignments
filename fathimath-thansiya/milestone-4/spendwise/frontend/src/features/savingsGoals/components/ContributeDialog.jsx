import { useEffect } from 'react';
import { Controller, useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Alert, Box, Stack, TextField, Typography } from '@mui/material';
import { toast } from 'react-toastify';
import FormDialog from '../../../components/common/FormDialog';
import { amountField } from '../../../utils/validation';
import { parseAmountToMinorUnits, formatCurrency } from '../../../utils/money';
import { useUpdateSavingsGoal } from '../api';

// The resolver needs an object schema so its output maps onto the form fields.
const contributeSchema = z.object({ amount: amountField });

/**
 * Adds money to a savings goal.
 *
 * The backend rejects a contribution that would exceed the target, so the
 * remaining amount is previewed here to make that limit obvious up front.
 */
export default function ContributeDialog({ goal, onClose }) {
  const updateGoal = useUpdateSavingsGoal();

  const {
    control,
    handleSubmit,
    reset,
    watch,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(contributeSchema),
    defaultValues: { amount: '' },
  });

  useEffect(() => {
    if (goal) reset({ amount: '' });
  }, [goal, reset]);

  const amount = watch('amount');
  const contributionPaise = parseAmountToMinorUnits(amount || '');
  const remainingPaise = goal ? goal.targetAmountPaise - goal.currentAmountPaise : 0;
  const exceedsTarget = contributionPaise !== null && contributionPaise > remainingPaise;

  const onSubmit = async (values) => {
    try {
      await updateGoal.mutateAsync({
        id: goal._id,
        payload: { contributionPaise: parseAmountToMinorUnits(values.amount) },
      });
      toast.success(`Added to ${goal.name}`);
      onClose();
    } catch (error) {
      toast.error(error.message);
    }
  };

  if (!goal) return null;

  return (
    <FormDialog
      open={Boolean(goal)}
      title={`Add money to ${goal.name}`}
      subtitle={`${formatCurrency(goal.currentAmountPaise)} saved of ${formatCurrency(goal.targetAmountPaise)}`}
      submitLabel="Add money"
      loading={updateGoal.isPending}
      error={updateGoal.error?.message}
      onSubmit={handleSubmit(onSubmit)}
      onClose={onClose}
      maxWidth="xs"
    >
      <Stack spacing={2}>
        <Controller
          control={control}
          name="amount"
          render={({ field }) => (
            <TextField
              {...field}
              label="Amount to add"
              placeholder="5000"
              inputMode="decimal"
              autoFocus
              error={Boolean(errors.amount)}
              helperText={errors.amount?.message}
              fullWidth
              InputProps={{
                startAdornment: <Box sx={{ mr: 1, color: 'text.secondary' }}>₹</Box>,
              }}
            />
          )}
        />

        <Typography variant="caption" color="text.secondary">
          {formatCurrency(remainingPaise)} still needed to reach the target.
        </Typography>

        {exceedsTarget && (
          <Alert severity="warning">
            This is more than the remaining target. The API will reject it unless the goal allows
            overshooting.
          </Alert>
        )}
      </Stack>
    </FormDialog>
  );
}
