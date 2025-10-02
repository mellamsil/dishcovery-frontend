import React, { useState, useContext } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import "../styles/Header.css";
import CurrentUserContext from "../contexts/CurrentUserContext";

const DEFAULT_AVATAR = "/src/assets/images/user-placeholder.png";

function Header({ isLoggedIn, onSignOut, openRegisterModal, openLoginModal }) {
  const [isOpen, setIsOpen] = useState(false); // hamburger menu for mobile
  const location = useLocation();
  const navigate = useNavigate();
  const { currentUser } = useContext(CurrentUserContext);

  const toggleMenu = () => setIsOpen(!isOpen);
  const closeMenu = () => setIsOpen(false);

  const isActive = (path) => location.pathname === path;

  const handleSignOut = () => {
    onSignOut();
    navigate("/");
  };

  const getAvatar = () => {
    return currentUser?.avatar?.trim() !== ""
      ? currentUser.avatar
      : DEFAULT_AVATAR;
  };

  return (
    <header className="header">
      <div className="header-container">
        {/* Logo / Title */}
        <h1 className="header__title">
          <Link to="/" onClick={closeMenu}>
            Dishcovery
          </Link>
        </h1>

        {/* Hamburger Button (mobile only, unauthenticated users) */}
        {!isLoggedIn && (
          <button
            className="hamburger"
            onClick={toggleMenu}
            aria-label="Toggle navigation"
          >
            ☰
          </button>
        )}

        {/* Navigation */}
        {!isLoggedIn ? (
          <nav className={`nav ${isOpen ? "open" : ""}`}>
            <Link
              to="/"
              className={`nav-link ${isActive("/") ? "active" : ""}`}
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
            {/* Top row: avatar + name */}
            <div className="header__user-top">
              <img
                src={getAvatar()}
                alt={`${currentUser?.name || "User"}'s avatar`}
                className="avatar"
              />
              <span className="user-name">{currentUser?.name || "User"}</span>
            </div>

            {/* Bottom row: Profile, Dashboard, Sign Out */}
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
