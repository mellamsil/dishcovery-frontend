import React, { useState, useContext } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import LoginModal from "../modals/LoginModal";
import RegisterModal from "../modals/RegisterModal";
import { CurrentUserContext } from "../contexts/CurrentUserContext";

const Signin = () => {
  const { signin, signup } = useContext(CurrentUserContext);
  const [showLogin, setShowLogin] = useState(true);
  const [showRegister, setShowRegister] = useState(false);
  const [error, setError] = useState(null);
  const navigate = useNavigate();
  const location = useLocation();

  const from = location.state?.from?.pathname || "/dashboard";

  // Handle login
  const handleSignIn = (credentials) => {
    setError(null);
    return signin(credentials)
      .then(() => {
        setShowLogin(false);
        navigate(from, { replace: true });
      })
      .catch(() => setError("Signin failed (Stage 1 demo)"));
  };

  // Handle register (optional: Stage 1 demo)
  const handleSignUp = (formData) => {
    setError(null);
    return signup(formData)
      .then(() => {
        setShowRegister(false);
        navigate(from, { replace: true });
      })
      .catch(() => setError("Signup failed (Stage 1 demo)"));
  };

  // Switch from login → register
  const handleSwitchToRegister = () => {
    setShowLogin(false);
    setShowRegister(true);
  };

  // Switch from register → login
  const handleSwitchToLogin = () => {
    setShowRegister(false);
    setShowLogin(true);
  };

  return (
    <>
      {showLogin && (
        <LoginModal
          onClose={() => setShowLogin(false)}
          onSignIn={handleSignIn}
          onSwitchToRegister={handleSwitchToRegister}
        />
      )}

      {showRegister && (
        <RegisterModal
          onClose={() => setShowRegister(false)}
          onSignUp={handleSignUp}
          onSwitchToLogin={handleSwitchToLogin}
        />
      )}

      {error && <p className="text-red-500">{error}</p>}
    </>
  );
};

export default Signin;
