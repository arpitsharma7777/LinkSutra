import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { getCurrentUser, getUserLinks, createLink, updateLink, deleteLink } from "../api/auth";
import "../styles/Dashboard.css";


function Dashboard({ setToken }) {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [links, setLinks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [showAddForm, setShowAddForm] = useState(false);
  const [newTitle, setNewTitle] = useState("");
  const [newUrl, setNewUrl] = useState("");
  const [editingId, setEditingId] = useState(null);
  const [editTitle, setEditTitle] = useState("");
  const [editUrl, setEditUrl] = useState("");

  // Fetch user data and links on component mount
  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      navigate("/");
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
        console.error("Error fetching dashboard data:", err);
      } finally {
        setLoading(false);
      }
    }

    fetchData();
  }, [navigate]);

  // Handle adding a new link
  async function handleAddLink(title, url) {
    const token = localStorage.getItem("token");
    if (!token) {
      alert("Session expired. Please login again.");
      navigate("/");
      return;
    }

    try {
      const newLink = await createLink(token, title, url);
      setLinks([...links, newLink]);
      setNewTitle("");
      setNewUrl("");
      setShowAddForm(false);
      alert("Link added successfully!");
    } catch (err) {
      alert("Error adding link: " + err.message);
    }
  }

  function handleAddFormOpenClick() {
    setShowAddForm(true);
  }

  function handleAddFormCloseClick() {
    setShowAddForm(false);
    setNewTitle("");
    setNewUrl("");
  }

  function handleAddFormSubmit() {
    if (!newTitle.trim() || !newUrl.trim()) {
      alert("Please enter both title and URL");
      return;
    }
    handleAddLink(newTitle, newUrl);
  }

  // Handle deleting a link
  async function handleDeleteLink(linkId) {
    const token = localStorage.getItem("token");
    if (!token) {
      alert("Session expired. Please login again.");
      navigate("/");
      return;
    }

    try {
      console.log("Deleting link with ID:", linkId);
      await deleteLink(token, linkId);

      const updatedLinks = links.filter(link => link.id !== linkId);
      setLinks(updatedLinks);
      console.log("Link deleted successfully. Remaining links:", updatedLinks);
      alert("Link deleted successfully!");
    } catch (err) {
      console.error("Delete error:", err);
      alert("Error deleting link: " + err.message);
    }
  }

  // Handle editing a link
  async function handleEditLink(linkId, title, url) {
    const token = localStorage.getItem("token");
    if (!token) {
      alert("Session expired. Please login again.");
      navigate("/");
      return;
    }

    try {
      const updatedLink = await updateLink(token, linkId, { title, url });
      setLinks(links.map(link => link.id === linkId ? updatedLink : link));
      setEditingId(null);
      setEditTitle("");
      setEditUrl("");
      alert("Link updated successfully!");
    } catch (err) {
      alert("Error updating link: " + err.message);
    }
  }

  function handleEditClick(linkId, title, url) {
    setEditingId(linkId);
    setEditTitle(title);
    setEditUrl(url);
  }

  function handleSaveEdit(linkId) {
    if (!editTitle.trim() || !editUrl.trim()) {
      alert("Please enter both title and URL");
      return;
    }
    handleEditLink(linkId, editTitle, editUrl);
  }

  function handleCancelEdit() {
    setEditingId(null);
    setEditTitle("");
    setEditUrl("");
  }

  function handleDeleteClick(linkId) {
    const confirm = window.confirm("Are you sure you want to delete this link?");
    if (confirm) {
      handleDeleteLink(linkId);
    }
  }

  function handleLogout() {
    localStorage.removeItem("token");
    setToken(null);
    navigate("/");
  }

  if (loading) {
    return (
      <div className="dashboard">
        <div className="main">
          <div className="Full-main">
            <p>Loading dashboard...</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="dashboard-container">
      {/* Sidebar */}
      <aside className="sidebar">
        <div className="logo">LinkSutra</div>
        <nav>
          <div className="nav-item active" onClick={() => navigate('/dashboard')}>Links</div>
          <div className="nav-item" onClick={() => navigate('/analytics')}>Analytics</div>
          <div className="nav-item">Settings</div>
          <div className="nav-item">Support</div>
        </nav>
      </aside>

      {/* Main Content */}
      <main className="main-content">
        <div className="header">
          <div>
            <span className="workspace-label">WORKSPACE</span>
            <h1 className="title">Manage Links</h1>
          </div>
          <button className="add-link-btn" onClick={handleAddFormOpenClick}>+ Add link</button>
        </div>

        {/* Add Link Form */}
        {showAddForm && (
          <div style={{
            backgroundColor: '#1e1e1e',
            padding: '20px',
            borderRadius: '8px',
            marginBottom: '20px',
            border: '1px solid #f95306'
          }}>
            <h3 style={{ marginTop: 0 }}>Add New Link</h3>
            <input
              type="text"
              placeholder="Link Title (e.g., LinkedIn)"
              value={newTitle}
              onChange={(e) => setNewTitle(e.target.value)}
              style={{
                width: '100%',
                padding: '10px',
                marginBottom: '10px',
                backgroundColor: '#2a2a2a',
                color: 'white',
                border: '1px solid #444',
                borderRadius: '6px'
              }}
            />
            <input
              type="text"
              placeholder="Link URL (e.g., https://linkedin.com/in/yourprofile)"
              value={newUrl}
              onChange={(e) => setNewUrl(e.target.value)}
              style={{
                width: '100%',
                padding: '10px',
                marginBottom: '10px',
                backgroundColor: '#2a2a2a',
                color: 'white',
                border: '1px solid #444',
                borderRadius: '6px'
              }}
            />
            <button
              className="edit-btn"
              onClick={handleAddFormSubmit}
              style={{ backgroundColor: '#34f27d', color: 'black', marginRight: '10px' }}
            >
              Add
            </button>
            <button
              className="edit-btn"
              onClick={handleAddFormCloseClick}
              style={{ backgroundColor: '#ff6b6b' }}
            >
              Cancel
            </button>
          </div>
        )}

        <div className="links-list">
          {links.length === 0 ? (
            <p style={{ color: '#888', textAlign: 'center', padding: '40px' }}>
              No links added yet. Click "+ Add link" to create your first link!
            </p>
          ) : (
            links.map((link) => (
              editingId === link.id ? (
                // Edit Mode
                <div key={link.id} className="link-card" style={{ border: '1px solid #34f27d' }}>
                  <div className="card-left" style={{ flex: 1 }}>
                    <div style={{ width: '100%' }}>
                      <input
                        type="text"
                        value={editTitle}
                        onChange={(e) => setEditTitle(e.target.value)}
                        placeholder="Title"
                        style={{
                          width: '100%',
                          padding: '8px',
                          marginBottom: '8px',
                          backgroundColor: '#2a2a2a',
                          color: 'white',
                          border: '1px solid #444',
                          borderRadius: '4px'
                        }}
                      />
                      <input
                        type="text"
                        value={editUrl}
                        onChange={(e) => setEditUrl(e.target.value)}
                        placeholder="URL"
                        style={{
                          width: '100%',
                          padding: '8px',
                          backgroundColor: '#2a2a2a',
                          color: 'white',
                          border: '1px solid #444',
                          borderRadius: '4px'
                        }}
                      />
                    </div>
                  </div>
                  <div className="card-right">
                    <button
                      className="edit-btn"
                      onClick={() => handleSaveEdit(link.id)}
                      style={{ backgroundColor: '#34f27d', color: 'black', marginRight: '5px' }}
                    >
                      Save
                    </button>
                    <button
                      className="edit-btn"
                      onClick={handleCancelEdit}
                      style={{ backgroundColor: '#ff6b6b' }}
                    >
                      Cancel
                    </button>
                  </div>
                </div>
              ) : (
                // View Mode
                <div key={link.id} className="link-card">
                  <div className="card-left">
                    <div className="img-box"></div>
                    <div className="text-info">
                      <h3>{link.title}</h3>
                      <p>{link.url}</p>
                    </div>
                  </div>
                  <div className="card-right">
                    <button
                      className="edit-btn"
                      onClick={() => handleEditClick(link.id, link.title, link.url)}
                    >
                      Edit
                    </button>
                    <button
                      className="delete-btn"
                      onClick={() => handleDeleteClick(link.id)}
                    >
                      Delete
                    </button>
                  </div>
                </div>
              )
            ))
          )}
        </div>
        <button className="btn" onClick={handleLogout} style={{ marginTop: '20px' }}>LOGOUT</button>
      </main>
    </div>
  );
}

export default Dashboard;