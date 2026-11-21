import { useEffect } from 'react';
import { Controller, useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Box, MenuItem, Stack, TextField, ToggleButton, ToggleButtonGroup } from '@mui/material';
import { toast } from 'react-toastify';
import FormDialog from '../../../components/common/FormDialog';
import { categorySchema } from '../../../utils/validation';
import { useCreateCategory, useUpdateCategory } from '../api';

const PRESET_COLORS = [
  '#10B981',
  '#3B82F6',
  '#8B5CF6',
  '#F59E0B',
  '#EC4899',
  '#EF4444',
  '#14B8A6',
  '#172B4D',
];

/**
 * Create / edit dialog for a custom category.
 */
export default function CategoryFormDialog({ open, category, onClose }) {
  const isEdit = Boolean(category);
  const createCategory = useCreateCategory();
  const updateCategory = useUpdateCategory();

  const {
    control,
    handleSubmit,
    reset,
    watch,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(categorySchema),
    defaultValues: { name: '', type: 'EXPENSE', icon: '🏷️', color: '#10B981' },
  });

  useEffect(() => {
    if (!open) return;
    reset(
      category
        ? {
            name: category.name,
            type: category.type,
            icon: category.icon,
            color: category.color,
          }
        : { name: '', type: 'EXPENSE', icon: '🏷️', color: '#10B981' },
    );
  }, [open, category, reset]);

  const selectedColor = watch('color');
  const selectedType = watch('type');

  const onSubmit = async (values) => {
    try {
      if (isEdit) {
        await updateCategory.mutateAsync({ id: category._id, payload: values });
        toast.success('Category updated');
      } else {
        await createCategory.mutateAsync(values);
        toast.success('Category created');
      }
      onClose();
    } catch (error) {
      toast.error(error.message);
    }
  };

  const isSaving = createCategory.isPending || updateCategory.isPending;

  return (
    <FormDialog
      open={open}
      title={isEdit ? 'Edit category' : 'New category'}
      subtitle={isEdit ? 'Update how this category is labelled.' : 'Create a category for your records.'}
      submitLabel={isEdit ? 'Save changes' : 'Create category'}
      loading={isSaving}
      error={createCategory.error?.message || updateCategory.error?.message}
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
              label="Name"
              placeholder={selectedType === 'INCOME' ? 'Consulting' : 'Coffee'}
              error={Boolean(errors.name)}
              helperText={errors.name?.message}
              autoFocus
              fullWidth
            />
          )}
        />

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
          name="icon"
          render={({ field }) => (
            <TextField
              {...field}
              label="Icon"
              placeholder="🍔"
              error={Boolean(errors.icon)}
              helperText={errors.icon?.message || 'A single emoji works best'}
              fullWidth
            />
          )}
        />

        <Controller
          control={control}
          name="color"
          render={({ field }) => (
            <Box>
              <TextField
                {...field}
                label="Colour"
                error={Boolean(errors.color)}
                helperText={errors.color?.message}
                fullWidth
                InputProps={{
                  startAdornment: (
                    <Box
                      sx={{
                        width: 18,
                        height: 18,
                        borderRadius: '4px',
                        bgcolor: selectedColor,
                        mr: 1.5,
                        border: '1px solid',
                        borderColor: 'divider',
                      }}
                    />
                  ),
                }}
              />
              <Stack direction="row" spacing={1} sx={{ mt: 1 }}>
                {PRESET_COLORS.map((color) => (
                  <Box
                    key={color}
                    role="button"
                    tabIndex={0}
                    aria-label={`Use colour ${color}`}
                    onClick={() => field.onChange(color)}
                    onKeyDown={(event) => {
                      if (event.key === 'Enter' || event.key === ' ') field.onChange(color);
                    }}
                    sx={{
                      width: 26,
                      height: 26,
                      borderRadius: '6px',
                      bgcolor: color,
                      cursor: 'pointer',
                      border: '2px solid',
                      borderColor: selectedColor === color ? 'text.primary' : 'transparent',
                    }}
                  />
                ))}
              </Stack>
            </Box>
          )}
        />
      </Stack>
    </FormDialog>
  );
}
