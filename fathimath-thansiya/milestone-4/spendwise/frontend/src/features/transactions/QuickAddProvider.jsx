import { useCallback, useMemo, useState } from 'react';
import TransactionFormDialog from './TransactionFormDialog';
import { QuickAddContext } from './quick-add-context';

/**
 * Owns the quick-add transaction dialog so any surface (header button,
 * dashboard card, transactions page) can open the same form.
 */
export function QuickAddProvider({ children }) {
  const [open, setOpen] = useState(false);
  const [editing, setEditing] = useState(null);

  const openQuickAdd = useCallback((transaction = null) => {
    setEditing(transaction);
    setOpen(true);
  }, []);

  const closeQuickAdd = useCallback(() => {
    setOpen(false);
    setEditing(null);
  }, []);

  const value = useMemo(() => ({ openQuickAdd, closeQuickAdd, isOpen: open }), [openQuickAdd, closeQuickAdd, open]);

  return (
    <QuickAddContext.Provider value={value}>
      {children}
      <TransactionFormDialog open={open} onClose={closeQuickAdd} transaction={editing} />
    </QuickAddContext.Provider>
  );
}
