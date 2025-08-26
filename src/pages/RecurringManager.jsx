// src/pages/RecurringManager.jsx
import React, { useEffect, useState } from "react";

const RecurringManager = () => {
  const [recurringTxns, setRecurringTxns] = useState([]);

  useEffect(() => {
    const txns = JSON.parse(localStorage.getItem("transactions")) || [];
    const rec = txns.filter((txn) => txn.recurring);
    setRecurringTxns(rec);
  }, []);

  const handleDeleteRecurring = (indexToDelete) => {
    const allTxns = JSON.parse(localStorage.getItem("transactions")) || [];
    const updatedTxns = allTxns.filter(
      (txn, idx) => !(txn.recurring && recurringTxns[indexToDelete] === txn)
    );
    localStorage.setItem("transactions", JSON.stringify(updatedTxns));
    setRecurringTxns((prev) => prev.filter((_, i) => i !== indexToDelete));
  };

  return (
    <div style={{ padding: "20px", maxWidth: "800px", margin: "0 auto" }}>
      <h2 style={{ textAlign: "center", marginBottom: "30px" }}>🔁 Recurring Transactions</h2>

      {recurringTxns.length === 0 ? (
        <p style={{ textAlign: "center", color: "#888" }}>
          No recurring transactions found.
        </p>
      ) : (
        recurringTxns.map((txn, idx) => (
          <div key={idx} style={cardStyle}>
            <div style={rowStyle}>
              <strong>{txn.category}</strong>
              <span>₹{txn.amount}</span>
            </div>
            <div style={rowStyle}>
              <span>{txn.type}</span>
              <span>{new Date(txn.date).toLocaleDateString()}</span>
            </div>
            <button onClick={() => handleDeleteRecurring(idx)} style={buttonStyle}>
              ❌ Remove Recurring
            </button>
          </div>
        ))
      )}
    </div>
  );
};

export default RecurringManager;

const cardStyle = {
  backgroundColor: "#fff",
  padding: "15px",
  borderRadius: "10px",
  boxShadow: "0 2px 8px rgba(0,0,0,0.1)",
  marginBottom: "20px",
};

const rowStyle = {
  display: "flex",
  justifyContent: "space-between",
  marginBottom: "5px",
};

const buttonStyle = {
  marginTop: "10px",
  backgroundColor: "#f44336",
  color: "#fff",
  border: "none",
  padding: "8px 12px",
  borderRadius: "6px",
  cursor: "pointer",
};
