import React, { useState, useContext } from "react";
import { useNavigate } from "react-router-dom";
import LoginModal from "../modals/LoginModal";
import { CurrentUserContext } from "../contexts/CurrentUserContext";

const Signin = () => {
  const { signin } = useContext(CurrentUserContext);
  const [showModal, setShowModal] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  // Login.jsx
  const handleSignIn = (credentials) => {
    setError(null);
    return signin(credentials) // add return
      .then(() => setShowModal(false))
      .catch(() => setError("Signin failed (Stage 1 demo)"));
  };

  return (
    <>
      {showModal && (
        <LoginModal
          onClose={() => setShowModal(false)}
          onSignIn={handleSignIn}
        />
      )}
      {error && <p className="text-red-500">{error}</p>}
    </>
  );
};

export default Signin;
