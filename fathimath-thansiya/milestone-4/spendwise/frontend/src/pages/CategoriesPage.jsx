import { useMemo, useState } from 'react';
import {
  Avatar,
  Box,
  Button,
  Card,
  Chip,
  IconButton,
  Stack,
  Tooltip,
  Typography,
} from '@mui/material';
import AddRoundedIcon from '@mui/icons-material/AddRounded';
import EditRoundedIcon from '@mui/icons-material/EditRounded';
import DeleteOutlineRoundedIcon from '@mui/icons-material/DeleteOutlineRounded';
import { toast } from 'react-toastify';
import PageHeader from '../components/common/PageHeader';
import ConfirmDialog from '../components/common/ConfirmDialog';
import { EmptyState, ErrorState, LoadingSkeleton } from '../components/common/States';
import CategoryFormDialog from '../features/categories/components/CategoryFormDialog';
import { useCategories, useDeleteCategory } from '../features/categories/api';

/**
 * Category management — default categories are read-only, custom categories
 * can be created, edited and deleted.
 */
export default function CategoriesPage() {
  const { data: categories = [], isLoading, isError, error, refetch } = useCategories();
  const deleteCategory = useDeleteCategory();

  const [formOpen, setFormOpen] = useState(false);
  const [editing, setEditing] = useState(null);
  const [pendingDelete, setPendingDelete] = useState(null);

  const income = useMemo(() => categories.filter((c) => c.type === 'INCOME'), [categories]);
  const expense = useMemo(() => categories.filter((c) => c.type === 'EXPENSE'), [categories]);

  const handleDelete = async () => {
    try {
      await deleteCategory.mutateAsync(pendingDelete._id);
      toast.success('Category deleted');
      setPendingDelete(null);
    } catch (requestError) {
      toast.error(requestError.message);
    }
  };

  const renderGrid = (list, emptyMessage) => (
    <Box
      sx={{
        display: 'grid',
        gridTemplateColumns: { xs: '1fr', sm: 'repeat(2, 1fr)', lg: 'repeat(3, 1fr)' },
        gap: 2,
      }}
    >
      {list.map((category) => (
        <Card key={category._id} sx={{ p: 2 }}>
          <Stack direction="row" alignItems="center" spacing={1.5}>
            <Avatar
              variant="rounded"
              sx={{ width: 42, height: 42, bgcolor: `${category.color}1A`, fontSize: 20 }}
            >
              {category.icon}
            </Avatar>
            <Box sx={{ minWidth: 0, flexGrow: 1 }}>
              <Stack direction="row" alignItems="center" spacing={1}>
                <Typography variant="body1" noWrap sx={{ fontWeight: 600 }}>
                  {category.name}
                </Typography>
                {category.isDefault && <Chip label="Default" size="small" variant="outlined" />}
              </Stack>
              <Stack direction="row" alignItems="center" spacing={0.75} sx={{ mt: 0.25 }}>
                <Box
                  sx={{ width: 10, height: 10, borderRadius: '3px', bgcolor: category.color }}
                />
                <Typography variant="caption" color="text.secondary">
                  {category.color}
                </Typography>
              </Stack>
            </Box>
            {!category.isDefault && (
              <Stack direction="row" spacing={0.5}>
                <Tooltip title="Edit category">
                  <IconButton
                    size="small"
                    onClick={() => {
                      setEditing(category);
                      setFormOpen(true);
                    }}
                  >
                    <EditRoundedIcon fontSize="small" />
                  </IconButton>
                </Tooltip>
                <Tooltip title="Delete category">
                  <IconButton size="small" color="error" onClick={() => setPendingDelete(category)}>
                    <DeleteOutlineRoundedIcon fontSize="small" />
                  </IconButton>
                </Tooltip>
              </Stack>
            )}
          </Stack>
        </Card>
      ))}
      {list.length === 0 && (
        <Box sx={{ gridColumn: '1 / -1' }}>
          <EmptyState title="No categories" description={emptyMessage} />
        </Box>
      )}
    </Box>
  );

  return (
    <Stack spacing={3}>
      <PageHeader
        title="Categories"
        subtitle="Organise your income and expenses into categories."
        actions={
          <Button
            variant="contained"
            startIcon={<AddRoundedIcon />}
            onClick={() => {
              setEditing(null);
              setFormOpen(true);
            }}
          >
            Add category
          </Button>
        }
      />

      {isLoading ? (
        <LoadingSkeleton count={6} height={84} />
      ) : isError ? (
        <ErrorState message={error?.message} onRetry={refetch} />
      ) : (
        <>
          <Box>
            <Typography variant="h4" sx={{ mb: 1.5 }}>
              Income
            </Typography>
            {renderGrid(income, 'Create an income category to start tracking earnings.')}
          </Box>

          <Box>
            <Typography variant="h4" sx={{ mb: 1.5 }}>
              Expenses
            </Typography>
            {renderGrid(expense, 'Create an expense category to start tracking spending.')}
          </Box>
        </>
      )}

      <CategoryFormDialog
        open={formOpen}
        category={editing}
        onClose={() => {
          setFormOpen(false);
          setEditing(null);
        }}
      />

      <ConfirmDialog
        open={Boolean(pendingDelete)}
        title="Delete category"
        message={
          pendingDelete
            ? `Delete "${pendingDelete.name}"? Categories that are still used by transactions or budgets cannot be deleted.`
            : ''
        }
        confirmLabel="Delete"
        destructive
        loading={deleteCategory.isPending}
        onConfirm={handleDelete}
        onClose={() => setPendingDelete(null)}
      />
    </Stack>
  );
}
