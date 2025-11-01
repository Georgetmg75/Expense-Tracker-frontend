// src/pages/Register.jsx
import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import API from '../services/api';
import logo from '../assets/logo.jpg';

import {
  container,
  card,
  heading,
  input,
  button,
  link as linkStyle
} from '../styles/registerStyles';

export default function Register() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleRegister = async (e) => {
    e.preventDefault();

    if (!name || !email || !password || !confirmPassword) {
      alert("Please fill in all fields");
      return;
    }

    if (password !== confirmPassword) {
      alert("Passwords do not match");
      return;
    }

    setLoading(true);
    try {
      const res = await API.post('/auth/register', { name, email, password });

      console.log("Registration response:", res);

      if (res.status === 201 || res.status === 200) {
        alert("Account created successfully");
        navigate('/login');
      } else {
        throw new Error("Unexpected response");
      }
    } catch (err) {
      console.error("Full registration error:", err);
      const message =
        err.response?.data?.message ||
        err.response?.data?.error ||
        err.message ||
        'Registration failed';
      alert(message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={container}>
      <form onSubmit={handleRegister} className={card}>
        <div className="flex flex-col items-center mb-6">
          <img src={logo} alt="Logo" className="w-12 h-12 mb-2" />
          <h1 className={heading}>Expense Tracker</h1>
        </div>

        <input
          type="text"
          placeholder="Name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          className={input}
          required
        />
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
        <input
          type="password"
          placeholder="Confirm Password"
          value={confirmPassword}
          onChange={(e) => setConfirmPassword(e.target.value)}
          className={input}
          required
        />

        <button type="submit" className={`${button} mt-2`} disabled={loading}>
          {loading ? 'Registering...' : 'Create Account'}
        </button>

        <p className={linkStyle}>
          Already have an account?{' '}
          <Link to="/login" className="underline text-green-600">Log in</Link>
        </p>
      </form>
    </div>
  );
}
