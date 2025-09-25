import React from "react";
import "../styles/SideBar.css";

const SideBar = ({ currentUser, userRecipes = [] }) => {
  const avatarSrc = currentUser?.avatar || "/src/assets/images/placeholder.png";

  const fullName = currentUser?.name || "Anonymous User";

  return (
    <aside className="sidebar dashboard__sidebar">
      {/* Avatar */}
      <img
        src={avatarSrc}
        alt={`${fullName}'s avatar`}
        className="sidebar__avatar avatar"
      />

      {/* Name */}
      <p className="sidebar__name">{fullName}</p>

      {/* Total Recipes */}
      <p className="sidebar__total">Total Recipes: {userRecipes.length}</p>
    </aside>
  );
};

export default SideBar;
