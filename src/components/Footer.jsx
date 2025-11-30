import React from "react";
import { useNavigate } from "react-router-dom";
import "../styles/Footer.css";

function Footer({ currentUser, openRegisterModal, openLoginModal }) {
  const navigate = useNavigate();

  const handleProfileClick = () => {
    if (currentUser) {
      navigate("/profile");
    } else if (typeof openLoginModal === "function") {
      openLoginModal();
    } else {
      console.warn("Login modal function not provided!");
    }
  };

  return (
    <footer className="footer">
      <div className="footer-container">
        {/* Left: Copyright */}
        <p className="footer-text">
          © {new Date().getFullYear()} Dishcovery | Designed by Melvin Sillah |
          All rights reserved
        </p>

        {/* Middle: Navigation */}
        <nav className="footer-nav">
          <button
            type="button"
            className="footer-link-btn"
            onClick={() => navigate("/")}
          >
            Home
          </button>

          {!currentUser && (
            <>
              <button
                type="button"
                className="footer-link-btn"
                onClick={openLoginModal}
              >
                Sign In
              </button>

              <button
                type="button"
                className="footer-link-btn"
                onClick={openRegisterModal}
              >
                Sign Up
              </button>
            </>
          )}

          <button
            type="button"
            className="footer-link-btn"
            onClick={handleProfileClick}
          >
            Profile
          </button>
        </nav>

        {/* Right: Social icons */}
        <div className="footer-socials">
          <a
            href="https://twitter.com"
            target="_blank"
            rel="noopener noreferrer"
            className="social-link"
          >
            🌐
          </a>
          <a
            href="https://facebook.com"
            target="_blank"
            rel="noopener noreferrer"
            className="social-link"
          >
            👍
          </a>
          <a
            href="https://instagram.com"
            target="_blank"
            rel="noopener noreferrer"
            className="social-link"
          >
            📸
          </a>
        </div>
      </div>
    </footer>
  );
}

export default Footer;
