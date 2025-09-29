import React, { useState, useContext } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import LoginModal from "../modals/LoginModal";
import { CurrentUserContext } from "../contexts/CurrentUserContext";

const Signin = ({ onSwitchToRegister }) => {
  const { signin } = useContext(CurrentUserContext);
  const [showModal, setShowModal] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();
  const location = useLocation();

  const from = location.state?.from?.pathname || "/dashboard";

  const handleSignIn = (credentials) => {
    setError(null);
    return signin(credentials)
      .then(() => {
        setShowModal(false);
        navigate(from, { replace: true });
      })
      .catch(() => setError("Signin failed (Stage 1 demo)"));
  };

  return (
    <>
      {showModal && (
        <LoginModal
          onClose={() => setShowModal(false)}
          onSignIn={handleSignIn}
          onSwitchToRegister={onSwitchToRegister} // pass it down
        />
      )}
      {error && <p className="text-red-500">{error}</p>}
    </>
  );
};

export default Signin;
