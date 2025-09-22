import React from "react";
import { useParams } from "react-router-dom";
import RecipeDetailModal from "../modals/RecipeDetailModal";

const RecipeDetails = () => {
  const { id } = useParams();

  // For now, just pass the ID into the modal.
  // Later I can fetch recipe data by ID or use state from RecipeList.
  return (
    <main className="recipe-details">
      <h1>Recipe Details</h1>
      <p>Showing details for recipe ID: {id}</p>

      {/* Example modal usage */}
      <RecipeDetailModal recipeId={id} />
    </main>
  );
};

export default RecipeDetails;
