import React from "react";
import "../styles/RecipeCard.css";

function RecipeCard({ recipe, onOpen }) {
  return (
    <article
      className="recipe-card"
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
    </article>
  );
}

export default RecipeCard;
