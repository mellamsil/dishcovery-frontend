import React, { useState, useEffect } from "react";
import { fetchData, saveRecipe, deleteRecipe } from "../utils/api.mock.js"; // Switch to api.js in production
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

  // Load cookbook from API
  useEffect(() => {
    setLoading(true);
    fetchData("cookbook")
      .then((res) => {
        if (res.success) setRecipes(res.data);
      })
      .finally(() => setLoading(false));
  }, []);

  const handleAddOrEdit = (item) => {
    saveRecipe(item).then((res) => {
      if (res.success) {
        const updated = res.saved;
        const exists = recipes.some((r) => r._id === updated._id);

        setRecipes((prev) =>
          exists
            ? prev.map((r) => (r._id === updated._id ? updated : r))
            : [...prev, updated]
        );

        setNotification(
          exists
            ? `Updated "${updated.title}" successfully.`
            : `Added "${updated.title}" to your cookbook.`
        );
        setNotificationType(exists ? "edit" : "add");
        setTimeout(() => setNotification(""), 2000);
      }
    });
  };

  const handleDelete = (_id) => {
    deleteRecipe(_id).then((res) => {
      if (res.success) {
        const deleted = recipes.find((r) => r._id === res.deletedId);
        setRecipes((prev) => prev.filter((r) => r._id !== res.deletedId));
        setShowDelete(false);

        setNotification(`Deleted "${deleted?.title}" from your cookbook.`);
        setNotificationType("delete");
        setTimeout(() => setNotification(""), 2000);
      }
    });
  };

  // Prevent access if not signed in
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

      {/* Main Content */}
      {loading ? (
        <Preloader text="Loading your cookbook..." />
      ) : recipes.length === 0 ? (
        <NoResults text="Your cookbook is empty. Add some delicious recipes!" />
      ) : (
        <>
          <ul className="cookbook-list">
            {displayedRecipes.map((r) => (
              <li key={r._id} className="cookbook-item">
                <img
                  src={r.image || "/images/placeholder.png"}
                  alt={r.title}
                  className="cookbook-item__image"
                  onError={(e) => (e.target.src = "/images/placeholder.png")}
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

      {/* ===== Modals ===== */}

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

      {/* ===== Notification Toast ===== */}
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
