import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';

export default function Navbar({ user }) {
  const [isDark, setIsDark] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    const storedTheme = localStorage.getItem('theme');
    const prefersDark = storedTheme === 'dark';
    document.documentElement.classList.toggle('dark', prefersDark);
    setIsDark(prefersDark);
  }, []);

  const toggleDarkMode = () => {
    const newMode = !isDark;
    document.documentElement.classList.toggle('dark', newMode);
    localStorage.setItem('theme', newMode ? 'dark' : 'light');
    setIsDark(newMode);
  };

  return (
    <header className="bg-white dark:bg-gray-900 shadow-md px-4 py-3 sm:px-6 sm:py-4 text-gray-800 dark:text-gray-100">
      <div className="flex justify-between items-center">
        {/* App Name */}
        <Link to="/" className="text-xl sm:text-2xl font-bold text-green-900 dark:text-green-400 hover:text-green-600">
          Expense Tracker
        </Link>

        {/* Mobile Menu Toggle */}
        <button
          className="sm:hidden text-green-700 dark:text-green-300 text-lg"
          onClick={() => setMenuOpen(!menuOpen)}
        >
          ☰
        </button>

        {/* Desktop Nav + User Info */}
        <div className="hidden sm:flex items-center gap-6">
          <nav className="flex gap-4 text-base font-medium">
            <Link to="/dashboard" className="hover:text-green-600 dark:hover:text-green-300">Dashboard</Link>
            <Link to="/register" className="hover:text-green-600 dark:hover:text-green-300">Create Account</Link>
            <Link to="/login" className="hover:text-green-600 dark:hover:text-green-300">Login</Link>
          </nav>

          {/* User Info */}
          <div className="flex items-center gap-3">
            <span className="text-sm">{user?.name || 'Guest'}</span>
            <img
              src={user?.avatar || '/logo.jpg'}
              alt="User Avatar"
              className="w-8 h-8 rounded-full object-cover border border-gray-300 dark:border-gray-600"
            />
          </div>

          {/* Dark Mode Toggle */}
          <div className="flex items-center gap-2">
            <span className="text-sm text-gray-700 dark:text-gray-300">Dark Mode</span>
            <label className="relative inline-flex items-center cursor-pointer">
              <input
                type="checkbox"
                checked={isDark}
                onChange={toggleDarkMode}
                className="sr-only peer"
              />
              <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-2 peer-focus:ring-gray-500 dark:peer-focus:ring-green-400 rounded-full peer dark:bg-gray-700 peer-checked:bg-green-600 transition-all"></div>
              <div className="absolute left-1 top-1 bg-white dark:bg-gray-300 w-4 h-4 rounded-full transition-transform peer-checked:translate-x-full"></div>
            </label>
          </div>
        </div>
      </div>

      {/* Mobile Nav */}
      {menuOpen && (
        <nav className="flex flex-col gap-3 mt-4 sm:hidden text-base font-medium">
          <Link to="/dashboard" className="hover:text-green-600 dark:hover:text-green-300">Dashboard</Link>
          <Link to="/register" className="hover:text-green-600 dark:hover:text-green-300">Create Account</Link>
          <Link to="/login" className="hover:text-green-600 dark:hover:text-green-300">Login</Link>
          <div className="flex items-center gap-3 mt-2">
            <span className="text-sm">{user?.name || 'Guest'}</span>
            <img
              src={user?.avatar || '/logo.jpg'}
              alt="User Avatar"
              className="w-8 h-8 rounded-full object-cover border border-gray-300 dark:border-gray-600"
            />
          </div>
          <div className="flex items-center gap-2 mt-2">
            <span className="text-sm text-gray-700 dark:text-gray-300">Dark Mode</span>
            <label className="relative inline-flex items-center cursor-pointer">
              <input
                type="checkbox"
                checked={isDark}
                onChange={toggleDarkMode}
                className="sr-only peer"
              />
              <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-2 peer-focus:ring-gray-500 dark:peer-focus:ring-green-400 rounded-full peer dark:bg-gray-700 peer-checked:bg-green-600 transition-all"></div>
              <div className="absolute left-1 top-1 bg-white dark:bg-gray-300 w-4 h-4 rounded-full transition-transform peer-checked:translate-x-full"></div>
            </label>
          </div>
        </nav>
      )}
    </header>
  );
}
