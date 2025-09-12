import React, { useState } from "react";
import { Link } from "react-router-dom";
import "./Header.css";

function Header() {
  const [isOpen, setIsOpen] = useState(false);

  const toggleMenu = () => setIsOpen(!isOpen);

  return (
    <header className="header">
      <div className="header__container">
        <h1 className="header__title">Dishcovery</h1>

        {/* Hamburger Button (mobile only) */}
        <button
          className="menu-button"
          onClick={toggleMenu}
          aria-label="Toggle navigation"
        ></button>

        {/* Navigation */}
        <nav className={`nav ${isOpen ? "open" : ""}`}>
          <Link to="/" className="nav-link">
            Home
          </Link>
          <Link to="/signup" className="nav-link">
            Sign Up
          </Link>
          <Link to="/signin" className="nav-link">
            Sign In
          </Link>
          <Link to="/profile" className="nav-link">
            Profile
          </Link>
          <Link to="/favorites" className="nav-link">
            Favorites
          </Link>
          <Link to="/dashboard" className="nav-link">
            Dashboard
          </Link>
        </nav>
      </div>
    </header>
  );
}

export default Header;
