import { useState } from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import Login from "./Login";
import Dashboard from "./Dashboard";
import Landing from "./Landing";
import Analytics from "./analytics";
import PublicProfile from "./PublicProfile";
import Settings from "./Settings";
import { ToastProvider } from "../components/ToastNotification";
import { ModalProvider } from "../components/Modal";

function App() {
  const [token, setToken] = useState(localStorage.getItem("token"));

  return (
    <ToastProvider>
      <ModalProvider>
        <Routes>
          {/* Landing page as home - no authentication required */}
          <Route path="/" element={<Landing />} />

          {/* Login page */}
          <Route path="/login" element={token ? <Navigate to="/dashboard" /> : <Login setToken={setToken} />} />

          {/* Public profile page - no authentication required */}
          <Route path="/profile.html/:username" element={<PublicProfile />} />

          {/* Protected routes - require authentication */}
          <Route path="/dashboard" element={token ? <Dashboard setToken={setToken} /> : <Navigate to="/login" />} />
          <Route path="/analytics" element={token ? <Analytics setToken={setToken} /> : <Navigate to="/login" />} />
          <Route path="/settings" element={token ? <Settings setToken={setToken} /> : <Navigate to="/login" />} />

          {/* Catch-all route - redirect to home */}
          <Route path="*" element={<Navigate to="/" />} />
        </Routes>
      </ModalProvider>
    </ToastProvider>
  );
}

export default App;