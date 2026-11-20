import axios from 'axios';

// Configured Axios instance connecting to backend port 5001 (Session 31)
const api = axios.create({
  baseURL: 'http://localhost:5001/api',
  timeout: 8000,
  headers: {
    'Content-Type': 'application/json',
  },
});

export default api;
