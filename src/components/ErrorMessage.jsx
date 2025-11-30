import React from "react";
import "../styles/error.css";

function ErrorMessage({ message }) {
  return (
    <div className="error-message">
      <p>{message}</p>
    </div>
  );
}

export default ErrorMessage;
