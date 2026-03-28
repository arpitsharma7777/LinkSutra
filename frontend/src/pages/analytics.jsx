import React, { useState, useEffect } from 'react';
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
  const [copied, setCopied] = useState(false);  // ← ADD

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

  function handleLogout() {
    localStorage.removeItem("token");
    setToken(null);
    navigate("/");
  }

  // ── COPY FUNCTION ──────────────────────────────  ← ADD
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
          backgroundColor: '#f77504',
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

        {/* ── HEADER WITH COPY BUTTON ── */}
        <header className="analytics-header">
          <h1 className="page-title">Analytics</h1>
          <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
            <div className="time-filter">LAST 7 DAYS</div>
            <button
              onClick={copyAnalyticsSummary}
              disabled={loading}
              style={{
                background: copied ? "#EAF3DE" : "#3C3489",
                color: copied ? "#27500A" : "#EEEDFE",
                border: "none",
                borderRadius: "8px",
                padding: "8px 16px",
                fontSize: "12px",
                fontWeight: "500",
                cursor: loading ? "not-allowed" : "pointer",
                opacity: loading ? 0.6 : 1,
                transition: "all 0.2s"
              }}
            >
              {copied ? "✓ Copied!" : "Copy Summary"}
            </button>
          </div>
        </header>

        {/* Top Metrics Row */}
        <section className="metrics-row">
          <div className="metric-card">
            <span className="metric-value">{loading ? '...' : totalClicks.toLocaleString()}</span>
            <span className="metric-change">TOTAL CLICKS</span>
          </div>
          <div className="metric-card">
            <span className="metric-value">{loading ? '...' : Math.ceil(totalClicks * 0.5)}</span>
            <span className="metric-change">UNIQUE VISITORS</span>
          </div>
          <div className="metric-card">
            <span className="metric-value">{loading ? '...' : topLink?.title || 'N/A'}</span>
            <span className="metric-change">TOP LINKS</span>
          </div>
          <div className="metric-card">
            <span className="metric-value">{loading ? '...' : avgPerDay}</span>
            <span className="metric-change">AVG PER DAY</span>
          </div>
        </section>

        {/* Graph Section */}
        <section className="graph-section">
          <div className="graph-header">
            <h2>Traffic Momentum</h2>
          </div>
          <div className="graph-placeholder">
            <div className="wave-line"></div>
          </div>
          <div className="graph-labels">
            <span>MON</span><span>TUE</span><span>WED</span><span>THU</span><span>FRI</span><span>SAT</span><span>SUN</span>
          </div>
        </section>

        {/* Top Performing Destinations */}
        <section className="destinations-section">
          <h2>Top Performing Destinations</h2>
          {loading ? (
            <p>Loading...</p>
          ) : linkAnalytics && linkAnalytics.length > 0 ? (
            linkAnalytics.slice(0, 5).map((link) => {
              const maxClicks = linkAnalytics[0]?.click_count || 1;
              const percentage = Math.round((link.click_count / maxClicks) * 100);
              return (
                <div key={link.link_id} className="dest-item">
                  <div className="dest-info">
                    <span title={link.url}>{link.title || link.url}</span>
                    <span>{link.click_count} Clicks</span>
                  </div>
                  <div className="progress-bar">
                    <div className="progress" style={{ width: `${percentage}%` }}></div>
                  </div>
                </div>
              );
            })
          ) : (
            <p>No data available yet.</p>
          )}
        </section>

      </main>
    </div>
  );
};

export default Analytics;