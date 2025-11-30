import React, { useState } from "react";
import RecipeCard from "./RecipeCard";
import RecipeDetailModal from "../modals/RecipeDetailModal";
import "../styles/RecipeList.css";

function RecipeList({ recipes, onSave }) {
  const [selectedRecipe, setSelectedRecipe] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isSaving, setIsSaving] = useState(false);

  const handleOpenModal = (recipe) => {
    setSelectedRecipe(recipe);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setSelectedRecipe(null);
    setIsModalOpen(false);
  };

  const handleSaveRecipe = (recipe) => {
    setIsSaving(true);
    onSave(recipe)
      .then(() => {
        setIsSaving(false);
        handleCloseModal();
      })
      .catch(() => {
        setIsSaving(false);
      });
  };

  if (!recipes || recipes.length === 0) {
    return <p className="recipe-list__empty">No recipes found.</p>;
  }

  return (
    <div className="recipe-list" role="list">
      {recipes.map((recipe) => (
        <RecipeCard
          key={recipe.id}
          recipe={recipe}
          onOpen={handleOpenModal}
          onSave={onSave}
          role="listitem"
        />
      ))}

      {isModalOpen && selectedRecipe && (
        <RecipeDetailModal
          recipe={selectedRecipe}
          isSaving={isSaving}
          onClose={handleCloseModal}
          onSave={handleSaveRecipe}
        />
      )}
    </div>
  );
}

export default RecipeList;
