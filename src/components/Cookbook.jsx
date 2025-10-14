import React, { useState, useEffect } from "react";
import {
  getRecipes,
  createRecipe,
  updateRecipe,
  deleteRecipe,
} from "../utils/api.js";
import AddItem from "./AddItem";
import DeleteConfirm from "./DeleteConfirm";
import EditRecipeConfirm from "./EditRecipeConfirm";
import NoResults from "./NoResults";
import Preloader from "./Preloader";
import "../styles/Cookbook.css";

function Cookbook({ isSignedIn }) {
  const [recipes, setRecipes] = useState([]);
  const [activeItem, setActiveItem] = useState(null);
  const [showAdd, setShowAdd] = useState(false);
  const [showDelete, setShowDelete] = useState(false);
  const [showEditConfirm, setShowEditConfirm] = useState(false);
  const [loading, setLoading] = useState(true);
  const [notification, setNotification] = useState("");
  const [notificationType, setNotificationType] = useState("add");
  const [visibleCount, setVisibleCount] = useState(3);
  const [searchQuery, setSearchQuery] = useState("");

  const token = localStorage.getItem("token");

  // Fetch recipes from backend, optionally with a search query
  const fetchRecipes = (query = "") => {
    setLoading(true);
    getRecipes(query)
      .then((data) => setRecipes(data || []))
      .catch((err) => {
        console.error("Failed to fetch recipes:", err.message);
        setRecipes([]);
      })
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    fetchRecipes();
  }, []);

  const handleAddOrEdit = (item) => {
    const apiCall = item._id
      ? updateRecipe(item._id, item, token)
      : createRecipe(item, token);

    apiCall.then((saved) => {
      if (!saved) return;

      const exists = recipes.some((r) => r._id === saved._id);
      setRecipes((prev) =>
        exists
          ? prev.map((r) => (r._id === saved._id ? saved : r))
          : [...prev, saved]
      );

      setNotification(
        exists
          ? `Updated "${saved.title}" successfully.`
          : `Added "${saved.title}" to your cookbook.`
      );
      setNotificationType(exists ? "edit" : "add");
      setTimeout(() => setNotification(""), 2000);
    });
  };

  const handleDelete = (_id) => {
    deleteRecipe(_id, token).then(() => {
      const deleted = recipes.find((r) => r._id === _id);
      setRecipes((prev) => prev.filter((r) => r._id !== _id));
      setShowDelete(false);

      setNotification(`Deleted "${deleted?.title}" from your cookbook.`);
      setNotificationType("delete");
      setTimeout(() => setNotification(""), 2000);
    });
  };

  const handleSearch = (e) => {
    e.preventDefault();
    fetchRecipes(searchQuery);
    setVisibleCount(3);
  };

  if (!isSignedIn) {
    return (
      <p className="cookbook__signin-msg">
        Please sign in to access your cookbook.
      </p>
    );
  }

  const displayedRecipes = recipes.slice(0, visibleCount);

  return (
    <div className="cookbook">
      {/* Header */}
      <div className="cookbook__header">
        <h2>My Cookbook</h2>
        <button
          className="cookbook__add-btn"
          onClick={() => {
            setShowAdd(true);
            setActiveItem(null);
          }}
          aria-label="Add a new recipe"
        >
          + Add Recipe
        </button>
      </div>

      {/* Search */}
      <form className="cookbook__search" onSubmit={handleSearch}>
        <input
          type="text"
          placeholder="Search recipes..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
        />
        <button type="submit">Search</button>
      </form>

      {/* Main Content */}
      {loading ? (
        <Preloader text="Loading your cookbook..." />
      ) : recipes.length === 0 ? (
        <NoResults text="No recipes found. Add some delicious recipes!" />
      ) : (
        <>
          <ul className="cookbook-list">
            {displayedRecipes.map((r) => (
              <li key={r._id} className="cookbook-item">
                <img
                  src={r.image || "/images/user-placeholder.png"}
                  alt={r.title}
                  className="cookbook-item__image"
                  onError={(e) =>
                    (e.target.src = "/images/user-placeholder.png")
                  }
                />
                <div className="cookbook-item__content">
                  <strong className="cookbook-item__title">{r.title}</strong>
                  <div className="cookbook-actions">
                    <button
                      className="cookbook-btn edit"
                      onClick={() => {
                        setActiveItem(r);
                        setShowEditConfirm(true);
                      }}
                      aria-label={`Edit ${r.title}`}
                    >
                      Edit
                    </button>
                    <button
                      className="cookbook-btn delete"
                      onClick={() => {
                        setActiveItem(r);
                        setShowDelete(true);
                      }}
                      aria-label={`Remove ${r.title}`}
                    >
                      Remove
                    </button>
                  </div>
                </div>
              </li>
            ))}
          </ul>

          {visibleCount < recipes.length && (
            <button
              className="cookbook__show-more"
              onClick={() => setVisibleCount((prev) => prev + 3)}
              aria-label="Show more recipes"
            >
              Show more
            </button>
          )}
        </>
      )}

      {/* Modals */}
      {showEditConfirm && activeItem && (
        <EditRecipeConfirm
          item={activeItem}
          onConfirm={() => {
            setShowEditConfirm(false);
            setShowAdd(true);
          }}
          onCancel={() => setShowEditConfirm(false)}
        />
      )}

      {showAdd && (
        <AddItem
          item={activeItem}
          onClose={() => setShowAdd(false)}
          onAdd={handleAddOrEdit}
        />
      )}

      {showDelete && activeItem && (
        <DeleteConfirm
          item={activeItem}
          onDelete={handleDelete}
          onCancel={() => setShowDelete(false)}
        />
      )}

      {/* Notification */}
      {notification && (
        <div
          className={`cookbook__notification ${notificationType}`}
          role="status"
          aria-live="polite"
        >
          {notification}
        </div>
      )}
    </div>
  );
}

export default Cookbook;
