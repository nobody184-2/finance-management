import React, { useState ,useEffect} from 'react';
import './app.css';
import { useNavigate } from "react-router-dom";

function FinancialInput() {
  const [date, setDate] = useState( new Date().toISOString().slice(0, 10));
  const [amount, setAmount] = useState('');
  const [category, setCategory] = useState('');
  const [transactions, setTransactions] = useState([]);
  const [message, setMessage] = useState(null);
  const navigate = useNavigate();

  function resetForm() {
    setDate(new Date().toISOString().slice(0, 10));
    setAmount('');
    setCategory('');
  }

  function addTransaction(e) {
    e && e.preventDefault();
    const num = parseFloat(amount);
    if (Number.isNaN(num) || num === 0) { setMessage({ type: 'error', text: 'Enter a non-zero numeric amount.' }); return; }
    const safeCategory = category.trim() || 'General';
    const tx = {
      id: Date.now(),
      date,
      amount: num,
      category: safeCategory
    };

    setTransactions(prev => [tx, ...prev]);
    resetForm();
    setMessage(null);
  }

  function removeTransaction(id) {
    setTransactions(prev => prev.filter(t => t.id !== id));
  }

  function getTotals() {
    return transactions.reduce((acc, t) => {
      if (t.amount > 0) acc.income += t.amount;
      else acc.expense += t.amount;
      return acc;
    }, { income: 0, expense: 0 });
  }

  async function handleSubmitAll() {
    if (transactions.length === 0) { setMessage({ type: 'error', text: 'No transactions to submit.' }); return; }
    try {
      // Replace URL with actual backend endpoint as needed
      const res = await fetch('http://127.0.0.1:8000/transactions', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ transactions })
      });
      if (!res.ok) throw new Error(`Server responded ${res.status}`);
      setTransactions([]);
      setMessage({ type: 'success', text: 'Transactions submitted successfully.' });
    } catch (err) {
      console.error(err);
      setMessage({ type: 'error', text: 'Failed to submit transactions. See console for details.' });
    }
  }

  const totals = getTotals();
  const balance = totals.income + totals.expense;

  return (
    <div className="app">
      <aside className="sidebar">
        <div className="brand">Fast Dashboard</div>
        <nav>
          <ul>
            <li onClick={() => navigate("/")} >Overview</li>
            <li className="active">Finance</li>
            <li>Reports</li>
            <li>Settings</li>
          </ul>
        </nav>
      </aside>

      <div className="main">
        <div className="fm-page">
      <h1>Financial Transactions</h1>

      <section className="fm-card" aria-labelledby="entry-form-heading">
        <h2 id="entry-form-heading">Add a transaction</h2>
        <form onSubmit={addTransaction} className="fm-form">
          <div className="fm-form-grid">
            <div>
              <label htmlFor="date">Date</label>
              <input id="date" type="date" value={date} onChange={e => setDate(e.target.value)} className="fm-input" />
            </div>
            <div>
              <label htmlFor="amount">Amount</label>
              <input id="amount" type="number" step="0.01" placeholder="0.00" value={amount} onChange={e => setAmount(e.target.value)} className="fm-input" />
            </div>
            <div>
              <label htmlFor="category">Category</label>
              <input id="category" type="text" placeholder="e.g., Food, Rent, Salary" value={category} onChange={e => setCategory(e.target.value)} className="fm-input" />
            </div>

            <div className="fm-actions">
              <button type="submit" className="fm-btn-primary">Add</button>
              <button type="button" onClick={resetForm} className="fm-btn-secondary">Clear</button>
            </div>
          </div>
        </form>
        {message && (
          <div className={`fm-message ${message.type === 'error' ? 'error' : 'success'}`}>{message.text}</div>
        )}
      </section>

      <section className="fm-card" aria-labelledby="transactions-heading">
        <h2 id="transactions-heading">Pending transactions</h2>

        <div style={{ marginBottom: 12 }}>
          <span className="fm-pill">Income: {totals.income.toFixed(2)}</span>
          <span className="fm-pill">Expense: {totals.expense.toFixed(2)}</span>
          <span className={`fm-pill fm-balance ${balance >= 0 ? 'positive' : 'negative'}`}>Balance: {balance.toFixed(2)}</span>
        </div>

        {transactions.length === 0 ? (
          <div>No transactions added yet.</div>
        ) : (
          <table className="fm-list-table">
            <thead>
              <tr>
                <th>Date</th>
                <th>Category</th>
                <th>Amount</th>
                <th></th>
              </tr>
            </thead>
            <tbody>
              {transactions.map(tx => (
                <tr key={tx.id}>
                  <td>{tx.date}</td>
                  <td>{tx.category}</td>
                  <td>{tx.amount.toFixed(2)}</td>
                  <td><button onClick={() => removeTransaction(tx.id)} className="fm-btn-secondary">Remove</button></td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
        <div style={{ marginTop: 12, display: 'flex', gap: 8 }}>
          <button onClick={handleSubmitAll} className="fm-btn-primary">Submit all</button>
          <button onClick={() => setTransactions([])} className="fm-btn-secondary">Clear all</button>
        </div>
      </section>
      <footer className="fm-footer">
        Tip: Add transactions as they occur and submit in batches or connect this page to a backend endpoint for immediate persistence.
      </footer>
        </div>
      </div>
    </div>
  );
}

export default FinancialInput;
