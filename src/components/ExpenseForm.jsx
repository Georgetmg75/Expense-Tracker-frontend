import React from 'react';
import toast from 'react-hot-toast';

export default function ExpenseForm({ form, onChange, onSubmit }) {
  const safeForm = form || { date: '', note: '', amount: '' };

  const handleSubmit = (e) => {
    e.preventDefault();

    if (!safeForm.date || !safeForm.note || !safeForm.amount) {
      toast.error('Please fill out all fields');
      return;
    }

    if (isNaN(parseInt(safeForm.amount))) {
      toast.error('Amount must be a number');
      return;
    }

    onSubmit(e);
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="flex flex-col sm:flex-row flex-wrap gap-4 mb-4 text-gray-800 dark:text-gray-100 transition-colors duration-300"
    >
      <input
        type="date"
        value={safeForm.date}
        onChange={(e) => onChange('date', e.target.value)}
        className="w-full sm:w-auto px-4 py-3 text-base border border-gray-300 dark:border-gray-600 rounded bg-white dark:bg-gray-900 text-gray-800 dark:text-gray-100 placeholder-gray-400 dark:placeholder-gray-500"
        required
      />
      <input
        type="text"
        placeholder="Note"
        value={safeForm.note}
        onChange={(e) => onChange('note', e.target.value)}
        className="w-full sm:w-auto px-4 py-3 text-base border border-gray-300 dark:border-gray-600 rounded bg-white dark:bg-gray-900 text-gray-800 dark:text-gray-100 placeholder-gray-400 dark:placeholder-gray-500"
        required
      />
      <input
        type="number"
        placeholder="Amount"
        value={safeForm.amount}
        onChange={(e) => onChange('amount', e.target.value)}
        className="w-full sm:w-auto px-4 py-3 text-base border border-gray-300 dark:border-gray-600 rounded bg-white dark:bg-gray-900 text-gray-800 dark:text-gray-100 placeholder-gray-400 dark:placeholder-gray-500"
        required
      />
      <button
        type="submit"
        className="w-full sm:w-auto px-4 py-3 text-base bg-green-600 text-white rounded hover:bg-green-700 transition-colors duration-300"
      >
        Add Expense
      </button>
    </form>
  );
}
