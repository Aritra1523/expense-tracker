import React from 'react';
import { Link } from 'react-router-dom';

const Navbar = () => (
  <nav>
    <h1>Budget Tracker</h1>
    <div>
      <Link to="/">Dashboard</Link>
      <Link to="/transactions">Transactions</Link>
      <Link to="/login">Login</Link>
      <Link to="/register">Register</Link>
    </div>
  </nav>
);

export default Navbar;