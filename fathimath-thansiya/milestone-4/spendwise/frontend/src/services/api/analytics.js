import http from '../http';

export async function fetchMonthlyAnalytics(params = {}) {
  const { data } = await http.get('/analytics/monthly', { params });
  return data.data;
}

export async function fetchCategoryAnalytics(params = {}) {
  const { data } = await http.get('/analytics/categories', { params });
  return data.data;
}

export async function fetchTrends(params = {}) {
  const { data } = await http.get('/analytics/trends', { params });
  return data.data;
}
