import React, { useState, useContext } from "react";
import { useNavigate } from "react-router-dom";
import SignUpModal from "../modals/SignUpModal";
import { CurrentUserContext } from "../contexts/CurrentUserContext";

const Signup = () => {
  const { signup } = useContext(CurrentUserContext);
  const [showModal, setShowModal] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  const handleSignUp = ({ name, email, password }) => {
    setError(null);
    signup(name, email, password)
      .then(() => {
        setShowModal(false);
        navigate("/profile");
      })
      .catch(() => setError("Signup failed (Stage 1 demo)"));
  };

  return (
    <>
      {showModal && (
        <SignUpModal
          isOpen={showModal}
          onClose={() => setShowModal(false)}
          onSignUp={handleSignUp}
        />
      )}
      {error && <p className="text-red-500">{error}</p>}
    </>
  );
};

export default Signup;
