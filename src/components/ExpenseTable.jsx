import React from 'react';

export default function ExpenseTable({
  category,
  data,
  isEditing,
  editIndex,
  onEdit,
  onCancel,
  onSave,
  onDelete,
  onFieldChange
}) {
  const remaining = data.budget - data.expenses.reduce((sum, e) => sum + e.amount, 0);

  return (
    <div className="overflow-x-auto">
      <table className="w-full table-auto text-sm sm:text-base text-gray-800 dark:text-gray-100 transition-colors duration-300">
        <thead>
          <tr className="bg-gray-200 dark:bg-gray-700 text-left">
            <th className="px-4 py-2">Date</th>
            <th className="px-4 py-2">Note</th>
            <th className="px-4 py-2">Amount</th>
            <th className="px-4 py-2">Actions</th>
            <th className="px-4 py-2 text-right">
              Budget: ₹{data.budget} <br />
              <span className={remaining < 0 ? 'text-red-600' : 'text-green-600'}>
                Remaining: ₹{remaining}
              </span>
            </th>
          </tr>
        </thead>
        <tbody>
          {data.expenses.length === 0 ? (
            <tr>
              <td colSpan="5" className="px-4 py-2 text-gray-500 dark:text-gray-400">No expenses yet.</td>
            </tr>
          ) : (
            data.expenses.map((exp, idx) => {
              const editing = isEditing && editIndex === idx;
              return (
                <tr key={idx} className="border-t border-gray-300 dark:border-gray-600">
                  {editing ? (
                    <>
                      <td className="px-4 py-2">
                        <input
                          type="date"
                          value={exp.date}
                          onChange={(e) => onFieldChange(idx, 'date', e.target.value)}
                          className="w-full px-3 py-2 text-sm border border-gray-300 dark:border-gray-600 rounded bg-white dark:bg-gray-900 text-gray-800 dark:text-gray-100"
                        />
                      </td>
                      <td className="px-4 py-2">
                        <input
                          type="text"
                          value={exp.note}
                          onChange={(e) => onFieldChange(idx, 'note', e.target.value)}
                          className="w-full px-3 py-2 text-sm border border-gray-300 dark:border-gray-600 rounded bg-white dark:bg-gray-900 text-gray-800 dark:text-gray-100"
                        />
                      </td>
                      <td className="px-4 py-2">
                        <input
                          type="number"
                          value={exp.amount}
                          onChange={(e) => onFieldChange(idx, 'amount', e.target.value)}
                          className="w-full px-3 py-2 text-sm border border-gray-300 dark:border-gray-600 rounded bg-white dark:bg-gray-900 text-gray-800 dark:text-gray-100"
                        />
                      </td>
                      <td className="px-4 py-2 whitespace-nowrap">
                        <button className="text-green-600 dark:text-green-400 hover:underline mr-2" onClick={onSave}>Save</button>
                        <button className="text-gray-600 dark:text-gray-400 hover:underline" onClick={onCancel}>Cancel</button>
                      </td>
                      <td></td>
                    </>
                  ) : (
                    <>
                      <td className="px-4 py-2">{new Date(exp.date).toLocaleDateString('en-IN')}</td>
                      <td className="px-4 py-2">{exp.note}</td>
                      <td className="px-4 py-2">₹{exp.amount}</td>
                      <td className="px-4 py-2 whitespace-nowrap">
                        <button className="text-blue-600 dark:text-blue-400 hover:underline mr-2" onClick={() => onEdit(idx)}>Edit</button>
                        <button className="text-red-600 dark:text-red-400 hover:underline" onClick={() => onDelete(idx)}>Delete</button>
                      </td>
                      <td></td>
                    </>
                  )}
                </tr>
              );
            })
          )}
        </tbody>
      </table>
    </div>
  );
}
