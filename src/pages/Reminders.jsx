import React, { useState, useEffect } from 'react';
import './pagesCss/Reminders.css'; // Assuming you have a CSS file for styling

const Reminders = () => {
  const [reminders, setReminders] = useState(() => JSON.parse(localStorage.getItem('reminders')) || []);
  const [title, setTitle] = useState('');
  const [dueDate, setDueDate] = useState('');
  const [amount, setAmount] = useState('');
  const [recurrence, setRecurrence] = useState('');
  const [editIndex, setEditIndex] = useState(null);

  useEffect(() => {
    localStorage.setItem('reminders', JSON.stringify(reminders));
  }, [reminders]);

  const handleAddOrUpdate = (e) => {
    e.preventDefault();
    const newReminder = { title, dueDate, amount, recurrence };

    if (editIndex !== null) {
      const updatedReminders = [...reminders];
      updatedReminders[editIndex] = newReminder;
      setReminders(updatedReminders);
      setEditIndex(null);
    } else {
      setReminders([...reminders, newReminder]);
    }

    setTitle('');
    setDueDate('');
    setAmount('');
    setRecurrence('');
  };

  const handleDelete = (index) => {
    const updated = reminders.filter((_, i) => i !== index);
    setReminders(updated);
  };

  const handleEdit = (index) => {
    const rem = reminders[index];
    setTitle(rem.title);
    setDueDate(rem.dueDate);
    setAmount(rem.amount);
    setRecurrence(rem.recurrence);
    setEditIndex(index);
  };

  const isDueSoon = (dateStr) => {
    const today = new Date();
    const due = new Date(dateStr);
    const diffDays = Math.ceil((due - today) / (1000 * 60 * 60 * 24));
    return diffDays <= 3 && diffDays >= 0;
  };

  const isOverdue = (dateStr) => {
    return new Date(dateStr) < new Date();
  };

  return (
    <div className="reminder-container">
      <h2>📅 Bill Reminders</h2>

      <form onSubmit={handleAddOrUpdate} className="reminder-form">
        <input type="text" placeholder="Title" value={title} onChange={(e) => setTitle(e.target.value)} required />
        <input type="date" value={dueDate} onChange={(e) => setDueDate(e.target.value)} required />
        <input type="number" placeholder="Amount" value={amount} onChange={(e) => setAmount(e.target.value)} required />
        <input type="text" placeholder="Recurrence (optional)" value={recurrence} onChange={(e) => setRecurrence(e.target.value)} />
        <button type="submit">{editIndex !== null ? "Update" : "Add Reminder"}</button>
      </form>

      <div className="reminder-list">
        {reminders.length === 0 ? (
          <p className="no-reminder">No reminders found.</p>
        ) : (
          reminders.map((rem, i) => (
            <div
              key={i}
              className={`reminder-card
                ${isOverdue(rem.dueDate) ? 'overdue' : isDueSoon(rem.dueDate) ? 'due-soon' : ''}`}
            >
              <div className="rem-title">{rem.title}</div>
              <div>💰 ₹{rem.amount}</div>
              <div>📅 {rem.dueDate}</div>
              {rem.recurrence && <div>🔁 {rem.recurrence}</div>}

              <div className="reminder-actions">
                <button onClick={() => handleEdit(i)} className="edit-btn">✏️ Edit</button>
                <button onClick={() => handleDelete(i)} className="delete-btn">🗑️ Delete</button>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default Reminders;
