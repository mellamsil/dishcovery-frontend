import React, { useState, useContext, useEffect, useRef } from "react";
import SideBar from "../components/SideBar";
import AddItem from "../modals/AddItem";
import EditRecipeConfirm from "../modals/EditRecipeConfirm";
import DeleteConfirm from "../modals/DeleteConfirm";
import "../styles/Dashboard.css";
import CurrentUserContext from "../contexts/CurrentUserContext";

const Dashboard = ({
  userRecipes: initialRecipes = [],
  onAddItem,
  onEditItem,
  onDeleteItem,
}) => {
  const { currentUser } = useContext(CurrentUserContext);
  const firstName = currentUser?.name?.split(" ")[0] || "User";
  const userKey = `recipes_${currentUser?.id || currentUser?.email || "guest"}`;

  // Load recipes from localStorage per user
  const [recipes, setRecipes] = useState(() => {
    const saved = localStorage.getItem(userKey);
    return saved ? JSON.parse(saved) : initialRecipes;
  });

  const [showAdd, setShowAdd] = useState(false);
  const [showEdit, setShowEdit] = useState(false);
  const [showDelete, setShowDelete] = useState(false);
  const [selectedRecipe, setSelectedRecipe] = useState(null);
  const [favorites, setFavorites] = useState([]);
  const [showIntro, setShowIntro] = useState(true);
  const [showFavoritesOnly, setShowFavoritesOnly] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");

  const cookbookRef = useRef(null);

  // Save recipes to localStorage whenever they change
  useEffect(() => {
    if (currentUser) {
      localStorage.setItem(userKey, JSON.stringify(recipes));
    }
  }, [recipes, userKey]);

  // Deselect card when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (cookbookRef.current && !cookbookRef.current.contains(event.target)) {
        setSelectedRecipe(null);
        setShowEdit(false);
        setShowDelete(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Handlers
  const handleAddClick = () => setShowAdd(true);
  const selectRecipe = (recipe) => setSelectedRecipe(recipe);

  const handleAddRecipe = (newRecipe) => {
    setRecipes((prev) => [...prev, newRecipe]);
    onAddItem?.(newRecipe);
    setShowAdd(false);
  };

  const handleConfirmEdit = (updatedItem) => {
    const updated = recipes.map((r) =>
      r._id === updatedItem._id || r.id === updatedItem.id ? updatedItem : r
    );
    setRecipes(updated);
    onEditItem?.(updatedItem);
    setShowEdit(false);
    setSelectedRecipe(null);
  };

  const handleConfirmDelete = (id) => {
    const updated = recipes.filter((r) => r._id !== id && r.id !== id);
    setRecipes(updated);
    onDeleteItem?.(id);
    setShowDelete(false);
    setSelectedRecipe(null);
  };

  const handleToggleFavorite = (recipeId) => {
    setFavorites((prev) =>
      prev.includes(recipeId)
        ? prev.filter((id) => id !== recipeId)
        : [...prev, recipeId]
    );
  };

  const filteredRecipes = recipes
    .filter((recipe) =>
      recipe.title.toLowerCase().includes(searchQuery.toLowerCase())
    )
    .filter((recipe) =>
      showFavoritesOnly ? favorites.includes(recipe._id) : true
    );

  return (
    <div className="dashboard">
      <SideBar
        currentUser={currentUser}
        userRecipes={recipes}
        favorites={favorites}
        onShowIntro={() => setShowIntro(true)}
        showIntro={showIntro}
        onSearch={setSearchQuery}
        showFavoritesOnly={showFavoritesOnly}
        onToggleFavorites={() => setShowFavoritesOnly((prev) => !prev)}
      />

      <main className="dashboard__main">
        <div className="dashboard__header">
          <h1 className="dashboard__title">{firstName}'s Cookbook</h1>
        </div>

        {/* Add Button Only */}
        <div className="dashboard__actions">
          <button className="dashboard__btn add" onClick={handleAddClick}>
            Add Item or Recipe
          </button>
        </div>

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
        <div className="dashboard__cookbook" ref={cookbookRef}>
          {filteredRecipes.length > 0 ? (
            filteredRecipes.map((recipe) => {
              const isSelected = selectedRecipe?._id === recipe._id;

              return (
                <div
                  key={recipe._id ?? recipe.id}
                  className={`dashboard__cookbook-item ${
                    isSelected ? "selected" : ""
                  }`}
                  onClick={() => selectRecipe(recipe)}
                >
                  <img
                    src={
                      recipe.image && recipe.image.trim() !== ""
                        ? recipe.image
                        : "/images/user-placeholder.png"
                    }
                    alt={recipe.title}
                    className="dashboard__cookbook-image"
                  />

                  {/* Action buttons appear only if selected */}
                  {isSelected && (
                    <div className="card-actions">
                      <button
                        className="card-action-btn edit-btn"
                        onClick={(e) => {
                          e.stopPropagation();
                          setShowEdit(true);
                          setShowDelete(false);
                        }}
                      >
                        ✏️ Edit Recipe
                      </button>
                      <button
                        className="card-action-btn delete-btn"
                        onClick={(e) => {
                          e.stopPropagation();
                          setShowDelete(true);
                          setShowEdit(false);
                        }}
                      >
                        🗑️ Delete Recipe
                      </button>
                    </div>
                  )}

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
              );
            })
          ) : (
            <p className="dashboard__empty">
              No recipes found. Add one to get started!
            </p>
          )}
        </div>
      </main>

      {/* Modals */}
      {showAdd && (
        <AddItem onClose={() => setShowAdd(false)} onAdd={handleAddRecipe} />
      )}
      {showEdit && selectedRecipe && (
        <EditRecipeConfirm
          item={selectedRecipe}
          onCancel={() => setShowEdit(false)}
          onConfirm={handleConfirmEdit}
        />
      )}
      {showDelete && selectedRecipe && (
        <DeleteConfirm
          item={selectedRecipe}
          itemName={selectedRecipe.title}
          onDelete={handleConfirmDelete}
          onClose={() => setShowDelete(false)}
          closeIcon="/src/assets/icons/close.svg"
        />
      )}
    </div>
  );
};

export default Dashboard;
