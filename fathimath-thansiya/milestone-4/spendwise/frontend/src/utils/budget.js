import { BUDGET_STATUS } from './constants';

/** Maps utilisation to a status + colour scale. */
export function budgetStatus(usagePercent) {
  if (usagePercent >= 100) {
    return { status: BUDGET_STATUS.EXCEEDED, color: 'error.main', label: 'Exceeded' };
  }
  if (usagePercent >= 80) {
    return { status: BUDGET_STATUS.WARNING, color: 'warning.main', label: 'Near limit' };
  }
  return { status: BUDGET_STATUS.SAFE, color: 'success.main', label: 'On track' };
}
