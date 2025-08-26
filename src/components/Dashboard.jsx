import React from 'react';
import { Pie, Bar } from 'react-chartjs-2';
import { Chart as ChartJS, ArcElement, Tooltip, Legend, BarElement, CategoryScale, LinearScale } from 'chart.js';

ChartJS.register(ArcElement, Tooltip, Legend, BarElement, CategoryScale, LinearScale);

function Dashboard({ transactions }) {
  if (!transactions) return null;

  const income = transactions.filter(t => t.type === 'Income').reduce((sum, t) => sum + t.amount, 0);
  const expense = transactions.filter(t => t.type === 'Expense').reduce((sum, t) => sum + t.amount, 0);
  const saving = transactions.filter(t => t.type === 'Saving').reduce((sum, t) => sum + t.amount, 0);

  const pieData = {
    labels: ['Income', 'Expense', 'Saving'],
    datasets: [
      {
        label: `Amount`,
        data: [income, expense, saving],
        backgroundColor: ['#4caf50', '#f44336', '#2196f3'],
        borderWidth: 1,
      },
    ],
  };

  const barData = {
    labels: ['Income', 'Expense', 'Saving'],
    datasets: [
      {
        label: `Amount`,
        data: [income, expense, saving],
        backgroundColor: ['#4caf50', '#f44336', '#2196f3'],
      },
    ],
  };

  return (
    <div style={{ textAlign: 'center' }}>
      <div style={{ width: '300px', margin: 'auto', marginBottom: '30px' }}>
        <Pie data={pieData} />
      </div>

      <div style={{ width: '400px', margin: 'auto' }}>
        <Bar data={barData} />
      </div>
    </div>
  );
}

export default Dashboard;
