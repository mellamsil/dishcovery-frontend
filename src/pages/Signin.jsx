import React, { useState, useContext } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import LoginModal from "../modals/LoginModal";
import { CurrentUserContext } from "../contexts/CurrentUserContext";

const Signin = ({ onSwitchToRegister }) => {
  const { setCurrentUser } = useContext(CurrentUserContext);
  const [showModal, setShowModal] = useState(true);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const navigate = useNavigate();
  const location = useLocation();
  const redirectPath = location.state?.from?.pathname || "/dashboard";

  const handleSignIn = async (credentials) => {
    setError(null);
    setLoading(true);

    const url = "/auth/signin";
    console.log("[Signin] Sending POST to:", url, "with data:", credentials);

    try {
      const response = await fetch(url, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(credentials),
      });

      const data = await response.json();
      console.log("[Signin] Response status:", response.status, "Body:", data);

      switch (response.status) {
        case 200:
          if (data.token) localStorage.setItem("authToken", data.token);
          if (data.user) setCurrentUser(data.user);
          setShowModal(false);
          navigate(redirectPath, { replace: true });
          break;

        case 400:
          setError("Incorrect password. Please try again.");
          break;

        case 403:
          setError("This account has been deleted.");
          break;

        case 404:
          setError(
            "Email not registered. Please register first. (Check backend route!)"
          );
          // temporarily prevent auto-opening register modal
          // if (typeof onSwitchToRegister === "function") {
          //   setTimeout(onSwitchToRegister, 500);
          // }
          break;

        default:
          setError(data.message || "Signin failed. Please try again later.");
          break;
      }
    } catch (err) {
      console.error("[Signin] Unexpected error:", err);
      setError(
        err.message || "An unexpected error occurred. Please try again."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      {showModal && (
        <LoginModal
          onClose={() => setShowModal(false)}
          onSignIn={handleSignIn}
          onSwitchToRegister={onSwitchToRegister}
          loading={loading}
          error={error}
        />
      )}
    </>
  );
};

export default Signin;
