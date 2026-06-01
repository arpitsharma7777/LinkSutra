import React from "react";
import { useNavigate, Link } from "react-router-dom";
import "../styles/Landing.css";

function Navbar() {
  const navigate = useNavigate();

  return (
    <nav className="navbar-container">
      <div className="navbar-capsule">
        <div className="navbar-left">
          <Link to="/" className="navbar-logo">
            LinkSutra<span className="logo-dot">.</span>
          </Link>
          <div className="navbar-menu">
            <button className="menu-item">Products</button>
            <button className="menu-item">Templates</button>
            <button className="menu-item">Marketplace</button>
            <button className="menu-item font-normal">Pricing</button>
          </div>
        </div>
        <div className="navbar-actions">
          <button onClick={() => navigate("/login")} className="btn-login-flat">
            Log in
          </button>
          <button onClick={() => navigate("/login")} className="btn-signup-pill">
            Sign up free
          </button>
        </div>
      </div>
    </nav>
  );
}

export default Navbar;