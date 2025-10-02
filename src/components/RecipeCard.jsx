import React from "react";
import "../styles/RecipeCard.css";

function RecipeCard({ recipe, onOpen, isPreview }) {
  return (
    <article
      className={`recipe-card ${
        isPreview ? "recipe-card--preview-active" : ""
      }`}
      onClick={() => onOpen && onOpen(recipe)}
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
          {recipe.description || "No description available."}
        </p>
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
