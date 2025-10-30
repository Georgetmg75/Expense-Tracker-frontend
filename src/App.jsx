// src/App.jsx
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { useEffect } from 'react';
import { Toaster } from 'react-hot-toast'; // ✅ added

import Landing from './pages/Landing';
import Login from './pages/Login';
import Register from './pages/Register';
import Dashboard from './pages/Dashboard';
import NotFound from './pages/NotFound';
import PrivateRoute from './components/PrivateRoute';

export default function App() {
  console.log("App.jsx loaded");

  // ✅ Apply dark mode on initial load based on localStorage
  useEffect(() => {
    if (localStorage.getItem('theme') === 'dark') {
      document.documentElement.classList.add('dark');
    }
  }, []);

  return (
    <div className="bg-white dark:bg-gray-900 text-gray-800 dark:text-gray-100 min-h-screen transition-colors duration-300">
      <Toaster
        position="top-right"
        toastOptions={{
          duration: 3000,
          style: {
            background: '#1f2937', // Tailwind dark gray-800
            color: '#f9fafb',       // Tailwind gray-50
            fontSize: '0.875rem',
          },
          success: {
            iconTheme: {
              primary: '#4ade80',   // Tailwind green-400
              secondary: '#1e293b'  // Tailwind slate-800
            }
          },
          error: {
            iconTheme: {
              primary: '#f87171',   // Tailwind red-400
              secondary: '#1e293b'
            }
          }
        }}
      />

      <Router>
        <Routes>
          {/* Default landing page */}
          <Route path="/" element={<Landing />} />

          {/* Auth routes */}
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />

          {/* Protected dashboard route */}
          <Route
            path="/dashboard"
            element={
              <PrivateRoute>
                <Dashboard />
              </PrivateRoute>
            }
          />

          {/* Catch-all for unknown routes */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </Router>
    </div>
  );
}
