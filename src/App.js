// src/App.js

import React, { useEffect, useState } from 'react';
import { BrowserRouter as Router, Routes, Route, NavLink } from 'react-router-dom';
import SetupScreen from './pages/SetupScreen';
import TransactionScreen from './pages/TransactionScreen';
import InsightsScreen from './pages/InsightsScreen';
import RecurringManager from './pages/RecurringManager'; // ✅ NEW
import './App.css';

function App() {
  const [darkMode, setDarkMode] = useState(false);

  useEffect(() => {
    const storedMode = localStorage.getItem('darkMode') === 'true';
    setDarkMode(storedMode);
    document.body.className = storedMode ? 'dark' : '';
  }, []);

  const toggleDarkMode = () => {
    const newMode = !darkMode;
    setDarkMode(newMode);
    localStorage.setItem('darkMode', newMode);
    document.body.className = newMode ? 'dark' : '';
  };

  return (
    <Router>
      <div className="app-container">
        <div className="top-bar">
          <nav className="nav-tabs">
            <NavLink to="/" end className={({ isActive }) => isActive ? "tab-link active" : "tab-link"}>Setup</NavLink>
            <NavLink to="/transactions" className={({ isActive }) => isActive ? "tab-link active" : "tab-link"}>Transactions</NavLink>
            <NavLink to="/insights" className={({ isActive }) => isActive ? "tab-link active" : "tab-link"}>Insights</NavLink>
            <NavLink to="/recurring" className={({ isActive }) => isActive ? "tab-link active" : "tab-link"}>Recurring</NavLink> {/* ✅ NEW */}
          </nav>
          <div className="mode-toggle-container">
            <button onClick={toggleDarkMode} className="toggle-mode-btn">
              {darkMode ? '☀️ Light Mode' : '🌙 Dark Mode'}
            </button>
          </div>
        </div>

        <Routes>
          <Route path="/" element={<SetupScreen />} />
          <Route path="/transactions" element={<TransactionScreen />} />
          <Route path="/insights" element={<InsightsScreen />} />
          <Route path="/recurring" element={<RecurringManager />} /> {/* ✅ NEW */}
        </Routes>
      </div>
    </Router>
  );
}

export default App;
