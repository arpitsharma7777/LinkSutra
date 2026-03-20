import { useState } from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import Login from "./Login";
import Dashboard from "./Dashboard";

function App() {
  const [token, setToken] = useState(localStorage.getItem("token"));

  return (
    <Routes>
      <Route path="/" element={token ? <Navigate to="/dashboard" /> : <Login setToken={setToken} />} />
      <Route path="/dashboard" element={token ? <Dashboard setToken={setToken} /> : <Navigate to="/" />} />
    </Routes>
  );
}
export default App;