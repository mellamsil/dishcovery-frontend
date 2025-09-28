import React from "react";

const Favorites = ({ userRecipes = [] }) => {
  const favoriteRecipes = userRecipes.filter((recipe) => recipe.isFavorite);

  return (
    <div className="favorites container">
      <h1 className="favorites__title">Your Favorites</h1>

      {favoriteRecipes.length > 0 ? (
        <div className="favorites__list">
          {favoriteRecipes.map((recipe) => (
            <div key={recipe._id ?? recipe.id} className="favorites__item">
              <img
                src={recipe.image || "/images/placeholder.png"}
                alt={recipe.title}
                className="favorites__image"
              />
              <p className="favorites__title-text">{recipe.title}</p>
            </div>
          ))}
        </div>
      ) : (
        <p className="favorites__intro">
          No saved recipes yet. Tap the ❤️ on a recipe to save it here.
        </p>
      )}
    </div>
  );
};

export default Favorites;
