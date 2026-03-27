import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { getCurrentUser, getUserLinks, createLink, updateLink, deleteLink } from "../api/auth";
import { useToast } from "../components/ToastNotification";
import { useModal } from "../components/Modal";
import "../styles/Dashboard.css";

function Dashboard({ setToken }) {
  const navigate = useNavigate();
  const { showSuccess, showError, showWarning } = useToast();
  const { showConfirmModal } = useModal();
  const [user, setUser] = useState(null);
  const [links, setLinks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [showAddForm, setShowAddForm] = useState(false);
  const [newTitle, setNewTitle] = useState("");
  const [newUrl, setNewUrl] = useState("");
  const [newIcon, setNewIcon] = useState("🔗");
  const [editingId, setEditingId] = useState(null);
  const [editTitle, setEditTitle] = useState("");
  const [editUrl, setEditUrl] = useState("");
  const [editIcon, setEditIcon] = useState("");

  // Emoji options for links
  const emojiOptions = ["🔗", "🌐", "📧", "📱", "💼", "🎯", "🚀", "⭐", "📊", "🎨", "💻", "📝"];

  // Fetch user data and links on component mount
  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      navigate("/login");
      return;
    }

    async function fetchData() {
      try {
        const userData = await getCurrentUser(token);
        setUser(userData);

        const linksData = await getUserLinks(token);
        setLinks(linksData);
      } catch (err) {
        setError(err.message);
        // Error already captured in error state
      } finally {
        setLoading(false);
      }
    }

    fetchData();
  }, [navigate]);

  // Handle adding a new link
  async function handleAddLink(title, url, icon) {
    const token = localStorage.getItem("token");
    if (!token) {
      showError("Session expired. Please login again.");
      navigate("/login");
      return;
    }

    try {
      const newLink = await createLink(token, title, url, icon);
      setLinks([...links, newLink]);
      setNewTitle("");
      setNewUrl("");
      setNewIcon("🔗");
      setShowAddForm(false);
      showSuccess("Link added successfully!");
    } catch (err) {
      showError("Error adding link: " + err.message);
    }
  }

  function handleAddFormOpenClick() {
    setShowAddForm(true);
  }

  function handleAddFormCloseClick() {
    setShowAddForm(false);
    setNewTitle("");
    setNewUrl("");
    setNewIcon("🔗");
  }

  function handleAddFormSubmit() {
    if (!newTitle.trim() || !newUrl.trim()) {
      showWarning("Please enter both title and URL");
      return;
    }
    handleAddLink(newTitle, newUrl, newIcon);
  }

  // Handle deleting a link
  async function handleDeleteLink(linkId) {
    const token = localStorage.getItem("token");
    if (!token) {
      showError("Session expired. Please login again.");
      navigate("/login");
      return;
    }

    try {
      await deleteLink(token, linkId);

      const updatedLinks = links.filter(link => link.id !== linkId);
      setLinks(updatedLinks);
      showSuccess("Link deleted successfully!");
    } catch (err) {
      showError("Error deleting link: " + err.message);
    }
  }

  // Handle editing a link
  async function handleEditLink(linkId, title, url, icon) {
    const token = localStorage.getItem("token");
    if (!token) {
      showError("Session expired. Please login again.");
      navigate("/login");
      return;
    }

    try {
      const updatedLink = await updateLink(token, linkId, { title, url, icon });
      setLinks(links.map(link => link.id === linkId ? updatedLink : link));
      setEditingId(null);
      setEditTitle("");
      setEditUrl("");
      setEditIcon("");
      showSuccess("Link updated successfully!");
    } catch (err) {
      showError("Error updating link: " + err.message);
    }
  }

  // Handle toggling link active status
  async function handleToggleLink(linkId, currentStatus) {
    const token = localStorage.getItem("token");
    if (!token) {
      showError("Session expired. Please login again.");
      navigate("/login");
      return;
    }

    try {
      const updatedLink = await updateLink(token, linkId, { is_active: !currentStatus });
      setLinks(links.map(link => link.id === linkId ? updatedLink : link));
    } catch (err) {
      showError("Error updating link: " + err.message);
    }
  }

  function handleEditClick(linkId, title, url, icon) {
    setEditingId(linkId);
    setEditTitle(title);
    setEditUrl(url);
    setEditIcon(icon || "🔗");
  }

  function handleSaveEdit(linkId) {
    if (!editTitle.trim() || !editUrl.trim()) {
      showWarning("Please enter both title and URL");
      return;
    }
    handleEditLink(linkId, editTitle, editUrl, editIcon);
  }

  function handleCancelEdit() {
    setEditingId(null);
    setEditTitle("");
    setEditUrl("");
    setEditIcon("");
  }

  async function handleDeleteClick(linkId) {
    const confirmed = await showConfirmModal({
      title: "Delete Link",
      message: "Are you sure you want to delete this link? This action cannot be undone.",
      confirmText: "Delete",
      cancelText: "Cancel",
      confirmButtonType: "danger"
    });

    if (confirmed) {
      handleDeleteLink(linkId);
    }
  }

  function handleCopyPublicURL() {
  if (user) {
    // React route nahi, actual static file ka URL
    const publicURL = `${window.location.origin}/profile.html?u=${user.username}`;
    navigator.clipboard.writeText(publicURL);
    showSuccess("Public URL copied to clipboard!");
  }
}


  function handleExportHTML() {
    if (!user) return;

    const activeLinks = links.filter(link => link.is_active);
    const htmlTemplate = `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>${user.display_name || user.username} - Links</title>
</head>
<body>
    <div class="container">
        <div class="avatar">
            ${user.avatar_url ? `<img src="${user.avatar_url}" alt="Avatar">` : '👤'}
        </div>
        <h1 class="name">${user.display_name || user.username}</h1>
        <p class="bio">${user.bio || 'Welcome to my links'}</p>
        <div class="links">
            ${activeLinks.map(link => `
                <a href="${link.url}" target="_blank" class="link">
                    <span class="link-icon">${link.icon || '🔗'}</span>
                    <span>${link.title}</span>
                </a>
            `).join('')}
        </div>
        <p class="powered-by">Powered by <a href="https://linksutra.dev" target="_blank">LinkSutra</a></p>
    </div>
</body>
</html>`;

    const blob = new Blob([htmlTemplate], { type: 'text/html' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${user.username || 'profile'}_links.html`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);

    showSuccess("HTML file exported successfully!");
  }

  function handleExportJSON() {
    if (!user) return;

    const activeLinks = links.filter(link => link.is_active);
    const jsonData = {
      user: {
        username: user.username,
        display_name: user.display_name,
        bio: user.bio,
        avatar_url: user.avatar_url
      },
      links: activeLinks,
      exported_at: new Date().toISOString()
    };

    const blob = new Blob([JSON.stringify(jsonData, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${user.username || 'profile'}_links.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);

    showSuccess("JSON file exported successfully!");
  }

  function handleLogout() {
    localStorage.removeItem("token");
    setToken(null);
    navigate("/");
  }

  if (loading) {
    return (
      <div className="dashboard-container">
        <div className="loading">Loading dashboard...</div>
      </div>
    );
  }

  return (
    <div className="dashboard-container">
      {/* Sidebar */}
      <aside className="sidebar">
        <div className="logo">LinkSutra</div>
        <nav className="sidebar-nav">
          <div className="nav-item active" onClick={() => navigate('/dashboard')}>
            <span className="nav-icon">🔗</span>
            Links
          </div>
          <div className="nav-item" onClick={() => navigate('/analytics')}>
            <span className="nav-icon">📊</span>
            Analytics
          </div>
          <div className="nav-item" onClick={() => navigate('/settings')}>
            <span className="nav-icon">⚙️</span>
            Settings
          </div>
          <div className="nav-item">
            <span className="nav-icon">❓</span>
            Support
          </div>
        </nav>

        <div className="sidebar-bottom">
          <button className="export-btn" onClick={handleExportHTML}>
            <span>📤</span> Export HTML
          </button>
          <button className="export-btn" onClick={handleExportJSON}>
            <span>📥</span> Export JSON
          </button>
          <button className="logout-btn" onClick={handleLogout}>
            <span>🚪</span> Logout
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="main-content">
        <div className="content-header">
          <div className="header-left">
            <span className="workspace-label">WORKSPACE</span>
            <h1 className="page-title">Manage Links</h1>
          </div>
          <div className="header-right">
            <button className="copy-url-btn" onClick={handleCopyPublicURL}>
              📋 Copy Public URL
            </button>
            <button className="add-link-btn" onClick={handleAddFormOpenClick}>
              + Add link
            </button>
          </div>
        </div>

        {/* Add Link Form */}
        {showAddForm && (
          <div className="add-form">
            <h3>Add New Link</h3>
            <div className="form-row">
              <div className="icon-selector">
                <label>Icon:</label>
                <select
                  value={newIcon}
                  onChange={(e) => setNewIcon(e.target.value)}
                  className="icon-select"
                >
                  {emojiOptions.map(emoji => (
                    <option key={emoji} value={emoji}>{emoji}</option>
                  ))}
                </select>
              </div>
              <input
                type="text"
                placeholder="Link Title (e.g., My Portfolio)"
                value={newTitle}
                onChange={(e) => setNewTitle(e.target.value)}
                className="form-input"
              />
            </div>
            <input
              type="text"
              placeholder="Link URL (e.g., https://portfolio.dev)"
              value={newUrl}
              onChange={(e) => setNewUrl(e.target.value)}
              className="form-input"
            />
            <div className="form-actions">
              <button className="btn-save" onClick={handleAddFormSubmit}>
                Add
              </button>
              <button className="btn-cancel" onClick={handleAddFormCloseClick}>
                Cancel
              </button>
            </div>
          </div>
        )}

        <div className="content-body">
          <div className="links-section">
            <div className="links-list">
              {links.length === 0 ? (
                <div className="empty-state">
                  <p>No links added yet. Click "+ Add link" to create your first link!</p>
                </div>
              ) : (
                links.map((link) => (
                  editingId === link.id ? (
                    // Edit Mode
                    <div key={link.id} className="link-item editing">
                      <div className="link-content">
                        <div className="icon-selector">
                          <select
                            value={editIcon}
                            onChange={(e) => setEditIcon(e.target.value)}
                            className="icon-select small"
                          >
                            {emojiOptions.map(emoji => (
                              <option key={emoji} value={emoji}>{emoji}</option>
                            ))}
                          </select>
                        </div>
                        <div className="link-inputs">
                          <input
                            type="text"
                            value={editTitle}
                            onChange={(e) => setEditTitle(e.target.value)}
                            placeholder="Title"
                            className="edit-input"
                          />
                          <input
                            type="text"
                            value={editUrl}
                            onChange={(e) => setEditUrl(e.target.value)}
                            placeholder="URL"
                            className="edit-input"
                          />
                        </div>
                      </div>
                      <div className="link-actions">
                        <button className="btn-save small" onClick={() => handleSaveEdit(link.id)}>
                          ✓
                        </button>
                        <button className="btn-cancel small" onClick={handleCancelEdit}>
                          ✕
                        </button>
                      </div>
                    </div>
                  ) : (
                    // View Mode
                    <div key={link.id} className="link-item">
                      <div className="link-content">
                        <div className="link-icon">
                          {link.icon || "🔗"}
                        </div>
                        <div className="link-info">
                          <h3 className="link-title">{link.title}</h3>
                          <p className="link-url">{link.url}</p>
                        </div>
                      </div>
                      <div className="link-controls">
                        <label className="toggle-switch">
                          <input
                            type="checkbox"
                            checked={link.is_active || false}
                            onChange={() => handleToggleLink(link.id, link.is_active)}
                          />
                          <span className="slider"></span>
                        </label>
                        <button
                          className="btn-edit"
                          onClick={() => handleEditClick(link.id, link.title, link.url, link.icon)}
                        >
                          ✏️
                        </button>
                        <button
                          className="btn-delete"
                          onClick={() => handleDeleteClick(link.id)}
                        >
                          🗑️
                        </button>
                      </div>
                    </div>
                  )
                ))
              )}
            </div>
          </div>

          {/* Live Preview */}
          <div className="preview-section">
            <h2 className="preview-title">Live Preview</h2>
            <div className="phone-mockup">
              <div className="phone-screen">
                <div className="profile-preview">
                  <div className="profile-avatar">
                    <img
                      src={user?.avatar_url || "https://via.placeholder.com/80"}
                      alt="Profile"
                    />
                  </div>
                  <h3 className="profile-name">
                    {user?.display_name || user?.username || "Alex Rivieras"}
                  </h3>
                  <p className="profile-role">
                    {user?.bio || "FULL-STACK DEVELOPER"}
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

export default Dashboard;