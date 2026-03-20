import React, { useState } from 'react';

function LinkList({ links, onAddLink, onDeleteLink, onEditLink }) {
  const [newLinkUrl, setNewLinkUrl] = useState("");
  const [isAdding, setIsAdding] = useState(false);
  const [showAddForm, setShowAddForm] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [editTitle, setEditTitle] = useState("");
  const [editUrl, setEditUrl] = useState("");

  // Extract domain name from URL to use as title
  function getTitleFromUrl(url) {
    try {
      const urlObj = new URL(url.startsWith('http') ? url : 'https://' + url);
      return urlObj.hostname.replace('www.', '');
    } catch {
      return url;
    }
  }

  async function handleAddLink(e) {
    e.preventDefault();
    if (!newLinkUrl.trim()) {
      alert("Please enter a URL");
      return;
    }
    setIsAdding(true);
    try {
      const title = getTitleFromUrl(newLinkUrl);
      await onAddLink(title, newLinkUrl);
      setNewLinkUrl("");
      setShowAddForm(false);
    } catch (err) {
      alert("Error adding link: " + err.message);
    } finally {
      setIsAdding(false);
    }
  }

  function handleCopyLink(url) {
    navigator.clipboard.writeText(url).then(() => {
      alert("Link copied to clipboard!");
    }).catch(() => {
      alert("Failed to copy link");
    });
  }

  async function handleDeleteLink(linkId) {
    if (window.confirm("Are you sure you want to delete this link?")) {
      try {
        await onDeleteLink(linkId);
        alert("Link deleted successfully!");
      } catch (err) {
        alert("Error deleting link: " + err.message);
      }
    }
  }

  function startEdit(link) {
    setEditingId(link.id);
    setEditTitle(link.title);
    setEditUrl(link.url);
  }

  async function handleSaveEdit(linkId) {
    if (!editTitle.trim() || !editUrl.trim()) {
      alert("Please fill in both title and URL");
      return;
    }
    try {
      await onEditLink(linkId, editTitle, editUrl);
      setEditingId(null);
      alert("Link updated successfully!");
    } catch (err) {
      alert("Error updating link: " + err.message);
    }
  }

  if (!links || links.length === 0) {
    return (
      <div className="card-container">
        {!showAddForm ? (
          <button className="addBtn" onClick={() => setShowAddForm(true)}>+ Add New Link</button>
        ) : (
          <form onSubmit={handleAddLink}>
            <input
              type="url"
              className="addLinkInput"
              placeholder="Enter URL (e.g., https://linkedin.com)"
              value={newLinkUrl}
              onChange={(e) => setNewLinkUrl(e.target.value)}
              required
            />
            <button className="addBtn" type="submit" disabled={isAdding}>
              {isAdding ? "Adding..." : "Add"}
            </button>
            <button className="addBtn" type="button" onClick={() => setShowAddForm(false)}>
              Cancel
            </button>
          </form>
        )}
        <p>No links added yet</p>
      </div>
    );
  }

  return (
    <div className="card-container">
      {!showAddForm ? (
        <button className="addBtn" onClick={() => setShowAddForm(true)}>+ Add New Link</button>
      ) : (
        <form onSubmit={handleAddLink}>
          <input
            type="url"
            className="addLinkInput"
            placeholder="Enter URL (e.g., https://linkedin.com)"
            value={newLinkUrl}
            onChange={(e) => setNewLinkUrl(e.target.value)}
            required
          />
          <button className="addBtn" type="submit" disabled={isAdding}>
            {isAdding ? "Adding..." : "Add"}
          </button>
          <button className="addBtn" type="button" onClick={() => setShowAddForm(false)}>
            Cancel
          </button>
        </form>
      )}

      {links.map((link) => (
        <div key={link.id} className="card profile-card">
          {editingId === link.id ? (
            <>
              <input
                type="text"
                value={editTitle}
                onChange={(e) => setEditTitle(e.target.value)}
                placeholder="Title"
              />
              <input
                type="url"
                value={editUrl}
                onChange={(e) => setEditUrl(e.target.value)}
                placeholder="URL"
              />
              <button className='btn' onClick={() => handleSaveEdit(link.id)}>Save</button>
              <button className='btn' onClick={() => setEditingId(null)}>Cancel</button>
            </>
          ) : (
            <>
              <h3 className="card-title">{link.title}</h3>
              <p className="card-subtitle">{link.url}</p>
              <button className='btn' onClick={() => startEdit(link)}>Edit</button>
              <button className='btn' onClick={() => handleCopyLink(link.url)}>Copy</button>
              <button className='btn' onClick={() => handleDeleteLink(link.id)}>Delete</button>
            </>
          )}
        </div>
      ))}
    </div>
  );
}

export default LinkList;