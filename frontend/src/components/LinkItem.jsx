import React, { useCallback } from "react";

function LinkItem({
  link,
  isEditing,
  editTitle,
  editUrl,
  editIcon,
  onEdit,
  onDelete,
  onToggle,
  onEditTitleChange,
  onEditUrlChange,
  onEditIconChange,
  onEditCancel,
  onEditSave,
  emojiOptions,
}) {
  if (isEditing) {
    return (
      <div className="link-item editing">
        <div className="link-content">
          <div className="icon-selector">
            <select
              value={editIcon}
              onChange={onEditIconChange}
              className="icon-select small"
            >
              {emojiOptions.map((emoji) => (
                <option key={emoji} value={emoji}>
                  {emoji}
                </option>
              ))}
            </select>
          </div>
          <div className="link-inputs">
            <input
              type="text"
              value={editTitle}
              onChange={onEditTitleChange}
              placeholder="Title"
              className="edit-input"
            />
            <input
              type="text"
              value={editUrl}
              onChange={onEditUrlChange}
              placeholder="URL"
              className="edit-input"
            />
          </div>
        </div>
        <div className="link-actions">
          <button className="btn-save small" onClick={() => onEditSave(link.id)}>
            ✓
          </button>
          <button className="btn-cancel small" onClick={onEditCancel}>
            ✕
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="link-item">
      <div className="link-content">
        <div className="link-icon">{link.icon || "🔗"}</div>
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
            onChange={() => onToggle(link.id, link.is_active)}
          />
          <span className="slider"></span>
        </label>
        <button
          className="btn-edit"
          onClick={() => onEdit(link.id, link.title, link.url, link.icon)}
        >
          ✏️
        </button>
        <button className="btn-delete" onClick={() => onDelete(link.id)}>
          🗑️
        </button>
      </div>
    </div>
  );
}

export default React.memo(LinkItem);
