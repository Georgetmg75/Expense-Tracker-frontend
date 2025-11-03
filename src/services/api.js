import axios from 'axios';

const apiBase = import.meta.env.VITE_API_URL;

const API = axios.create({
  baseURL: apiBase,
  timeout: 30000,
  withCredentials: true,
});

// AUTO-ADD TOKEN
API.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
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
