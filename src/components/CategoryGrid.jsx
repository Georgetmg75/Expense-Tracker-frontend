import React from 'react';

export default function CategoryGrid({ categories, onClick }) {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 mb-6 max-w-4xl mx-auto px-2">
      {categories.map(cat => (
        <button
          key={cat.name}
          onClick={() => onClick(cat.name)}
          className="flex flex-col items-center justify-center p-4 min-h-[64px] aspect-square border border-gray-300 dark:border-gray-600 rounded bg-white dark:bg-gray-800 text-gray-800 dark:text-gray-100 hover:bg-gray-100 dark:hover:bg-gray-700 shadow transition-colors duration-300"
        >
          <span className="text-3xl sm:text-4xl">{cat.icon}</span>
          <span className="mt-2 text-base font-medium text-gray-700 dark:text-gray-200 text-center break-words">
            {cat.name}
          </span>
        </button>
      ))}
    </div>
  );
}
