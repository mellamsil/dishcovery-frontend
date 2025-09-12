import React from "react";
import "./modal.css";

function RecipeDetailModal({ recipe, isSaving, onClose, onSave }) {
  if (!recipe) return null;

  return (
    <div className="modal-overlay">
      <div className="modal">
        <h2 className="modal__title">{recipe.title}</h2>

        {recipe.image && (
          <img src={recipe.image} alt={recipe.title} className="modal__image" />
        )}

        <p className="modal__description">{recipe.description || ""}</p>
        {recipe.cookingTime && (
          <p className="modal__time">Cooking time: {recipe.cookingTime} mins</p>
        )}

        <div className="modal__actions">
          <button
            className="btn-primary"
            onClick={() => onSave(recipe)}
            disabled={isSaving}
            aria-label={`Save ${recipe.title} to cookbook`}
          >
            {isSaving ? "Saving..." : "Save to Cookbook"}
          </button>
          <button
            className="btn-cancel"
            onClick={onClose}
            aria-label="Close modal"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
}

export default RecipeDetailModal;
