// src/pages/SetupScreen.jsx

import React, { useState, useEffect } from 'react';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const colorOptions = [
  "#FF5733", "#FFC300", "#DAF7A6", "#33FF57", "#57C7FF",
  "#AF7AC5", "#F1948A", "#45B39D", "#3498DB", "#F8C471",
  "#82E0AA", "#E59866", "#5DADE2", "#EC7063", "#48C9B0",
  "#7FB3D5", "#F5B7B1", "#58D68D", "#F4D03F", "#BB8FCE",
  "#F39C12", "#D35400", "#16A085", "#2980B9", "#2E86C1",
  "#1ABC9C", "#E74C3C", "#9B59B6", "#34495E", "#5D6D7E"
];

const currencies = [
  { name: 'Indian Rupee', symbol: '₹' },
  { name: 'US Dollar', symbol: '$' },
  { name: 'Euro', symbol: '€' },
  { name: 'Japanese Yen', symbol: '¥' },
  { name: 'British Pound', symbol: '£' },
  { name: 'Australian Dollar', symbol: 'A$' }
];

function SetupScreen({ onSetupComplete }) {
  const [currency, setCurrency] = useState('₹');
  const [expenseCategories, setExpenseCategories] = useState([]);
  const [incomeSources, setIncomeSources] = useState([]);
  const [savingCategories, setSavingCategories] = useState([]);

  const [newCategory, setNewCategory] = useState('');
  const [selectedColor, setSelectedColor] = useState('');
  const [selectedType, setSelectedType] = useState('income');

  useEffect(() => {
    const setup = JSON.parse(localStorage.getItem('setupData'));
    if (setup) {
      setCurrency(setup.currency || '₹');
      setExpenseCategories(setup.expenseCategories || []);
      setIncomeSources(setup.incomeSources || []);
      setSavingCategories(setup.savingCategories || []);
    }
  }, []);

  const addCategory = () => {
    if (!newCategory) return;
    const newEntry = { name: newCategory, color: selectedColor || '#4caf50' };

    if (selectedType === 'income') setIncomeSources([...incomeSources, newEntry]);
    else if (selectedType === 'expense') setExpenseCategories([...expenseCategories, newEntry]);
    else if (selectedType === 'saving') setSavingCategories([...savingCategories, newEntry]);

    setNewCategory('');
    setSelectedColor('');
  };

  const deleteCategory = (type, name) => {
    if (type === 'income') setIncomeSources(incomeSources.filter(c => c.name !== name));
    else if (type === 'expense') setExpenseCategories(expenseCategories.filter(c => c.name !== name));
    else if (type === 'saving') setSavingCategories(savingCategories.filter(c => c.name !== name));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const setupData = {
      currency,
      expenseCategories,
      incomeSources,
      savingCategories,
    };
    localStorage.setItem('setupData', JSON.stringify(setupData));
    toast.success('Setup saved successfully!');
    if (onSetupComplete) onSetupComplete();
  };

  const renderColorOptions = () => (
    <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px', marginTop: '8px' }}>
      {colorOptions.map((color, idx) => (
        <div
          key={idx}
          onClick={() => setSelectedColor(color)}
          style={{
            width: '24px',
            height: '24px',
            borderRadius: '50%',
            backgroundColor: color,
            border: selectedColor === color ? '3px solid black' : '1px solid #ccc',
            cursor: 'pointer',
          }}
        />
      ))}
    </div>
  );

  const renderCustomDropdown = (items, type) => (
    <div style={{ display: 'flex', flexWrap: 'wrap', gap: '10px', marginTop: '10px' }}>
      {items.map((item, idx) => (
        <div key={idx} style={{ display: 'flex', alignItems: 'center', backgroundColor: '#fff', border: '1px solid #ccc', borderRadius: '20px', padding: '5px 10px' }}>
          <div style={{ width: '12px', height: '12px', borderRadius: '50%', backgroundColor: item.color, marginRight: '6px' }}></div>
          <span>{item.name}</span>
          <span onClick={() => deleteCategory(type, item.name)} style={{ marginLeft: '8px', cursor: 'pointer', color: 'red' }}>×</span>
        </div>
      ))}
    </div>
  );

  return (
    <div style={{ padding: '20px', maxWidth: '800px', margin: 'auto' }}>
      <h2 style={{ textAlign: 'center', marginBottom: '30px' }}>🏦 App Settings</h2>
      <ToastContainer position="top-center" autoClose={2000} />

      <form onSubmit={handleSubmit}>
        <div style={cardStyle}> 
          <div className="card-header">🎨 Add Categories</div>

          <select
            value={selectedType}
            onChange={(e) => setSelectedType(e.target.value)}
            style={inputStyle}
          >
            <option value="income">Income</option>
            <option value="expense">Expense</option>
            <option value="saving">Saving</option>
          </select>

          <input
            type="text"
            placeholder="Category Name"
            value={newCategory}
            onChange={(e) => setNewCategory(e.target.value)}
            style={inputStyle}
          />

          {renderColorOptions()}

          <button type="button" onClick={addCategory} style={buttonStyle}>Add Category</button>
        </div>

        <div style={{ ...cardStyle, background: document.body.classList.contains('dark')? '#1f2f1f':'linear-gradient(to right, #e8f5e9, #d0f0c0)' }}>
          <div className="card-header">💰 Income Categories</div>
          {renderCustomDropdown(incomeSources, 'income')}
        </div>

        <div style={{ ...cardStyle, background: 'linear-gradient(to right, #fdecea, #fad4d4)' }}>
          <div className="card-header">🛒 Expense Categories</div>
          {renderCustomDropdown(expenseCategories, 'expense')}
        </div>

        <div style={{ ...cardStyle, background: 'linear-gradient(to right, #e3f2fd, #d4e9f7)' }}>
          <div className="card-header">🏦 Saving Categories</div>
          {renderCustomDropdown(savingCategories, 'saving')}
        </div>

        <div style={cardStyle}>
          <div className="card-header">💱 Select Currency</div>
          <select
            value={currency}
            onChange={(e) => setCurrency(e.target.value)}
            style={inputStyle}
          >
            {currencies.map((curr, idx) => (
              <option key={idx} value={curr.symbol}>{curr.name} ({curr.symbol})</option>
            ))}
          </select>
        </div>

        <div style={{ textAlign: 'center', marginTop: '20px' }}>
          <button type="submit" style={buttonStyle}>Save Setup</button>
        </div>
      </form>
    </div>
  );
}

const cardStyle = {
  padding: '20px',
  borderRadius: '12px',
  boxShadow: '0px 4px 12px rgba(0,0,0,0.15)',
  marginBottom: '30px',
};

const inputStyle = {
  width: '100%',
  padding: '10px',
  marginTop: '8px',
  borderRadius: '6px',
  border: '1px solid #ccc',
  fontSize: '16px',
};

const buttonStyle = {
  marginTop: '10px',
  padding: '10px 20px',
  backgroundColor: '#007bff',
  color: '#fff',
  border: 'none',
  borderRadius: '6px',
  cursor: 'pointer',
  fontSize: '16px',
};

export default SetupScreen;
