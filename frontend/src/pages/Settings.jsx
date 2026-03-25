import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { getCurrentUser, updateUserProfile } from "../api/auth";
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

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const token = localStorage.getItem("token");
        if (!token) {
          navigate("/login");
          return;
        }

        const userData = await getCurrentUser(token);
        setDisplayName(userData.display_name || "");
        setBio(userData.bio || "");
        setAvatarUrl(userData.avatar_url || "");
        setAvatarPreview(userData.avatar_url || "");
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

  if (loading) {
    return (
      <div className="settings-container">
        <div className="loading">Loading settings...</div>
      </div>
    );
  }

  return (
    <div className="settings-container">
      {/* Sidebar */}
      <aside className="sidebar">
        <div className="logo">LinkSutra</div>
        <nav className="sidebar-nav">
          <div className="nav-item" onClick={() => navigate("/dashboard")}>
            <span className="nav-icon">🔗</span>
            Links
          </div>
          <div className="nav-item" onClick={() => navigate("/analytics")}>
            <span className="nav-icon">📊</span>
            Analytics
          </div>
          <div className="nav-item active">
            <span className="nav-icon">⚙️</span>
            Settings
          </div>
        </nav>
      </aside>

      {/* Main Content */}
      <main className="settings-main">
        <div className="settings-header">
          <h1>Profile Settings</h1>
          <p>Update your profile information</p>
        </div>

        <div className="settings-form-container">
          <form onSubmit={handleSave} className="settings-form">
            {/* Avatar Section */}
            <div className="form-section">
              <h2>Avatar</h2>
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
                    <label htmlFor="avatar-upload">Upload Image</label>
                    <input
                      id="avatar-upload"
                      type="file"
                      accept="image/*"
                      onChange={handleFileUpload}
                      disabled={saving}
                    />
                  </div>

                  <div className="divider">OR</div>

                  <div className="form-group">
                    <label htmlFor="avatar-url">Image URL</label>
                    <input
                      id="avatar-url"
                      type="url"
                      placeholder="https://example.com/avatar.jpg"
                      value={avatarUrl}
                      onChange={handleUrlChange}
                      disabled={saving}
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
                />
              </div>
            </div>

            {/* Bio Section */}
            <div className="form-section">
              <h2>Bio</h2>
              <div className="form-group">
                <textarea
                  placeholder="Tell people about yourself..."
                  value={bio}
                  onChange={(e) => setBio(e.target.value)}
                  disabled={saving}
                  maxLength="500"
                  rows="5"
                />
                <small>{bio.length}/500 characters</small>
              </div>
            </div>

            {/* Messages */}
            {error && <div className="error-message">{error}</div>}
            {success && <div className="success-message">Profile updated successfully!</div>}

            {/* Buttons */}
            <div className="form-buttons">
              <button
                type="submit"
                className="btn-save"
                disabled={saving}
              >
                {saving ? "Saving..." : "Save Changes"}
              </button>
              <button
                type="button"
                className="btn-cancel"
                onClick={handleCancel}
                disabled={saving}
              >
                Cancel
              </button>
            </div>
          </form>
        </div>
      </main>
    </div>
  );
}

export default Settings;
