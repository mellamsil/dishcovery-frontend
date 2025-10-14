import React from "react";
import "../styles/RecipeCard.css";

function RecipeCard({ recipe, onOpen, onSave, isPreview }) {
  const handleClick = () => {
    if (onOpen) onOpen(recipe);
  };

  const handleSave = (e) => {
    e.stopPropagation();
    if (onSave) onSave(recipe);
  };

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
        <p className="recipe-card__description">
          {(recipe.description &&
            recipe.description
              .replace(/<\/?[^>]+(>|$)/g, "") // strip HTML tags from Spoonacular
              .split(" ")
              .slice(0, 25)
              .join(" ") + "...") ||
            "No description available."}
        </p>
        {onSave && (
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
