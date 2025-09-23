import React from "react";
import "../styles/SideBar.css";

const SideBar = ({ currentUser, userRecipes, onAddItem }) => {
  return (
    <aside className="sidebar">
      {/* User Info */}
      <div className="user-info">
        <img
          src={currentUser.avatar || "/src/assets/images/placeholder.png"}
          alt={`${currentUser.name}'s avatar`}
          className="user-avatar"
        />
        <div className="user-details">
          <span className="user-name">{currentUser.name}</span>
          <span className="my-cookbook">My Cookbook</span>
        </div>
      </div>

      {/* Add Item Button */}
      <div className="actions">
        <button className="add-item-btn" onClick={onAddItem}>
          Add Item or Recipe
        </button>
      </div>

      {/* User Recipes */}
      <div className="recipes-list">
        {userRecipes.map((recipe) => (
          <div key={recipe.id} className="recipe-item">
            <img
              src={recipe.image || "/src/assets/images/placeholder.png"}
              alt={recipe.title}
              className="recipe-image"
            />
            <div className="recipe-info">
              <span className="recipe-title">{recipe.title}</span>
            </div>
          </div>
        ))}
      </div>
    </aside>
  );
};

export default SideBar;
