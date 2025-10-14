import React, { useState, useEffect } from "react";
import ModalWithForm from "./ModalWithForm";
import { createRecipe } from "../utils/api.js";

function EditRecipeConfirm({ item, onConfirm, onCancel }) {
  const [title, setTitle] = useState("");
  const [image, setImage] = useState("");
  const [description, setDescription] = useState("");
  const [instructions, setInstructions] = useState("");
  const [notes, setNotes] = useState("");
  const [saving, setSaving] = useState(false);
  const token = localStorage.getItem("token");

  // Populate form fields when item changes
  useEffect(() => {
    if (item) {
      setTitle(item.title || "");
      setImage(item.image || "");
      setDescription(item.description || "");
      setInstructions(item.instructions || "");
      setNotes(item.notes || "");
    }
  }, [item]);

  // Handle Esc key to close modal
  useEffect(() => {
    const handleEsc = (e) => {
      if (e.key === "Escape") onCancel();
    };
    window.addEventListener("keydown", handleEsc);
    return () => window.removeEventListener("keydown", handleEsc);
  }, [onCancel]);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!item) return;
    setSaving(true);

    const updatedItem = {
      ...item,
      title: title.trim(),
      image: image.trim(),
      description: description.trim(),
      instructions: instructions.trim(),
      notes: notes.trim(),
    };

    createRecipe(updatedItem, token)
      .then((savedItem) => {
        onConfirm(savedItem);
        onCancel();
      })
      .finally(() => setSaving(false));
  };

  if (!item) return null;

  return (
    <ModalWithForm
      title="Edit Recipe"
      onClose={onCancel}
      onSubmit={handleSubmit}
      submitText={saving ? "Saving..." : "Save Changes"}
      secondaryText="Cancel"
      secondaryAction={onCancel}
      isLoading={saving}
    >
      {/* Top-right Close Icon */}
      <button
        type="button"
        className="modal-close-icon-topright"
        onClick={onCancel}
        aria-label="Close"
      >
        &times;
      </button>

      {/* Editable fields */}
      <label>
        Title:
        <input
          type="text"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          required
          disabled={saving}
        />
      </label>

      <label>
        Image URL:
        <input
          type="url"
          value={image}
          onChange={(e) => setImage(e.target.value)}
          placeholder="https://example.com/photo.jpg"
          disabled={saving}
        />
      </label>

      <label>
        Description:
        <textarea
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          disabled={saving}
        />
      </label>

      <label>
        Instructions:
        <textarea
          value={instructions}
          onChange={(e) => setInstructions(e.target.value)}
          disabled={saving}
        />
      </label>

      <label>
        Notes:
        <textarea
          value={notes}
          onChange={(e) => setNotes(e.target.value)}
          disabled={saving}
        />
      </label>
    </ModalWithForm>
  );
}

export default EditRecipeConfirm;
