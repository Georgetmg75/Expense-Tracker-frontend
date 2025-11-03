// src/pages/Dashboard.jsx
import { useEffect, useState, useRef } from 'react';
import API from '../services/api';
import DashboardBuild from '../components/DashboardBuild';
import toast from 'react-hot-toast';

const categories = [
  { name: 'Bills & Rechange', icon: '💡' },
  { name: 'Subscription', icon: '🎬' },
  { name: 'Shopping', icon: '🛍️' },
  { name: 'Groceries', icon: '🥦' },
  { name: 'Health Insurance', icon: '🏥' },
  { name: 'Transport Charges', icon: '🚗' },
  { name: 'Vehicle Repairs', icon: '🔧' },
  { name: 'Miscellaneous', icon: '🧺' },
  { name: 'Savings', icon: '💰' },
  { name: 'Vacation', icon: '🏖️' },
];

export default function Dashboard() {
  const dashboardRef = useRef({ scrollToBudget: () => window.scrollTo(0, 500) });

  const [user, setUser] = useState({ name: 'User', avatar: '/logo.jpg' });
  const [transactions, setTransactions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [budgetTables, setBudgetTables] = useState({});
  const [expenseForms, setExpenseForms] = useState({});
  const [editState, setEditState] = useState({ category: null, index: null });
  const [totalSalary, setTotalSalary] = useState(0);
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [categoryBudgetInput, setCategoryBudgetInput] = useState('');

  // SAFE USER LOAD
  useEffect(() => {
    try {
      const storedUser = localStorage.getItem('user');
      if (storedUser) {
        const parsed = JSON.parse(storedUser);
        setUser({
          name: parsed.name || 'User',
          avatar: parsed.avatar || '/logo.jpg'
        });
      }
    } catch (err) {
      console.warn('Failed to parse user from localStorage:', err);
      setUser({ name: 'User', avatar: '/logo.jpg' });
    }

    // FORCE TOKEN
    const token = localStorage.getItem('token');
    if (token) {
      API.defaults.headers.common['Authorization'] = `Bearer ${token}`;
      console.log('Token applied to API');
    } else {
      console.warn('No token found — redirecting to login');
      window.location.href = '/login';
      return;
    }

    fetchTransactions();
    fetchDashboard();
  }, []);

  const fetchDashboard = async () => {
    try {
      console.log('Fetching dashboard data...');
      const res = await API.get('/api/dashboard');
      console.log('Dashboard response:', res.data);

      const raw = res.data.budgetTables || {};
      const normalized = {};
      const initialForms = {};

      for (const category in raw) {
        normalized[category] = {
          budget: Number(raw[category].budget) || 0,
          expenses: Array.isArray(raw[category].expenses) ? raw[category].expenses : []
        };
        initialForms[category] = { date: '', note: '', amount: '' };
      }

      setTotalSalary(Number(res.data.totalSalary) || 0);
      setBudgetTables(normalized);
      setExpenseForms(initialForms);
      toast.success('Dashboard loaded!');
    } catch (err) {
      console.error('DASHBOARD ERROR:', err.response?.data || err.message);
      toast.error('Failed to load dashboard');
    }
  };

  const fetchTransactions = async () => {
    try {
      console.log('Fetching transactions...');
      const res = await API.get('/api/transactions');
      console.log('Transactions:', res.data);
      setTransactions(Array.isArray(res.data) ? res.data : []);
    } catch (err) {
      console.error('TRANSACTIONS ERROR:', err.response?.data || err.message);
      toast.error('Failed to load transactions');
      setTransactions([]);
    } finally {
      setLoading(false);
    }
  };

  // AUTO-SAVE ON CHANGE
  useEffect(() => {
    if (!loading && Object.keys(budgetTables).length > 0) {
      const timeout = setTimeout(saveDashboard, 800);
      return () => clearTimeout(timeout);
    }
  }, [budgetTables, totalSalary, loading]);

  const saveDashboard = async () => {
    try {
      console.log('Saving dashboard...', { totalSalary, budgetTables });
      await API.post('/api/dashboard', { totalSalary, budgetTables });
      toast.success('Saved!');
    } catch (err) {
      console.error('SAVE ERROR:', err.response?.data || err.message);
      toast.error('Auto-save failed');
    }
  };

  // SAVE ON EXIT
  useEffect(() => {
    const handleBeforeUnload = () => saveDashboard();
    window.addEventListener('beforeunload', handleBeforeUnload);
    return () => {
      window.removeEventListener('beforeunload', handleBeforeUnload);
      saveDashboard();
    };
  }, [budgetTables, totalSalary]);

  const handleCategoryClick = (categoryName) => {
    setSelectedCategory(categoryName);
    setCategoryBudgetInput(budgetTables[categoryName]?.budget?.toString() || '');
    setTimeout(() => dashboardRef.current?.scrollToBudget?.(), 100);
  };

  const handleSetCategoryBudget = () => {
    const value = parseFloat(categoryBudgetInput);
    if (!isNaN(value) && value >= 0) {
      setBudgetTables(prev => ({
        ...prev,
        [selectedCategory]: {
          budget: value,
          expenses: prev[selectedCategory]?.expenses || []
        }
      }));
      toast.success(`Budget set: ₹${value}`);
      setSelectedCategory(null);
      setCategoryBudgetInput('');
    } else {
      toast.error('Enter a valid budget');
    }
  };

  const handleDeleteCategoryBudget = (category) => {
    setBudgetTables(prev => {
      const updated = { ...prev };
      delete updated[category];
      return updated;
    });
    toast.success(`Deleted ${category}`);
  };

  const handleExpenseChange = (category, field, value) => {
    setExpenseForms(prev => ({
      ...prev,
      [category]: { ...prev[category], [field]: value }
    }));
  };

  const handleExpenseAdd = (e, category) => {
    e.preventDefault();
    const form = expenseForms[category] || {};
    if (!form.date || !form.note || !form.amount) {
      toast.error('Fill all fields');
      return;
    }
    const amount = parseFloat(form.amount);
    if (isNaN(amount) || amount <= 0) {
      toast.error('Invalid amount');
      return;
    }

    setBudgetTables(prev => ({
      ...prev,
      [category]: {
        ...prev[category],
        expenses: [...(prev[category]?.expenses || []), {
          date: form.date,
          note: form.note,
          amount
        }]
      }
    }));
    setExpenseForms(prev => ({
      ...prev,
      [category]: { date: '', note: '', amount: '' }
    }));
    toast.success('Expense added!');
  };

  const updateExpenseField = (category, index, field, value) => {
    setBudgetTables(prev => {
      const expenses = [...prev[category].expenses];
      expenses[index] = {
        ...expenses[index],
        [field]: field === 'amount' ? parseFloat(value) || 0 : value
      };
      return {
        ...prev,
        [category]: { ...prev[category], expenses }
      };
    });
  };

  const handleDeleteExpense = (category, index) => {
    setBudgetTables(prev => {
      const expenses = prev[category].expenses.filter((_, i) => i !== index);
      return {
        ...prev,
        [category]: { ...prev[category], expenses }
      };
    });
    toast.success('Expense deleted');
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-2xl font-bold">Loading your dashboard...</div>
      </div>
    );
  }

  return (
    <div className="bg-white dark:bg-gray-900 text-gray-800 dark:text-gray-100 min-h-screen transition-colors duration-300 px-4 sm:px-6">
      <DashboardBuild
        ref={dashboardRef}
        user={user}
        categories={categories}
        budgetTables={budgetTables}
        totalSalary={totalSalary}
        setTotalSalary={setTotalSalary}
        selectedCategory={selectedCategory}
        categoryBudgetInput={categoryBudgetInput}
        setCategoryBudgetInput={setCategoryBudgetInput}
        handleSetCategoryBudget={handleSetCategoryBudget}
        handleCategoryClick={handleCategoryClick}
        handleDeleteCategoryBudget={handleDeleteCategoryBudget}
        expenseForms={expenseForms}
        handleExpenseChange={handleExpenseChange}
        handleExpenseAdd={handleExpenseAdd}
        editState={editState}
        setEditState={setEditState}
        updateExpenseField={updateExpenseField}
        handleDeleteExpense={handleDeleteExpense}
        transactions={transactions}
        loading={loading}
      />
    </div>
  );
}