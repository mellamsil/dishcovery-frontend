import { useEffect, useCallback, useContext } from "react";
import CurrentUserContext from "../contexts/CurrentUserContext";
import "../styles/modal.css";

function RecipeDetailModal({
  recipe,
  isSaving,
  onClose,
  onSave,
  onRequireAuth,
  resetSaving,
}) {
  const { isLoggedIn } = useContext(CurrentUserContext);

  // Handle modal close with animation
  const handleClose = useCallback(() => {
    setTimeout(() => {
      if (resetSaving) resetSaving();
      onClose();
    }, 250);
  }, [onClose, resetSaving]);

  // Escape key support
  useEffect(() => {
    const handleEsc = (event) => {
      if (event.key === "Escape") handleClose();
    };
    window.addEventListener("keydown", handleEsc);
    return () => window.removeEventListener("keydown", handleEsc);
  }, [handleClose]);

  if (!recipe) return null;

  const handleSave = () => {
    if (!isLoggedIn) {
      if (onRequireAuth) onRequireAuth(recipe);
      return;
    }
    onSave(recipe);
  };

  return (
    <div
      className="modal"
      role="dialog"
      aria-modal="true"
      aria-labelledby="recipe-title"
      aria-describedby="recipe-description"
      onClick={(e) => {
        if (e.target.classList.contains("modal")) handleClose();
      }}
    >
      <div className="modal__container">
        <button
          className="modal__close"
          onClick={handleClose}
          aria-label="Close modal"
        >
          ×
        </button>

        <h2 className="modal__title" id="recipe-title">
          {recipe.title}
        </h2>

        {recipe.image && (
          <div className="modal__image-wrapper">
            <img
              src={recipe.image}
              alt={recipe.title}
              className="modal__image"
            />
          </div>
        )}

        <p className="modal__description" id="recipe-description">
          {recipe.description
            ? recipe.description
                .replace(/<\/?[^>]+(>|$)/g, "")
                .split(" ")
                .slice(0, 60)
                .join(" ") + "..."
            : "No description available."}
        </p>

        {recipe.cookingTime && (
          <p className="modal__time">Cooking time: {recipe.cookingTime} mins</p>
        )}

        <div className="modal__footer">
          <button
            className="modal__btn modal__btn--primary"
            onClick={handleSave}
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
