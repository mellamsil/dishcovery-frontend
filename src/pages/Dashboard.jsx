import React, { useState } from "react";
import SideBar from "../components/SideBar";
import AddItem from "../modals/AddItem";
import EditRecipeConfirm from "../modals/EditRecipeConfirm";
import "../styles/Dashboard.css";

const Dashboard = ({ currentUser, userRecipes, onAddItem, onEditItem }) => {
  const firstName = currentUser?.name?.split(" ")[0] || "User";

  const [showAdd, setShowAdd] = useState(false);
  const [showEdit, setShowEdit] = useState(false);
  const [selectedRecipe, setSelectedRecipe] = useState(null);

  // Open Add modal
  const handleAddClick = () => setShowAdd(true);

  // Open Edit modal
  const handleEditClick = () => {
    if (selectedRecipe) setShowEdit(true);
  };

  // Select recipe when clicked
  const selectRecipe = (recipe) => setSelectedRecipe(recipe);

  return (
    <div className="dashboard">
      {/* Sidebar */}
      <SideBar
        currentUser={currentUser}
        userRecipes={userRecipes}
        onAddItem={handleAddClick}
      />

      {/* Main Content */}
      <main className="dashboard__main">
        {/* Title */}
        <h1 className="dashboard__title">{firstName}'s Cookbook</h1>

        {/* Buttons row */}
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
        </div>

        {/* Intro */}
        <div className="dashboard__intro">
          <p>
            Welcome back, {firstName}! Here you can manage your recipes, add new
            items, and keep your cookbook updated.
          </p>
        </div>

        {/* Cookbook window */}
        <div className="dashboard__cookbook">
          {userRecipes && userRecipes.length > 0 ? (
            userRecipes.map((recipe) => (
              <div
                key={recipe.id ?? recipe._id}
                className={`dashboard__cookbook-item ${
                  selectedRecipe?._id === recipe._id ? "selected" : ""
                }`}
                onClick={() => selectRecipe(recipe)}
              >
                <img
                  src={recipe.image || "/src/assets/images/placeholder.png"}
                  alt={recipe.title}
                  className="dashboard__cookbook-image"
                />
                <p className="dashboard__cookbook-title">{recipe.title}</p>
              </div>
            ))
          ) : (
            <p className="dashboard__empty">
              No recipes yet. Add one to get started!
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
    </div>
  );
};

export default Dashboard;
