import { useNavigate } from "react-router-dom";
import { PieChart, Pie, Cell, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { useEffect, useState } from "react";

function Analytics() {
  const navigate = useNavigate();
  const [expenses, setExpenses] = useState([]);
  const [incomes, setIncomes] = useState([]);
  const [budgetrows, setBudgetRows] = useState([]);
  const [isBudgetModalOpen, setIsBudgetModalOpen] = useState(false);
  const [newBudgetItem, setNewBudgetItem] = useState({
    category: "",
    budget_amount: "",
    spent: "0"
  });

  useEffect(() => {
    fetch("http://127.0.0.1:8000/showexpenses")
      .then((response) => response.json())
      .then((result) => setExpenses(result));

    fetch("http://127.0.0.1:8000/showincomes")
      .then((response) => response.json())
      .then((result) => setIncomes(result));

    fetch("http://127.0.0.1:8000/getbudget")
      .then((response) => response.json())
      .then((result) => setBudgetRows(Array.isArray(result) ? result : []));
  }, []);

  const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#A28DFF'];

  const totalBudget = (budgetrows || []).reduce((sum, row) => sum + Number(row.budget_amount ?? 0), 0);
  const totalSpent = (budgetrows || []).reduce((sum, row) => sum + Number(row.spent ?? 0), 0);
  const remaining = totalBudget - totalSpent;

  const handleBudgetInputChange = (event) => {
    const { name, value } = event.target;
    setNewBudgetItem((current) => ({
      ...current,
      [name]: value
    }));
  };

  const handleBudgetSubmit = (event) => {
    event.preventDefault();

    const category = newBudgetItem.category.trim();
    const budgetAmount = Number(newBudgetItem.budget_amount);
    const spentAmount = Number(newBudgetItem.spent || 0);

    if (!category || Number.isNaN(budgetAmount)) {
      return;
    }

    const nextItem = {
      category,
      budget_amount: budgetAmount,
      spent: spentAmount,
      remaining: budgetAmount - spentAmount
    };

    setBudgetRows((currentRows) => [...currentRows, nextItem]);
    setNewBudgetItem({ category: "", budget_amount: "", spent: "0" });
    setIsBudgetModalOpen(false);
  };

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
        <section className="analytics-budget-section">
          <div className="analytics-card budget-card">
            <div className="analytics-card-heading">
              <div className="analytics-card-title-wrap">
                <h2>Budget tracking</h2>
                <button
                  className="budget-add-btn"
                  type="button"
                  aria-label="Add budget item"
                  onClick={() => setIsBudgetModalOpen(true)}
                >
                  +
                </button>
              </div>
              <span className="analytics-card-badge">This month</span>
            </div>

            <div className="budget-summary">
              <div className="budget-summary-item">
                <span className="budget-label">Planned</span>
                <strong>${totalBudget.toLocaleString()}</strong>
              </div>
              <div className="budget-summary-item">
                <span className="budget-label">Spent</span>
                <strong>${totalSpent.toLocaleString()}</strong>
              </div>
              <div className="budget-summary-item">
                <span className="budget-label">Remaining</span>
                <strong className={remaining >= 0 ? "positive" : "negative"}>${remaining.toLocaleString()}</strong>
              </div>
            </div>

            <div className="budget-table-wrapper">
              <table className="budget-table">
                <thead>
                  <tr>
                    <th>Category</th>
                    <th>Budget</th>
                    <th>Spent</th>
                    <th>Remaining</th>
                  </tr>
                </thead>
                <tbody>
                  {budgetrows.map((row) => {
                    const rowRemaining = Number(row.budget_amount ?? 0) - Number(row.spent ?? 0);
                    return (
                      <tr key={`${row.category}-${row.budget_amount}`}>
                        <td>{row.category}</td>
                        <td>${Number(row.budget_amount ?? 0).toLocaleString()}</td>
                        <td>${Number(row.spent ?? 0).toLocaleString()}</td>
                        <td className={rowRemaining >= 0 ? "remaining positive" : "remaining negative"}>
                          ${rowRemaining.toLocaleString()}
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
        </section>

        {isBudgetModalOpen && (
          <div className="budget-modal-overlay" onClick={() => setIsBudgetModalOpen(false)}>
            <div className="budget-modal" onClick={(event) => event.stopPropagation()}>
              <div className="budget-modal-header">
                <h3>Add budget item</h3>
                <button
                  type="button"
                  className="budget-modal-close"
                  aria-label="Close budget modal"
                  onClick={() => setIsBudgetModalOpen(false)}
                >
                  ×
                </button>
              </div>

              <form onSubmit={handleBudgetSubmit} className="budget-modal-form">
                <label>
                  Category
                  <input
                    type="text"
                    name="category"
                    value={newBudgetItem.category}
                    onChange={handleBudgetInputChange}
                    placeholder="e.g. Groceries"
                  />
                </label>

                <label>
                  Budget amount
                  <input
                    type="number"
                    name="budget_amount"
                    min="0"
                    step="0.01"
                    value={newBudgetItem.budget_amount}
                    onChange={handleBudgetInputChange}
                    placeholder="0.00"
                  />
                </label>

                <label>
                  Amount spent
                  <input
                    type="number"
                    name="spent"
                    min="0"
                    step="0.01"
                    value={newBudgetItem.spent}
                    onChange={handleBudgetInputChange}
                    placeholder="0.00"
                  />
                </label>

                <div className="budget-modal-actions">
                  <button type="button" className="budget-modal-cancel" onClick={() => setIsBudgetModalOpen(false)}>
                    Cancel
                  </button>
                  <button type="submit" className="budget-modal-save">
                    Add item
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default Analytics;