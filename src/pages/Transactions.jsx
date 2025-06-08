import React, { useState, useEffect } from 'react';
import jsPDF from 'jspdf';
import 'jspdf-autotable';
import './pagesCss/Transactions.css';

const Transactions = () => {
  const [amount, setAmount] = useState('');
  const [category, setCategory] = useState('');
  const [date, setDate] = useState('');
  const [description, setDescription] = useState('');
  const [categories, setCategories] = useState([]);
  const [transactions, setTransactions] = useState([]);
  const [budgets, setBudgets] = useState([]);

  const [filterCategory, setFilterCategory] = useState('');
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');

  const [editId, setEditId] = useState(null);

  useEffect(() => {
    const loadedBudgets = JSON.parse(localStorage.getItem('budgets')) || [];
    const savedTransactions = JSON.parse(localStorage.getItem('transactions')) || [];

    setBudgets(loadedBudgets);
    setCategories([...new Set(loadedBudgets.map(b => b.category))]);
    setTransactions(savedTransactions);
  }, []);

  const formatDate = (dateString) => {
    if (!dateString) return '';
    const options = { year: 'numeric', month: 'short', day: 'numeric' };
    return new Date(dateString).toLocaleDateString(undefined, options);
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    const newAmount = parseFloat(amount);
    const trimmedCategory = category.trim();

    if (!trimmedCategory) {
      alert('Please select or enter a valid category.');
      return;
    }

    if (isNaN(newAmount) || newAmount <= 0) {
      alert('Please enter a valid amount.');
      return;
    }

    if (!date) {
      alert('Please select a valid date.');
      return;
    }

    const budgetObj = budgets.find(
      (b) => b.category.toLowerCase() === trimmedCategory.toLowerCase()
    );
    const categoryBudget = budgetObj ? parseFloat(budgetObj.limit) : Infinity;

    const currentTotal = transactions.reduce((sum, t) => {
      if (t.category.toLowerCase() === trimmedCategory.toLowerCase() && t.id !== editId) {
        return sum + parseFloat(t.amount || 0);
      }
      return sum;
    }, 0);

    if (currentTotal + newAmount > categoryBudget) {
      alert(
        `⚠️ Budget exceeded for "${trimmedCategory}".\n\n` +
        `Budget Limit: ₹${categoryBudget}\n` +
        `Already Spent: ₹${currentTotal}\n` +
        `Please adjust the amount.`
      );
      return;
    }

    if (editId !== null) {
      // Editing existing transaction
      const updatedTransactions = transactions.map(t =>
        t.id === editId ? { id: editId, amount: newAmount, category: trimmedCategory, date, description } : t
      );
      setTransactions(updatedTransactions);
      localStorage.setItem('transactions', JSON.stringify(updatedTransactions));
    } else {
      // Adding new transaction
      const newTransaction = {
        id: Date.now(),
        amount: newAmount,
        category: trimmedCategory,
        date,
        description
      };
      const updatedTransactions = [...transactions, newTransaction];
      setTransactions(updatedTransactions);
      localStorage.setItem('transactions', JSON.stringify(updatedTransactions));
    }

    // Reset form
    setAmount('');
    setCategory('');
    setDate('');
    setDescription('');
    setEditId(null);
  };

  const handleEdit = (id) => {
    const transaction = transactions.find(t => t.id === id);
    if (!transaction) return;
    setAmount(transaction.amount);
    setCategory(transaction.category);
    setDate(transaction.date);
    setDescription(transaction.description);
    setEditId(id);
  };

  const handleDelete = (id) => {
    if (window.confirm('Are you sure you want to delete this transaction?')) {
      const updated = transactions.filter(t => t.id !== id);
      setTransactions(updated);
      localStorage.setItem('transactions', JSON.stringify(updated));
      if (editId === id) {
        // Reset form if deleting currently edited transaction
        setEditId(null);
        setAmount('');
        setCategory('');
        setDate('');
        setDescription('');
      }
    }
  };

  const filteredTransactions = transactions.filter(t => {
    const isInCategory = filterCategory ? t.category === filterCategory : true;
    const isInDateRange =
      (!startDate || new Date(t.date) >= new Date(startDate)) &&
      (!endDate || new Date(t.date) <= new Date(endDate));
    return isInCategory && isInDateRange;
  });

  const totalExpense = filteredTransactions.reduce(
    (sum, t) => sum + (parseFloat(t.amount) || 0),
    0
  );

  const exportCSV = () => {
    const csvRows = [
      ['Date', 'Category', 'Amount', 'Description'],
      ...filteredTransactions.map(t => [t.date, t.category, t.amount, t.description || ''])
    ];
    const blob = new Blob([csvRows.map(r => r.join(',')).join('\n')], { type: 'text/csv' });
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = 'transactions.csv';
    link.click();
  };

  const exportPDF = () => {
    const doc = new jsPDF();
    doc.text('Transaction History', 14, 16);
    doc.autoTable({
      head: [['Date', 'Category', 'Amount (₹)', 'Description']],
      body: filteredTransactions.map(t => [formatDate(t.date), t.category, `₹${t.amount}`, t.description || '']),
    });
    doc.save('transactions.pdf');
  };

  const isFormValid = category.trim() !== '' && amount !== '' && parseFloat(amount) > 0 && date !== '';

  return (
    <div className="premium-container">
      {/* Title at the top */}
      <h1 className="page-title">Expense Tracker</h1>

      {/* Add/Edit Form */}
      {editId === null ? (
        <form className="form" onSubmit={handleSubmit}>
          <div className="input-group">
            <select
              value={category}
              onChange={e => setCategory(e.target.value)}
              required
              className="input"
            >
              <option value="" disabled>
                Select Category
              </option>
              {categories.map((cat, i) => (
                <option key={i} value={cat}>
                  {cat}
                </option>
              ))}
            </select>
            <label className="floating-label select-label">Category</label>
          </div>
          <div className="input-group">
            <input
              type="number"
              value={amount}
              onChange={e => setAmount(e.target.value)}
              required
              className="input"
            />
            <label className="floating-label">Amount (₹)</label>
          </div>
          <div className="input-group">
            <input
              type="date"
              value={date}
              onChange={e => setDate(e.target.value)}
              required
              className="input"
            />
            <label className="floating-label">Date</label>
          </div>
          <div className="input-group">
            <input
              type="text"
              value={description}
              onChange={e => setDescription(e.target.value)}
              className="input"
            />
            <label className="floating-label">Description (optional)</label>
          </div>
          <button type="submit" className="btn primary" disabled={!isFormValid}>
            Add Expense
          </button>
        </form>
      ) : (
        <div className="modal-overlay">
          <div className="modal">
            <form className="form" onSubmit={handleSubmit}>
              <h2>Edit Transaction</h2>
              <div className="input-group">
                <input
                  type="number"
                  value={amount}
                  onChange={e => setAmount(e.target.value)}
                  required
                  className="input"
                />
                <label className="floating-label">Amount (₹)</label>
              </div>
              <div className="input-group">
                <select
                  value={category}
                  onChange={e => setCategory(e.target.value)}
                  required
                  className="input"
                >
                  <option value="" disabled>
                    Select Category
                  </option>
                  {categories.map((cat, i) => (
                    <option key={i} value={cat}>
                      {cat}
                    </option>
                  ))}
                </select>
                <label className="floating-label select-label">Category</label>
              </div>
              <div className="input-group">
                <input
                  type="date"
                  value={date}
                  onChange={e => setDate(e.target.value)}
                  required
                  className="input"
                />
                <label className="floating-label">Date</label>
              </div>
              <div className="input-group">
                <input
                  type="text"
                  value={description}
                  onChange={e => setDescription(e.target.value)}
                  className="input"
                />
                <label className="floating-label">Description</label>
              </div>
              <div className="buttons">
                <button type="submit" className="btn primary" disabled={!isFormValid}>
                  Update
                </button>
                <button
                  type="button"
                  className="btn secondary"
                  onClick={() => {
                    setEditId(null);
                    setAmount('');
                    setCategory('');
                    setDate('');
                    setDescription('');
                  }}
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Filters */}
      <div className="filters">
        <h2>Filter Transactions</h2>
        <div className="filter-row">
          <select
            value={filterCategory}
            onChange={e => setFilterCategory(e.target.value)}
            className="input"
          >
            <option value="">All Categories</option>
            {categories.map((cat, i) => (
              <option key={i} value={cat}>
                {cat}
              </option>
            ))}
          </select>
          <input
            type="date"
            value={startDate}
            onChange={e => setStartDate(e.target.value)}
            className="input"
          />
          <input
            type="date"
            value={endDate}
            onChange={e => setEndDate(e.target.value)}
            className="input"
          />
          <button
            type="button"
            className="btn tertiary"
            onClick={() => {
              setFilterCategory('');
              setStartDate('');
              setEndDate('');
            }}
          >
            Clear Filters
          </button>
        </div>
      </div>

      {/* Summary & Export */}
      <div className="summary">
        <h3>
          Total Filtered Expenses: <span>₹{totalExpense.toFixed(2)}</span>
        </h3>
        <div className="export-buttons">
          <button
            onClick={exportCSV}
            disabled={filteredTransactions.length === 0}
            className="btn export"
          >
            Export CSV
          </button>
          <button
            onClick={exportPDF}
            disabled={filteredTransactions.length === 0}
            className="btn export"
          >
            Export PDF
          </button>
        </div>
      </div>

      {/* Transaction List */}
      <div className="transaction-history">
        <h2>Transaction History</h2>
        {filteredTransactions.length === 0 ? (
          <p className="no-transactions">No transactions found.</p>
        ) : (
          <ul>
            {filteredTransactions.map(t => (
              <li
                key={t.id}
                className="transaction-item"
              >
                <div className="transaction-info">
                  <div>
                    <strong>{t.category}</strong>
                  </div>
                  <div className="date">{formatDate(t.date)}</div>
                  <div className="description">{t.description || '-'}</div>
                </div>
                <div className="transaction-actions">
                  <div className="amount">₹{parseFloat(t.amount).toFixed(2)}</div>
                  <button
                    onClick={() => handleEdit(t.id)}
                    className="icon-btn edit"
                    aria-label={`Edit transaction in category ${t.category} amount ₹${t.amount}`}
                  >
                    ✏️
                  </button>
                  <button
                    onClick={() => handleDelete(t.id)}
                    className="icon-btn delete"
                    aria-label={`Delete transaction in category ${t.category} amount ₹${t.amount}`}
                  >
                    🗑️
                  </button>
                </div>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
};

export default Transactions;
