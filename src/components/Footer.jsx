import React from "react";
import "../styles/Footer.css"; // <-- custom styles

function Footer() {
  return (
    <footer className="footer">
      <div className="footer-container">
        <p className="footer-text">
          © {new Date().getFullYear()} | Designed by Melvin Sillah | All rights
          reserved
        </p>
      </div>
    </footer>
  );
}

export default Footer;
