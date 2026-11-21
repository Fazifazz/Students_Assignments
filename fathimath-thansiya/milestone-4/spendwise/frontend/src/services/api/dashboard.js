import http from '../http';

export async function fetchDashboardSummary() {
  const { data } = await http.get('/dashboard/summary');
  return data.data;
}

export async function fetchRecentTransactions(limit = 8) {
  const { data } = await http.get('/dashboard/recent-transactions', { params: { limit } });
  return data.data.items;
}

export async function fetchSpendingOverview() {
  const { data } = await http.get('/dashboard/spending-overview');
  return data.data;
}
