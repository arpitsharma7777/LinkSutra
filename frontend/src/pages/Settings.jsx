import React, { useState, useEffect, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { getCurrentUser, updateUserProfile, getUserLinks } from "../api/auth";
import "../styles/Settings.css";

function Settings({ setToken }) {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(false);

  const [displayName, setDisplayName] = useState("");
  const [bio, setBio] = useState("");
  const [avatarUrl, setAvatarUrl] = useState("");
  const [avatarPreview, setAvatarPreview] = useState("");
  const [username, setUsername] = useState("");
  const [links, setLinks] = useState([]);
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const token = localStorage.getItem("token");
        if (!token) {
          navigate("/login");
          return;
        }

        const [userData, userLinks] = await Promise.all([
          getCurrentUser(token),
          getUserLinks(token)
        ]);

        setUsername(userData.username || "");
        setDisplayName(userData.display_name || "");
        setBio(userData.bio || "");
        setAvatarUrl(userData.avatar_url || "");
        setAvatarPreview(userData.avatar_url || "");
        setLinks(userLinks || []);
      } catch (err) {
        setError("Failed to load user data");
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchUser();
  }, [navigate]);

  const handleFileUpload = (e) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => {
        const base64 = event.target?.result;
        setAvatarUrl(base64);
        setAvatarPreview(base64);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleUrlChange = (e) => {
    const url = e.target.value;
    setAvatarUrl(url);
    setAvatarPreview(url);
  };

  const handleSave = async (e) => {
    e.preventDefault();
    try {
      setSaving(true);
      setError(null);
      setSuccess(false);

      const token = localStorage.getItem("token");
      if (!token) {
        navigate("/login");
        return;
      }

      const updates = {
        display_name: displayName || undefined,
        bio: bio || undefined,
        avatar_url: avatarUrl || undefined,
      };

      await updateUserProfile(token, updates);
      setSuccess(true);
      setTimeout(() => setSuccess(false), 3000);
    } catch (err) {
      setError(err.message || "Failed to update profile");
    } finally {
      setSaving(false);
    }
  };

  const handleCancel = () => {
    navigate("/dashboard");
  };

  const handleLogout = useCallback(() => {
    localStorage.removeItem("token");
    setToken(null);
    navigate("/");
  }, [setToken, navigate]);

  if (loading) {
    return (
      <div className="settings-container">
        <div className="loading">Loading settings...</div>
      </div>
    );
  }

  return (
    <div className="settings-container">
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
            <div className="nav-item" onClick={() => { navigate("/dashboard"); setMenuOpen(false); }}>
              <span className="nav-icon">🔗</span>
              Links
            </div>
            <div className="nav-item" onClick={() => { navigate("/analytics"); setMenuOpen(false); }}>
              <span className="nav-icon">📊</span>
              Analytics
            </div>
            <div className="nav-item active">
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
      <main className="settings-main">
        <header className="settings-header">
          <div className="header-left">
            <span className="workspace-label">CONFIGURATION</span>
            <h1 className="page-title">Profile Settings</h1>
          </div>
        </header>

        <div className="settings-content-body">
          <div className="settings-form-container glass-panel">
            <form onSubmit={handleSave} className="settings-form">
              {/* Avatar Section */}
              <div className="form-section">
                <h2>Avatar Customization</h2>
                <div className="avatar-section">
                  <div className="avatar-preview">
                    {avatarPreview ? (
                      <img src={avatarPreview} alt="Avatar preview" />
                    ) : (
                      <div className="avatar-placeholder">
                        {displayName ? displayName[0].toUpperCase() : "👤"}
                      </div>
                    )}
                  </div>

                  <div className="avatar-inputs">
                    <div className="form-group">
                      <label htmlFor="avatar-upload" className="upload-label-pill">Upload Image</label>
                      <input
                        id="avatar-upload"
                        type="file"
                        accept="image/*"
                        onChange={handleFileUpload}
                        disabled={saving}
                      />
                    </div>

                    <div className="avatar-divider">OR</div>

                    <div className="form-group">
                      <label htmlFor="avatar-url">Image URL</label>
                      <input
                        id="avatar-url"
                        type="url"
                        placeholder="https://example.com/avatar.jpg"
                        value={avatarUrl}
                        onChange={handleUrlChange}
                        disabled={saving}
                        className="form-input"
                      />
                    </div>
                  </div>
                </div>
              </div>

              {/* Display Name Section */}
              <div className="form-section">
                <h2>Display Name</h2>
                <div className="form-group">
                  <input
                    type="text"
                    placeholder="Your display name"
                    value={displayName}
                    onChange={(e) => setDisplayName(e.target.value)}
                    disabled={saving}
                    maxLength="100"
                    className="form-input"
                  />
                </div>
              </div>

              {/* Bio Section */}
              <div className="form-section">
                <h2>Bio Description</h2>
                <div className="form-group">
                  <textarea
                    placeholder="Tell people about yourself..."
                    value={bio}
                    onChange={(e) => setBio(e.target.value)}
                    disabled={saving}
                    maxLength="500"
                    rows="5"
                    className="form-textarea"
                  />
                  <small className="char-count">{bio.length}/500 characters</small>
                </div>
              </div>

              {/* Messages feedback */}
              {error && <div className="settings-error-banner">{error}</div>}
              {success && <div className="settings-success-banner">Profile updated successfully!</div>}

              {/* Form Actions */}
              <div className="form-buttons">
                <button
                  type="submit"
                  className="btn-save-settings"
                  disabled={saving}
                >
                  {saving ? "Saving..." : "Save Changes"}
                </button>
                <button
                  type="button"
                  className="btn-cancel-settings"
                  onClick={handleCancel}
                  disabled={saving}
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>

          {/* Live Preview */}
          <div className="preview-section">
            <h2 className="preview-title">Live Preview</h2>
            <div className="phone-mockup">
              <div className="phone-screen">
                <div className="profile-preview">
                  <div className="profile-avatar">
                    {avatarPreview ? (
                      <img
                        src={avatarPreview}
                        alt="Profile"
                      />
                    ) : (
                      <div className="avatar-placeholder" style={{ fontSize: '32px', color: '#fff', height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                        {displayName ? displayName[0].toUpperCase() : "👤"}
                      </div>
                    )}
                  </div>
                  <h3 className="profile-name">
                    {displayName || username || "Alex Rivieras"}
                  </h3>
                  <p className="profile-role">
                    {bio || "FULL-STACK DEVELOPER"}
                  </p>
                  <div className="preview-links">
                    {links.filter(link => link.is_active).map(link => (
                      <button key={link.id} className="preview-link-btn">
                        {link.title}
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}

export default Settings;
