import http from '../http';

/**
 * Authentication endpoints.
 *
 * The session token is delivered as an HTTP-only cookie by the backend, so
 * no token is ever handled (or stored) by the frontend.
 */
export async function login({ email, password }) {
  const { data } = await http.post('/auth/login', { email, password });
  return data.data;
}

export async function register({ name, email, password }) {
  const { data } = await http.post('/auth/register', { name, email, password });
  return data.data;
}

export async function logout() {
  const { data } = await http.post('/auth/logout');
  return data.data;
}

export async function fetchCurrentUser() {
  const { data } = await http.get('/auth/me');
  return data.data.user;
}

export async function updateProfile(payload) {
  const { data } = await http.patch('/auth/profile', payload);
  return data.data;
}

export async function changePassword(payload) {
  const { data } = await http.post('/auth/change-password', payload);
  return data.data;
}

export async function forgotPassword({ email }) {
  const { data } = await http.post('/auth/forgot-password', { email });
  return data.data;
}

export async function resetPassword({ token, password }) {
  const { data } = await http.post('/auth/reset-password', { token, password });
  return data.data;
}
