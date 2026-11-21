import http from '../http';

export async function fetchSavingsGoals() {
  const { data } = await http.get('/savings-goals');
  return data.data.items;
}

export async function createSavingsGoal(payload) {
  const { data } = await http.post('/savings-goals', payload);
  return data.data;
}

export async function updateSavingsGoal(id, payload) {
  const { data } = await http.patch(`/savings-goals/${id}`, payload);
  return data.data;
}

export async function deleteSavingsGoal(id) {
  const { data } = await http.delete(`/savings-goals/${id}`);
  return data.data;
}
