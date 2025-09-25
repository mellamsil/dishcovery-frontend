import React, { useState, useContext } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import "../styles/Header.css";
import { CurrentUserContext } from "../contexts/CurrentUserContext";

function Header() {
  const { currentUser, signout } = useContext(CurrentUserContext);
  const [isOpen, setIsOpen] = useState(false); // hamburger menu for unauthenticated users
  const location = useLocation();
  const navigate = useNavigate();

  const toggleMenu = () => setIsOpen(!isOpen);
  const closeMenu = () => setIsOpen(false);

  const isActive = (path) => location.pathname === path;

  const handleSignOut = () => {
    signout();
    navigate("/");
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
        {!currentUser && (
          <button
            className="hamburger"
            onClick={toggleMenu}
            aria-label="Toggle navigation"
          >
            ☰
          </button>
        )}

        {/* Navigation */}
        {!currentUser ? (
          <nav className={`nav ${isOpen ? "open" : ""}`}>
            <Link
              to="/"
              className={`nav-link ${isActive("/") ? "active" : ""}`}
              onClick={closeMenu}
            >
              Home
            </Link>
            <Link
              to="/signup"
              className={`nav-link ${isActive("/signup") ? "active" : ""}`}
              onClick={closeMenu}
            >
              Sign Up
            </Link>
            <Link
              to="/signin"
              className={`nav-link ${isActive("/signin") ? "active" : ""}`}
              onClick={closeMenu}
            >
              Sign In
            </Link>
          </nav>
        ) : (
          <div className="header__user-container">
            {/* Top row: avatar + name */}
            <div className="header__user-top">
              <img
                src={currentUser.avatar || "/src/assets/images/placeholder.png"}
                alt={`${currentUser.name}'s avatar`}
                className="avatar"
              />
              <span className="user-name">{currentUser.name}</span>
            </div>

            {/* Bottom row: Profile, Dashboard, Sign Out */}
            <div className="header__user-links">
              <Link to="/profile">Profile</Link>
              <Link to="/dashboard">Dashboard</Link>
              <button onClick={handleSignOut}>Sign Out</button>
            </div>
          </div>
        )}
      </div>
    </header>
  );
}

export default Header;
