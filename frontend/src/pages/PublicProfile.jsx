import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import "../styles/PublicProfile.css";

function PublicProfile() {
  const { username } = useParams();
  const [profileData, setProfileData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [currentTheme, setCurrentTheme] = useState(localStorage.getItem("ls_theme") || "minimal");

  // Dynamic production-ready API resolution matching vanilla profile template
  const API = window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1'
    ? 'http://127.0.0.1:8000'
    : window.location.hostname.includes('onrender.com')
      ? window.location.hostname.replace('frontend', 'backend').replace(/^/, `${window.location.protocol}//`)
      : 'https://linksutra-backend.onrender.com';

  const ICON_MAP = {
    youtube: "▶️",
    instagram: "📸",
    twitter: "🐦",
    x: "🐦",
    github: "💻",
    linkedin: "💼",
    portfolio: "🌐",
    website: "🌐",
    spotify: "🎵",
    discord: "💬",
    telegram: "✈️",
    whatsapp: "💬",
    facebook: "📘",
    tiktok: "🎵",
    twitch: "🎮",
    default: "🔗",
  };

  const getIcon = (title, url) => {
    const key = (title + url).toLowerCase();
    for (const [k, v] of Object.entries(ICON_MAP)) {
      if (key.includes(k)) return v;
    }
    return ICON_MAP.default;
  };

  const cleanUrl = (url) => {
    return url.replace(/^https?:\/\/(www\.)?/, "").split("/")[0];
  };

  const trackClick = async (linkId, url) => {
    try {
      await fetch(`${API}/links/${linkId}/click`);
    } catch (_) {}
    window.open(url, "_blank", "noopener,noreferrer");
  };

  const setTheme = (t) => {
    setCurrentTheme(t);
    document.documentElement.setAttribute("data-theme", t === "minimal" ? "" : t);
    localStorage.setItem("ls_theme", t);
  };

  useEffect(() => {
    document.documentElement.setAttribute("data-theme", currentTheme === "minimal" ? "" : currentTheme);
  }, [currentTheme]);

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        setLoading(true);
        const res = await fetch(`${API}/links/profile/${username}`);
        if (res.status === 404) {
          setError("Profile not found");
          setProfileData(null);
          return;
        }
        if (!res.ok) throw new Error("Server error");
        const data = await res.json();
        setProfileData(data);
        document.title = `${data.display_name || data.username} — LinkSutra`;
        setError(null);
      } catch (err) {
        setError("Could not load profile. Make sure the backend is running.");
        setProfileData(null);
      } finally {
        setLoading(false);
      }
    };

    if (username) {
      fetchProfile();
    }
  }, [username, API]);

  const THEMES = ["minimal", "dark", "colorful"];

  if (error && !profileData) {
    return (
      <div className="profile-page-view">
        <div className="theme-bar">
          {THEMES.map((t) => (
            <button
              key={t}
              className={`theme-btn ${t === currentTheme ? "active" : ""}`}
              data-t={t}
              onClick={() => setTheme(t)}
            ></button>
          ))}
        </div>
        <div className="not-found-card glass-panel">
          <h1>404</h1>
          <p>@{username} — profile not found.</p>
        </div>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="profile-page-view">
        <div className="theme-bar">
          {THEMES.map((t) => (
            <button
              key={t}
              className={`theme-btn ${t === currentTheme ? "active" : ""}`}
              data-t={t}
              onClick={() => setTheme(t)}
            ></button>
          ))}
        </div>
        <div className="profile-header">
          <div className="skeleton skeleton-avatar"></div>
          <div className="skeleton skeleton-line" style={{ width: "140px" }}></div>
          <div className="skeleton skeleton-line" style={{ width: "80px", height: "10px" }}></div>
          <div className="skeleton skeleton-line" style={{ width: "220px", height: "10px", marginTop: "14px" }}></div>
        </div>
        <div className="skeleton-socials-row">
          {[1, 2, 3, 4].map((i) => (
            <div key={i} className="skeleton skeleton-circle"></div>
          ))}
        </div>
        <div className="links-list">
          {[1, 2, 3].map((i) => (
            <div key={i} className="skeleton skeleton-link-card"></div>
          ))}
        </div>
      </div>
    );
  }

  if (!profileData) {
    return (
      <div className="profile-page-view">
        <div className="theme-bar">
          {THEMES.map((t) => (
            <button
              key={t}
              className={`theme-btn ${t === currentTheme ? "active" : ""}`}
              data-t={t}
              onClick={() => setTheme(t)}
            ></button>
          ))}
        </div>
        <div className="error-card glass-panel">
          <span className="emoji">⚠️</span>Could not load profile.
          <br />
          Make sure the backend is running.
        </div>
      </div>
    );
  }

  const socialLinks = profileData.social_links || [];
  const actionButtons = profileData.action_buttons || [];
  const links = profileData.links || [];

  const initials = (profileData.display_name || profileData.username)[0].toUpperCase();

  return (
    <div className="profile-page-view">
      <div className="theme-bar">
        {THEMES.map((t) => (
          <button
            key={t}
            className={`theme-btn ${t === currentTheme ? "active" : ""}`}
            data-t={t}
            onClick={() => setTheme(t)}
          ></button>
        ))}
      </div>

      <div className="profile-header">
        <div className="avatar-wrap">
          {profileData.avatar_url ? (
            <img className="avatar" src={profileData.avatar_url} alt={profileData.display_name} />
          ) : (
            <div className="avatar-placeholder">{initials}</div>
          )}
        </div>
        <h1 className="display-name">{profileData.display_name || profileData.username}</h1>
        <p className="username-tag">@{profileData.username}</p>
        {profileData.bio && <p className="bio">{profileData.bio}</p>}

        {socialLinks.length > 0 && (
          <div className="social-icons">
            {socialLinks.map((link) => (
              <a
                key={link.id}
                className="social-icon-btn"
                href={link.url}
                target="_blank"
                rel="noopener noreferrer"
                title={link.title}
              >
                {getIcon(link.title, link.url)}
              </a>
            ))}
          </div>
        )}
      </div>

      {actionButtons.length > 0 && (
        <div className="action-buttons">
          {actionButtons.map((btn) => (
            <a
              key={btn.id}
              className="action-btn"
              href={btn.url}
              target="_blank"
              rel="noopener noreferrer"
            >
              <div className="action-btn-icon">{getIcon(btn.title, btn.url)}</div>
              <div className="action-btn-text">{btn.title}</div>
            </a>
          ))}
        </div>
      )}

      <div className="divider"></div>

      <div className="links-list">
        {links.length > 0 ? (
          links.map((link) => (
            <div
              key={link.id}
              className="link-item-card"
              onClick={() => trackClick(link.id, link.url)}
            >
              <div className="link-left">
                <div className="link-icon-circle">{getIcon(link.title, link.url)}</div>
                <div className="link-details">
                  <div className="link-title-text">{link.title}</div>
                  <div className="link-url-text">{cleanUrl(link.url)}</div>
                </div>
              </div>
              <span className="link-arrow">→</span>
            </div>
          ))
        ) : (
          <div className="empty-links-card glass-panel">
            <span className="emoji">🔗</span>No links added yet.
          </div>
        )}
      </div>

      <div className="profile-footer">
        <Link to="/" title="Powered by LinkSutra">
          <span className="footer-dot"></span>
          LinkSutra
          <span className="footer-dot"></span>
        </Link>
      </div>
    </div>
  );
}

export default PublicProfile;
