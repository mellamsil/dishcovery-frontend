import React, { useState, useContext } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import RegisterModal from "../modals/RegisterModal";
import { CurrentUserContext } from "../contexts/CurrentUserContext";

const Signup = ({ onClose, onSwitchToLogin }) => {
  const { signup } = useContext(CurrentUserContext);
  const [showModal, setShowModal] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();
  const location = useLocation();

  // If redirected from PrivateRoute, get the original target
  const from = location.state?.from?.pathname || "/dashboard";

  const handleSignUp = (formData) => {
    setError(null);
    return signup(formData)
      .then(() => {
        setShowModal(false);
        if (onClose) onClose();
        navigate(from, { replace: true }); // Redirect after signup
      })
      .catch(() => setError("Signup failed (Stage 1 demo)"));
  };

  const handleSwitchToLogin = () => {
    setShowModal(false);
    if (onSwitchToLogin) onSwitchToLogin();
  };

  return (
    <>
      {showModal && (
        <RegisterModal
          onClose={() => {
            setShowModal(false);
            if (onClose) onClose();
          }}
          onSignUp={handleSignUp}
          onSwitchToLogin={handleSwitchToLogin}
        />
      )}
      {error && <p className="text-red-500">{error}</p>}
    </>
  );
};

export default Signup;
