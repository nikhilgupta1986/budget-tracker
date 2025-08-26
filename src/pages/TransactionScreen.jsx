// src/pages/TransactionScreen.jsx

import { useState, useEffect } from "react";
import { Pie, Bar, Doughnut, Line } from "react-chartjs-2";
import {
  Chart,
  ArcElement,
  BarElement,
  LineElement,
  CategoryScale,
  LinearScale,
  PointElement,
  Tooltip,
  Legend,
} from "chart.js";
import { getSetupDataFromLocalStorage } from "../utils/storage";
import TransactionList from "../components/TransactionList";

Chart.register(
  ArcElement,
  BarElement,
  LineElement,
  CategoryScale,
  LinearScale,
  PointElement,
  Tooltip,
  Legend
);

const TransactionScreen = () => {
  const [transactions, setTransactions] = useState([]);
  const [setupData, setSetupData] = useState({});
  const [type, setType] = useState("Income");
  const [amount, setAmount] = useState("");
  const [category, setCategory] = useState("");
  const [date, setDate] = useState("");
  const [showToast, setShowToast] = useState(false);
  const [compulsory, setCompulsory] = useState(false);
  const [recurring, setRecurring] = useState(false);
  const [expenseChartType, setExpenseChartType] = useState("Pie");
  const [incomeExpenseChartType, setIncomeExpenseChartType] = useState("Bar");

  useEffect(() => {
    const storedTransactions = JSON.parse(localStorage.getItem("transactions")) || [];
    setTransactions(storedTransactions);

    const setup = getSetupDataFromLocalStorage();
    setSetupData(setup);

    const today = new Date().toISOString().split("T")[0];
    setDate(today);

    const savedExpenseType = localStorage.getItem("expenseChartType");
    const savedIncomeExpenseType = localStorage.getItem("incomeExpenseChartType");
    if (savedExpenseType) setExpenseChartType(savedExpenseType);
    if (savedIncomeExpenseType) setIncomeExpenseChartType(savedIncomeExpenseType);
  }, []);

  const handleSaveTransaction = () => {
    if (!type || !amount || !category) {
      alert("Please fill amount and category.");
      return;
    }

    const txnDate = date || new Date().toISOString().split("T")[0];

    const newTransaction = {
      type,
      amount: parseFloat(amount),
      category,
      date: new Date(txnDate).toISOString(),
      compulsory,
      recurring,
    };

    const updatedTransactions = [...transactions, newTransaction];
    setTransactions(updatedTransactions);
    localStorage.setItem("transactions", JSON.stringify(updatedTransactions));

    setType("Income");
    setAmount("");
    setCategory("");
    setDate(new Date().toISOString().split("T")[0]);
    setCompulsory(false);
    setRecurring(false);

    setShowToast(true);
    setTimeout(() => setShowToast(false), 2000);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleDeleteTransaction = (indexToDelete) => {
    const updatedTransactions = transactions.filter((_, idx) => idx !== indexToDelete);
    setTransactions(updatedTransactions);
    localStorage.setItem("transactions", JSON.stringify(updatedTransactions));
  };

  const income = transactions
    .filter((txn) => txn.type === "Income")
    .reduce((sum, txn) => sum + txn.amount, 0);

  const expenses = transactions
    .filter((txn) => txn.type === "Expense")
    .reduce((sum, txn) => sum + txn.amount, 0);

    const savings = transactions
    .filter((txn) => txn.type === "Savings" || txn.type === "Saving")
    .reduce((sum, txn) => sum + txn.amount, 0);
  

  const groupedExpenses = {};
  transactions
    .filter((txn) => txn.type === "Expense")
    .forEach((txn) => {
      groupedExpenses[txn.category] = (groupedExpenses[txn.category] || 0) + txn.amount;
    });

  const expenseLabels = Object.keys(groupedExpenses);
  const expenseValues = Object.values(groupedExpenses);
  const expenseColors = expenseLabels.map((label) => {
    const match = setupData.expenseCategories?.find((cat) => cat.name === label);
    return match?.color || "#ccc";
  });

  const expenseData = {
    labels: expenseLabels,
    datasets: [
      {
        data: expenseValues,
        backgroundColor: expenseColors,
      },
    ],
  };

  const incomeVsExpenseData = {
    labels: ["Income", "Expense"],
    datasets: [
      {
        label: "Amount",
        data: [income, expenses],
        backgroundColor: ["#4CAF50", "#F44336"],
      },
    ],
  };

  const savingsData = {
    labels: ["Savings"],
    datasets: [
      {
        label: "Saving",
        data: [savings],
        backgroundColor: ["#2196F3"],
      },
    ],
  };

  // 📆 Monthly insights calc
  const monthlyKeys = new Set(
    transactions.map((txn) => {
      const d = new Date(txn.date);
      return `${d.getFullYear()}-${d.getMonth() + 1}`;
    })
  );
  const monthCount = monthlyKeys.size || 1;
  const avgMonthlySavings = savings / monthCount;
  const avgMonthlyExpense = expenses / monthCount;

  const compulsoryTotal = transactions
    .filter((txn) => txn.compulsory)
    .reduce((sum, txn) => sum + txn.amount, 0);

  return (
    <div style={{ padding: "20px", maxWidth: "900px", margin: "0 auto" }}>
      <h2 style={{ textAlign: "center", marginBottom: "30px" }}>📋 Transactions Dashboard</h2>

      {/* Chart Type Selector for Expense */}
      <div style={{ marginBottom: "10px", textAlign: "center" }}>
        <label style={{ marginRight: "8px" }}>Expense Chart Type:</label>
        <select value={expenseChartType} onChange={(e) => {
          setExpenseChartType(e.target.value);
          localStorage.setItem("expenseChartType", e.target.value);
        }}>
          <option value="Pie">Pie</option>
          <option value="Bar">Bar</option>
          <option value="Doughnut">Doughnut</option>
        </select>
      </div>

      {/* Chart Type Selector for Income vs Expense */}
      <div style={{ marginBottom: "10px", textAlign: "center" }}>
        <label style={{ marginRight: "8px" }}>Income vs Expense Chart Type:</label>
        <select value={incomeExpenseChartType} onChange={(e) => {
          setIncomeExpenseChartType(e.target.value);
          localStorage.setItem("incomeExpenseChartType", e.target.value);
        }}>
          <option value="Bar">Bar</option>
          <option value="Line">Line</option>
          <option value="Doughnut">Doughnut</option>
        </select>
      </div>

      {/* Charts Section */}
      <div style={{ display: "flex", flexWrap: "wrap", justifyContent: "center", gap: "20px", marginBottom: "30px" }}>
        <div style={chartCardStyle}>
          <h4>🥜 Expense Breakdown</h4>
          {expenseChartType === "Pie" && <Pie data={expenseData} />}
          {expenseChartType === "Bar" && <Bar data={expenseData} />}
          {expenseChartType === "Doughnut" && <Doughnut data={expenseData} />}
        </div>

        <div style={chartCardStyle}>
          <h4>📊 Income vs Expense</h4>
          {incomeExpenseChartType === "Bar" && <Bar data={incomeVsExpenseData} />}
          {incomeExpenseChartType === "Line" && <Line data={incomeVsExpenseData} />}
          {incomeExpenseChartType === "Doughnut" && <Doughnut data={incomeVsExpenseData} />}
        </div>

        <div style={chartCardStyle}>
          <h4>💰 Monthly Savings</h4>
          <Bar data={savingsData} />
        </div>
      </div>

      {/* 📌 Enhanced Insights Card */}
      <div style={{ ...chartCardStyle, marginBottom: "30px", backgroundColor: "#f9f9f9" }}>
        <h4>📈 Monthly Insights</h4>
        <p>💸 <strong>Total Compulsory Spending:</strong> ₹{compulsoryTotal.toFixed(2)}</p>
        <p>💰 <strong>Avg Monthly Savings:</strong> ₹{avgMonthlySavings.toFixed(2)}</p>
        <p>📉 <strong>Avg Monthly Expenses:</strong> ₹{avgMonthlyExpense.toFixed(2)}</p>
      </div>

      {/* Add Transaction Form */}
      <div style={formCardStyle}>
        <h3 style={{ marginBottom: "15px" }}>➕ Add Transaction</h3>

        <select value={type} onChange={(e) => setType(e.target.value)} style={inputStyle}>
          <option value="Income">Income</option>
          <option value="Expense">Expense</option>
          <option value="Saving">Saving</option>
        </select>

        <input type="number" value={amount} onChange={(e) => setAmount(e.target.value)} placeholder="Amount" style={inputStyle} />

        <select value={category} onChange={(e) => setCategory(e.target.value)} style={inputStyle}>
          <option value="">Select Category</option>
          {(type === "Income"
            ? setupData?.incomeSources
            : type === "Expense"
            ? setupData?.expenseCategories
            : setupData?.savingCategories)?.map((cat, idx) => (
              <option key={idx} value={cat.name}>{cat.name}</option>
            ))}
        </select>

        <input type="date" value={date} onChange={(e) => setDate(e.target.value)} style={inputStyle} />

        <div style={{ marginBottom: "10px" }}>
          <label>
            <input type="checkbox" checked={compulsory} onChange={() => setCompulsory(!compulsory)} />
            <span style={{ marginLeft: "8px" }}>Mark as Compulsory</span>
          </label>
        </div>

        <div style={{ marginBottom: "10px" }}>
          <label>
            <input type="checkbox" checked={recurring} onChange={() => setRecurring(!recurring)} />
            <span style={{ marginLeft: "8px" }}>Make Recurring 🔁</span>
          </label>
        </div>

        <button onClick={handleSaveTransaction} style={{
          padding: "10px",
          marginTop: "15px",
          backgroundColor: "#007BFF",
          color: "#fff",
          border: "none",
          width: "100%",
          borderRadius: "8px",
          fontSize: "16px",
        }}>
          ➕ Save Transaction
        </button>
      </div>

      {showToast && (
        <div style={toastStyle}>Transaction Saved!</div>
      )}

      <TransactionList transactions={transactions} onDelete={handleDeleteTransaction} />
    </div>
  );
};

export default TransactionScreen;

// Styles
const chartCardStyle = {
  backgroundColor: "#fff",
  borderRadius: "10px",
  padding: "15px",
  boxShadow: "0 2px 10px rgba(0,0,0,0.1)",
  textAlign: "center",
  flex: "1",
  minWidth: "250px",
};

const formCardStyle = {
  backgroundColor: "#fff",
  borderRadius: "10px",
  padding: "20px",
  boxShadow: "0 2px 10px rgba(0,0,0,0.1)",
  marginTop: "20px",
};

const inputStyle = {
  width: "100%",
  padding: "10px",
  marginBottom: "10px",
  borderRadius: "6px",
  border: "1px solid #ccc",
};

const toastStyle = {
  position: "fixed",
  top: "20px",
  left: "50%",
  transform: "translateX(-50%)",
  backgroundColor: "#4CAF50",
  color: "#fff",
  padding: "10px 20px",
  borderRadius: "8px",
  boxShadow: "0 2px 8px rgba(0,0,0,0.3)",
  zIndex: "999",
  fontSize: "16px",
};
