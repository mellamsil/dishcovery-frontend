import React, { useContext } from "react";
import { FaSearch, FaLightbulb, FaHeart } from "react-icons/fa";
import "../styles/SideBar.css";
import { CurrentUserContext } from "../contexts/CurrentUserContext";

const SideBar = ({
  userRecipes = [],
  favorites = [],
  onShowIntro,
  showIntro,
  onSearch,
  showFavoritesOnly,
  onToggleFavorites,
}) => {
  const { currentUser } = useContext(CurrentUserContext);

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

      {/* Stats */}
      <div className="sidebar__stats">
        <div className="sidebar__stat-card">
          <h3>{userRecipes.length}</h3>
          <p>Total Recipes</p>
        </div>
        <div className="sidebar__stat-card">
          <h3>{favorites.length}</h3>
          <p>Favorites</p>
        </div>
      </div>

      {/* Actions */}
      <div className="sidebar__actions">
        {/* Favorites toggle */}
        <button
          className={`sidebar__btn show-favorites ${
            showFavoritesOnly ? "active" : ""
          }`}
          onClick={onToggleFavorites}
        >
          <FaHeart className="sidebar__btn-icon" />
          {showFavoritesOnly ? "Show All Recipes" : "Show Favorites Only"}
        </button>

        {/* Search input */}
        <div className="sidebar__search-wrapper">
          <FaSearch className="sidebar__search-icon" />
          <input
            type="text"
            placeholder="Search Saved Recipes"
            className="sidebar__search"
            onChange={(e) => onSearch?.(e.target.value)}
          />
        </div>

        {/* Show Intro */}
        {!showIntro && (
          <button className="sidebar__btn show-intro" onClick={onShowIntro}>
            <FaLightbulb className="sidebar__btn-icon" />
            Show Intro
          </button>
        )}
      </div>
    </aside>
  );
};

export default SideBar;
