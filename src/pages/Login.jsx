// src/pages/Login.jsx
import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import API from '../services/api';
import md5 from 'md5';

import {
  container,
  card,
  heading,
  input,
  button,
  link as linkStyle
} from '../styles/loginStyles';

export default function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const res = await API.post('/api/auth/login', { email, password });
      const { token, user } = res.data;

      // SAVE FULL USER + FORCE _id
      localStorage.setItem('token', token);
      localStorage.setItem('user', JSON.stringify({
        ...user,
        _id: user._id || user.id, // GUARANTEED _id
        name: user.name || email.split('@')[0]
      }));

      console.log('LOGIN SUCCESS → userId:', user._id);
      toast.success('Welcome back, Boss!');

      navigate('/dashboard');
    } catch (err) {
      const message = err.response?.data?.message || 'Login failed';
      toast.error(message);
    } finally {
      setLoading(false);
    }
  };
  
  return (
    <div className={container}>
      <form onSubmit={handleLogin} className={card}>
        <div className="flex flex-col items-center mb-6">
          <img src="/logo.jpg" alt="Logo" className="w-12 h-12 mb-2" />
          <h1 className={heading}>Log In</h1>
        </div>

        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className={input}
          required
        />
        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className={input}
          required
        />

        <button type="submit" className={`${button} mt-2`} disabled={loading}>
          {loading ? 'Logging in...' : 'Log In'}
        </button>

        <p className={linkStyle}>
          Don’t have an account?{' '}
          <Link to="/register" className="underline text-green-600">Create one</Link>
        </p>
      </form>
    </div>
  );
}
