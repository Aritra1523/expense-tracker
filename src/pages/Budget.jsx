import React, { useState, useEffect } from 'react';
import './pagesCss/BudgetForm.css';
import { PieChart, Pie, Cell, Tooltip, Legend, ResponsiveContainer } from 'recharts';

const COLORS = ['#4B7BEC', '#EB4B4B', '#26de81', '#f7b731', '#9b59b6', '#2ecc71', '#e67e22'];

const BudgetForm = () => {
  const [category, setCategory] = useState('');
  const [limit, setLimit] = useState('');
  const [notes, setNotes] = useState('');
  const [message, setMessage] = useState('');
  const [income, setIncome] = useState(0);
  const [budgets, setBudgets] = useState([]);
  const [editIndex, setEditIndex] = useState(null);
  const [showModal, setShowModal] = useState(false);

  // Initial data load from localStorage
  useEffect(() => {
    const storedIncome = parseFloat(localStorage.getItem('income')) || 0;
    const storedBudgets = JSON.parse(localStorage.getItem('budgets')) || [];
    setIncome(storedIncome);
    setBudgets(storedBudgets);
  }, []);

  // Close modal with Escape key
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape') closeModal();
    };
    if (showModal) window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [showModal]);

  const totalBudget = budgets.reduce((sum, b) => sum + parseFloat(b.limit || 0), 0);
  const remainingToBudget = income - totalBudget;

  const openAddModal = () => {
    setCategory('');
    setLimit('');
    setNotes('');
    setEditIndex(null);
    setMessage('');
    setShowModal(true);
  };

  const closeModal = () => {
    setShowModal(false);
    setMessage('');
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const trimmedCategory = category.trim();
    const newLimit = parseFloat(limit);

    if (!trimmedCategory || isNaN(newLimit) || newLimit <= 0) {
      setMessage('⚠️ Please enter a valid category and positive limit.');
      return;
    }

    const budgetWithoutCurrent = editIndex !== null
      ? budgets.reduce((sum, b, idx) => idx === editIndex ? sum : sum + parseFloat(b.limit), 0)
      : totalBudget;

    if (budgetWithoutCurrent + newLimit > income) {
      setMessage('❌ Total budget exceeds income. Please adjust.');
      return;
    }

    const newBudget = { category: trimmedCategory, limit: newLimit, notes };
    const updatedBudgets = [...budgets];

    if (editIndex !== null) {
      updatedBudgets[editIndex] = newBudget;
      setMessage('✅ Budget updated!');
    } else {
      updatedBudgets.push(newBudget);
      setMessage('✅ Budget added!');
    }

    localStorage.setItem('budgets', JSON.stringify(updatedBudgets));
    setBudgets(updatedBudgets);
    setTimeout(() => setMessage(''), 2500);
    setShowModal(false);
  };

  const handleDelete = (index) => {
    const filtered = budgets.filter((_, idx) => idx !== index);
    setBudgets(filtered);
    localStorage.setItem('budgets', JSON.stringify(filtered));
  };

  const handleEdit = (index) => {
    const b = budgets[index];
    setCategory(b.category);
    setLimit(b.limit);
    setNotes(b.notes || '');
    setEditIndex(index);
    setShowModal(true);
  };

  return (
    <div className="budget-form-container">
      <h2>📊 Budget Overview</h2>
      <p><strong>Total Income:</strong> ₹{income.toFixed(2)}</p>
      <p><strong>Total Budgeted:</strong> ₹{totalBudget.toFixed(2)}</p>
      <p><strong>Remaining to Budget:</strong> ₹{remainingToBudget.toFixed(2)}</p>

      {budgets.length > 0 && (
        <div className="chart-wrapper">
          <h3>📈 Spending Distribution</h3>
          <ResponsiveContainer width="100%" height={250}>
            <PieChart>
              <Pie
                data={budgets.map(b => ({ name: b.category, value: parseFloat(b.limit) }))}
                dataKey="value"
                nameKey="name"
                cx="50%"
                cy="50%"
                outerRadius={80}
                label
              >
                {budgets.map((_, idx) => (
                  <Cell key={`cell-${idx}`} fill={COLORS[idx % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip />
              <Legend />
            </PieChart>
          </ResponsiveContainer>
        </div>
      )}

      {income > 0 && (
        <div className="add-budget-card" onClick={openAddModal}>
          <h3><span>➕</span> Add Budget</h3>
          <p>Click to create a new budget category</p>
        </div>
      )}

      <h3>📋 Your Budgets</h3>
      {budgets.length === 0 ? (
        <p>No budgets set. Add one to get started.</p>
      ) : (
        <div className="budget-cards">
          {budgets.map((b, idx) => (
            <div key={idx} className="budget-card">
              <h4>{b.category}</h4>
              <p><strong>Limit:</strong> ₹{parseFloat(b.limit).toFixed(2)}</p>
              {b.notes && <p className="notes">📝 {b.notes}</p>}
              <div className="card-buttons">
                <button onClick={() => handleEdit(idx)} className="btn-primary btn-sm">Edit</button>
                <button onClick={() => handleDelete(idx)} className="btn-danger btn-sm">Delete</button>
              </div>
            </div>
          ))}
        </div>
      )}

      {showModal && (
        <div className="modal-overlay" onClick={closeModal}>
          <div className="modal-content" onClick={e => e.stopPropagation()}>
            <h2>{editIndex !== null ? '✏️ Edit Budget' : '➕ Add New Budget'}</h2>
            <form onSubmit={handleSubmit} className="budget-form">
              <label htmlFor="category">Category</label>
              <input
                id="category"
                value={category}
                onChange={e => setCategory(e.target.value)}
                placeholder="e.g. Rent, Food"
                list="category-suggestions"
                className="input-field"
                required
              />
              <datalist id="category-suggestions">
                <option value="Rent" />
                <option value="Food" />
                <option value="Transport" />
                <option value="Savings" />
                <option value="Entertainment" />
                <option value="Education" />
                <option value="Investment" />
                <option value="Health" />
                <option value="Clothing" />
              </datalist>

              <label htmlFor="limit">Limit (₹)</label>
              <input
                id="limit"
                type="number"
                min="1"
                step="0.01"
                value={limit}
                onChange={e => setLimit(e.target.value)}
                placeholder="Enter monthly limit"
                className="input-field"
                required
              />

              <label htmlFor="notes">Notes (optional)</label>
              <textarea
                id="notes"
                value={notes}
                onChange={e => setNotes(e.target.value)}
                placeholder="e.g. Essentials, recurring, etc."
                className="textarea-field"
              />

              {message && (
                <p className={`form-message ${message.includes('❌') ? 'error' : 'success'}`}>
                  {message}
                </p>
              )}

              <div className="modal-buttons">
                <button type="submit" className="btn-primary">
                  {editIndex !== null ? 'Update Budget' : 'Add Budget'}
                </button>
                <button type="button" className="btn-cancel" onClick={closeModal}>
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default BudgetForm;
