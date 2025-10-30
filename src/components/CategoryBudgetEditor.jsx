import React from 'react';

export default function CategoryBudgetEditor({
  category,
  budget,
  onEdit,
  onDelete
}) {
  return (
    <span className="text-sm text-gray-600 dark:text-gray-300 transition-colors duration-300">
      Budget: ₹{budget}
      <button
        className="ml-2 text-blue-600 dark:text-blue-400 hover:underline"
        onClick={() => onEdit(category)}
      >
        Edit
      </button>
      <button
        className="ml-2 text-red-600 dark:text-red-400 hover:underline"
        onClick={() => onDelete(category)}
      >
        Delete
      </button>
    </span>
  );
}
