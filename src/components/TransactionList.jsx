// src/components/TransactionList.jsx
import React from "react";

const TransactionList = ({ transactions, onDelete }) => {
  const getColorByType = (type) => {
    switch (type) {
      case "Income":
        return "#4CAF50";
      case "Expense":
        return "#F44336";
      case "Saving":
        return "#2196F3";
      default:
        return "#999";
    }
  };

  const sortedTransactions = [...transactions].sort(
    (a, b) => new Date(b.date) - new Date(a.date)
  );

  return (
    <div style={{ marginTop: "30px" }}>
      <h3 style={{ textAlign: "center", marginBottom: "20px" }}>🧾 Your Transactions</h3>

      {sortedTransactions.length === 0 && (
        <p style={{ textAlign: "center", color: "#999" }}>No transactions found.</p>
      )}

      <div style={listStyle}>
        {sortedTransactions.map((txn, index) => (
          <div
            key={index}
            style={{
              ...cardStyle,
              borderLeft: `6px solid ${getColorByType(txn.type)}`,
            }}
          >
            <div style={topRow}>
              <strong>
                {txn.category}{" "}
                {txn.recurring && <span style={recurringTag}>🔁</span>}
              </strong>
              <button onClick={() => onDelete(index)} style={deleteButton}>
                🗑️
              </button>
            </div>

            <div style={rowStyle}>
              <span>{txn.type}</span>
              <span>{new Date(txn.date).toLocaleDateString()}</span>
            </div>

            <div style={rowStyle}>
              <span style={{ fontWeight: 600 }}>₹{txn.amount}</span>
              {txn.compulsory && <span style={tagStyle}>Compulsory</span>}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default TransactionList;

// Styles
const listStyle = {
  display: "flex",
  flexDirection: "column",
  gap: "12px",
  alignItems: "center",
};

const cardStyle = {
  width: "90%",
  backgroundColor: "#fff",
  padding: "12px 16px",
  borderRadius: "10px",
  boxShadow: "0 2px 6px rgba(0,0,0,0.1)",
  position: "relative",
  transition: "all 0.3s ease",
};

const topRow = {
  display: "flex",
  justifyContent: "space-between",
  alignItems: "center",
};

const rowStyle = {
  display: "flex",
  justifyContent: "space-between",
  marginTop: "5px",
};

const tagStyle = {
  backgroundColor: "#ff9800",
  color: "#fff",
  fontSize: "11px",
  borderRadius: "12px",
  padding: "2px 8px",
};

const recurringTag = {
  fontSize: "12px",
  marginLeft: "5px",
  color: "#2196F3",
};

const deleteButton = {
  background: "none",
  border: "none",
  color: "#888",
  cursor: "pointer",
  fontSize: "16px",
  padding: "0",
};
