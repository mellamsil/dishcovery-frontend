import React from "react";
import "./RecipeCard.css";

function RecipeCard({ recipe, onSave, onOpen }) {
  return (
    <article
      className="recipe-card"
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
        {recipe.cookingTime && (
          <p className="recipe-card__time">{recipe.cookingTime} mins</p>
        )}
        <button
          type="button"
          className="btn-primary"
          aria-label={`Save ${recipe.title} to cookbook`}
          onClick={(e) => {
            e.stopPropagation();
            onSave && onSave(recipe);
          }}
        >
          Save to Cookbook
        </button>
      </div>
    </article>
  );
}

export default RecipeCard;
