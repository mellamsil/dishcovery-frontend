import React, { useState, useContext } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import "../styles/Header.css";
import CurrentUserContext from "../contexts/CurrentUserContext";

function Header({ isLoggedIn, onSignOut, openRegisterModal, openLoginModal }) {
  const [menuOpen, setMenuOpen] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();
  const { currentUser } = useContext(CurrentUserContext);

  const toggleMenu = () => setMenuOpen(!menuOpen);
  const closeMenu = () => setMenuOpen(false);

  const handleSignOut = () => {
    onSignOut();
    navigate("/");
  };

  const isActive = (path) => location.pathname === path;

  // Only use avatar from backend, no local default
  const getAvatar = () =>
    currentUser?.avatar ||
    currentUser?.avatarUrl ||
    currentUser?.profileImage ||
    "";

  // Get first letter fallback if avatar missing
  const getInitial = () => currentUser?.name?.charAt(0).toUpperCase() || "";

  return (
    <header className="header">
      <div className="header-container">
        <h1 className="header__title">
          <Link to="/" onClick={closeMenu}>
            Dishcovery
          </Link>
        </h1>

        {!isLoggedIn && (
          <button
            className="hamburger"
            onClick={toggleMenu}
            aria-label="Toggle navigation"
          >
            ☰
          </button>
        )}

        {!isLoggedIn ? (
          <nav className={`nav${menuOpen ? " open" : ""}`}>
            <Link
              to="/"
              className={`nav-link${isActive("/") ? " active" : ""}`}
              onClick={closeMenu}
            >
              Home
            </Link>
            <button
              className="nav-link"
              onClick={() => {
                openRegisterModal();
                closeMenu();
              }}
            >
              Sign Up
            </button>
            <button
              className="nav-link"
              onClick={() => {
                openLoginModal();
                closeMenu();
              }}
            >
              Sign In
            </button>
          </nav>
        ) : (
          <div className="header__user-container">
            <div className="header__user-top">
              {getAvatar() ? (
                <img
                  src={getAvatar()}
                  alt={`${currentUser?.name || "User"} avatar`}
                  className="avatar"
                />
              ) : (
                <span className="avatar-initial">{getInitial()}</span>
              )}
              <span className="user-name">{currentUser?.name || "User"}</span>
            </div>
            <div className="header__user-links">
              <Link to="/profile" onClick={closeMenu}>
                Profile
              </Link>
              <Link to="/dashboard" onClick={closeMenu}>
                Dashboard
              </Link>
              <button onClick={handleSignOut}>Sign Out</button>
            </div>
          </div>
        )}
      </div>
    </header>
  );
}

export default Header;
