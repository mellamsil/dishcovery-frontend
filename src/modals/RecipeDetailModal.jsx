import React, { useState, useEffect, useCallback } from "react";
import "../styles/modal.css";

function RecipeDetailModal({ recipe, isSaving, onClose, onSave }) {
  const [closing, setClosing] = useState(false);

  // --- Handle close ---
  const handleClose = useCallback(() => {
    setClosing(true);
    setTimeout(() => onClose(), 250);
  }, [onClose]);

  // --- Handle Escape key ---
  useEffect(() => {
    const handleEsc = (event) => {
      if (event.key === "Escape") handleClose();
    };
    window.addEventListener("keydown", handleEsc);
    return () => window.removeEventListener("keydown", handleEsc);
  }, [handleClose]);

  if (!recipe) return null;

  return (
    <div
      className={`modal-overlay ${closing ? "fade-out" : ""}`}
      role="dialog"
      aria-modal="true"
      aria-labelledby="recipe-title"
      aria-describedby="recipe-description"
      onClick={(e) => {
        if (e.target.classList.contains("modal-overlay")) handleClose();
      }}
    >
      <div className={`modal ${closing ? "fade-out" : ""}`}>
        <button
          className="btn-cancel modal-close-button"
          onClick={handleClose}
          aria-label="Close modal"
        >
          ×
        </button>

        <h2 className="modal-title" id="recipe-title">
          {recipe.title}
        </h2>

        {recipe.image && (
          <img src={recipe.image} alt={recipe.title} className="modal-image" />
        )}

        <p className="modal-description" id="recipe-description">
          {recipe.description || "No description available."}
        </p>

        {recipe.cookingTime && (
          <p className="modal-time">Cooking time: {recipe.cookingTime} mins</p>
        )}

        <div className="modal-footer">
          <button
            className="btn-primary btn-primary-dirty"
            onClick={() => onSave(recipe)}
            disabled={isSaving}
          >
            {isSaving ? "Saving..." : "Save to Cookbook"}
          </button>
          <button className="btn-cancel" onClick={handleClose}>
            Close
          </button>
        </div>
      </div>
    </div>
  );
}

export default RecipeDetailModal;
