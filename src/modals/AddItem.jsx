import React, { useState, useEffect } from "react";
import ModalWithForm from "./ModalWithForm";
import closeIcon from "../assets/icons/close.svg";

function AddItem({ item, onClose, onAdd }) {
  const [title, setTitle] = useState("");
  const [ingredients, setIngredients] = useState("");
  const [description, setDescription] = useState("");
  const [instructions, setInstructions] = useState("");
  const [notes, setNotes] = useState("");
  const [image, setImage] = useState(""); // renamed from imageUrl
  const [saving, setSaving] = useState(false);

  const saveRecipe = (recipe) =>
    new Promise((resolve) => {
      setTimeout(() => {
        const saved = { ...recipe, _id: recipe._id || Date.now().toString() };
        resolve({ success: true, saved });
      }, 700);
    });

  useEffect(() => {
    if (item) {
      setTitle(item.title || "");
      setIngredients(item.ingredients || "");
      setDescription(item.description || "");
      setInstructions(item.instructions || "");
      setNotes(item.notes || "");
      setImage(item.image || ""); // renamed
    } else {
      setTitle("");
      setIngredients("");
      setDescription("");
      setInstructions("");
      setNotes("");
      setImage("");
    }
  }, [item]);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!title.trim()) return;

    const newItem = {
      _id: item?._id || undefined,
      title: title.trim(),
      ingredients: ingredients.trim(),
      description: description.trim(),
      instructions: instructions.trim(),
      notes: notes.trim(),
      image: image.trim(), // renamed
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
      isLoading={saving}
      secondaryText="Cancel"
      secondaryAction={onClose}
      closeIcon={closeIcon}
    >
      {/* Title */}
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

      {/* Ingredients */}
      <label>
        Ingredients:
        <textarea
          value={ingredients}
          onChange={(e) => setIngredients(e.target.value)}
          placeholder="List ingredients separated by commas or new lines"
          disabled={saving}
        />
      </label>

      {/* Image */}
      <label>
        Image URL:
        <input
          type="text"
          value={image}
          onChange={(e) => setImage(e.target.value)}
          placeholder="Enter image URL"
          disabled={saving}
        />
      </label>

      {/* Description */}
      <label>
        Description:
        <textarea
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          placeholder="Brief description"
          disabled={saving}
        />
      </label>

      {/* Instructions */}
      <label>
        Instructions:
        <textarea
          value={instructions}
          onChange={(e) => setInstructions(e.target.value)}
          placeholder="Step by step instructions"
          disabled={saving}
        />
      </label>

      {/* Notes */}
      <label>
        Notes:
        <textarea
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
