import React from "react";
import { useParams } from "react-router-dom";
import RecipeDetailModal from "../modals/RecipeDetailModal";

const RecipeDetails = () => {
  const { id } = useParams();

  return (
    <main className="recipe-details">
      <h1>Recipe Details</h1>
      <p>Showing details for recipe ID: {id}</p>

      <RecipeDetailModal recipeId={id} />
    </main>
  );
};

export default RecipeDetails;
