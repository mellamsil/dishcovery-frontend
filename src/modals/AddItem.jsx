import React, { useState, useEffect } from "react";
import ModalWithForm from "./ModalWithForm";

function AddItem({ item, onClose, onAdd }) {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [instructions, setInstructions] = useState("");
  const [notes, setNotes] = useState("");
  const [saving, setSaving] = useState(false);

  // --- Mock saveRecipe function ---
  const saveRecipe = (recipe) => {
    return new Promise((resolve) => {
      setTimeout(() => {
        const saved = {
          ...recipe,
          _id: recipe._id || Date.now().toString(), // mock ID
        };
        resolve({ success: true, saved });
      }, 700); // simulate network delay
    });
  };

  // Pre-fill form if editing
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
      _id: item?._id || undefined, // undefined for new recipe
      title: title.trim(),
      description: description.trim(),
      instructions: instructions.trim(),
      notes: notes.trim(),
    };

    setSaving(true);

    saveRecipe(newItem).then((res) => {
      setSaving(false);
      if (res.success) {
        onAdd(res.saved); // pass saved recipe back
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
      secondaryText="Cancel"
      disabled={saving}
    >
      <label>
        Title:
        <input
          type="text"
          name="title"
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
          name="description"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          placeholder="Brief description"
          disabled={saving}
        />
      </label>

      <label>
        Instructions:
        <textarea
          name="instructions"
          value={instructions}
          onChange={(e) => setInstructions(e.target.value)}
          placeholder="Step by step instructions"
          disabled={saving}
        />
      </label>

      <label>
        Notes:
        <textarea
          name="notes"
          value={notes}
          onChange={(e) => setNotes(e.target.value)}
          placeholder="Personal notes or tips"
          disabled={saving}
        />
      </label>
    </ModalWithForm>
  );
}

export default AddItem;
