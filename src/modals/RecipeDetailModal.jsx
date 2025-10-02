import { useEffect, useCallback } from "react";
import "../styles/modal.css";

function RecipeDetailModal({ recipe, isSaving, onClose, onSave }) {
  // Handle modal close with animation
  const handleClose = useCallback(() => {
    setTimeout(() => onClose(), 250);
  }, [onClose]);

  // Escape key support
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
      className={`modal`}
      role="dialog"
      aria-modal="true"
      aria-labelledby="recipe-title"
      aria-describedby="recipe-description"
      onClick={(e) => {
        if (e.target.classList.contains("modal")) handleClose();
      }}
    >
      <div className={`modal__container `}>
        {/* Close button */}
        <button
          className="modal__close"
          onClick={handleClose}
          aria-label="Close modal"
        >
          ×
        </button>

        {/* Title */}
        <h2 className="modal__title" id="recipe-title">
          {recipe.title}
        </h2>

        {/* Image */}
        {recipe.image && (
          <div className="modal__image-wrapper">
            <img
              src={recipe.image}
              alt={recipe.title}
              className="modal__image"
            />
          </div>
        )}

        {/* Description */}
        <p className="modal__description" id="recipe-description">
          {recipe.description || "No description available."}
        </p>

        {/* Cooking time */}
        {recipe.cookingTime && (
          <p className="modal__time">Cooking time: {recipe.cookingTime} mins</p>
        )}

        {/* Footer actions */}
        <div className="modal__footer">
          <button
            className="modal__btn modal__btn--primary"
            onClick={() => onSave(recipe)}
            disabled={isSaving}
          >
            {isSaving ? "Saving..." : "Save to Cookbook"}
          </button>
          <button
            className="modal__btn modal__btn--cancel"
            onClick={handleClose}
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
}

export default RecipeDetailModal;
