import React from 'react';
import './pagesCss/premium.css';

const Premium = () => {
  return (
    <div className="premium-container">
      <div className="premium-card">
        <h2 className="premium-title">🚀 Upgrade to <span>Premium</span></h2>
        <ul className="premium-features">
          <li>🔓 Unlock <strong>Goal Tracking</strong></li>
          <li>🧠 AI <strong>Financial Suggestions</strong></li>
          <li>📄 Export Reports as <strong>PDF</strong></li>
          <li>💼 Unlimited <strong>Budgets & Transactions</strong></li>
        </ul>
        <button className="premium-btn">Upgrade Now</button>
      </div>
    </div>
  );
};

export default Premium;
