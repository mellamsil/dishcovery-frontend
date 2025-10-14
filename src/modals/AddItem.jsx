import React, { useState, useEffect } from "react";
import ModalWithForm from "./ModalWithForm";
import closeIcon from "../assets/icons/close.svg";
import { createRecipe, updateRecipe } from "../utils/api.js";

function AddItem({ item, onClose, onAdd }) {
  const [title, setTitle] = useState("");
  const [ingredients, setIngredients] = useState("");
  const [description, setDescription] = useState("");
  const [instructions, setInstructions] = useState("");
  const [notes, setNotes] = useState("");
  const [image, setImage] = useState("");
  const [saving, setSaving] = useState(false);

  const token = localStorage.getItem("authToken");

  useEffect(() => {
    if (item) {
      setTitle(item.title || "");
      setIngredients(item.ingredients || "");
      setDescription(item.description || "");
      setInstructions(item.instructions || "");
      setNotes(item.notes || "");
      setImage(item.image || "");
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

    const recipeData = {
      title: title.trim(),
      ingredients: ingredients.trim(),
      description: description.trim(),
      instructions: instructions.trim(),
      notes: notes.trim(),
      image: image.trim(),
    };

    setSaving(true);

    // Decide between create or update
    const apiCall =
      item && item._id
        ? updateRecipe(item._id, recipeData, token)
        : createRecipe(recipeData, token);

    apiCall
      .then((saved) => {
        if (saved) {
          onAdd(saved);
          onClose();
        }
      })
      .catch((err) => {
        console.error("Failed to save recipe:", err.message);
      })
      .finally(() => setSaving(false));
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
      <div className="modal__field">
        <label>Title</label>
        <input
          type="text"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          required
        />
      </div>
      <div className="modal__field">
        <label>Ingredients</label>
        <textarea
          value={ingredients}
          onChange={(e) => setIngredients(e.target.value)}
        />
      </div>
      <div className="modal__field">
        <label>Description</label>
        <textarea
          value={description}
          onChange={(e) => setDescription(e.target.value)}
        />
      </div>
      <div className="modal__field">
        <label>Instructions</label>
        <textarea
          value={instructions}
          onChange={(e) => setInstructions(e.target.value)}
        />
      </div>
      <div className="modal__field">
        <label>Notes</label>
        <textarea value={notes} onChange={(e) => setNotes(e.target.value)} />
      </div>
      <div className="modal__field">
        <label>Image URL</label>
        <input
          type="text"
          value={image}
          onChange={(e) => setImage(e.target.value)}
        />
      </div>
    </ModalWithForm>
  );
}

export default AddItem;
