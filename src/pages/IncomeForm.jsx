import React, { useState } from 'react';
import './pagesCss/IncomeForm.css'; 

const IncomeForm = ({ onSave }) => {
  const [income, setIncome] = useState('');
  const [message, setMessage] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!income || isNaN(income) || Number(income) <= 0) {
      setMessage('Please enter a valid income amount.');
      return;
    }
    onSave(Number(income)); // callback to parent to store income
    setMessage('Income updated successfully!');
    setIncome('');
  };

  return (
    <div className="income-form">
      <h2>Set Monthly Income</h2>
      <form onSubmit={handleSubmit}>
        <label>Monthly Income (₹)</label>
        <input
          type="number"
          placeholder="Enter your income"
          value={income}
          onChange={(e) => setIncome(e.target.value)}
        />
        <button type="submit">Save</button>
        {message && <p className="message">{message}</p>}
      </form>
    </div>
  );
};

export default IncomeForm;
