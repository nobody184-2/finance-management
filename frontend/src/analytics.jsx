import { useNavigate } from "react-router-dom";
import { PieChart, Pie, Cell, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { useEffect, useState } from "react";

function Analytics() {
  const navigate = useNavigate();
  const [expenses, setExpenses] = useState([]);
  const [incomes, setIncomes] = useState([]);
  useEffect(() => {
      fetch("http://127.0.0.1:8000/showexpenses")
        .then((response) => response.json())
        .then((result) => setExpenses(result));
      fetch("http://127.0.0.1:8000/showincomes")
        .then((response) => response.json())
        .then((result) => setIncomes(result));
    }, []);
  const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#A28DFF'];
  return (
    <div className="app">
      <aside className="sidebar">
        <div className="brand">Fast Dashboard</div>
        <nav>
          <ul>
            <li onClick={() => navigate("/")} >Overview</li>
            <li onClick={() => navigate("/financial-input")}>Finance</li>
            <li className="active">Analytics</li>
            <li>Settings</li>
          </ul>
        </nav>
      </aside>

      <div className="main">
        <header className="analytics-header">
          <div>
            <p className="eyebrow">Financial overview</p>
            <h1>Analytics</h1>
            <p>Track how your income and expenses are distributed.</p>
          </div>
        </header>
        <section className="analytics-grid">
          <article className="analytics-card">
            <div className="analytics-card-heading">
              <h2>Expenses</h2>
              <span className="analytics-card-badge">Spending</span>
            </div>
            <div className="pie-chart-container">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={expenses}
                    dataKey="total"
                    nameKey="category"
                    cx="50%"
                    cy="44%"
                    outerRadius="62%"
                    label
                  >
                    {expenses.map((entry, index) => (
                      <Cell
                        key={`expense-cell-${index}`}
                        fill={COLORS[index % COLORS.length]}
                      />
                    ))}
                  </Pie>
                  <Tooltip />
                  <Legend content={() => (
                <ul
                  style={{
                    display: "flex",
                    justifyContent: "center",
                    gap: "20px",
                    padding: 0,
                    margin: 0
                  }}
                >
                  {expenses.map((entry, index) => (
                    <li
                      key={entry.category}
                      style={{
                        listStyleType: "none",
                        display: "flex",
                        alignItems: "center"
                      }}
                    >
                      <span
                        style={{
                          display: "inline-block",
                          width: "10px",
                          height: "10px",
                          backgroundColor: COLORS[index % COLORS.length],
                          marginRight: "8px"
                        }}
                      />
                      {entry.category}
                    </li>
                  ))}
                </ul>
                  )}
                  />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </article>
          <article className="analytics-card">
            <div className="analytics-card-heading">
              <h2>Income</h2>
              <span className="analytics-card-badge income">Earnings</span>
            </div>
            <div className="pie-chart-container">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={incomes}
                    dataKey="total"
                    nameKey="category"
                    cx="50%"
                    cy="44%"
                    outerRadius="62%"
                    label
                  >
                    {incomes.map((entry, index) => (
                      <Cell
                        key={`income-cell-${index}`}
                        fill={COLORS[index % COLORS.length]}
                      />
                    ))}
                  </Pie>
                  <Tooltip />
                  <Legend content={() => (
                <ul
                  style={{
                    display: "flex",
                    justifyContent: "center",
                    gap: "20px",
                    padding: 0,
                    margin: 0
                  }}
                >
                  {incomes.map((entry, index) => (
                    <li
                      key={entry.category}
                      style={{
                        listStyleType: "none",
                        display: "flex",
                        alignItems: "center"
                      }}
                    >
                      <span
                        style={{
                          display: "inline-block",
                          width: "10px",
                          height: "10px",
                          backgroundColor: COLORS[index % COLORS.length],
                          marginRight: "8px"
                        }}
                      />
                      {entry.category}
                    </li>
                  ))}
                </ul>
                  )}
                  />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </article>
        </section>
        <section className="analytics-placeholder-grid">
          <div className="analytics-placeholder">Budget</div>
          <div className="analytics-placeholder">Anomaly Detection</div>
          <div className="analytics-placeholder">Compare</div>
        </section>
      </div>
    </div>
  );
}

export default Analytics;