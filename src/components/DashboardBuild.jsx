import { useRef, forwardRef, useImperativeHandle } from 'react';
import DonutChart from './DonutChart';
import SalaryEditor from './SalaryEditor';
import CategoryGrid from './CategoryGrid';
import ExpenseForm from './ExpenseForm';
import ExpenseTable from './ExpenseTable';
import CategoryBudgetEditor from './CategoryBudgetEditor';
import Navbar from './Navbar';
import toast from 'react-hot-toast';

const DashboardBuild = forwardRef(({
  user,
  categories,
  budgetTables,
  totalSalary,
  setTotalSalary,
  selectedCategory,
  categoryBudgetInput,
  setCategoryBudgetInput,
  handleSetCategoryBudget,
  handleCategoryClick,
  handleDeleteCategoryBudget,
  expenseForms,
  handleExpenseChange,
  handleExpenseAdd,
  editState,
  setEditState,
  updateExpenseField,
  handleDeleteExpense,
  transactions,
  loading
}, ref) => {
  const budgetRef = useRef(null);

  useImperativeHandle(ref, () => ({
    scrollToBudget: () => {
      if (budgetRef.current) {
        budgetRef.current.scrollIntoView({ behavior: 'smooth' });
      }
    }
  }));

  const totalExpenses = Object.values(budgetTables).reduce((sum, category) => {
    const categoryTotal = Array.isArray(category.expenses)
      ? category.expenses.reduce((acc, exp) => acc + (exp.amount || 0), 0)
      : 0;
    return sum + categoryTotal;
  }, 0);

  const remainingBalance = totalSalary - totalExpenses;

  const handleAddBudget = () => {
    handleSetCategoryBudget();
    toast.success(`Budget added for ${selectedCategory}`);
  };

  const handleDeleteBudget = (category) => {
    handleDeleteCategoryBudget(category);
    toast.success(`Deleted budget for ${category}`);
  };

  return (
    <>
      <Navbar user={user} />

      <div className="min-h-screen bg-gray-100 dark:bg-gray-900 px-4 py-6 sm:px-6 font-sans text-gray-800 dark:text-gray-100 transition-colors duration-300 flex flex-col gap-8">
        {/* Top Section */}
        <div className="flex flex-col md:flex-row gap-6">
          {/* Salary Editor */}
          <div className="flex-1 bg-white dark:bg-gray-800 rounded-lg shadow-md p-4 sm:p-6 flex flex-col gap-6">
            <SalaryEditor
              totalSalary={totalSalary}
              setTotalSalary={setTotalSalary}
              budgetTables={budgetTables}
            />

            <div className="mt-6 grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="bg-gray-50 dark:bg-gray-700 border rounded-lg p-4 text-center shadow-sm">
                <p className="text-sm text-gray-500 dark:text-gray-300">Total Expenses</p>
                <p className="text-lg font-semibold text-red-600">₹{totalExpenses}</p>
              </div>
              <div className={`border rounded-lg p-4 text-center shadow-sm ${remainingBalance < 0 ? 'bg-red-50 dark:bg-red-900' : 'bg-green-50 dark:bg-green-900'}`}>
                <p className="text-sm text-gray-500 dark:text-gray-300">Remaining Balance</p>
                <p className={`text-lg font-semibold ${remainingBalance < 0 ? 'text-red-600' : 'text-green-600'}`}>₹{remainingBalance}</p>
              </div>
            </div>
          </div>

          {/* Donut Chart */}
          <div className="flex-1 bg-white dark:bg-gray-800 rounded-lg shadow-md p-4 sm:p-6">
            <div className="w-full h-72">
              <DonutChart budgetTables={budgetTables} totalSalary={totalSalary} />
            </div>
          </div>
        </div>

        {/* Bottom Section */}
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
                  className="w-full sm:w-auto px-4 py-3 text-base bg-blue-600 text-white rounded hover:bg-blue-700 transition"
                  onClick={handleAddBudget}
                >
                  Add
                </button>
              </div>
            </div>
          )}

          <div className="w-full max-w-4xl flex flex-col gap-6">
            {Object.entries(budgetTables).map(([category, data]) => (
              <div key={category} className="bg-white dark:bg-gray-800 shadow rounded p-4">
                <h2 className="text-xl font-bold mb-4 flex justify-between items-center">
                  {category}
                  <CategoryBudgetEditor
                    category={category}
                    budget={data.budget}
                    onEdit={handleCategoryClick}
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
                    ...data,
                    expenses: Array.isArray(data.expenses) ? data.expenses : []
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
            ))}
          </div>
        </div>

        {/* Transaction Table */}
        <div className="mt-8 overflow-x-auto">
          {loading ? (
            <p className="text-center text-gray-500 dark:text-gray-300">Loading transactions...</p>
          ) : transactions.length === 0 ? (
            <div className="bg-white dark:bg-gray-800 shadow rounded p-4">
              <p className="text-gray-600 dark:text-gray-300">No transactions found.</p>
            </div>
          ) : (
            <div className="bg-white dark:bg-gray-800 shadow rounded p-4">
              <table className="w-full table-auto text-sm sm:text-base">
                <thead>
                  <tr className="bg-gray-200 dark:bg-gray-700 text-left">
                    <th className="px-4 py-2">Date</th>
                    <th className="px-4 py-2">Category</th>
                    <th className="px-4 py-2">Amount</th>
                    <th className="px-4 py-2">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {transactions.map(tx => (
                    <tr key={tx._id} className="border-t border-gray-300 dark:border-gray-600">
                      <td className="px-4 py-2">
                        {tx.date
                          ? new Date(tx.date).toLocaleDateString('en-IN', {
                              day: '2-digit',
                              month: 'short',
                              year: 'numeric'
                            })
                          : '-'}
                      </td>
                      <td className="px-4 py-2">{tx.category}</td>
                      <td className="px-4 py-2">₹{tx.amount}</td>
                      <td className="px-4 py-2">
                        <button className="text-blue-600 hover:underline mr-2">Edit</button>
                        <button className="text-red-600 hover:underline">Delete</button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </>
  );
});

export default DashboardBuild;
