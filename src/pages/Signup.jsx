import React, { useState, useContext } from "react";
import { useNavigate } from "react-router-dom";
import RegisterModal from "../modals/RegisterModal";
import { CurrentUserContext, useAuth } from "../contexts/CurrentUserContext";

const Signup = () => {
  const { signup } = useContext(CurrentUserContext);
  const [showModal, setShowModal] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  // Signup.jsx
  const handleSignUp = (formData) => {
    setError(null);
    return signup(formData) // add return
      .then(() => {
        setShowModal(false);
        navigate("/profile");
      })
      .catch(() => setError("Signup failed (Stage 1 demo)"));
  };

  return (
    <>
      {showModal && (
        <RegisterModal
          onClose={() => setShowModal(false)}
          onSignUp={handleSignUp}
        />
      )}
      {error && <p className="text-red-500">{error}</p>}
    </>
  );
};

export default Signup;
