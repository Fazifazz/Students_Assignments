import { useContext } from 'react';
import { QuickAddContext } from './quick-add-context';

export function useQuickAdd() {
  const context = useContext(QuickAddContext);
  if (!context) throw new Error('useQuickAdd must be used inside a QuickAddProvider');
  return context;
}
