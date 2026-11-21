import http from '../http';

export async function fetchTransactions(params = {}) {
  const { data } = await http.get('/transactions', { params });
  return data.data;
}

export async function fetchTransaction(id) {
  const { data } = await http.get(`/transactions/${id}`);
  return data.data;
}

export async function createTransaction(payload) {
  const { data } = await http.post('/transactions', payload);
  return data.data;
}

export async function updateTransaction(id, payload) {
  const { data } = await http.patch(`/transactions/${id}`, payload);
  return data.data;
}

export async function deleteTransaction(id) {
  const { data } = await http.delete(`/transactions/${id}`);
  return data.data;
}
