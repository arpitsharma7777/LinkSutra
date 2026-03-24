import React from 'react';
import { useNavigate } from 'react-router-dom';
import '../styles/Analytics.css';

const Analytics = ({ setToken }) => {
  const navigate = useNavigate();

  function handleLogout() {
    localStorage.removeItem("token");
    setToken(null);
    navigate("/");
  }

  return (
    <div className="analytics-container">
      {/* Sidebar */}
      <aside className="sidebar">
        <div className="logo">LinkSutra</div>
        <nav>
          <div className="nav-item" onClick={() => navigate('/dashboard')}>Links</div>
          <div className="nav-item active" onClick={() => navigate('/analytics')}>Analytics</div>
          <div className="nav-item">Settings</div>
          <div className="nav-item">Support</div>
        </nav>
        <button className="logout-btn" onClick={handleLogout} style={{
          marginTop: '20px',
          width: '100%',
          padding: '10px',
          backgroundColor: '#ff6b6b',
          color: 'white',
          border: 'none',
          borderRadius: '6px',
          cursor: 'pointer'
        }}>
          LOGOUT
        </button>
      </aside>

      {/* Main Content */}
      <main className="analytics-main">
        <header className="analytics-header">
          <h1 className="page-title">Analytics</h1>
          <div className="time-filter">LAST 7 DAYS</div>
        </header>

        {/* Top Metrics Row */}
        <section className="metrics-row">
          <div className="metric-card">
            <span className="metric-value">2,405</span>
            <span className="metric-change">TOTAL CLICKS</span>
          </div>
          <div className="metric-card divider">
            <span className="metric-value">1,200</span>
            <span className="metric-change">UNIQUE VISITORS</span>
          </div>
          <div className="metric-card divider">
            <span className="metric-value">/github</span>
            <span className="metric-change">TOP LINKS</span>
          </div>
          <div className="metric-card divider">
            <span className="metric-value">342</span>
            <span className="metric-change">AVG PER DAY</span>
          </div>
        </section>

        {/* Graph Section */}
        <section className="graph-section">
          <div className="graph-header">
            <h2>Traffic Momentum</h2>
           
          </div>
          <div className="graph-placeholder">
             {/* This represents the blue wavy line in your image */}
             <div className="wave-line"></div>
          </div>
          <div className="graph-labels">
            <span>MON</span><span>TUE</span><span>WED</span><span>THU</span><span>FRI</span><span>SAT</span><span>SUN</span>
          </div>
        </section>

        {/* Top Performing Destinations */}
        <section className="destinations-section">
          <h2>Top Performing Destinations</h2>
          
          <div className="dest-item">
            <div className="dest-info">
              <span>github.com/linksutra/core</span>
              <span>842 Clicks</span>
            </div>
            <div className="progress-bar"><div className="progress" style={{width: '85%'}}></div></div>
          </div>

          <div className="dest-item">
            <div className="dest-info">
              <span>docs.linksutra.io/quickstart</span>
              <span>612 Clicks</span>
            </div>
            <div className="progress-bar"><div className="progress" style={{width: '65%'}}></div></div>
          </div>

          <div className="dest-item">
            <div className="dest-info">
              <span>gumroad.com/l/linksutra-pro</span>
              <span>405 Clicks</span>
            </div>
            <div className="progress-bar"><div className="progress" style={{width: '45%'}}></div></div>
          </div>
        </section>
      </main>
    </div>
  );
};

export default Analytics;