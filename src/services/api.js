import axios from 'axios';

// ✅ Use environment variable for dynamic backend URL
const apiBase = import.meta.env.VITE_API_URL || 'https://expense-tracker-ecru-chi.vercel.app/api';

const API = axios.create({
  baseURL: apiBase,
  timeout: 10000,
});

// ✅ Attach token to every request
API.interceptors.request.use((req) => {
  const token = localStorage.getItem('token');
  if (token) {
    req.headers.authorization = `Bearer ${token}`;
  }
  return req;
});

// ✅ Log errors globally
API.interceptors.response.use(
  (res) => res,
  (err) => {
    console.error('API error:', err?.response?.data?.message || err.message);
    return Promise.reject(err);
  }
);

export default API;
