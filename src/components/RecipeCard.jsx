import React from "react";
import "../styles/RecipeCard.css";

function RecipeCard({ recipe, onOpen }) {
  return (
    <article
      className="recipe-card recipe-card--horizontal"
      onClick={() => onOpen && onOpen(recipe)}
      tabIndex={0}
    >
      {recipe.image && (
        <img
          src={recipe.image}
          alt={recipe.title}
          className="recipe-card__image"
        />
      )}
      <div className="recipe-card__content">
        <h2 className="recipe-card__title">{recipe.title}</h2>
        <p className="recipe-card__description">{recipe.description || ""}</p>
      </div>
    </article>
  );
}

export default RecipeCard;
