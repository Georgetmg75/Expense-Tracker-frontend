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
  const dashboardRef = useRef(null);

  const [user, setUser] = useState({ name: '', avatar: '' });
  const [transactions, setTransactions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [budgetTables, setBudgetTables] = useState({});
  const [expenseForms, setExpenseForms] = useState({});
  const [editState, setEditState] = useState({ category: null, index: null });
  const [totalSalary, setTotalSalary] = useState(0);
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [categoryBudgetInput, setCategoryBudgetInput] = useState('');

  useEffect(() => {
    const storedUser = JSON.parse(localStorage.getItem('user'));
    if (storedUser?.name) {
      setUser({
        name: storedUser.name,
        avatar: storedUser.avatar || '/logo.jpg'
      });
    }

    fetchTransactions();
    fetchDashboard();
  }, []);

  const fetchDashboard = async () => {
    try {
      const res = await API.get('/api/dashboard');
      const raw = res.data.budgetTables || {};
      const normalized = {};
      const initialForms = {};

      for (const category in raw) {
        normalized[category] = {
          budget: raw[category].budget || 0,
          expenses: Array.isArray(raw[category].expenses) ? raw[category].expenses : []
        };
        initialForms[category] = { date: '', note: '', amount: '' };
      }

      setTotalSalary(res.data.totalSalary || 0);
      setBudgetTables(normalized);
      setExpenseForms(initialForms);
    } catch (err) {
      console.error('Failed to load dashboard:', err.message);
      toast.error('Failed to load dashboard');
    }
  };

  useEffect(() => {
    if (!loading) {
      const timeout = setTimeout(() => {
        saveDashboard();
      }, 500);

      return () => clearTimeout(timeout);
    }
  }, [budgetTables, totalSalary]);

  const fetchTransactions = async () => {
    try {
      const res = await API.get('/api/transactions');
      setTransactions(res.data);
    } catch (err) {
      console.error('Transaction fetch failed:', err.message);
      toast.error('Failed to fetch transactions');
    } finally {
      setLoading(false);
    }
  };

  const handleCategoryClick = (categoryName) => {
    setSelectedCategory(categoryName);
    setCategoryBudgetInput(budgetTables[categoryName]?.budget?.toString() || '');
    setTimeout(() => {
      dashboardRef.current?.scrollToBudget();
    }, 100);
  };

  const handleSetCategoryBudget = () => {
    const value = parseInt(categoryBudgetInput);
    if (!isNaN(value)) {
      setBudgetTables(prev => ({
        ...prev,
        [selectedCategory]: {
          budget: value,
          expenses: prev[selectedCategory]?.expenses || []
        }
      }));
      setExpenseForms(prev => ({
        ...prev,
        [selectedCategory]: prev[selectedCategory] || { date: '', note: '', amount: '' }
      }));
      toast.success(`Budget set for ${selectedCategory}`);
      setSelectedCategory(null);
      setCategoryBudgetInput('');
    }
  };

  const handleDeleteCategoryBudget = (category) => {
    const updated = { ...budgetTables };
    delete updated[category];
    setBudgetTables(updated);
    toast.success(`Deleted budget for ${category}`);
  };

  const handleExpenseChange = (category, field, value) => {
    setExpenseForms(prev => ({
      ...prev,
      [category]: {
        ...prev[category],
        [field]: value
      }
    }));
  };

  const handleExpenseAdd = (e, category) => {
    e.preventDefault();
    const form = expenseForms[category] || { date: '', note: '', amount: '' };
    const newExpense = {
      date: form.date,
      note: form.note,
      amount: parseInt(form.amount)
    };
    setBudgetTables(prev => ({
      ...prev,
      [category]: {
        ...prev[category],
        expenses: [...prev[category].expenses, newExpense]
      }
    }));
    setExpenseForms(prev => ({
      ...prev,
      [category]: { date: '', note: '', amount: '' }
    }));
    toast.success(`Expense added to ${category}`);
  };

  const updateExpenseField = (category, index, field, value) => {
    setBudgetTables(prev => {
      const updatedExpenses = [...prev[category].expenses];
      updatedExpenses[index] = {
        ...updatedExpenses[index],
        [field]: field === 'amount' ? parseInt(value) : value
      };
      return {
        ...prev,
        [category]: {
          ...prev[category],
          expenses: updatedExpenses
        }
      };
    });
  };

  const handleDeleteExpense = (category, index) => {
    setBudgetTables(prev => {
      const updatedExpenses = [...prev[category].expenses];
      updatedExpenses.splice(index, 1);
      return {
        ...prev,
        [category]: {
          ...prev[category],
          expenses: updatedExpenses
        }
      };
    });
    toast.success(`Expense deleted from ${category}`);
  };

  // ✅ Manual save function
  const saveDashboard = async () => {
    try {
      await API.post('/api/dashboard', { totalSalary, budgetTables });
      toast.success('Dashboard saved!');
    } catch (err) {
      console.error('Failed to save dashboard:', err.message);
      toast.error('Failed to save dashboard');
    }
  };

  // ✅ Save on unmount
  useEffect(() => {
    return () => {
      saveDashboard();
    };
  }, []);

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
