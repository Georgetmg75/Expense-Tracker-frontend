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
  // FIXED: Real ref for forwardRef
  const dashboardRef = useRef(null);

  const [user, setUser] = useState({ name: 'User', avatar: '/logo.jpg' });
  const [transactions, setTransactions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [budgetTables, setBudgetTables] = useState({});
  const [expenseForms, setExpenseForms] = useState({});
  const [editState, setEditState] = useState({ category: null, index: null });
  const [totalSalary, setTotalSalary] = useState(0);
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [categoryBudgetInput, setCategoryBudgetInput] = useState('');

  useEffect(() => {
    // User + Token
    const storedUser = localStorage.getItem('user');
    if (storedUser) {
      try {
        const parsed = JSON.parse(storedUser);
        setUser({ name: parsed.name || 'User', avatar: parsed.avatar || '/logo.jpg' });
      } catch (err) {
        console.warn('Bad user data', err);
      }
    }

    const token = localStorage.getItem('token');
    if (!token) {
      window.location.href = '/login';
      return;
    }
    API.defaults.headers.common['Authorization'] = `Bearer ${token}`;

    fetchTransactions();
    fetchDashboard();
  }, []);

  const fetchDashboard = async () => {
    try {
      const res = await API.get('/api/dashboard');
      const raw = res.data.budgetTables || {};
      const normalized = {};
      const initialForms = {};

      for (const cat in raw) {
        normalized[cat] = {
          budget: Number(raw[cat].budget) || 0,
          expenses: Array.isArray(raw[cat].expenses) ? raw[cat].expenses : []
        };
        initialForms[cat] = { date: '', note: '', amount: '' };
      }

      setTotalSalary(Number(res.data.totalSalary) || 0);
      setBudgetTables(normalized);
      setExpenseForms(initialForms);
      toast.success('Dashboard loaded!');
    } catch (err) {
      console.error('Dashboard fetch error:', err);
      toast.error('Failed to load data');
    }
  };

  const fetchTransactions = async () => {
    try {
      const res = await API.get('/api/transactions');
      setTransactions(Array.isArray(res.data) ? res.data : []);
    } catch (err) {
      console.error('Transactions error:', err);
      setTransactions([]);
    } finally {
      setLoading(false);
    }
  };

  // Auto-save
  useEffect(() => {
    if (!loading && Object.keys(budgetTables).length) {
      const t = setTimeout(() => {
        API.post('/api/dashboard', { totalSalary, budgetTables }).catch(() => {});
      }, 800);
      return () => clearTimeout(t);
    }
  }, [budgetTables, totalSalary, loading]);

  // FIXED: Safe scroll
  const handleCategoryClick = (categoryName) => {
    setSelectedCategory(categoryName);
    setCategoryBudgetInput(budgetTables[categoryName]?.budget?.toString() || '');
    setTimeout(() => {
      dashboardRef.current?.scrollToBudget?.() || window.scrollTo({ top: 600, behavior: 'smooth' });
    }, 100);
  };

  const handleSetCategoryBudget = () => {
    const value = parseFloat(categoryBudgetInput);
    if (isNaN(value) || value < 0) {
      toast.error('Invalid budget');
      return;
    }
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
      const expenses = [...(prev[category]?.expenses || [])];
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
      const expenses = (prev[category]?.expenses || []).filter((_, i) => i !== index);
      return {
        ...prev,
        [category]: { ...prev[category], expenses }
      };
    });
    toast.success('Expense deleted');
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-100">
        <div className="text-2xl font-bold animate-pulse">Loading...</div>
      </div>
    );
  }

  return (
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
  );
}