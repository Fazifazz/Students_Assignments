import { useEffect, useMemo } from 'react';
import { Controller, useForm, useWatch } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import {
  Alert,
  Box,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Divider,
  IconButton,
  MenuItem,
  Stack,
  TextField,
  ToggleButton,
  Typography,
  ToggleButtonGroup,
} from '@mui/material';
import CloseRoundedIcon from '@mui/icons-material/CloseRounded';
import dayjs from 'dayjs';
import { transactionSchema } from '../../utils/validation';
import { parseAmountToMinorUnits } from '../../utils/money';
import { PAYMENT_METHODS } from '../../utils/constants';
import { useCategories } from '../categories/api';
import { useCreateTransaction, useUpdateTransaction } from './api';

/**
 * Add / edit transaction dialog.
 *
 * Amounts are entered in rupees and converted to integer paise on submit, so
 * no float ever reaches the API layer.
 */
export default function TransactionFormDialog({ open, onClose, transaction = null }) {
  const isEdit = Boolean(transaction);
  const { data: categories = [], isLoading: categoriesLoading } = useCategories();
  const createMutation = useCreateTransaction();
  const updateMutation = useUpdateTransaction();

  const {
    control,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm({
    resolver: zodResolver(transactionSchema),
    defaultValues: {
      title: '',
      amount: '',
      type: 'EXPENSE',
      categoryId: '',
      description: '',
      paymentMethod: 'UPI',
      date: dayjs().format('YYYY-MM-DD'),
    },
  });

  useEffect(() => {
    if (!open) return;
    if (transaction) {
      reset({
        title: transaction.title,
        amount: String(transaction.amountPaise / 100),
        type: transaction.type,
        categoryId: transaction.categoryId,
        description: transaction.description || '',
        paymentMethod: transaction.paymentMethod,
        date: dayjs(transaction.date).format('YYYY-MM-DD'),
      });
    } else {
      reset({
        title: '',
        amount: '',
        type: 'EXPENSE',
        categoryId: '',
        description: '',
        paymentMethod: 'UPI',
        date: dayjs().format('YYYY-MM-DD'),
      });
    }
  }, [open, transaction, reset]);

  const watchedType = useWatch({ control, name: 'type' });

  const filteredCategories = useMemo(
    () => categories.filter((category) => category.type === (watchedType || 'EXPENSE')),
    [categories, watchedType],
  );

  const onSubmit = async (values) => {
    const payload = {
      title: values.title,
      amountPaise: parseAmountToMinorUnits(values.amount),
      type: values.type,
      categoryId: values.categoryId,
      description: values.description || '',
      paymentMethod: values.paymentMethod,
      date: dayjs(values.date).toISOString(),
    };

    if (isEdit) {
      await updateMutation.mutateAsync({ id: transaction._id, payload });
    } else {
      await createMutation.mutateAsync(payload);
    }
    onClose();
  };

  const isSaving = isSubmitting || createMutation.isPending || updateMutation.isPending;
  const serverError = createMutation.error?.message || updateMutation.error?.message;

  return (
    <Dialog open={open} onClose={onClose} fullWidth maxWidth="sm">
      <DialogTitle sx={{ pb: 1 }}>
        <Stack direction="row" alignItems="center" justifyContent="space-between">
          <Box>
            <Typography variant="h4">{isEdit ? 'Edit transaction' : 'Add transaction'}</Typography>
            <Typography variant="body2" color="text.secondary">
              {isEdit ? 'Update the details below.' : 'Record income or an expense in seconds.'}
            </Typography>
          </Box>
          <IconButton onClick={onClose} aria-label="Close dialog">
            <CloseRoundedIcon />
          </IconButton>
        </Stack>
      </DialogTitle>

      <Divider />

      <Box component="form" onSubmit={handleSubmit(onSubmit)} noValidate>
        <DialogContent sx={{ pt: 2.5 }}>
          {serverError && (
            <Alert severity="error" sx={{ mb: 2 }}>
              {serverError}
            </Alert>
          )}

          <Stack spacing={2}>
            <Controller
              control={control}
              name="type"
              render={({ field }) => (
                <ToggleButtonGroup
                  value={field.value}
                  exclusive
                  onChange={(_, value) => value && field.onChange(value)}
                  fullWidth
                  size="small"
                  sx={{ '& .MuiToggleButton-root': { py: 0.9, textTransform: 'none', fontWeight: 600 } }}
                >
                  <ToggleButton value="EXPENSE">Expense</ToggleButton>
                  <ToggleButton value="INCOME">Income</ToggleButton>
                </ToggleButtonGroup>
              )}
            />

            <Controller
              control={control}
              name="title"
              render={({ field }) => (
                <TextField
                  {...field}
                  label="Title"
                  placeholder={watchedType === 'INCOME' ? 'Monthly salary' : 'Groceries'}
                  error={Boolean(errors.title)}
                  helperText={errors.title?.message}
                  fullWidth
                  autoFocus
                />
              )}
            />

            <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2}>
              <Controller
                control={control}
                name="amount"
                render={({ field }) => (
                  <TextField
                    {...field}
                    label="Amount"
                    placeholder="0.00"
                    type="text"
                    inputMode="decimal"
                    error={Boolean(errors.amount)}
                    helperText={errors.amount?.message}
                    fullWidth
                    InputProps={{ startAdornment: <Box sx={{ mr: 1, color: 'text.secondary' }}>₹</Box> }}
                  />
                )}
              />
              <Controller
                control={control}
                name="date"
                render={({ field }) => (
                  <TextField
                    {...field}
                    label="Date"
                    type="date"
                    InputLabelProps={{ shrink: true }}
                    error={Boolean(errors.date)}
                    helperText={errors.date?.message}
                    fullWidth
                  />
                )}
              />
            </Stack>

            <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2}>
              <Controller
                control={control}
                name="categoryId"
                render={({ field }) => (
                  <TextField
                    {...field}
                    select
                    label="Category"
                    error={Boolean(errors.categoryId)}
                    helperText={errors.categoryId?.message || (categoriesLoading ? 'Loading categories…' : '')}
                    fullWidth
                  >
                    {filteredCategories.map((category) => (
                      <MenuItem key={category._id} value={category._id}>
                        <Stack direction="row" alignItems="center" spacing={1}>
                          <span>{category.icon}</span>
                          <span>{category.name}</span>
                        </Stack>
                      </MenuItem>
                    ))}
                  </TextField>
                )}
              />
              <Controller
                control={control}
                name="paymentMethod"
                render={({ field }) => (
                  <TextField
                    {...field}
                    select
                    label="Payment method"
                    error={Boolean(errors.paymentMethod)}
                    helperText={errors.paymentMethod?.message}
                    fullWidth
                  >
                    {PAYMENT_METHODS.map((method) => (
                      <MenuItem key={method.value} value={method.value}>
                        {method.label}
                      </MenuItem>
                    ))}
                  </TextField>
                )}
              />
            </Stack>

            <Controller
              control={control}
              name="description"
              render={({ field }) => (
                <TextField
                  {...field}
                  label="Description"
                  placeholder="Optional note about this transaction"
                  error={Boolean(errors.description)}
                  helperText={errors.description?.message}
                  multiline
                  minRows={2}
                  fullWidth
                />
              )}
            />
          </Stack>
        </DialogContent>

        <DialogActions sx={{ px: 3, pb: 2.5 }}>
          <Button onClick={onClose} color="inherit">
            Cancel
          </Button>
          <Button type="submit" variant="contained" disabled={isSaving}>
            {isSaving ? 'Saving…' : isEdit ? 'Save changes' : 'Add transaction'}
          </Button>
        </DialogActions>
      </Box>
    </Dialog>
  );
}
