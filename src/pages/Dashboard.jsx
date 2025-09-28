import React, { useState, useContext } from "react";
import SideBar from "../components/SideBar";
import AddItem from "../modals/AddItem";
import EditRecipeConfirm from "../modals/EditRecipeConfirm";
import DeleteConfirm from "../modals/DeleteConfirm";
import "../styles/Dashboard.css";
import { CurrentUserContext } from "../contexts/CurrentUserContext";

const Dashboard = ({
  userRecipes = [],
  onAddItem,
  onEditItem,
  onDeleteItem,
}) => {
  const { currentUser } = useContext(CurrentUserContext);
  const firstName = currentUser?.name?.split(" ")[0] || "User";

  const [showAdd, setShowAdd] = useState(false);
  const [showEdit, setShowEdit] = useState(false);
  const [showDelete, setShowDelete] = useState(false);
  const [selectedRecipe, setSelectedRecipe] = useState(null);
  const [favorites, setFavorites] = useState([]);
  const [showIntro, setShowIntro] = useState(true);
  const [showFavoritesOnly, setShowFavoritesOnly] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");

  // Handlers
  const handleAddClick = () => setShowAdd(true);
  const handleEditClick = () => selectedRecipe && setShowEdit(true);
  const handleDeleteClick = () => selectedRecipe && setShowDelete(true);

  const selectRecipe = (recipe) => setSelectedRecipe(recipe);

  const handleConfirmDelete = (id) => {
    onDeleteItem?.(id);
    setShowDelete(false);
    setSelectedRecipe(null);
  };

  // Toggle favorite
  const handleToggleFavorite = (recipeId) => {
    setFavorites((prev) =>
      prev.includes(recipeId)
        ? prev.filter((id) => id !== recipeId)
        : [...prev, recipeId]
    );
  };

  // Filter recipes
  const filteredRecipes = userRecipes
    .filter((recipe) =>
      recipe.title.toLowerCase().includes(searchQuery.toLowerCase())
    )
    .filter((recipe) =>
      showFavoritesOnly ? favorites.includes(recipe._id) : true
    );

  return (
    <div className="dashboard">
      {/* SideBar */}
      <SideBar
        currentUser={currentUser}
        userRecipes={userRecipes}
        favorites={favorites}
        onShowIntro={() => setShowIntro(true)}
        showIntro={showIntro}
        onSearch={setSearchQuery}
        showFavoritesOnly={showFavoritesOnly}
        onToggleFavorites={() => setShowFavoritesOnly((prev) => !prev)}
      />

      <main className="dashboard__main">
        {/* Dashboard header with user info */}
        <div className="dashboard__header">
          {currentUser && (
            <div className="dashboard__user-info">
              <img
                src={currentUser.avatar || "/default-avatar.png"}
                alt={currentUser.name || "User Avatar"}
                className="dashboard__user-avatar"
              />
              <span className="dashboard__user-name">{currentUser.name}</span>
            </div>
          )}
          <h1 className="dashboard__title">{firstName}'s Cookbook</h1>
        </div>

        <div className="dashboard__actions">
          <button className="dashboard__btn add" onClick={handleAddClick}>
            Add Item or Recipe
          </button>
          <button
            className="dashboard__btn edit"
            onClick={handleEditClick}
            disabled={!selectedRecipe}
          >
            Edit Item or Recipe
          </button>
          <button
            className="dashboard__btn delete"
            onClick={handleDeleteClick}
            disabled={!selectedRecipe}
          >
            Delete Item or Recipe
          </button>
        </div>

        {/* Dashboard Intro */}
        {showIntro && (
          <div className="dashboard__intro">
            <p>
              Welcome back, {firstName}! This is your personal kitchen corner
              Dishcovery where your recipes and food inspirations come together.
              It is your digital cookbook — a place to store family classics,
              experiment with new dishes, and quickly return to meals you love.
              Whether planning for a busy week or saving ideas for a special
              dinner, your dashboard keeps you organized and creative in the
              kitchen. Use the search box to quickly find a recipe, click a card
              to select it for editing, or hit “Add Item or Recipe” to grow your
              collection.
            </p>
            <button
              className="dashboard__btn hide-intro pulse"
              onClick={() => setShowIntro(false)}
            >
              Hide Intro
            </button>
          </div>
        )}

        {/* Cookbook */}
        <div className="dashboard__cookbook">
          {filteredRecipes.length > 0 ? (
            filteredRecipes.map((recipe) => (
              <div
                key={recipe._id ?? recipe.id}
                className={`dashboard__cookbook-item ${
                  selectedRecipe?._id === recipe._id ? "selected" : ""
                }`}
                onClick={() => selectRecipe(recipe)}
              >
                <img
                  src={
                    recipe.image && recipe.image.trim() !== ""
                      ? recipe.image
                      : "/images/placeholder.png"
                  }
                  alt={recipe.title}
                  className="dashboard__cookbook-image"
                />

                <div className="dashboard__cookbook-title-wrapper">
                  <p className="dashboard__cookbook-title">{recipe.title}</p>
                  <span
                    className={`dashboard__cookbook-favorite ${
                      favorites.includes(recipe._id) ? "active" : ""
                    }`}
                    onClick={(e) => {
                      e.stopPropagation();
                      handleToggleFavorite(recipe._id);
                    }}
                  >
                    ♥
                  </span>
                </div>

                {recipe.description && (
                  <p className="dashboard__cookbook-description">
                    {recipe.description.length > 80
                      ? recipe.description.slice(0, 80) + "..."
                      : recipe.description}
                  </p>
                )}
              </div>
            ))
          ) : (
            <p className="dashboard__empty">
              No recipes found. Add one to get started!
            </p>
          )}
        </div>
      </main>

      {/* Modals */}
      {showAdd && (
        <AddItem onClose={() => setShowAdd(false)} onAdd={onAddItem} />
      )}
      {showEdit && selectedRecipe && (
        <EditRecipeConfirm
          item={selectedRecipe}
          onCancel={() => setShowEdit(false)}
          onConfirm={(updatedItem) => {
            onEditItem(updatedItem);
            setShowEdit(false);
            setSelectedRecipe(null);
          }}
        />
      )}
      {showDelete && selectedRecipe && (
        <DeleteConfirm
          item={selectedRecipe}
          onDelete={handleConfirmDelete}
          onCancel={() => setShowDelete(false)}
        />
      )}
    </div>
  );
};

export default Dashboard;
