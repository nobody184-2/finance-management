import { useEffect, useState } from "react";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer
} from "recharts";
import './App.css';

function App() {
    const [students, setStudents] = useState([]);

    useEffect(() => {
        fetch("http://127.0.0.1:8000/students")
            .then(response => response.json())
            .then(data => {
                setStudents(data);
            });
    }, []);

    const total = students.length;
    const avgGrade = total ? (students.reduce((s, st) => s + (st.grade || 0), 0) / total).toFixed(1) : '—';
    const avgAge = total ? (students.reduce((s, st) => s + (st.age || 0), 0) / total).toFixed(1) : '—';

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
                        <div className="card-value">{total}</div>
                    </div>
                    <div className="card">
                        <div className="card-title">Total Expenses</div>
                        <div className="card-value">{avgGrade}</div>
                    </div>
                    <div className="card">
                        <div className="card-title">Total Balance</div>
                        <div className="card-value">{avgAge}</div>
                    </div>
                </section>

                <section className="chart">
                    <ResponsiveContainer width="100%" height="100%">
                        <LineChart data={students} margin={{ top: 5, right: 30, left: 0, bottom: 5 }}>
                            <CartesianGrid strokeDasharray="3 3" />
                            <XAxis dataKey="age" />
                            <YAxis />
                            <Tooltip />
                            <Line type="monotone" dataKey="grade" stroke="#64636a" activeDot={{ r: 8 }} />
                        </LineChart>
                    </ResponsiveContainer>
                </section>

                <section className="list">
                    <h2>Transactions History</h2>
                    <div className="table-wrapper">
                        {students.length === 0 ? (
                            <p>No transactions yet.</p>
                        ) : (
                            <table className="students-table">
                                <thead>
                                    <tr>
                                        <th>Name</th>
                                        <th>Age</th>
                                        <th>Grade</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {students.map(student => (
                                        <tr key={student.id}>
                                            <td>{student.name}</td>
                                            <td>{student.age}</td>
                                            <td>{student.grade}</td>
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