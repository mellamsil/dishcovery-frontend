import React from "react";
import RecipeCard from "./RecipeCard";
import "./RecipeList.css";

function RecipeList({ recipes, onOpen, onSave }) {
  if (!recipes || recipes.length === 0) {
    return <p className="recipe-list__empty">No recipes found.</p>;
  }

  return (
    <div className="recipe-list" role="list">
      {recipes.map((recipe) => (
        <RecipeCard
          key={recipe.id}
          recipe={recipe}
          onOpen={onOpen}
          onSave={onSave}
          role="listitem"
        />
      ))}
    </div>
  );
}

export default RecipeList;
