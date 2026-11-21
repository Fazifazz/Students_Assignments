import { useEffect, useMemo, useState } from 'react';
import {
  Box,
  Button,
  Card,
  Chip,
  FormControl,
  InputAdornment,
  MenuItem,
  Stack,
  TablePagination,
  TextField,
  Typography,
} from '@mui/material';
import AddRoundedIcon from '@mui/icons-material/AddRounded';
import SearchRoundedIcon from '@mui/icons-material/SearchRounded';
import FilterAltOffRoundedIcon from '@mui/icons-material/FilterAltOffRounded';
import { toast } from 'react-toastify';
import PageHeader from '../components/common/PageHeader';
import ConfirmDialog from '../components/common/ConfirmDialog';
import TransactionTable from '../components/transactions/TransactionTable';
import { EmptyState, ErrorState, LoadingSkeleton } from '../components/common/States';
import { useTransactions, useDeleteTransaction } from '../features/transactions/api';
import { useQuickAdd } from '../features/transactions/useQuickAdd';
import { useCategories } from '../features/categories/api';
import useDebouncedValue from '../hooks/useDebouncedValue';
import { PAGE_SIZE_OPTIONS, SORT_OPTIONS, TRANSACTION_TYPE_OPTIONS } from '../utils/constants';

const EMPTY_FILTERS = {
  search: '',
  type: '',
  categoryId: '',
  from: '',
  to: '',
  sort: 'date_desc',
};

/**
 * Transaction management screen — list, search, filter, sort and paginate
 * against the real API.
 */
export default function TransactionsPage() {
  const { openQuickAdd } = useQuickAdd();
  const deleteTransaction = useDeleteTransaction();

  const [filters, setFilters] = useState(EMPTY_FILTERS);
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(10);
  const [pendingDelete, setPendingDelete] = useState(null);

  const debouncedSearch = useDebouncedValue(filters.search, 350);
  const { data: categories = [] } = useCategories();

  // Any filter change invalidates the current page number.
  useEffect(() => {
    setPage(1);
  }, [debouncedSearch, filters.type, filters.categoryId, filters.from, filters.to, filters.sort]);

  const queryParams = useMemo(() => {
    const params = { page, limit, sort: filters.sort };
    if (debouncedSearch) params.search = debouncedSearch;
    if (filters.type) params.type = filters.type;
    if (filters.categoryId) params.categoryId = filters.categoryId;
    if (filters.from) params.from = filters.from;
    if (filters.to) params.to = filters.to;
    return params;
  }, [page, limit, debouncedSearch, filters]);

  const { data, isLoading, isError, error, refetch } = useTransactions(queryParams);

  const items = data?.items || [];
  const pagination = data?.pagination || { page: 1, limit: 10, total: 0, totalPages: 1 };

  const typeCategories = useMemo(
    () =>
      categories.filter((category) =>
        filters.type ? category.type === filters.type : true,
      ),
    [categories, filters.type],
  );

  const hasActiveFilters =
    Boolean(
      filters.search ||
        filters.type ||
        filters.categoryId ||
        filters.from ||
        filters.to ||
        filters.sort !== 'date_desc',
    );

  const updateFilter = (key) => (event) => {
    const value = event.target.value;
    setFilters((current) => ({ ...current, [key]: value }));
  };

  const handleDelete = async () => {
    try {
      await deleteTransaction.mutateAsync(pendingDelete._id);
      toast.success('Transaction deleted');
      setPendingDelete(null);
    } catch (requestError) {
      toast.error(requestError.message);
    }
  };

  const clearFilters = () => {
    setFilters(EMPTY_FILTERS);
    setPage(1);
  };

  return (
    <Stack spacing={3}>
      <PageHeader
        title="Transactions"
        subtitle="Search, filter and manage every income and expense record."
        actions={
          <Button variant="contained" startIcon={<AddRoundedIcon />} onClick={() => openQuickAdd()}>
            Add transaction
          </Button>
        }
      />

      <Card sx={{ p: 2 }}>
        <Box
          sx={{
            display: 'grid',
            gridTemplateColumns: {
              xs: '1fr',
              sm: 'repeat(2, 1fr)',
              lg: 'repeat(6, 1fr)',
            },
            gap: 1.5,
          }}
        >
          <TextField
            size="small"
            label="Search"
            placeholder="Title or description"
            value={filters.search}
            onChange={updateFilter('search')}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <SearchRoundedIcon fontSize="small" sx={{ color: 'text.secondary' }} />
                </InputAdornment>
              ),
            }}
          />

          <TextField
            size="small"
            select
            label="Type"
            value={filters.type}
            onChange={updateFilter('type')}
          >
            <MenuItem value="">All types</MenuItem>
            {TRANSACTION_TYPE_OPTIONS.map((option) => (
              <MenuItem key={option.value} value={option.value}>
                {option.label}
              </MenuItem>
            ))}
          </TextField>

          <TextField
            size="small"
            select
            label="Category"
            value={filters.categoryId}
            onChange={updateFilter('categoryId')}
          >
            <MenuItem value="">All categories</MenuItem>
            {typeCategories.map((category) => (
              <MenuItem key={category._id} value={category._id}>
                {category.icon} {category.name}
              </MenuItem>
            ))}
          </TextField>

          <TextField
            size="small"
            label="From"
            type="date"
            value={filters.from}
            onChange={updateFilter('from')}
            InputLabelProps={{ shrink: true }}
          />

          <TextField
            size="small"
            label="To"
            type="date"
            value={filters.to}
            onChange={updateFilter('to')}
            InputLabelProps={{ shrink: true }}
          />

          <TextField size="small" select label="Sort by" value={filters.sort} onChange={updateFilter('sort')}>
            {SORT_OPTIONS.map((option) => (
              <MenuItem key={option.value} value={option.value}>
                {option.label}
              </MenuItem>
            ))}
          </TextField>
        </Box>

        {hasActiveFilters && (
          <Stack direction="row" alignItems="center" spacing={1.5} sx={{ mt: 1.5 }}>
            <Chip label="Filters active" size="small" color="primary" variant="outlined" />
            <Button size="small" startIcon={<FilterAltOffRoundedIcon />} onClick={clearFilters}>
              Clear filters
            </Button>
          </Stack>
        )}
      </Card>

      <Card>
        {isLoading ? (
          <Box sx={{ p: 2.5 }}>
            <LoadingSkeleton variant="row" count={8} />
          </Box>
        ) : isError ? (
          <ErrorState message={error?.message} onRetry={refetch} />
        ) : items.length === 0 ? (
          <EmptyState
            title="No transactions found"
            description={
              hasActiveFilters
                ? 'Try relaxing the filters, or add a new transaction.'
                : 'Add your first income or expense to start tracking.'
            }
            action={
              <Button variant="contained" startIcon={<AddRoundedIcon />} onClick={() => openQuickAdd()}>
                Add transaction
              </Button>
            }
          />
        ) : (
          <>
            <TransactionTable
              transactions={items}
              onEdit={(transaction) => openQuickAdd(transaction)}
              onDelete={(transaction) => setPendingDelete(transaction)}
            />
            <TablePagination
              component="div"
              count={pagination.total}
              page={pagination.page - 1}
              onPageChange={(_, nextPage) => setPage(nextPage + 1)}
              rowsPerPage={pagination.limit}
              onRowsPerPageChange={(event) => {
                setLimit(Number(event.target.value));
                setPage(1);
              }}
              rowsPerPageOptions={PAGE_SIZE_OPTIONS}
              labelRowsPerPage="Rows"
            />
          </>
        )}
      </Card>

      <ConfirmDialog
        open={Boolean(pendingDelete)}
        title="Delete transaction"
        message={
          pendingDelete
            ? `Delete "${pendingDelete.title}"? This cannot be undone.`
            : ''
        }
        confirmLabel="Delete"
        destructive
        loading={deleteTransaction.isPending}
        onConfirm={handleDelete}
        onClose={() => setPendingDelete(null)}
      />
    </Stack>
  );
}
