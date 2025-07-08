import "./App.css";
import Dashboard from "./Components/DashboardLayout";
import Landing from "./Components/Landing";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Landing />} />
        <Route path="/dashbrd" element={<Dashboard />} />
      </Routes>
    </Router>
  );
}

export default App;
