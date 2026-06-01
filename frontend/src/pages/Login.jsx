import React, { useState, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import { loginUser, registerUser } from "../api/auth";
import "../styles/login.css";

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

  // Claim username pre-fill logic
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const claim = params.get("claim");
    if (claim) {
      setRegName(claim.toLowerCase().replace(/[^a-z0-9_-]/g, ''));
      setIsLogin(false); // Auto toggle to signup
    }
  }, []);

  async function handleLogin(e) {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      const data = await loginUser(loginEmail, loginPassword);
      localStorage.setItem("token", data.access_token);
      localStorage.setItem("username", data.username || loginEmail.split('@')[0]);
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

    // Client-side validations matching backend constraints
    if (regName.length < 3 || regName.length > 50) {
      setError("Username must be between 3 and 50 characters");
      return;
    }

    const usernameRegex = /^[a-zA-Z0-9_-]+$/;
    if (!usernameRegex.test(regName)) {
      setError("Username can only contain alphanumeric characters, hyphens, and underscores");
      return;
    }

    if (regPassword.length < 8) {
      setError("Password must be at least 8 characters long");
      return;
    }

    setLoading(true);
    try {
      await registerUser(regName, regEmail, regPassword, regName);
      // Auto-login after successful registration
      const data = await loginUser(regEmail, regPassword);
      localStorage.setItem("token", data.access_token);
      localStorage.setItem("username", regName);
      setToken(data.access_token);
      navigate("/dashboard");
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="split-auth-container">
      {/* Left Side: Dynamic Forms */}
      <div className="auth-form-side">
        <div className="auth-form-header">
          <Link to="/" className="auth-logo">
            LinkSutra<span className="logo-dot">.</span>
          </Link>
        </div>

        <div className="auth-form-content">
          {isLogin ? (
            <div className="auth-form-wrapper">
              <h1 className="auth-title">Welcome back</h1>
              <p className="auth-subtitle">Log in to your LinkSutra</p>

              {error && <div className="auth-error-message">{error}</div>}

              <form onSubmit={handleLogin} className="auth-actual-form">
                <div className="auth-input-field-group">
                  <input
                    type="text"
                    placeholder="Email or username"
                    value={loginEmail}
                    onChange={(e) => setLoginEmail(e.target.value)}
                    className="auth-field-input"
                    required
                    disabled={loading}
                  />
                </div>

                <div className="auth-input-field-group">
                  <input
                    type="password"
                    placeholder="Password"
                    value={loginPassword}
                    onChange={(e) => setLoginPassword(e.target.value)}
                    className="auth-field-input"
                    required
                    disabled={loading}
                  />
                </div>

                <button type="submit" className="btn-auth-continue" disabled={loading}>
                  {loading ? "Logging in..." : "Continue"}
                </button>
              </form>

              <div className="auth-forgot-row">
                <span className="forgot-link">Forgot password?</span>
                <span className="forgot-dot">•</span>
                <span className="forgot-link">Forgot username?</span>
              </div>

              <p className="auth-switch-prompt">
                Don't have an account?{" "}
                <span className="auth-switch-link" onClick={() => { setIsLogin(false); setError(""); }}>
                  Sign up
                </span>
              </p>
            </div>
          ) : (
            <div className="auth-form-wrapper">
              <h1 className="auth-title">Join LinkSutra</h1>
              <p className="auth-subtitle">Sign up for free!</p>

              {error && <div className="auth-error-message">{error}</div>}

              <form onSubmit={handleRegister} className="auth-actual-form">
                <div className="username-input-wrapper">
                  <span className="username-prefix">linksutra.app/</span>
                  <input
                    type="text"
                    placeholder="username"
                    value={regName}
                    onChange={(e) => setRegName(e.target.value.toLowerCase().replace(/[^a-z0-9_-]/g, ''))}
                    className="auth-field-input-username"
                    required
                    disabled={loading}
                  />
                </div>

                <div className="auth-input-field-group">
                  <input
                    type="email"
                    placeholder="Email"
                    value={regEmail}
                    onChange={(e) => setRegEmail(e.target.value)}
                    className="auth-field-input"
                    required
                    disabled={loading}
                  />
                </div>

                <div className="auth-input-field-group">
                  <input
                    type="password"
                    placeholder="Password"
                    value={regPassword}
                    onChange={(e) => setRegPassword(e.target.value)}
                    className="auth-field-input"
                    required
                    disabled={loading}
                  />
                </div>

                <button type="submit" className="btn-auth-continue" disabled={loading}>
                  {loading ? "Creating account..." : "Create account"}
                </button>
              </form>

              <p className="auth-switch-prompt">
                Already have an account?{" "}
                <span className="auth-switch-link" onClick={() => { setIsLogin(true); setError(""); }}>
                  Log in
                </span>
              </p>
            </div>
          )}
        </div>

        <div className="auth-form-footer">
          <span>Cookie preferences</span>
        </div>
      </div>

      {/* Right Side: Animated Mockup Graphics */}
      <div className={`auth-illustration-side ${isLogin ? "login-bg" : "signup-bg"}`}>
        {isLogin ? (
          /* Login View: Blue backdrop, shoes product layout, vlogs card, socials, profile preview */
          <div className="illustration-wrapper">
            {/* Sneaker Card */}
            <div className="ill-card ill-product-card float-anim-1">
              <div className="product-icon">👟</div>
              <div className="product-details">
                <div className="p-title">Salt & Stone</div>
                <div className="p-price">$36</div>
              </div>
            </div>

            {/* Video Player Card */}
            <div className="ill-card ill-video-card float-anim-2">
              <div className="video-thumbnail">
                <div className="video-play-btn">▶</div>
              </div>
              <div className="video-title">Beach sunset vibes 🌊</div>
            </div>

            {/* Profile Mock Phone Card */}
            <div className="ill-card ill-phone-card float-anim-3">
              <div className="ill-avatar">👩</div>
              <h3>Sarah Jenkins</h3>
              <p>Vlogger & Artist</p>
              <div className="ill-links">
                <div className="ill-pill">🎥 Latest Travel Vlog</div>
                <div className="ill-pill">🎵 My Spotify Playlist</div>
              </div>
            </div>

            {/* Social icons row */}
            <div className="ill-socials float-anim-1">
              <span className="social-icon-circle bg-insta">📸</span>
              <span className="social-icon-circle bg-yt">▶</span>
              <span className="social-icon-circle bg-spotify">🎵</span>
            </div>
          </div>
        ) : (
          /* Signup View: Golden mustard backdrop, shapeshft3rs, Nikole Brake, circular social icons */
          <div className="illustration-wrapper">
            {/* Shapesht3rs custom pill box */}
            <div className="ill-card ill-purple-card float-anim-1">
              <div className="purple-avatar">👩</div>
              <div className="purple-user">
                <span className="asterisk">✳</span>
                <span className="username">/shapeshft3rs</span>
              </div>
            </div>

            {/* Nikole Brake bio card layout */}
            <div className="ill-card ill-mustard-card float-anim-2">
              <div className="ill-avatar avatar-mustard">👩🏾</div>
              <h3>Nikole Brake</h3>
              <p>Founder of Shape Shifters</p>
              <div className="mustard-links">
                <div className="mustard-pill">Slow flow</div>
                <div className="mustard-pill">Online courses</div>
                <div className="mustard-pill">Wellness retreats</div>
              </div>
            </div>

            {/* Social icons row */}
            <div className="ill-socials float-anim-3">
              <span className="social-icon-circle bg-twitter">🐦</span>
              <span className="social-icon-circle bg-yt">▶</span>
              <span className="social-icon-circle bg-tiktok">🎵</span>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
