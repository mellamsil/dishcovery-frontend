import React, { useState, useEffect } from "react";
import ModalWithForm from "./ModalWithForm";

function AddItem({ item, onClose, onAdd }) {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [instructions, setInstructions] = useState("");
  const [notes, setNotes] = useState("");
  const [saving, setSaving] = useState(false);

  const saveRecipe = (recipe) => {
    return new Promise((resolve) => {
      setTimeout(() => {
        const saved = {
          ...recipe,
          _id: recipe._id || Date.now().toString(),
        };
        resolve({ success: true, saved });
      }, 700);
    });
  };

  useEffect(() => {
    if (item) {
      setTitle(item.title || "");
      setDescription(item.description || "");
      setInstructions(item.instructions || "");
      setNotes(item.notes || "");
    } else {
      setTitle("");
      setDescription("");
      setInstructions("");
      setNotes("");
    }
  }, [item]);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!title.trim()) return;

    const newItem = {
      _id: item?._id || undefined,
      title: title.trim(),
      description: description.trim(),
      instructions: instructions.trim(),
      notes: notes.trim(),
    };

    setSaving(true);

    saveRecipe(newItem).then((res) => {
      setSaving(false);
      if (res.success) {
        onAdd(res.saved);
        onClose();
      }
    });
  };

  return (
    <ModalWithForm
      title={item ? "Edit Recipe" : "Add Recipe"}
      onClose={onClose}
      onSubmit={handleSubmit}
      submitText={saving ? "Saving..." : item ? "Save Changes" : "Add Recipe"}
      disabled={saving}
    >
      {/* Close icon at top left */}
      <button
        type="button"
        className="modal-close-icon"
        onClick={onClose}
        aria-label="Close"
      >
        &times;
      </button>

      {/* Form fields */}
      <label>
        Title:
        <input
          type="text"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="Enter recipe title"
          required
          disabled={saving}
        />
      </label>

      <label>
        Description:
        <textarea
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          placeholder="Brief description"
          disabled={saving}
        />
      </label>

      <label>
        Instructions:
        <textarea
          value={instructions}
          onChange={(e) => setInstructions(e.target.value)}
          placeholder="Step by step instructions"
          disabled={saving}
        />
      </label>

      <label>
        Notes:
        <textarea
          value={notes}
          onChange={(e) => setNotes(e.target.value)}
          placeholder="Personal notes or tips"
          disabled={saving}
        />
      </label>

      {/* Footer buttons */}
      <div className="modal-actions">
        <button type="submit" className="btn-primary" disabled={saving}>
          {saving ? "Saving..." : item ? "Save Changes" : "Add Recipe"}
        </button>
        <button
          type="button"
          className="btn-cancel"
          onClick={onClose}
          disabled={saving}
        >
          Cancel
        </button>
      </div>
    </ModalWithForm>
  );
}

export default AddItem;
