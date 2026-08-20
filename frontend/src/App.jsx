import { useEffect, useState } from "react";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import './App.css';

function App() {
  const [data, setData] = useState([]);
  const [incomes, setIncomes] = useState(0);
  const [expenses, setExpenses] = useState(0);
  const [balance, setBalance] = useState(0);
  const [daybalance, setDayBalance] = useState([]);

  useEffect(() => {
    fetch("http://127.0.0.1:8000/finance")
      .then((response) => response.json())
      .then((result) => setData(result));
  }, []);

  useEffect(() => {
    fetch("http://127.0.0.1:8000/incomes")
      .then((response) => response.json())
      .then((value) => setIncomes(value));

    fetch("http://127.0.0.1:8000/expenses")
      .then((response) => response.json())
      .then((value) => setExpenses(value));

    fetch("http://127.0.0.1:8000/balance")
      .then((response) => response.json())
      .then((value) => setBalance(value));

    fetch("http://127.0.0.1:8000/daybalance")
      .then((response) => response.json())
      .then((value) => setDayBalance(Array.isArray(value) ? value : []));
  }, []);

  return (
    <div className="app">
      <aside className="sidebar">
        <div className="brand">Fast Dashboard</div>
        <nav>
          <ul>
            <li className="active">Overview</li>
            <li>Finance</li>
            <li>Reports</li>
            <li>Settings</li>
          </ul>
        </nav>
      </aside>

      <div className="main">
        <header className="topbar">
          <h1>Finance Dashboard</h1>
        </header>

        <section className="cards">
          <div className="card">
            <div className="card-title">Total Incomes</div>
            <div className="card-value">{incomes}</div>
          </div>
          <div className="card">
            <div className="card-title">Total Expenses</div>
            <div className="card-value">{expenses}</div>
          </div>
          <div className="card">
            <div className="card-title">Total Balance</div>
            <div className="card-value">{balance}</div>
          </div>
        </section>

        <section className="chart" style={{overflow: 'hidden' }}>
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={daybalance} margin={{ top: 5, right: 30, left: 0, bottom: 5 }}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="date" />
              <YAxis />
              <Tooltip />
              <Line type="monotone" dataKey="total" stroke="#64636a" activeDot={{ r: 8 }} />
            </LineChart>
          </ResponsiveContainer>
        </section>

        <section className="list">
          <h2>Transactions History</h2>
          <div className="table-wrapper">
            {data.length === 0 ? (
              <p>No transactions yet.</p>
            ) : (
              <table className="students-table">
                <thead>
                  <tr>
                    <th>date</th>
                    <th>amount</th>
                    <th>type</th>
                  </tr>
                </thead>
                <tbody>
                  {data.map((row) => (
                    <tr key={row.id}>
                      <td>{row.date}</td>
                      <td style={{ color: row.amount >= 0 ? 'green' : 'red' }}>{row.amount}</td>
                      <td>{row.type}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>
        </section>
      </div>
    </div>
  );
}

export default App;
