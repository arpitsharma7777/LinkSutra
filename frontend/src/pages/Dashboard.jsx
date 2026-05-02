import React, { useState, useEffect, useCallback, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import { getCurrentUser, getUserLinks, createLink, updateLink, deleteLink } from "../api/auth";
import { useToast } from "../components/ToastNotification";
import { useModal } from "../components/Modal";
import { FormProvider, useForm } from "../components/FormContext";
import LinkItem from "../components/LinkItem";
import LinkForm from "../components/LinkForm";
import "../styles/Dashboard.css";

function Dashboard({ setToken }) {
  const navigate = useNavigate();
  const { showSuccess, showError, showWarning } = useToast();
  const { showConfirmModal } = useModal();
  const [user, setUser] = useState(null);
  const [links, setLinks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  // Emoji options memoized to prevent recreation on every render
  const emojiOptions = useMemo(
    () => ["🔗", "🌐", "📧", "📱", "💼", "🎯", "🚀", "⭐", "📊", "🎨", "💻", "📝"],
    []
  );

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
      } finally {
        setLoading(false);
      }
    }

    fetchData();
  }, [navigate]);

  if (loading) {
    return (
      <div className="dashboard-container">
        <div className="loading">Loading dashboard...</div>
      </div>
    );
  }

  return (
    <FormProvider>
      <DashboardContent
        user={user}
        links={links}
        setLinks={setLinks}
        emojiOptions={emojiOptions}
        navigate={navigate}
        showSuccess={showSuccess}
        showError={showError}
        showWarning={showWarning}
        showConfirmModal={showConfirmModal}
        setToken={setToken}
      />
    </FormProvider>
  );
}

function DashboardContent({
  user,
  links,
  setLinks,
  emojiOptions,
  navigate,
  showSuccess,
  showError,
  showWarning,
  showConfirmModal,
  setToken,
}) {
  const {
    showAddForm,
    setShowAddForm,
    newTitle,
    setNewTitle,
    newUrl,
    setNewUrl,
    newIcon,
    setNewIcon,
    editingId,
    setEditingId,
    editTitle,
    setEditTitle,
    editUrl,
    setEditUrl,
    editIcon,
    setEditIcon,
  } = useForm();

  // Memoized callbacks to prevent unnecessary re-renders of child components
  const handleAddLink = useCallback(
    async (title, url, icon) => {
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
    },
    [links, navigate, showError, showSuccess, setLinks, setNewTitle, setNewUrl, setNewIcon, setShowAddForm]
  );

  const handleDeleteLink = useCallback(
    async (linkId) => {
      const token = localStorage.getItem("token");
      if (!token) {
        showError("Session expired. Please login again.");
        navigate("/login");
        return;
      }

      try {
        await deleteLink(token, linkId);
        const updatedLinks = links.filter((link) => link.id !== linkId);
        setLinks(updatedLinks);
        showSuccess("Link deleted successfully!");
      } catch (err) {
        showError("Error deleting link: " + err.message);
      }
    },
    [links, navigate, showError, showSuccess, setLinks]
  );

  const handleEditLink = useCallback(
    async (linkId, title, url, icon) => {
      const token = localStorage.getItem("token");
      if (!token) {
        showError("Session expired. Please login again.");
        navigate("/login");
        return;
      }

      try {
        const updatedLink = await updateLink(token, linkId, { title, url, icon });
        setLinks(links.map((link) => (link.id === linkId ? updatedLink : link)));
        setEditingId(null);
        setEditTitle("");
        setEditUrl("");
        setEditIcon("");
        showSuccess("Link updated successfully!");
      } catch (err) {
        showError("Error updating link: " + err.message);
      }
    },
    [links, navigate, showError, showSuccess, setLinks, setEditingId, setEditTitle, setEditUrl, setEditIcon]
  );

  const handleToggleLink = useCallback(
    async (linkId, currentStatus) => {
      const token = localStorage.getItem("token");
      if (!token) {
        showError("Session expired. Please login again.");
        navigate("/login");
        return;
      }

      try {
        const updatedLink = await updateLink(token, linkId, { is_active: !currentStatus });
        setLinks(links.map((link) => (link.id === linkId ? updatedLink : link)));
      } catch (err) {
        showError("Error updating link: " + err.message);
      }
    },
    [links, navigate, showError, setLinks]
  );

  const handleDeleteClick = useCallback(
    async (linkId) => {
      const confirmed = await showConfirmModal({
        title: "Delete Link",
        message: "Are you sure you want to delete this link? This action cannot be undone.",
        confirmText: "Delete",
        cancelText: "Cancel",
        confirmButtonType: "danger",
      });

      if (confirmed) {
        handleDeleteLink(linkId);
      }
    },
    [showConfirmModal, handleDeleteLink]
  );

  const handleEditClick = useCallback(
    (linkId, title, url, icon) => {
      setEditingId(linkId);
      setEditTitle(title);
      setEditUrl(url);
      setEditIcon(icon || "🔗");
    },
    [setEditingId, setEditTitle, setEditUrl, setEditIcon]
  );

  const handleEditCancel = useCallback(() => {
    setEditingId(null);
    setEditTitle("");
    setEditUrl("");
    setEditIcon("");
  }, [setEditingId, setEditTitle, setEditUrl, setEditIcon]);

  const handleEditSave = useCallback(
    (linkId) => {
      if (!editTitle.trim() || !editUrl.trim()) {
        showWarning("Please enter both title and URL");
        return;
      }
      handleEditLink(linkId, editTitle, editUrl, editIcon);
    },
    [editTitle, editUrl, editIcon, showWarning, handleEditLink]
  );

  const handleAddFormOpen = useCallback(() => {
    setShowAddForm(true);
  }, [setShowAddForm]);

  const handleAddFormClose = useCallback(() => {
    setShowAddForm(false);
    setNewTitle("");
    setNewUrl("");
    setNewIcon("🔗");
  }, [setShowAddForm, setNewTitle, setNewUrl, setNewIcon]);

  const handleCopyPublicURL = useCallback(() => {
    if (user) {
      const publicURL = `${window.location.origin}/profile.html?u=${user.username}`;
      navigator.clipboard.writeText(publicURL);
      showSuccess("Public URL copied to clipboard!");
    }
  }, [user, showSuccess]);

  const handleExportHTML = useCallback(() => {
    if (!user) return;

    const activeLinks = links.filter((link) => link.is_active);
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
            ${user.avatar_url ? `<img src="${user.avatar_url}" alt="Avatar">` : "👤"}
        </div>
        <h1 class="name">${user.display_name || user.username}</h1>
        <p class="bio">${user.bio || "Welcome to my links"}</p>
        <div class="links">
            ${activeLinks
              .map(
                (link) => `
                <a href="${link.url}" target="_blank" class="link">
                    <span class="link-icon">${link.icon || "🔗"}</span>
                    <span>${link.title}</span>
                </a>
            `
              )
              .join("")}
        </div>
        <p class="powered-by">Powered by <a href="https://linksutra.dev" target="_blank">LinkSutra</a></p>
    </div>
</body>
</html>`;

    const blob = new Blob([htmlTemplate], { type: "text/html" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `${user.username || "profile"}_links.html`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);

    showSuccess("HTML file exported successfully!");
  }, [user, links, showSuccess]);

  const handleExportJSON = useCallback(() => {
    if (!user) return;

    const activeLinks = links.filter((link) => link.is_active);
    const jsonData = {
      user: {
        username: user.username,
        display_name: user.display_name,
        bio: user.bio,
        avatar_url: user.avatar_url,
      },
      links: activeLinks,
      exported_at: new Date().toISOString(),
    };

    const blob = new Blob([JSON.stringify(jsonData, null, 2)], {
      type: "application/json",
    });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `${user.username || "profile"}_links.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);

    showSuccess("JSON file exported successfully!");
  }, [user, links, showSuccess]);

  const handleLogout = useCallback(() => {
    localStorage.removeItem("token");
    setToken(null);
    navigate("/");
  }, [setToken, navigate]);

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
            <button className="add-link-btn" onClick={handleAddFormOpen}>
              + Add link
            </button>
          </div>
        </div>

        {/* Add Link Form - Using new LinkForm component */}
        {showAddForm && (
          <LinkForm
            emojiOptions={emojiOptions}
            onSubmit={handleAddLink}
            onCancel={handleAddFormClose}
          />
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
                  <LinkItem
                    key={link.id}
                    link={link}
                    isEditing={editingId === link.id}
                    editTitle={editTitle}
                    editUrl={editUrl}
                    editIcon={editIcon}
                    onEdit={handleEditClick}
                    onDelete={handleDeleteClick}
                    onToggle={handleToggleLink}
                    onEditTitleChange={(e) => setEditTitle(e.target.value)}
                    onEditUrlChange={(e) => setEditUrl(e.target.value)}
                    onEditIconChange={(e) => setEditIcon(e.target.value)}
                    onEditCancel={handleEditCancel}
                    onEditSave={handleEditSave}
                    emojiOptions={emojiOptions}
                  />
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
