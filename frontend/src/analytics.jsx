import { useNavigate } from "react-router-dom";
function Analytics() {
  const navigate = useNavigate();
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
        <h1>Analytics</h1>
        <p>This is the analytics page.</p>
        <p>pie chart expenses/income</p>
        <p>budget</p>
        <p>Anomaly Detection</p>
        <p>compare</p>
      </div>
    </div>
  );
}

export default Analytics;