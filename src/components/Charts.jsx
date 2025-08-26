// src/components/Charts.jsx

import { Pie, Bar } from "react-chartjs-2";
import { Chart, ArcElement, BarElement, CategoryScale, LinearScale, Tooltip, Legend } from "chart.js";

Chart.register(ArcElement, BarElement, CategoryScale, LinearScale, Tooltip, Legend);

const Charts = ({ expensesByCategory, income, expenses }) => {
  const pieData = {
    labels: expensesByCategory.map((cat) => cat.category),
    datasets: [
      {
        data: expensesByCategory.map((cat) => cat.amount),
        backgroundColor: ["#FF6384", "#36A2EB", "#FFCE56", "#4BC0C0", "#9966FF"],
      },
    ],
  };

  const barData = {
    labels: ["Income", "Expenses"],
    datasets: [
      {
        label: "Amount",
        data: [income, expenses],
        backgroundColor: ["#36A2EB", "#FF6384"],
      },
    ],
  };

  return (
    <div style={{ display: "flex", justifyContent: "space-around", marginBottom: "30px" }}>
      <div style={{ width: "40%" }}>
        <h4>Expenses by Category</h4>
        <Pie data={pieData} />
      </div>
      <div style={{ width: "40%" }}>
        <h4>Income vs Expenses</h4>
        <Bar data={barData} />
      </div>
    </div>
  );
};

export default Charts;
