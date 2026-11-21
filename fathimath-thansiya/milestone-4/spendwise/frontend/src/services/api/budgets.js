import http from '../http';

export async function fetchBudgets() {
  const { data } = await http.get('/budgets');
  return data.data.items;
}

export async function createBudget(payload) {
  const { data } = await http.post('/budgets', payload);
  return data.data;
}

export async function updateBudget(id, payload) {
  const { data } = await http.patch(`/budgets/${id}`, payload);
  return data.data;
}

export async function deleteBudget(id) {
  const { data } = await http.delete(`/budgets/${id}`);
  return data.data;
}
