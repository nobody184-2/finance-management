import { BrowserRouter, Routes, Route } from "react-router-dom";
import FinancialInput from "./input.jsx";
import Overview from "./overview.jsx";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Overview />} />
        <Route path="/financial-input" element={<FinancialInput />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;