import React, { useState } from 'react';

function LinkList({ links = [], onAddLink, onDeleteLink, onEditLink }) {
  const [newTitle, setNewTitle] = useState('');
  const [newUrl, setNewUrl] = useState('');
  const [editingId, setEditingId] = useState(null);
  const [editTitle, setEditTitle] = useState('');
  const [editUrl, setEditUrl] = useState('');

  // Handle adding a new link
  function handleAddClick() {
    if (!newTitle.trim() || !newUrl.trim()) {
      alert('Please enter both title and URL');
      return;
    }

    onAddLink(newTitle, newUrl);
    setNewTitle('');
    setNewUrl('');
  }

  // Handle copying link to clipboard
  function handleCopyLink(url) {
    navigator.clipboard.writeText(url);
    alert('Link copied to clipboard!');
  }

  // Handle editing a link
  function handleEditClick(linkId, currentTitle, currentUrl) {
    setEditingId(linkId);
    setEditTitle(currentTitle);
    setEditUrl(currentUrl);
  }

  // Handle saving edited link
  function handleSaveEdit(linkId) {
    if (!editTitle.trim() || !editUrl.trim()) {
      alert('Please enter both title and URL');
      return;
    }

    onEditLink(linkId, editTitle, editUrl);
    setEditingId(null);
    setEditTitle('');
    setEditUrl('');
  }

  // Handle canceling edit
  function handleCancelEdit() {
    setEditingId(null);
    setEditTitle('');
    setEditUrl('');
  }

  // Handle deleting a link with confirmation
  function handleDeleteClick(linkId, title) {
    const confirm = window.confirm(`Are you sure you want to delete "${title}"?`);
    if (confirm) {
      onDeleteLink(linkId);
    }
  }

  return (
    <div className="card-container">
      {/* Add New Link Form */}
      <div style={{ marginBottom: '20px' }}>
        <input
          className="addLinkInput"
          placeholder="Link Title (e.g., LinkedIn)"
          value={newTitle}
          onChange={(e) => setNewTitle(e.target.value)}
        />
        <input
          className="addLinkInput"
          placeholder="Link URL (e.g., https://linkedin.com/in/yourprofile)"
          value={newUrl}
          onChange={(e) => setNewUrl(e.target.value)}
          style={{ marginLeft: '10px' }}
        />
        <button className="addBtn" onClick={handleAddClick}>
          Add
        </button>
      </div>

      {/* Display Links */}
      {links.length === 0 ? (
        <p style={{ color: 'white', textAlign: 'center' }}>No links added yet. Add your first link!</p>
      ) : (
        links.map((link) => (
          <div key={link.id} className="card profile-card">
            {editingId === link.id ? (
              // Edit Mode
              <>
                <input
                  type="text"
                  value={editTitle}
                  onChange={(e) => setEditTitle(e.target.value)}
                  placeholder="Title"
                  style={{ marginBottom: '10px', width: '100%', padding: '5px' }}
                />
                <input
                  type="text"
                  value={editUrl}
                  onChange={(e) => setEditUrl(e.target.value)}
                  placeholder="URL"
                  style={{ marginBottom: '10px', width: '100%', padding: '5px' }}
                />
                <button
                  className="btn"
                  onClick={() => handleSaveEdit(link.id)}
                  style={{ backgroundColor: '#34f27d' }}
                >
                  Save
                </button>
                <button
                  className="btn"
                  onClick={handleCancelEdit}
                  style={{ backgroundColor: '#ff6b6b' }}
                >
                  Cancel
                </button>
              </>
            ) : (
              // View Mode
              <>
                <div>
                  <h3 className="card-title">{link.title}</h3>
                  <p className="card-subtitle">{link.url}</p>
                </div>
                <div>
                  <button
                    className="btn"
                    onClick={() => handleEditClick(link.id, link.title, link.url)}
                  >
                    Edit
                  </button>
                  <button
                    className="btn"
                    onClick={() => handleCopyLink(link.url)}
                  >
                    Copy
                  </button>
                  <button
                    className="btn"
                    onClick={() => handleDeleteClick(link.id, link.title)}
                    style={{ backgroundColor: '#ff6b6b' }}
                  >
                    Delete
                  </button>
                </div>
              </>
            )}
          </div>
        ))
      )}
    </div>
  );
}

export default LinkList;