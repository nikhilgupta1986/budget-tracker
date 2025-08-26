// ⬇ Keep your existing imports here
import React, { useState, useEffect } from "react";
import {
  Chart,
  LineElement,
  ArcElement,
  BarElement,
  CategoryScale,
  LinearScale,
  PointElement,
  Tooltip,
  Legend,
} from "chart.js";
import { Line, Pie, Bar } from "react-chartjs-2";
import "../styles/InsightsScreen.css";
import { getSetupDataFromLocalStorage } from "../utils/storage";

Chart.register(
  LineElement,
  ArcElement,
  BarElement,
  CategoryScale,
  LinearScale,
  PointElement,
  Tooltip,
  Legend
);

const months = [
  "January", "February", "March", "April", "May", "June",
  "July", "August", "September", "October", "November", "December"
];

const InsightsScreen = () => {
  const [month, setMonth] = useState(new Date().getMonth());
  const [year, setYear] = useState(new Date().getFullYear());
  const [transactions, setTransactions] = useState([]);
  const [setupData, setSetupData] = useState({});
  const [savingsChartType, setSavingsChartType] = useState("Bar");

  useEffect(() => {
    const txns = JSON.parse(localStorage.getItem("transactions")) || [];
    setTransactions(txns);
    setSetupData(getSetupDataFromLocalStorage());
  }, []);

  const filterByMonth = transactions.filter((txn) => {
    const d = new Date(txn.date);
    return d.getMonth() === parseInt(month) && d.getFullYear() === parseInt(year);
  });
  const hasMonthlyData = filterByMonth.length > 0;

  const filterByYear = transactions.filter((txn) => {
    const d = new Date(txn.date);
    return d.getFullYear() === parseInt(year);
  });

  const sumByType = (arr, matchFnOrType) => {
    const matcher = typeof matchFnOrType === "function"
      ? matchFnOrType
      : (txn) => txn.type === matchFnOrType;
    return arr.filter(matcher).reduce((sum, t) => sum + t.amount, 0);
  };

  const incomeMonth = sumByType(filterByMonth, "Income");
  const expenseMonth = sumByType(filterByMonth, "Expense");
  const savingsMonth = sumByType(filterByMonth, (t) => t.type === "Savings" || t.type === "Saving");
  const leftoverMoney = incomeMonth - expenseMonth - savingsMonth;

  const incomeYear = sumByType(filterByYear, "Income");
  const expenseYear = sumByType(filterByYear, "Expense");
  const savingsYear = sumByType(filterByYear, (t) => t.type === "Savings" || t.type === "Saving");

  const compulsoryThisMonth = filterByMonth
    .filter((txn) => txn.isCompulsory)
    .reduce((sum, txn) => sum + txn.amount, 0);
  const compulsoryRatio = expenseMonth > 0 ? compulsoryThisMonth / expenseMonth : 0;

  const previousMonth = month === 0 ? 11 : month - 1;
  const previousYear = month === 0 ? year - 1 : year;
  const filterPrevMonth = transactions.filter((txn) => {
    const d = new Date(txn.date);
    return d.getMonth() === previousMonth && d.getFullYear() === previousYear;
  });
  const prevExpense = sumByType(filterPrevMonth, "Expense");

  const monthlyTrend = Array(12).fill(0).map((_, idx) => {
    const txns = transactions.filter((t) => {
      const d = new Date(t.date);
      return d.getFullYear() === parseInt(year) && d.getMonth() === idx;
    });
    return {
      income: sumByType(txns, "Income"),
      expense: sumByType(txns, "Expense"),
      savings: sumByType(txns, (t) => t.type === "Savings" || t.type === "Saving"),
    };
  });

  const avgMonthlySavingsRate = incomeYear > 0 ? ((savingsYear / incomeYear) / 12) * 100 : 0;

  const monthlySpending = monthlyTrend.map((x) => x.expense);
  const maxSpending = Math.max(...monthlySpending);
  const minSpending = Math.min(...monthlySpending);
  const maxMonth = months[monthlySpending.indexOf(maxSpending)];
  const minMonth = months[monthlySpending.indexOf(minSpending)];

  const lineChartData = {
    labels: months,
    datasets: [
      {
        label: "Income",
        data: monthlyTrend.map((x) => x.income),
        borderColor: "#4CAF50",
        backgroundColor: "#4CAF50",
        tension: 0.3,
      },
      {
        label: "Expense",
        data: monthlyTrend.map((x) => x.expense),
        borderColor: "#F44336",
        backgroundColor: "#F44336",
        tension: 0.3,
      },
      {
        label: "Savings",
        data: monthlyTrend.map((x) => x.savings),
        borderColor: "#2196F3",
        backgroundColor: "#2196F3",
        tension: 0.3,
      },
    ],
  };

  const monthlyGrouped = {};
  filterByMonth
    .filter((txn) => txn.type === "Expense")
    .forEach((txn) => {
      monthlyGrouped[txn.category] =
        (monthlyGrouped[txn.category] || 0) + txn.amount;
    });

  const pieData = {
    labels: Object.keys(monthlyGrouped),
    datasets: [
      {
        data: Object.values(monthlyGrouped),
        backgroundColor: Object.keys(monthlyGrouped).map((label) => {
          const match = setupData.expenseCategories?.find((cat) => cat.name === label);
          return match?.color || "#ccc";
        }),
      },
    ],
  };

  const yearlyGrouped = {};
  filterByYear
    .filter((txn) => txn.type === "Expense")
    .forEach((txn) => {
      yearlyGrouped[txn.category] =
        (yearlyGrouped[txn.category] || 0) + txn.amount;
    });

  const topCategories = Object.entries(yearlyGrouped)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 5);

  const barData = {
    labels: topCategories.map((entry) => entry[0]),
    datasets: [
      {
        label: "₹ Spent",
        data: topCategories.map((entry) => entry[1]),
        backgroundColor: "#FF9800",
      },
    ],
  };

  const monthlySavingsGrouped = {};
  filterByMonth
    .filter((txn) => txn.type === "Savings" || txn.type === "Saving")
    .forEach((txn) => {
      monthlySavingsGrouped[txn.category] =
        (monthlySavingsGrouped[txn.category] || 0) + txn.amount;
    });

  const monthlySavingsData = {
    labels: Object.keys(monthlySavingsGrouped),
    datasets: [
      {
        label: "₹ Saved",
        data: Object.values(monthlySavingsGrouped),
        backgroundColor: "#2196F3",
      },
    ],
  };

  const yearlySavingsGrouped = {};
  filterByYear
    .filter((txn) => txn.type === "Savings" || txn.type === "Saving")
    .forEach((txn) => {
      yearlySavingsGrouped[txn.category] =
        (yearlySavingsGrouped[txn.category] || 0) + txn.amount;
    });

  const yearlySavingsData = {
    labels: Object.keys(yearlySavingsGrouped),
    datasets: [
      {
        label: "₹ Saved",
        data: Object.values(yearlySavingsGrouped),
        backgroundColor: "#4CAF50",
      },
    ],
  };

  const expenseRatio = incomeMonth > 0 ? expenseMonth / incomeMonth : 0;
  const savingsRatio = incomeMonth > 0 ? savingsMonth / incomeMonth : 0;

  let score = 100;
  if (expenseRatio > 0.7) score -= 20;
  else score -= 10;
  if (savingsRatio > 0.2) score += 20;
  else score += 10;
  if (compulsoryRatio > 0.6) score -= 10;

  const scoreColor = score > 80 ? "green" : score > 60 ? "orange" : "red";
  const scoreComment =
    score > 80 ? "Excellent!" : score > 60 ? "Good, but can improve." : "Needs attention.";

  const tips = [];
  if (prevExpense && expenseMonth > prevExpense) {
    tips.push(`⚠️ Your expenses increased by ₹${(expenseMonth - prevExpense).toFixed(0)} vs last month.`);
  }
  if (savingsRatio < 0.2) {
    tips.push(`💡 You're saving less than 20% — try saving ₹${((0.2 * incomeMonth) - savingsMonth).toFixed(0)} more.`);
  }
  if (compulsoryRatio > 0.6) {
    tips.push(`📌 Compulsory expenses are over 60% of your total spend.`);
  }
  if (avgMonthlySavingsRate < 10) {
    tips.push(`📌 Try to increase your average monthly savings rate above 10%.`);
  }
  if (maxSpending - minSpending > 20000) {
    tips.push(`⚠️ Big fluctuation in spending — ₹${(maxSpending - minSpending).toFixed(0)} difference between ${maxMonth} and ${minMonth}.`);
  }

  return (
    <div className="insights-wrapper">
      <div className="filters">
        <select value={month} onChange={(e) => setMonth(e.target.value)}>
          {months.map((m, idx) => (
            <option key={idx} value={idx}>{m}</option>
          ))}
        </select>
        <select value={year} onChange={(e) => setYear(e.target.value)}>
          {[2023, 2024, 2025, 2026].map((y) => (
            <option key={y} value={y}>{y}</option>
          ))}
        </select>
      </div>

      <div className="insights-grid">
        {/* MONTHLY INSIGHTS */}
        <div className="insight-panel">
          <h2>📅 Monthly Insights</h2>
          <div className="cards">
            <div className="metric-card">💰 Income: ₹{incomeMonth}</div>
            <div className="metric-card">💸 Expenses: ₹{expenseMonth}</div>
            <div className="metric-card">💼 Savings: ₹{savingsMonth}</div>
            <div className="metric-card">🧮 Leftover Money: ₹{leftoverMoney.toFixed(2)}</div>
          </div>

          <div className="chart-container" style={{ maxWidth: "400px", height: "300px" }}>
            <h4>📈 Monthly Trend</h4>
            {hasMonthlyData ? (
              <Line data={lineChartData} />
            ) : (
              <p style={{ textAlign: "center", padding: "20px" }}>No data for selected month.</p>
            )}
          </div>

          <div className="chart-container" style={{ maxWidth: "400px", height: "300px" }}>
            <h4>🥧 Expense Breakdown</h4>
            <div style={{ maxWidth: "400px", height: "300px", margin: "auto" }}>
              {hasMonthlyData ? (
                <Pie data={pieData} options={{ responsive: true, maintainAspectRatio: false }} />
              ) : (
                <p style={{ textAlign: "center", padding: "20px" }}>No expenses recorded for this month.</p>
              )}
            </div>
          </div>

          <div className="chart-container" style={{ maxWidth: "400px", height: "300px" /*, overflowY: "auto" */ }}>
            <h4>💼 Savings Breakdown (Monthly)</h4>
            <div style={{ textAlign: "right", marginBottom: "8px" }}>
              <label style={{ marginRight: "8px" }}>Chart Type:</label>
              <select
                value={savingsChartType}
                onChange={(e) => setSavingsChartType(e.target.value)}
              >
                <option value="Bar">Bar</option>
                <option value="Pie">Pie</option>
              </select>
            </div>
            {Object.keys(monthlySavingsGrouped).length > 0 ? (
              savingsChartType === "Bar" ? (
                <Bar data={monthlySavingsData} options={{ responsive: true, maintainAspectRatio: false }} />
              ) : (
                <Pie data={monthlySavingsData} options={{ responsive: true, maintainAspectRatio: false }} />
              )
            ) : (
              <p style={{ textAlign: "center" }}>No savings data available for this month.</p>
            )}
          </div>
        </div>

        {/* YEARLY INSIGHTS */}
        <div className="insight-panel">
          <h2>📆 Yearly Insights</h2>
          <div className="cards">
            <div className="metric-card">💰 Income: ₹{incomeYear}</div>
            <div className="metric-card">💸 Expenses: ₹{expenseYear}</div>
            <div className="metric-card">💼 Savings: ₹{savingsYear}</div>
            <div className="metric-card">📊 Avg Monthly Savings Rate: {avgMonthlySavingsRate.toFixed(1)}%</div>
            <div className="metric-card">📈 Highest Spend: {maxMonth} (₹{maxSpending.toFixed(0)})</div>
            <div className="metric-card">📉 Lowest Spend: {minMonth} (₹{minSpending.toFixed(0)})</div>
          </div>

          <div className="chart-container" style={{ maxWidth: "400px", height: "300px" }}>
            <h4>📈 Yearly Trend</h4>
            <Line data={lineChartData} />
          </div>

          <div className="chart-container" style={{ maxWidth: "400px", height: "300px" }}>
            <h4>🏆 Top 5 Categories</h4>
            <Bar data={barData} />
          </div>

          <div className="chart-container" style={{ maxWidth: "400px", height: "300px" /*, overflowY: "auto" */ }}>
            <h4>💼 Savings Breakdown (Yearly)</h4>
            <div style={{ textAlign: "right", marginBottom: "8px" }}>
              <label style={{ marginRight: "8px" }}>Chart Type:</label>
              <select
                value={savingsChartType}
                onChange={(e) => setSavingsChartType(e.target.value)}
              >
                <option value="Bar">Bar</option>
                <option value="Pie">Pie</option>
              </select>
            </div>
            {Object.keys(yearlySavingsGrouped).length > 0 ? (
              savingsChartType === "Bar" ? (
                <Bar data={yearlySavingsData} options={{ responsive: true, maintainAspectRatio: false }} />
              ) : (
                <Pie data={yearlySavingsData} options={{ responsive: true, maintainAspectRatio: false }} />
              )
            ) : (
              <p style={{ textAlign: "center" }}>No savings data available for this year.</p>
            )}
          </div>
        </div>
      </div>

      {/* Financial Score + Smart Tips */}
      <div className="insight-panel">
        <h2>💯 Financial Health</h2>
        <div
          className="metric-card"
          style={{ backgroundColor: scoreColor, color: "#fff", fontSize: "24px" }}
        >
          Score: {score} – {scoreComment}
        </div>
      </div>

      <div
        className="insight-panel"
        style={{ backgroundColor: "#f5f5f5", border: "1px solid #ccc", padding: "20px", borderRadius: "10px" }}
      >
        <h2>🧠 Smart Suggestions</h2>
        {tips.length > 0 ? (
          <ul>
            {tips.map((tip, idx) => (
              <li key={idx} style={{ marginBottom: "8px" }}>{tip}</li>
            ))}
          </ul>
        ) : (
          <p>✅ You're on track! Keep it up.</p>
        )}
      </div>
    </div>
  );
};

export default InsightsScreen;
