import React, { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import "../styles/Header.css";

function Header() {
  const [isOpen, setIsOpen] = useState(false);
  const location = useLocation(); // get current path

  const toggleMenu = () => setIsOpen(!isOpen);
  const closeMenu = () => setIsOpen(false);

  // Function to check active link
  const isActive = (path) => location.pathname === path;

  return (
    <header className="header">
      <div className="header-container">
        {/* Logo / Title */}
        <h1 className="header__title">
          <Link to="/" onClick={closeMenu}>
            Dishcovery
          </Link>
        </h1>

        {/* Hamburger Button (mobile only) */}
        <button
          className="hamburger"
          onClick={toggleMenu}
          aria-label="Toggle navigation"
        >
          ☰
        </button>

        {/* Navigation */}
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
          <Link
            to="/profile"
            className={`nav-link ${isActive("/profile") ? "active" : ""}`}
            onClick={closeMenu}
          >
            Profile
          </Link>
          <Link
            to="/favorites"
            className={`nav-link ${isActive("/favorites") ? "active" : ""}`}
            onClick={closeMenu}
          >
            Favorites
          </Link>
          <Link
            to="/dashboard"
            className={`nav-link ${isActive("/dashboard") ? "active" : ""}`}
            onClick={closeMenu}
          >
            Dashboard
          </Link>
        </nav>
      </div>
    </header>
  );
}

export default Header;
