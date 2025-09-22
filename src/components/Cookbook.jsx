import React, { useState, useEffect } from "react";
import { fetchData, saveRecipe, deleteRecipe } from "../utils"; // using api.mock.js or api.js
import AddItem from "./AddItem";
import DeleteConfirm from "./DeleteConfirm";
import EditRecipeConfirm from "./EditRecipeConfirm";
import NoResults from "./NoResults";
import Preloader from "./Preloader";
import "../styles/Cookbook.css";

function Cookbook({ isSignedIn }) {
  const [recipes, setRecipes] = useState([]);
  const [activeItem, setActiveItem] = useState(null); // current recipe
  const [showAdd, setShowAdd] = useState(false);
  const [showDelete, setShowDelete] = useState(false);
  const [showEditConfirm, setShowEditConfirm] = useState(false);
  const [loading, setLoading] = useState(true);
  const [notification, setNotification] = useState("");
  const [notificationType, setNotificationType] = useState("add"); // "add" | "edit" | "delete"
  const [visibleCount, setVisibleCount] = useState(3); // incremental rendering

  // Load from mock API on mount
  useEffect(() => {
    setLoading(true);
    fetchData("cookbook")
      .then((res) => {
        if (res.success) setRecipes(res.data);
        setLoading(false);
      })
      .catch(() => {
        setLoading(false);
      });
  }, []);

  const handleAddOrEdit = (item) => {
    saveRecipe(item).then((res) => {
      if (res.success) {
        const updated = res.saved;
        setRecipes((prev) => {
          const exists = prev.some((r) => r._id === updated._id);
          return exists
            ? prev.map((r) => (r._id === updated._id ? updated : r))
            : [...prev, updated];
        });

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

  if (!isSignedIn) {
    return <p>Please sign in to access your cookbook.</p>;
  }

  const displayedRecipes = recipes.slice(0, visibleCount);

  return (
    <div className="cookbook">
      <h2>My Cookbook</h2>
      <button
        onClick={() => {
          setShowAdd(true);
          setActiveItem(null);
        }}
      >
        Add Recipe
      </button>

      {loading ? (
        <Preloader text="Loading your cookbook..." />
      ) : recipes.length === 0 ? (
        <NoResults text="Your cookbook is empty. Add some delicious recipes!" />
      ) : (
        <>
          <ul className="cookbook-list">
            {displayedRecipes.map((r) => (
              <li key={r._id} className="cookbook-item">
                {r.image && (
                  <img
                    src={r.image}
                    alt={r.title}
                    className="cookbook-item__image"
                  />
                )}
                <div className="cookbook-item__content">
                  <strong className="cookbook-item__title">{r.title}</strong>
                  <div className="cookbook-actions">
                    <button
                      className="cookbook-btn edit"
                      onClick={() => {
                        setActiveItem(r);
                        setShowEditConfirm(true);
                      }}
                    >
                      Edit
                    </button>
                    <button
                      className="cookbook-btn delete"
                      onClick={() => {
                        setActiveItem(r);
                        setShowDelete(true);
                      }}
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
            >
              Show more
            </button>
          )}
        </>
      )}

      {/* Edit Confirmation Modal */}
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

      {/* Add/Edit Modal */}
      {showAdd && (
        <AddItem
          item={activeItem}
          onClose={() => setShowAdd(false)}
          onAdd={handleAddOrEdit}
        />
      )}

      {/* Delete Confirmation Modal */}
      {showDelete && activeItem && (
        <DeleteConfirm
          item={activeItem}
          onDelete={handleDelete}
          onCancel={() => setShowDelete(false)}
        />
      )}

      {/* Notification Toast */}
      {notification && (
        <div className={`cookbook__notification ${notificationType}`}>
          {notification}
        </div>
      )}
    </div>
  );
}

export default Cookbook;
