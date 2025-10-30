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
    if (password !== confirmPassword) {
      alert("Passwords do not match");
      return;
    }

    setLoading(true);
    try {
      await API.post('/auth/register', { name, email, password });
      navigate('/login');
    } catch (err) {
      alert(err.response?.data?.message || 'Registration failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={container}>
      <form onSubmit={handleRegister} className={card}>
        {/* Step 1: Logo + Title */}
        <div className="flex flex-col items-center mb-6">
          <img src={logo} alt="Logo" className="w-12 h-12 mb-2" />
          <h1 className={heading}>Expense Tracker</h1>
        </div>

        {/* Step 2: Form Fields */}
        <input
          type="text"
          placeholder="Name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          className={input}
        />
        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className={input}
        />
        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className={input}
        />
        <input
          type="password"
          placeholder="Confirm Password"
          value={confirmPassword}
          onChange={(e) => setConfirmPassword(e.target.value)}
          className={input}
        />

        {/* Step 4: CTA Button */}
        <button type="submit" className={`${button} mt-2`} disabled={loading}>
          {loading ? 'Registering...' : 'Create Account'}
        </button>

        {/* Step 5: Login Link */}
        <p className={linkStyle}>
          Already have an account?{' '}
          <Link to="/login" className="underline text-green-600">Log in</Link>
        </p>
      </form>
    </div>
  );
}
