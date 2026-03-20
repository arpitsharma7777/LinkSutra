import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { loginUser, registerUser } from "../api/auth";
import "../styles/Login.css";

export default function Login({ setToken }) {
  const [isLogin, setIsLogin] = useState(true);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  // Login form state
  const [loginEmail, setLoginEmail] = useState("");
  const [loginPassword, setLoginPassword] = useState("");

  // Register form state
  const [regName, setRegName] = useState("");
  const [regEmail, setRegEmail] = useState("");
  const [regPassword, setRegPassword] = useState("");

  async function handleLogin(e) {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      const data = await loginUser(loginEmail, loginPassword);
      localStorage.setItem("token", data.access_token);
      setToken(data.access_token);
      navigate("/dashboard");
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }

  async function handleRegister(e) {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      await registerUser(regName, regEmail, regPassword, regName);
      // Auto-login after successful registration
      const data = await loginUser(regEmail, regPassword);
      localStorage.setItem("token", data.access_token);
      setToken(data.access_token);
      navigate("/dashboard");
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="container">
      <h1 className="title">Welcome to LinkSutra</h1>
      <div className="form-container">
        <div className="form-toggle">
          <button className={isLogin ? "active" : ""} onClick={() => { setIsLogin(true); setError(""); }}>Login</button>
          <button className={!isLogin ? "active" : ""} onClick={() => { setIsLogin(false); setError(""); }}>Sign-Up</button>
        </div>

        {error && <p style={{ color: "red", textAlign: "center", margin: "8px 0" }}>{error}</p>}

        {isLogin ? (
          <form className="form" onSubmit={handleLogin}>
            <h2>Login</h2>
            <input type="email" placeholder="Email" value={loginEmail} onChange={(e) => setLoginEmail(e.target.value)} required />
            <input type="password" placeholder="Password" value={loginPassword} onChange={(e) => setLoginPassword(e.target.value)} required />
            <a href="#">Forgot Password?</a>
            <button type="submit" disabled={loading}>{loading ? "Logging in..." : "Login"}</button>
            <p>Don't have an account? <a href="#" onClick={() => { setIsLogin(false); setError(""); }}>Sign Up</a></p>
          </form>
        ) : (
          <form className="form" onSubmit={handleRegister}>
            <h2>Sign Up</h2>
            <input type="text" placeholder="Username" value={regName} onChange={(e) => setRegName(e.target.value)} required />
            <input type="email" placeholder="Email" value={regEmail} onChange={(e) => setRegEmail(e.target.value)} required />
            <input type="password" placeholder="Password" value={regPassword} onChange={(e) => setRegPassword(e.target.value)} required />
            <button type="submit" disabled={loading}>{loading ? "Signing up..." : "Sign Up"}</button>
          </form>
        )}
      </div>
    </div>
  );
}
