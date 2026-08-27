import { BrowserRouter, Routes, Route } from "react-router-dom";
import FinancialInput from "./input.jsx";
import Overview from "./overview.jsx";
import Analytics from "./analytics.jsx";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Overview />} />
        <Route path="/financial-input" element={<FinancialInput />} />
        <Route path="/analytics" element={<Analytics />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;