// src/components/DonutChart.jsx
import React from 'react';
import { Doughnut } from 'react-chartjs-2';
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from 'chart.js';

ChartJS.register(ArcElement, Tooltip, Legend);

export default function DonutChart({ budgetTables = {}, totalSalary = 0 }) {
  // SAFE GUARDS
  const categories = Object.keys(budgetTables);
  
  if (categories.length === 0) {
    return (
      <div className="w-full p-4 bg-white dark:bg-gray-800 rounded-lg shadow text-center">
        <p className="text-gray-500">No budgets set yet. Click a category to start!</p>
      </div>
    );
  }

  const expenses = categories.map(cat => {
    const exps = budgetTables[cat]?.expenses || [];
    return exps.reduce((sum, e) => sum + (Number(e.amount) || 0), 0);
  });

  const totalExpenses = expenses.reduce((a, b) => a + b, 0);
  if (totalExpenses === 0) {
    return (
      <div className="w-full p-4 bg-white dark:bg-gray-800 rounded-lg shadow text-center">
        <p className="text-gray-500">No expenses recorded yet.</p>
      </div>
    );
  }

  const data = {
    labels: categories,
    datasets: [
      {
        data: expenses,
        backgroundColor: [
          '#4ade80', '#60a5fa', '#f472b6', '#facc15', '#a78bfa',
          '#fb923c', '#34d399', '#f87171', '#c084fc', '#2dd4bf'
        ],
        borderWidth: 2,
        borderColor: '#fff',
      },
    ],
  };

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'right',
        labels: {
          color: '#888',
          boxWidth: 12,
          padding: 10,
          font: { size: 12 }
        },
      },
      tooltip: {
        callbacks: {
          label: (context) => {
            const value = context.parsed;
            const percentage = ((value / totalExpenses) * 100).toFixed(1);
            return `${context.label}: ₹${value} (${percentage}%)`;
          }
        }
      }
    },
  };

  const centerText = {
    id: 'centerText',
    beforeDraw(chart) {
      const { width, height, ctx } = chart;
      ctx.save();
      ctx.font = 'bold 16px sans-serif';
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      const isDark = document.documentElement.classList.contains('dark');
      ctx.fillStyle = isDark ? '#f3f4f6' : '#1f2937';
      ctx.fillText(`₹${totalSalary}`, width / 2, height / 2 - 10);
      ctx.font = '12px sans-serif';
      ctx.fillStyle = isDark ? '#9ca3af' : '#6b7280';
      ctx.fillText('Salary', width / 2, height / 2 + 10);
      ctx.restore();
    },
  };

  return (
    <div className="w-full p-4">
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg transition-all">
        <h3 className="text-lg font-bold mb-4 text-left px-4 pt-4">Expense Distribution</h3>
        <div className="h-72">
          <Doughnut data={data} options={options} plugins={[centerText]} />
        </div>
      </div>
    </div>
  );
}