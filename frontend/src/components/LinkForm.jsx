import React from "react";
import { useForm } from "./FormContext";

function LinkForm({ emojiOptions, onSubmit, onCancel }) {
  const { newTitle, setNewTitle, newUrl, setNewUrl, newIcon, setNewIcon } =
    useForm();

  const handleSubmit = () => {
    if (!newTitle.trim() || !newUrl.trim()) {
      alert("Please enter both title and URL");
      return;
    }
    onSubmit(newTitle, newUrl, newIcon);
  };

  const handleCancel = () => {
    setNewTitle("");
    setNewUrl("");
    setNewIcon("🔗");
    onCancel();
  };

  return (
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
            {emojiOptions.map((emoji) => (
              <option key={emoji} value={emoji}>
                {emoji}
              </option>
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
        <button className="btn-save" onClick={handleSubmit}>
          Add
        </button>
        <button className="btn-cancel" onClick={handleCancel}>
          Cancel
        </button>
      </div>
    </div>
  );
}

export default React.memo(LinkForm);
