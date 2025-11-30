import React from "react";
import "../styles/RecipeCard.css";

function RecipeCard({
  recipe,
  onOpen,
  onSave,
  isPreview,
  showSaveButton = true,
  onRequireLogin,
}) {
  const handleClick = function () {
    if (onOpen) onOpen(recipe);
  };

  const handleSave = function (e) {
    e.stopPropagation();
    // If user is not logged in, trigger login modal
    if (onRequireLogin) {
      onRequireLogin(recipe);
      return;
    }

    // Otherwise, call the save callback
    if (onSave) onSave(recipe);
  };

  const descriptionText = recipe.description
    ? recipe.description
        .replace(/<\/?[^>]+(>|$)/g, "")
        .split(" ")
        .slice(0, 25)
        .join(" ") + "..."
    : "No description available.";

  return (
    <article
      className={`recipe-card ${
        isPreview ? "recipe-card--preview-active" : ""
      }`}
      onClick={handleClick}
      tabIndex={0}
    >
      {recipe.image && (
        <img
          src={recipe.image}
          alt={recipe.title || "Recipe Image"}
          className="recipe-card__image"
          loading="lazy"
        />
      )}

      <div className="recipe-card__content">
        <h2 className="recipe-card__title">
          {recipe.title || "Untitled Recipe"}
        </h2>
        <p className="recipe-card__description">{descriptionText}</p>

        {showSaveButton && (
          <button className="recipe-card__save-btn" onClick={handleSave}>
            Save
          </button>
        )}
      </div>

      {isPreview && (
        <div className="recipe-card__preview">
          <h3 className="recipe-card__preview-title">Preview</h3>
          <p className="recipe-card__preview-details">
            {recipe.details || "No details available."}
          </p>
        </div>
      )}
    </article>
  );
}

export default RecipeCard;
