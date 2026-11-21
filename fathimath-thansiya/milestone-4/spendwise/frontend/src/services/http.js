import axios from 'axios';
import env from '../config/env';

/**
 * Single axios instance for the whole app.
 *
 * `withCredentials` lets the backend own the HTTP-only auth cookie, which is
 * the only place the session token exists.
 */
const http = axios.create({
  baseURL: env.apiUrl,
  withCredentials: true,
  timeout: 15000,
  headers: { 'Content-Type': 'application/json' },
});

http.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response) {
      const { status, data } = error.response;
      const message =
        data?.error?.message || data?.message || `Request failed with status ${status}`;
      const normalised = new Error(message);
      normalised.status = status;
      normalised.code = data?.error?.code || data?.code;
      normalised.details = data?.error?.details || data?.details;
      return Promise.reject(normalised);
    }
    if (error.code === 'ECONNABORTED') {
      const timeout = new Error('The request timed out. Please try again.');
      timeout.status = 408;
      return Promise.reject(timeout);
    }
    const offline = new Error('Cannot reach the server. Check your connection and try again.');
    offline.status = 0;
    return Promise.reject(offline);
  },
);

export default http;
