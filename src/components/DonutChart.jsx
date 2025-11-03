import React from 'react';
import { Doughnut } from 'react-chartjs-2';
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from 'chart.js';

ChartJS.register(ArcElement, Tooltip, Legend);

export default function DonutChart({ budgetTables, totalSalary }) {
  const categories = Object.keys(budgetTables);
  const expenses = categories.map(cat =>
    budgetTables[cat].expenses.reduce((sum, e) => sum + e.amount, 0)
  );

  const data = {
    labels: categories,
    datasets: [
      {
        data: expenses,
        backgroundColor: [
          '#4ade80', '#60a5fa', '#f472b6', '#facc15', '#a78bfa',
          '#fb923c', '#34d399', '#f87171', '#c084fc', '#2dd4bf'
        ],
        borderWidth: 1,
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
        },
      },
    },
  };

  const centerText = {
    id: 'centerText',
    beforeDraw(chart) {
      const { width } = chart;
      const ctx = chart.ctx;
      ctx.save();
      ctx.font = 'bold 14px sans-serif';
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';

      const isDark = document.documentElement.classList.contains('dark');
      ctx.fillStyle = isDark ? '#f3f4f6' : '#333';

      ctx.fillText(`Total Salary: ₹${totalSalary}`, width / 2, chart.height / 2);
    },
  };

  return (
    <div className="w-full p-2">
      <div className="bg-white dark:bg-gray-800 text-gray-800 dark:text-gray-100 shadow rounded p-4 transition-colors duration-300">
        <h3 className="text-md font-semibold mb-4 text-left">Expense Distribution</h3>
        <div className="flex flex-col md:flex-row gap-6 items-start">
          {/* Chart */}
          <div className="w-full md:w-2/3 h-72">
            <Doughnut data={data} options={options} plugins={[centerText]} />
          </div>
        </div>
      </div>
    </div>
  );
}
