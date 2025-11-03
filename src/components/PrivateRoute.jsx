// src/components/PrivateRoute.jsx
import { useEffect, useState } from 'react';
import { Navigate } from 'react-router-dom';

export default function PrivateRoute({ children }) {
  const [isAuthenticated, setIsAuthenticated] = useState(null);

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) {
      API.defaults.headers.common['Authorization'] = `Bearer ${token}`;
    }
    setIsAuthenticated(!!token);
  }, []);

  if (isAuthenticated === null) {
    // Optional: show a loading spinner or skeleton
    return <div className="text-center mt-10">Checking authentication...</div>;
  }

  return isAuthenticated ? children : <Navigate to="/login" />;
}
