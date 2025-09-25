import React, { useState, useContext } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import LoginModal from "../modals/LoginModal";
import { CurrentUserContext } from "../contexts/CurrentUserContext";

const Signin = () => {
  const { signin } = useContext(CurrentUserContext);
  const [showModal, setShowModal] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();
  const location = useLocation();

  // If redirected from PrivateRoute, get the original target
  const from = location.state?.from?.pathname || "/dashboard";

  // Login handler
  const handleSignIn = (credentials) => {
    setError(null);
    return signin(credentials)
      .then(() => {
        setShowModal(false);
        navigate(from, { replace: true }); // Redirect after login
      })
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
