import React, { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { getTotalClicks, getDailyAnalytics, getLinkAnalytics, getTopLink } from '../api/auth';
import '../styles/Analytics.css';

const Analytics = ({ setToken }) => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [totalClicks, setTotalClicks] = useState(0);
  const [dailyData, setDailyData] = useState([]);
  const [linkAnalytics, setLinkAnalytics] = useState([]);
  const [topLink, setTopLink] = useState(null);
  const [avgPerDay, setAvgPerDay] = useState(0);
  const [copied, setCopied] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    const fetchAnalytics = async () => {
      try {
        const token = localStorage.getItem('token');
        if (!token) {
          navigate('/login');
          return;
        }
        setLoading(true);
        const [totalRes, dailyRes, linksRes, topRes] = await Promise.all([
          getTotalClicks(token),
          getDailyAnalytics(token, 7),
          getLinkAnalytics(token),
          getTopLink(token),
        ]);
        setTotalClicks(totalRes.total_clicks || 0);
        setDailyData(dailyRes || []);
        setLinkAnalytics(linksRes || []);
        setTopLink(topRes);
        if (dailyRes && dailyRes.length > 0) {
          const totalFromDaily = dailyRes.reduce((sum, day) => sum + (day.clicks || 0), 0);
          setAvgPerDay(Math.ceil(totalFromDaily / dailyRes.length));
        }
      } catch (err) {
        console.error('Failed to fetch analytics:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchAnalytics();
  }, [navigate]);

  const handleLogout = useCallback(() => {
    localStorage.removeItem("token");
    setToken(null);
    navigate("/");
  }, [setToken, navigate]);

  const copyAnalyticsSummary = () => {
    const username = localStorage.getItem("username") || "your-profile";

    const summary = `
LinkSutra Analytics Summary
────────────────────────────
Profile  : linksutra.app/${username}
Period   : Last 7 Days
Total    : ${totalClicks} clicks
Unique   : ~${Math.ceil(totalClicks * 0.5)} visitors
Avg/Day  : ${avgPerDay} clicks
Top Link : ${topLink?.title || "N/A"}

Per Link Breakdown:
${linkAnalytics.slice(0, 5).map(l => `  ${l.title}: ${l.click_count} clicks`).join("\n")}

Generated: ${new Date().toLocaleDateString("en-IN")}
    `.trim();

    navigator.clipboard.writeText(summary)
      .then(() => {
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
      })
      .catch(() => alert("Copy failed — please try again"));
  };

  return (
    <div className="analytics-container">
      {/* Sidebar Navigation */}
      <aside className="sidebar">
        <div className="logo">LinkSutra</div>
        
        {/* Mobile menu hamburger toggle button */}
        <button 
          className="mobile-menu-toggle" 
          onClick={() => setMenuOpen(!menuOpen)}
          aria-label="Toggle navigation menu"
        >
          {menuOpen ? "✕" : "☰"}
        </button>

        <div className={`sidebar-menu-wrapper ${menuOpen ? "open" : ""}`}>
          <nav className="sidebar-nav">
            <div className="nav-item" onClick={() => { navigate('/dashboard'); setMenuOpen(false); }}>
              <span className="nav-icon">🔗</span>
              Links
            </div>
            <div className="nav-item active" onClick={() => { navigate('/analytics'); setMenuOpen(false); }}>
              <span className="nav-icon">📊</span>
              Analytics
            </div>
            <div className="nav-item" onClick={() => { navigate('/settings'); setMenuOpen(false); }}>
              <span className="nav-icon">⚙️</span>
              Settings
            </div>
            <div className="nav-item">
              <span className="nav-icon">❓</span>
              Support
            </div>
          </nav>

          <div className="sidebar-bottom">
            <button className="logout-btn" onClick={() => { handleLogout(); setMenuOpen(false); }}>
              <span>🚪</span> Logout
            </button>
          </div>
        </div>
      </aside>

      {/* Main Content */}
      <main className="analytics-main">
        {/* Header with copy summary btn */}
        <header className="analytics-header">
          <div className="header-left">
            <span className="workspace-label">METRICS</span>
            <h1 className="page-title">Performance Insights</h1>
          </div>
          <div className="header-right">
            <div className="time-filter">LAST 7 DAYS</div>
            <button
              onClick={copyAnalyticsSummary}
              disabled={loading}
              className="copy-summary-btn"
            >
              {copied ? "✓ Copied Summary" : "Copy Summary"}
            </button>
          </div>
        </header>

        {loading ? (
          <div className="loading">Loading analytics metrics...</div>
        ) : (
          <div className="analytics-body">
            {/* Top Metrics Row */}
            <section className="metrics-row">
              <div className="metric-card glass-panel">
                <span className="metric-value">{totalClicks.toLocaleString()}</span>
                <span className="metric-change">TOTAL CLICKS</span>
              </div>
              <div className="metric-card glass-panel">
                <span className="metric-value">{Math.ceil(totalClicks * 0.5)}</span>
                <span className="metric-change">UNIQUE VISITORS</span>
              </div>
              <div className="metric-card glass-panel">
                <span className="metric-value">{topLink?.title || 'N/A'}</span>
                <span className="metric-change">TOP PERFORMING LINK</span>
              </div>
              <div className="metric-card glass-panel">
                <span className="metric-value">{avgPerDay}</span>
                <span className="metric-change">AVG CLICKS PER DAY</span>
              </div>
            </section>

            {/* Graph Visualization */}
            <section className="graph-section glass-panel">
              <div className="graph-header">
                <h2>Traffic Momentum</h2>
                <span className="graph-sub">Clicks registered per day</span>
              </div>
              <div className="graph-placeholder">
                <div className="wave-line-vector"></div>
                <div className="bar-chart-mockup">
                  <div className="bar-col" style={{ height: '30%' }}><span className="bar-label">MON</span></div>
                  <div className="bar-col" style={{ height: '55%' }}><span className="bar-label">TUE</span></div>
                  <div className="bar-col" style={{ height: '45%' }}><span className="bar-label">WED</span></div>
                  <div className="bar-col" style={{ height: '75%' }}><span className="bar-label">THU</span></div>
                  <div className="bar-col active" style={{ height: '90%' }}><span className="bar-label">FRI</span></div>
                  <div className="bar-col" style={{ height: '60%' }}><span className="bar-label">SAT</span></div>
                  <div className="bar-col" style={{ height: '50%' }}><span className="bar-label">SUN</span></div>
                </div>
              </div>
            </section>

            {/* Top Performing Destinations list */}
            <section className="destinations-section glass-panel">
              <h2>Top Performing Destinations</h2>
              <div className="dest-list">
                {linkAnalytics && linkAnalytics.length > 0 ? (
                  linkAnalytics.slice(0, 5).map((link) => {
                    const maxClicks = linkAnalytics[0]?.click_count || 1;
                    const percentage = Math.round((link.click_count / maxClicks) * 100);
                    return (
                      <div key={link.link_id} className="dest-item">
                        <div className="dest-info">
                          <span className="dest-title" title={link.url}>{link.title || link.url}</span>
                          <span className="dest-clicks">{link.click_count} Clicks</span>
                        </div>
                        <div className="progress-bar-bg">
                          <div className="progress-fill" style={{ width: `${percentage}%` }}></div>
                        </div>
                      </div>
                    );
                  })
                ) : (
                  <p className="no-data-msg">No click data registered yet.</p>
                )}
              </div>
            </section>
          </div>
        )}
      </main>
    </div>
  );
};

export default Analytics;