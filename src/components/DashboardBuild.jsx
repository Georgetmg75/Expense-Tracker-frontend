// src/components/DashboardBuild.jsx
import { useRef, forwardRef, useImperativeHandle, useEffect } from 'react';
import DonutChart from './DonutChart';
import SalaryEditor from './SalaryEditor';
import CategoryGrid from './CategoryGrid';
import ExpenseForm from './ExpenseForm';
import ExpenseTable from './ExpenseTable';
import CategoryBudgetEditor from './CategoryBudgetEditor';
import Navbar from './Navbar';
import toast from 'react-hot-toast';

// DEBUG LOGS
console.log('DashboardBuild component loaded');

const DashboardBuild = forwardRef((props, ref) => {
  useEffect(() => {
    console.log('DashboardBuild LOADED');
    console.log('totalSalary:', totalSalary);
    console.log('budgetTables:', budgetTables);
    console.log('categories:', categories);
  }, [totalSalary, budgetTables, categories]);

  const {
    user = { name: 'User', avatar: '/logo.jpg' },
    categories = [],
    budgetTables = {},
    totalSalary = 0,
    setTotalSalary = () => {},
    selectedCategory = null,
    categoryBudgetInput = '',
    setCategoryBudgetInput = () => {},
    handleSetCategoryBudget = () => {},
    handleCategoryClick = () => {},
    handleDeleteCategoryBudget = () => {},
    expenseForms = {},
    handleExpenseChange = () => {},
    handleExpenseAdd = () => {},
    editState = { category: null, index: null },
    setEditState = () => {},
    updateExpenseField = () => {},
    handleDeleteExpense = () => {},
    transactions = [],
    loading = false
  } = props;

  const budgetRef = useRef(null);

  useImperativeHandle(ref, () => ({
    scrollToBudget: () => {
      budgetRef.current?.scrollIntoView({ behavior: 'smooth' });
    }
  }));

  const safeBudgetTables = budgetTables || {};
  const totalExpenses = Object.values(safeBudgetTables).reduce((sum, cat) => {
    if (!cat || !Array.isArray(cat.expenses)) return sum;
    return sum + cat.expenses.reduce((acc, exp) => acc + (Number(exp.amount) || 0), 0);
  }, 0);

  const remainingBalance = totalSalary - totalExpenses;

  const handleAddBudget = () => {
    if (!selectedCategory || !categoryBudgetInput) {
      toast.error('Please enter a budget amount');
      return;
    }
    handleSetCategoryBudget();
    toast.success(`Budget set for ${selectedCategory}!`);
  };

  const handleDeleteBudget = (category) => {
    handleDeleteCategoryBudget(category);
    toast.success(`Budget deleted for ${category}`);
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-100">
        <div className="text-2xl font-bold animate-pulse">Loading Dashboard...</div>
      </div>
    );
  }

  return (
    <>
      <Navbar user={user} />

      <div className="min-h-screen bg-gray-100 dark:bg-gray-900 px-4 py-6 sm:px-6 font-sans text-gray-800 dark:text-gray-100 transition-colors duration-300 flex flex-col gap-8">
        
        {/* Top: Salary + Chart */}
        <div className="flex flex-col md:flex-row gap-6">
          <div className="flex-1 bg-white dark:bg-gray-800 rounded-lg shadow-md p-4 sm:p-6 flex flex-col gap-6">
            <SalaryEditor
              totalSalary={totalSalary}
              setTotalSalary={setTotalSalary}
              budgetTables={safeBudgetTables}
            />

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="bg-gray-50 dark:bg-gray-700 border rounded-lg p-4 text-center shadow-sm">
                <p className="text-sm text-gray-500 dark:text-gray-300">Total Expenses</p>
                <p className="text-lg font-semibold text-red-600">₹{totalExpenses}</p>
              </div>
              <div className={`border rounded-lg p-4 text-center shadow-sm ${remainingBalance < 0 ? 'bg-red-50 dark:bg-red-900' : 'bg-green-50 dark:bg-green-900'}`}>
                <p className="text-sm text-gray-500 dark:text-gray-300">Remaining Balance</p>
                <p className={`text-lg font-semibold ${remainingBalance < 0 ? 'text-red-600' : 'text-green-600'}`}>
                  ₹{remainingBalance}
                </p>
              </div>
            </div>
          </div>

          {/* <div className="flex-1 bg-white dark:bg-gray-800 rounded-lg shadow-md p-4 sm:p-6">
            <div className="w-full h-72">
              <DonutChart budgetTables={safeBudgetTables} totalSalary={totalSalary} />
            </div>
          </div> */}
        </div>

        {/* Categories */}
        <div className="flex flex-col items-center gap-6">
          <CategoryGrid categories={categories} onClick={handleCategoryClick} />

          {selectedCategory && (
            <div ref={budgetRef} className="max-w-md w-full bg-white dark:bg-gray-800 p-4 rounded shadow">
              <h3 className="text-lg font-semibold mb-2">Set Budget for {selectedCategory}</h3>
              <div className="flex flex-col sm:flex-row gap-2">
                <input
                  type="number"
                  value={categoryBudgetInput}
                  onChange={(e) => setCategoryBudgetInput(e.target.value)}
                  className="w-full px-4 py-3 text-base border rounded focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-900 dark:text-white"
                  placeholder="Enter budget (₹)"
                />
                <button
                  onClick={handleAddBudget}
                  className="w-full sm:w-auto px-4 py-3 text-base bg-blue-600 text-white rounded hover:bg-blue-700 transition"
                >
                  Add Budget
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Expense Sections */}
        <div className="w-full max-w-4xl flex flex-col gap-6">
          {Object.entries(safeBudgetTables).length === 0 ? (
            <div className="text-center py-10">
              <p className="text-gray-500">Click a category to set a budget and start tracking!</p>
            </div>
          ) : (
            Object.entries(safeBudgetTables).map(([category, data]) => (
              <div key={category} className="bg-white dark:bg-gray-800 shadow rounded p-4">
                <h2 className="text-xl font-bold mb-4 flex justify-between items-center">
                  {category}
                  <CategoryBudgetEditor
                    category={category}
                    budget={data?.budget || 0}
                    onEdit={() => handleCategoryClick(category)}
                    onDelete={() => handleDeleteBudget(category)}
                  />
                </h2>

                <ExpenseForm
                  form={expenseForms[category] || { date: '', note: '', amount: '' }}
                  onChange={(field, value) => handleExpenseChange(category, field, value)}
                  onSubmit={(e) => handleExpenseAdd(e, category)}
                />

                <ExpenseTable
                  category={category}
                  data={{
                    budget: data?.budget || 0,
                    expenses: Array.isArray(data?.expenses) ? data.expenses : []
                  }}
                  isEditing={editState.category === category}
                  editIndex={editState.index}
                  onEdit={(index) => setEditState({ category, index })}
                  onCancel={() => setEditState({ category: null, index: null })}
                  onSave={() => setEditState({ category: null, index: null })}
                  onDelete={(index) => handleDeleteExpense(category, index)}
                  onFieldChange={(index, field, value) => updateExpenseField(category, index, field, value)}
                />
              </div>
            ))
          )}
        </div>

        {/* Transactions */}
        <div className="mt-8 overflow-x-auto">
          <h2 className="text-2xl font-bold mb-4">Recent Transactions</h2>
          {transactions.length === 0 ? (
            <p className="text-center text-gray-500">No transactions yet. Add your first expense!</p>
          ) : (
            <div className="bg-white dark:bg-gray-800 shadow rounded overflow-hidden">
              <table className="w-full text-sm sm:text-base">
                <thead className="bg-gray-200 dark:bg-gray-700">
                  <tr>
                    <th className="px-4 py-3 text-left">Date</th>
                    <th className="px-4 py-3 text-left">Category</th>
                    <th className="px-4 py-3 text-left">Note</th>
                    <th className="px-4 py-3 text-left">Amount</th>
                  </tr>
                </thead>
                <tbody>
                  {transactions.map((tx) => (
                    <tr key={tx._id} className="border-t border-gray-300 dark:border-gray-600 hover:bg-gray-50 dark:hover:bg-gray-700">
                      <td className="px-4 py-3">
                        {tx.date ? new Date(tx.date).toLocaleDateString('en-IN') : '-'}
                      </td>
                      <td className="px-4 py-3">{tx.category || 'Uncategorized'}</td>
                      <td className="px-4 py-3">{tx.note || '-'}</td>
                      <td className="px-4 py-3 font-semibold text-red-600">₹{tx.amount}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>

        {/* DEBUG BUTTON */}
        <div className="fixed bottom-4 right-4">
          <button
            onClick={() => {
              console.log('FULL STATE:', { user, categories, budgetTables, transactions, totalSalary });
              toast.success('Debug logged to console!');
            }}
            className="px-6 py-3 bg-purple-600 text-white rounded-full shadow-lg hover:bg-purple-700"
          >
            🔍 DEBUG
          </button>
        </div>
      </div>
    </>
  );
});

DashboardBuild.displayName = 'DashboardBuild';
export default DashboardBuild;