import React from 'react';
import { BrowserRouter as Router, Routes, Route, NavLink } from 'react-router-dom';
import Dashboard from './pages/Dashboard';
import Budget from './pages/Budget';
import Transactions from './pages/Transactions';
import Premium from './pages/Premium';
import Reminders from './pages/Reminders';  
import IncomeForm from './pages/IncomeForm'; 
import './App.css';

const App = () => {
  return (
    <Router>
      <div className="app-container">
        <aside className="sidebar">
          <h2 className="sidebar-title">Budget Tracker</h2>
          <nav className="sidebar-nav">
            <NavLink to="/" end className={({ isActive }) => (isActive ? 'active' : '')}>
              Dashboard
            </NavLink>
            <NavLink to="/budget" className={({ isActive }) => (isActive ? 'active' : '')}>
              Budget
            </NavLink>
            <NavLink to="/transactions" className={({ isActive }) => (isActive ? 'active' : '')}>
              Transactions
            </NavLink>
            <NavLink to="/premium" className={({ isActive }) => (isActive ? 'active' : '')}>
              Premium
            </NavLink>
            <NavLink to="/Reminders" className={({ isActive }) => (isActive ? 'active' : '')}>
              Reminders
            </NavLink>
            <NavLink to="/IncomeForm" className={({ isActive }) => (isActive ? 'active' : '')}>
              IncomeForm
            </NavLink>
          </nav>
        </aside>

        <main className="main-content">
          <Routes>
            <Route path="/" element={<Dashboard />} />
            <Route path="/budget" element={<Budget />} />
            <Route path="/transactions" element={<Transactions />} />
            <Route path="/premium" element={<Premium />} />
            <Route path="/reminders" element={<Reminders />} />
            <Route path="/incomeform" element={<IncomeForm />} />

          </Routes>
        </main>
      </div>
    </Router>
  );
};

export default App;
