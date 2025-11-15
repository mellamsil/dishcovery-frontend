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
  const [error, setError] = useState("");

  const token =
    localStorage.getItem("authToken") || localStorage.getItem("token");

  useEffect(
    function () {
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
    },
    [item]
  );

  function handleSubmit(e) {
    e.preventDefault();
    if (!title.trim()) return;

    setSaving(true);
    setError("");

    const recipeData = {
      title: title.trim(),
      ingredients: ingredients.trim(),
      description: description.trim(),
      instructions: instructions.trim(),
      notes: notes.trim(),
      image: image.trim(),
    };

    const request =
      item && item._id
        ? updateRecipe(item._id, recipeData, token)
        : createRecipe(recipeData, token);

    request
      .then(function (savedRecipe) {
        onAdd(savedRecipe);
        onClose();
      })
      .catch(function (err) {
        console.error("Failed to save recipe:", err.message || err);
        setError(err.message || "Failed to save recipe");
      })
      .finally(function () {
        setSaving(false);
      });
  }

  return (
    <ModalWithForm
      title={item ? "Edit Recipe" : "Add Recipe"}
      onClose={onClose}
      onSubmit={handleSubmit}
      submitText={item ? "Save Changes" : "Add Recipe"}
      isLoading={saving}
      secondaryText="Cancel"
      secondaryAction={onClose}
      closeIcon={closeIcon}
    >
      {error && <p className="modal__error">{error}</p>}

      <div className="modal__field">
        <label>Title</label>
        <input
          type="text"
          value={title}
          onChange={function (e) {
            setTitle(e.target.value);
          }}
          required
          disabled={saving}
        />
      </div>

      <div className="modal__field">
        <label>Ingredients</label>
        <textarea
          value={ingredients}
          onChange={function (e) {
            setIngredients(e.target.value);
          }}
          disabled={saving}
        />
      </div>

      <div className="modal__field">
        <label>Description</label>
        <textarea
          value={description}
          onChange={function (e) {
            setDescription(e.target.value);
          }}
          disabled={saving}
        />
      </div>

      <div className="modal__field">
        <label>Instructions</label>
        <textarea
          value={instructions}
          onChange={function (e) {
            setInstructions(e.target.value);
          }}
          disabled={saving}
        />
      </div>

      <div className="modal__field">
        <label>Notes</label>
        <textarea
          value={notes}
          onChange={function (e) {
            setNotes(e.target.value);
          }}
          disabled={saving}
        />
      </div>

      <div className="modal__field">
        <label>Image URL</label>
        <input
          type="text"
          value={image}
          onChange={function (e) {
            setImage(e.target.value);
          }}
          disabled={saving}
        />
      </div>
    </ModalWithForm>
  );
}

export default AddItem;
