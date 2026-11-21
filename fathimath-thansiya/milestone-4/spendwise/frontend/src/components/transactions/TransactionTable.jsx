import {
  Avatar,
  Box,
  IconButton,
  Menu,
  MenuItem,
  Stack,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Tooltip,
  Typography,
} from '@mui/material';
import MoreVertRoundedIcon from '@mui/icons-material/MoreVertRounded';
import DeleteOutlineRoundedIcon from '@mui/icons-material/DeleteOutlineRounded';
import EditRoundedIcon from '@mui/icons-material/EditRounded';
import { useState } from 'react';
import { formatCurrency } from '../../utils/money';
import { formatDate } from '../../utils/format';
import { PAYMENT_METHOD_LABELS } from '../../utils/constants';

/**
 * Reusable transaction table. `compact` renders a borderless list used on the
 * dashboard, `full` renders the data grid used on the transactions page.
 */
export default function TransactionTable({
  transactions = [],
  compact = false,
  onEdit,
  onDelete,
}) {
  const [menuAnchor, setMenuAnchor] = useState(null);
  const [activeId, setActiveId] = useState(null);

  const handleOpenMenu = (event, id) => {
    setMenuAnchor(event.currentTarget);
    setActiveId(id);
  };

  const handleCloseMenu = () => setMenuAnchor(null);

  if (!transactions.length) {
    return (
      <Typography variant="body2" color="text.secondary" sx={{ py: 3, textAlign: 'center' }}>
        No transactions to show.
      </Typography>
    );
  }

  if (compact) {
    return (
      <Stack divider={<Box sx={{ borderBottom: '1px solid', borderColor: 'divider' }} />}>
        {transactions.map((txn) => (
          <Stack
            key={txn._id}
            direction="row"
            alignItems="center"
            spacing={1.5}
            sx={{ py: 1.5, '&:last-child': { pb: 0 } }}
          >
            <Avatar
              variant="rounded"
              sx={{ width: 38, height: 38, bgcolor: `${txn.category?.color || '#10B981'}1A`, fontSize: 18 }}
            >
              {txn.category?.icon || '💸'}
            </Avatar>
            <Box sx={{ minWidth: 0, flexGrow: 1 }}>
              <Typography variant="body2" noWrap sx={{ fontWeight: 600 }}>
                {txn.title}
              </Typography>
              <Typography variant="caption" color="text.secondary" noWrap>
                {txn.category?.name || 'Uncategorised'} · {formatDate(txn.date)}
              </Typography>
            </Box>
            <Typography
              variant="body2"
              sx={{
                fontWeight: 700,
                whiteSpace: 'nowrap',
                color: txn.type === 'INCOME' ? 'success.main' : 'text.primary',
              }}
            >
              {txn.type === 'INCOME' ? '+' : '−'}
              {formatCurrency(txn.amountPaise)}
            </Typography>
          </Stack>
        ))}
      </Stack>
    );
  }

  return (
    <>
      <TableContainer>
        <Table size="medium">
          <TableHead>
            <TableRow>
              <TableCell>Transaction</TableCell>
              <TableCell>Category</TableCell>
              <TableCell>Date</TableCell>
              <TableCell>Payment</TableCell>
              <TableCell align="right">Amount</TableCell>
              <TableCell align="right" width={56} />
            </TableRow>
          </TableHead>
          <TableBody>
            {transactions.map((txn) => (
              <TableRow key={txn._id} hover>
                <TableCell>
                  <Stack direction="row" alignItems="center" spacing={1.25}>
                    <Avatar
                      variant="rounded"
                      sx={{ width: 34, height: 34, bgcolor: `${txn.category?.color || '#10B981'}1A`, fontSize: 16 }}
                    >
                      {txn.category?.icon || '💸'}
                    </Avatar>
                    <Box sx={{ minWidth: 0 }}>
                      <Typography variant="body2" sx={{ fontWeight: 600 }} noWrap>
                        {txn.title}
                      </Typography>
                      {txn.description && (
                        <Typography variant="caption" color="text.secondary" noWrap sx={{ display: 'block', maxWidth: 220 }}>
                          {txn.description}
                        </Typography>
                      )}
                    </Box>
                  </Stack>
                </TableCell>
                <TableCell>
                  <Typography variant="body2">{txn.category?.name || '—'}</Typography>
                </TableCell>
                <TableCell>
                  <Typography variant="body2" color="text.secondary">
                    {formatDate(txn.date)}
                  </Typography>
                </TableCell>
                <TableCell>
                  <Typography variant="body2" color="text.secondary">
                    {PAYMENT_METHOD_LABELS[txn.paymentMethod] || txn.paymentMethod}
                  </Typography>
                </TableCell>
                <TableCell align="right">
                  <Typography
                    variant="body2"
                    sx={{ fontWeight: 700, color: txn.type === 'INCOME' ? 'success.main' : 'text.primary' }}
                  >
                    {txn.type === 'INCOME' ? '+' : '−'}
                    {formatCurrency(txn.amountPaise)}
                  </Typography>
                </TableCell>
                <TableCell align="right">
                  <Tooltip title="Actions">
                    <IconButton size="small" onClick={(event) => handleOpenMenu(event, txn._id)}>
                      <MoreVertRoundedIcon fontSize="small" />
                    </IconButton>
                  </Tooltip>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>

      <Menu anchorEl={menuAnchor} open={Boolean(menuAnchor)} onClose={handleCloseMenu}>
        <MenuItem
          onClick={() => {
            handleCloseMenu();
            onEdit?.(transactions.find((t) => t._id === activeId));
          }}
        >
          <EditRoundedIcon fontSize="small" sx={{ mr: 1 }} /> Edit
        </MenuItem>
        <MenuItem
          onClick={() => {
            handleCloseMenu();
            onDelete?.(transactions.find((t) => t._id === activeId));
          }}
          sx={{ color: 'error.main' }}
        >
          <DeleteOutlineRoundedIcon fontSize="small" sx={{ mr: 1 }} /> Delete
        </MenuItem>
      </Menu>
    </>
  );
}
