// src/components/AddTransactionForm.jsx

import { useState } from "react";

const AddTransactionForm = ({ setupData, onTransactionAdded, onCancel }) => {
  const [category, setCategory] = useState("");
  const [amount, setAmount] = useState("");
  const [date, setDate] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!category || !amount || !date) {
      alert("Please fill all fields.");
      return;
    }

    const newTransaction = {
      date,
      category,
      amount: parseFloat(amount),
    };

    onTransactionAdded(newTransaction);
  };

  return (
    <form onSubmit={handleSubmit} style={{ marginBottom: "20px" }}>
      <div>
        <label>Date: </label>
        <input
          type="date"
          value={date}
          onChange={(e) => setDate(e.target.value)}
        />
      </div>

      <div>
        <label>Category: </label>
        <select value={category} onChange={(e) => setCategory(e.target.value)}>
          <option value="">Select Category</option>
          {setupData?.expenseCategories?.map((cat) => (
            <option key={cat.id} value={cat.name}>
              {cat.name}
            </option>
          ))}
        </select>
      </div>

      <div>
        <label>Amount: </label>
        <input
          type="number"
          value={amount}
          onChange={(e) => setAmount(e.target.value)}
        />
      </div>

      <div style={{ marginTop: "10px" }}>
        <button type="submit">Save</button>
        <button type="button" onClick={onCancel} style={{ marginLeft: "10px" }}>
          Cancel
        </button>
      </div>
    </form>
  );
};

export default AddTransactionForm;
