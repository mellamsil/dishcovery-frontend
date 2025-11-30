import React, { useContext } from "react";
import { FaSearch, FaLightbulb, FaHeart } from "react-icons/fa";
import "../styles/SideBar.css";
import CurrentUserContext from "../contexts/CurrentUserContext";

function SideBar({
  userRecipes = [],
  favorites = [],
  onShowIntro,
  showIntro,
  onSearch,
  showFavoritesOnly,
  onToggleFavorites,
}) {
  const { currentUser } = useContext(CurrentUserContext);

  if (!currentUser) return null;

  const fullName = currentUser.name || "Anonymous User";

  const getAvatar = function () {
    return (
      currentUser.avatar ||
      currentUser.avatarUrl ||
      currentUser.profileImage ||
      ""
    );
  };

  const getInitial = function () {
    return fullName.charAt(0).toUpperCase();
  };

  return (
    <aside className="sidebar dashboard__sidebar">
      <div className="sidebar__avatar-wrapper">
        {getAvatar() ? (
          <img
            src={getAvatar()}
            alt={fullName + " avatar"}
            className="sidebar__avatar avatar"
          />
        ) : (
          <span className="sidebar__avatar-initial">{getInitial()}</span>
        )}
      </div>

      <p className="sidebar__name">{fullName}</p>

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

      <div className="sidebar__actions">
        <button
          className={
            "sidebar__btn show-favorites " + (showFavoritesOnly ? "active" : "")
          }
          onClick={onToggleFavorites}
        >
          <FaHeart className="sidebar__btn-icon" />
          {showFavoritesOnly ? "Show All Recipes" : "Show Favorites Only"}
        </button>

        <div className="sidebar__search-wrapper">
          <FaSearch className="sidebar__search-icon" />
          <input
            type="text"
            placeholder="Search Saved Recipes"
            className="sidebar__search"
            onChange={function (e) {
              if (onSearch) onSearch(e.target.value);
            }}
          />
        </div>

        {!showIntro && (
          <button className="sidebar__btn show-intro" onClick={onShowIntro}>
            <FaLightbulb className="sidebar__btn-icon" />
            Show Intro
          </button>
        )}
      </div>
    </aside>
  );
}

export default SideBar;
