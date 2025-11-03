// src/components/DonutChart.jsx
import React from 'react';
import { Doughnut } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  ArcElement,
  Tooltip,
  Legend,
  Title // ADD THIS
} from 'chart.js';

// REGISTER EVERYTHING
ChartJS.register(ArcElement, Tooltip, Legend, Title);

export default function DonutChart({ budgetTables = {}, totalSalary = 0 }) {
  const categories = Object.keys(budgetTables);

  if (categories.length === 0) {
    return (
      <div className="w-full h-72 flex items-center justify-center bg-white dark:bg-gray-800 rounded-lg shadow">
        <p className="text-gray-500">Set a budget to see the chart!</p>
      </div>
    );
  }

  const expenses = categories.map(cat => {
    const exps = budgetTables[cat]?.expenses || [];
    return exps.reduce((sum, e) => sum + (Number(e.amount) || 0), 0);
  });

  const totalSpent = expenses.reduce((a, b) => a + b, 0);
  if (totalSpent === 0) {
    return (
      <div className="w-full h-72 flex items-center justify-center bg-white dark:bg-gray-800 rounded-lg shadow">
        <p className="text-gray-500">No expenses yet.</p>
      </div>
    );
  }

  const data = {
    labels: categories,
    datasets: [{
      data: expenses,
      backgroundColor: [
        '#FF6384', '#36A2EB', '#FFCE56', '#4BC0C0', '#9966FF',
        '#FF9F40', '#C9CBCF', '#E7E9ED', '#36A2EB', '#FF6384'
      ],
      hoverOffset: 20,
      borderWidth: 2,
      borderColor: '#fff'
    }]
  };

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: { position: 'bottom' },
      title: {
        display: true,
        text: 'Expense Breakdown',
        color: '#333',
        font: { size: 16 }
      }
    }
  };

  // CENTER TEXT PLUGIN
  const centerPlugin = {
    id: 'centerText',
    beforeDraw: (chart) => {
      const { ctx, width, height } = chart;
      ctx.save();
      ctx.font = 'bold 20px Arial';
      ctx.fillStyle = '#333';
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      ctx.fillText(`₹${totalSalary}`, width / 2, height / 2);
      ctx.font = '14px Arial';
      ctx.fillStyle = '#666';
      ctx.fillText('Salary', width / 2, height / 2 + 25);
      ctx.restore();
    }
  };

  return (
    <div className="w-full h-72 bg-white dark:bg-gray-800 rounded-lg shadow p-4">
      <Doughnut data={data} options={options} plugins={[centerPlugin]} />
    </div>
  );
}
////