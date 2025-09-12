import React, { useState } from "react";
import "./modal.css"; // shared modal styles

const SignInModal = ({ onClose, onSignIn }) => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();
    onSignIn({ email, password });
  };

  return (
    <div className="modal-overlay">
      <div className="modal">
        <h2>Sign In</h2>
        <form onSubmit={handleSubmit}>
          <label>
            Email:
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </label>
          <label>
            Password:
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </label>
          <button type="submit" className="btn-primary">
            Sign In
          </button>
        </form>
        <button onClick={onClose} className="btn-cancel">
          Close
        </button>
      </div>
    </div>
  );
};

export default SignInModal;
