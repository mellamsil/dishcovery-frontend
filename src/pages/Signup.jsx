import React, { useState, useContext } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import RegisterModal from "../modals/RegisterModal";
import { CurrentUserContext } from "../contexts/CurrentUserContext";

const Signup = () => {
  const { signup } = useContext(CurrentUserContext);
  const [showModal, setShowModal] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();
  const location = useLocation();

  const from = location.state?.from?.pathname || "/dashboard";

  const handleSignUp = (formData) => {
    setError(null);
    return signup(formData)
      .then(() => {
        setShowModal(false);
        navigate(from, { replace: true });
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
