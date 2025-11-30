import React from "react";
import "../styles/HeroImac.css";
import ImacImage from "../assets/images/iMac.svg";

function HeroImac({ children }) {
  return (
    <div className="hero-imac">
      <div
        className="hero-imac__mockup"
        style={{ backgroundImage: `url(${ImacImage})` }}
      >
        <div className="hero-imac__screen">
          {children ? (
            children
          ) : (
            <p className="hero-imac__placeholder">No recipes to display</p>
          )}
        </div>
      </div>
    </div>
  );
}

export default HeroImac;
