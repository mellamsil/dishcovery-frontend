import React from "react";
import "../styles/noResults.css";

function NoResults({ text = "No recipes found. Try another search!" }) {
  return (
    <div className="no-results">
      <div className="no-results__icon">🍳</div>
      <p className="no-results__text">{text}</p>
    </div>
  );
}

export default NoResults;
