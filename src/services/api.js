// src/services/api.js
import axios from 'axios';

const apiBase = import.meta.env.VITE_API_URL || 'https://expense-tracker-flax-one-83.vercel.app';

const API = axios.create({
  baseURL: apiBase,
  timeout: 30000,
  withCredentials: true,
});

// ✅ GLOBAL: Auto-add /api prefix
API.interceptors.request.use((config) => {
  // Auto-add /api if missing
  if (config.url && !config.url.startsWith('/api') && !config.url.startsWith('http')) {
    config.url = '/api' + config.url;
  }
  return config;
});

// ✅ Attach token to EVERY request
API.interceptors.request.use((req) => {
  const token = localStorage.getItem('token');
  if (token) {
    req.headers.Authorization = `Bearer ${token}`;
  }
  return req;
});

// ✅ Force headers on app load
const updateAuthHeader = () => {
  const token = localStorage.getItem('token');
  API.defaults.headers.common['Authorization'] = token ? `Bearer ${token}` : '';
};
updateAuthHeader(); // Run once

// ✅ Export update function for Login
API.updateAuth = updateAuthHeader;

// ✅ Log errors
API.interceptors.response.use(
  (res) => res,
  (err) => {
    console.error('API ERROR:', err?.response?.data || err.message);
    return Promise.reject(err);
  }
);

export default API;