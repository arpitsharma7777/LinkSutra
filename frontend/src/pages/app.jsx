import { useState, lazy, Suspense } from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import { ToastProvider } from "../components/ToastNotification";
import { ModalProvider } from "../components/Modal";

// Lazy load route components for better performance
const Login = lazy(() => import("./Login"));
const Dashboard = lazy(() => import("./Dashboard"));
const Landing = lazy(() => import("./Landing"));
const Analytics = lazy(() => import("./analytics"));
const PublicProfile = lazy(() => import("./PublicProfile"));
const Settings = lazy(() => import("./Settings"));

// Loading fallback component
const LoadingFallback = () => (
  <div style={{
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    minHeight: '100vh',
    fontSize: '18px',
    color: '#666'
  }}>
    <div>Loading...</div>
  </div>
);

function App() {
  const [token, setToken] = useState(localStorage.getItem("token"));

  return (
    <ToastProvider>
      <ModalProvider>
        <Suspense fallback={<LoadingFallback />}>
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
        </Suspense>
      </ModalProvider>
    </ToastProvider>
  );
}

export default App;