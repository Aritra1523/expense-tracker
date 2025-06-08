import React, { useEffect, useState } from 'react';
import IncomeForm from './IncomeForm';
import './pagesCss/Dashboard.css'; // custom CSS for premium layout

const Dashboard = () => {
  const [income, setIncome] = useState(0);
  const [budgets, setBudgets] = useState([]);
  const [transactions, setTransactions] = useState([]);

  useEffect(() => {
    const incomeStored = parseFloat(localStorage.getItem('income')) || 0;
    const budgetsStored = JSON.parse(localStorage.getItem('budgets')) || [];
    const transactionsStored = JSON.parse(localStorage.getItem('transactions')) || [];

    setIncome(incomeStored);
    setBudgets(budgetsStored);
    setTransactions(transactionsStored);
  }, []);

  const handleIncomeSave = (newIncome) => {
    setIncome(newIncome);
    localStorage.setItem('income', newIncome);
  };

  const totalBudget = budgets.reduce((sum, b) => sum + Number(b.limit || 0), 0);
  const totalSpent = transactions.reduce((sum, t) => sum + Number(t.amount || 0), 0);
  const remaining = totalBudget - totalSpent;

  return (
    <div className="dashboard-container">
      <h1 className="dashboard-title">💼 Finance Dashboard</h1>

      <div className="summary-grid">
        <div className="summary-box income">Income<br /><span>₹{income.toFixed(2)}</span></div>
        <div className="summary-box budget">Budget<br /><span>₹{totalBudget.toFixed(2)}</span></div>
        <div className="summary-box spent">Spent<br /><span>₹{totalSpent.toFixed(2)}</span></div>
        <div className="summary-box remaining">Remaining Budget<br /><span>₹{remaining.toFixed(2)}</span></div>
        <div className="summary-box savings"> Savings<br /> <span>₹{(income - totalBudget).toFixed(2)}</span> </div>
      </div>

      <div className="recent-transactions">
        <h2>🧾 Recent Transactions</h2>
        {transactions.length === 0 ? (
          <p className="no-transactions">No transactions found.</p>
        ) : (
          <ul>
            {transactions.slice(-5).reverse().map((t, index) => (
              <li key={index} className="transaction-item">
                <div>
                  <strong>{t.category}</strong> - ₹{Number(t.amount).toFixed(2)}
                </div>
                <div className="date">{t.date}</div>
              </li>
            ))}
          </ul>
        )}
      </div>

      <div className="income-form-section">
        <IncomeForm onSave={handleIncomeSave} />
      </div>
    </div>
  );
};

export default Dashboard;
