import React, { useState, useContext, useEffect, useRef } from "react";
import SideBar from "../components/SideBar";
import AddItem from "../modals/AddItem";
import EditRecipeConfirm from "../modals/EditRecipeConfirm";
import DeleteConfirm from "../modals/DeleteConfirm";
import "../styles/Dashboard.css";
import CurrentUserContext from "../contexts/CurrentUserContext";

function Dashboard({ userRecipes = [], onAddItem, onEditItem, onDeleteItem }) {
  const { currentUser } = useContext(CurrentUserContext);

  const [recipes, setRecipes] = useState([]);
  const [favorites, setFavorites] = useState([]);

  const [showAdd, setShowAdd] = useState(false);
  const [showEdit, setShowEdit] = useState(false);
  const [showDelete, setShowDelete] = useState(false);

  const [selectedRecipe, setSelectedRecipe] = useState(null);
  const [showIntro, setShowIntro] = useState(true);

  const [showFavoritesOnly, setShowFavoritesOnly] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");

  const cookbookRef = useRef(null);

  const firstName =
    (currentUser && currentUser.name && currentUser.name.split(" ")[0]) ||
    "User";

  // Load recipe list from parent props (API already done outside Dashboard)
  useEffect(
    function () {
      setRecipes(
        Array.isArray(userRecipes) ? userRecipes : userRecipes.recipes || []
      );
    },
    [userRecipes]
  );

  // Handlers
  const handleAddRecipe = function (newRecipe) {
    const recipeToSave = {
      _id: newRecipe._id || newRecipe.id || Date.now().toString(),
      title: newRecipe.title || "Untitled Recipe",
      description:
        (newRecipe.description &&
          newRecipe.description.replace(/<\/?[^>]+(>|$)/g, "")) ||
        "No description available.",
      image: newRecipe.image || "",
      cookingTime: newRecipe.cookingTime || null,
      details: newRecipe.details || "",
    };

    setRecipes(function (prev) {
      return prev.concat(recipeToSave);
    });

    if (onAddItem) onAddItem(recipeToSave);
    setShowAdd(false);
  };

  const handleConfirmEdit = function (updatedRecipe) {
    if (!updatedRecipe || !updatedRecipe._id) return;

    setRecipes(function (prev) {
      return prev.map(function (r) {
        return r._id === updatedRecipe._id ? { ...r, ...updatedRecipe } : r;
      });
    });

    if (onEditItem) onEditItem(updatedRecipe);

    setShowEdit(false);
    setSelectedRecipe(null);
  };

  const handleConfirmDelete = function (id) {
    setRecipes(function (prev) {
      return prev.filter(function (r) {
        return r._id !== id;
      });
    });

    if (onDeleteItem) onDeleteItem(id);

    setShowDelete(false);
    setSelectedRecipe(null);
  };

  const handleToggleFavorite = function (recipeId) {
    setFavorites(function (prev) {
      return prev.indexOf(recipeId) !== -1
        ? prev.filter(function (id) {
            return id !== recipeId;
          })
        : prev.concat(recipeId);
    });
  };

  // Filtering
  const filteredRecipes = recipes
    .filter(function (r) {
      return r.title
        ? r.title.toLowerCase().includes(searchQuery.toLowerCase())
        : false;
    })
    .filter(function (r) {
      return showFavoritesOnly ? favorites.indexOf(r._id) !== -1 : true;
    });

  // Avatar Helper
  const getAvatar = function () {
    return (
      currentUser?.avatar?.trim() ||
      currentUser?.avatarUrl?.trim() ||
      currentUser?.profileImage?.trim() ||
      ""
    );
  };

  // Render
  return (
    <div className="dashboard">
      <SideBar
        currentUser={currentUser}
        avatarUrl={getAvatar()}
        userRecipes={recipes}
        favorites={favorites}
        onShowIntro={function () {
          setShowIntro(true);
        }}
        showIntro={showIntro}
        onSearch={setSearchQuery}
        showFavoritesOnly={showFavoritesOnly}
        onToggleFavorites={function () {
          setShowFavoritesOnly(function (prev) {
            return !prev;
          });
        }}
      />

      <main className="dashboard__main">
        <div className="dashboard__header">
          <h1 className="dashboard__title">{firstName}'s Cookbook</h1>
        </div>

        <div className="dashboard__actions">
          <button
            className="dashboard__btn add"
            onClick={function () {
              setShowAdd(true);
            }}
          >
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
              collection.{" "}
            </p>
            <button
              className="dashboard__btn hide-intro pulse"
              onClick={function () {
                setShowIntro(false);
              }}
            >
              Hide Intro
            </button>
          </div>
        )}

        <div className="dashboard__cookbook" ref={cookbookRef}>
          {filteredRecipes.length > 0 ? (
            filteredRecipes.map(function (recipe) {
              const isSelected =
                selectedRecipe && selectedRecipe._id === recipe._id;

              return (
                <div
                  key={recipe._id}
                  className={
                    "dashboard__cookbook-item " + (isSelected ? "selected" : "")
                  }
                  onClick={function () {
                    setSelectedRecipe(recipe);
                  }}
                >
                  {recipe.image && recipe.image.trim() && (
                    <img
                      src={recipe.image}
                      alt={recipe.title}
                      className="dashboard__cookbook-image"
                    />
                  )}

                  {isSelected && (
                    <div className="card-actions">
                      <button
                        className="card-action-btn edit-btn"
                        onClick={function (e) {
                          e.stopPropagation();
                          setSelectedRecipe(recipe);
                          setShowEdit(true);
                          setShowDelete(false);
                        }}
                      >
                        ✏️ Edit Recipe
                      </button>

                      <button
                        className="card-action-btn delete-btn"
                        onClick={function (e) {
                          e.stopPropagation();
                          setSelectedRecipe(recipe);
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
                      className={
                        "dashboard__cookbook-favorite " +
                        (favorites.indexOf(recipe._id) !== -1 ? "active" : "")
                      }
                      onClick={function (e) {
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
            <p className="dashboard__empty">No recipes found. Add one!</p>
          )}
        </div>
      </main>

      {showAdd && (
        <AddItem
          onClose={function () {
            setShowAdd(false);
          }}
          onAdd={handleAddRecipe}
        />
      )}

      {showEdit && selectedRecipe && (
        <EditRecipeConfirm
          item={selectedRecipe}
          onCancel={function () {
            setShowEdit(false);
          }}
          onConfirm={handleConfirmEdit}
        />
      )}

      {showDelete && selectedRecipe && (
        <DeleteConfirm
          item={selectedRecipe}
          itemName={selectedRecipe.title}
          onDelete={handleConfirmDelete}
          onClose={function () {
            setShowDelete(false);
          }}
          closeIcon="/src/assets/icons/close.svg"
        />
      )}
    </div>
  );
}

export default Dashboard;
