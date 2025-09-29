import React, { useState, useEffect, useRef } from "react";
import PropTypes from "prop-types";
import "../styles/modal.css";
import CloseIcon from "../assets/icons/close.svg";
import ModalWithForm from "./ModalWithForm";

const RegisterModal = ({ onClose, onSignUp, onSwitchToLogin }) => {
  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
    avatar: "",
    favoriteCuisine: "",
    dietaryPreferences: "",
    preferences: "",
    terms: false,
  });

  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);
  const modalRef = useRef(null);

  // Focus first input
  useEffect(() => {
    const focusable = modalRef.current?.querySelectorAll(
      "input, button, textarea, a[href]"
    );
    if (focusable?.length) focusable[0].focus();
  }, []);

  // Close on ESC
  useEffect(() => {
    const handleEsc = (e) => e.key === "Escape" && onClose();
    document.addEventListener("keydown", handleEsc);
    return () => document.removeEventListener("keydown", handleEsc);
  }, [onClose]);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setForm((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const validateForm = () => {
    if (!form.name.trim() || form.name.length < 2 || form.name.length > 30)
      return "Name must be between 2 and 30 characters.";

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!form.email.trim() || !emailRegex.test(form.email))
      return "Please enter a valid email address.";

    if (!form.password || form.password.length < 8)
      return "Password must be at least 8 characters.";

    if (!form.avatar.trim())
      return "Profile picture or avatar URL is required.";

    if (!form.terms) return "You must agree to the Terms and Privacy Policy.";

    return null;
  };

  const handleRegisterClick = () => {
    setError(null);
    const validationError = validateForm();
    if (validationError) return setError(validationError);

    setLoading(true);
    onSignUp(form)
      .catch((err) => setError(err?.message || "Registration failed"))
      .finally(() => setLoading(false));
  };

  const handleSwitchToLogin = () => {
    if (typeof onSwitchToLogin === "function") {
      onSwitchToLogin();
    } else {
      console.warn("onSwitchToLogin function is not defined in parent");
    }
  };

  return (
    <ModalWithForm
      title="Register"
      onClose={onClose}
      ref={modalRef}
      closeIcon={CloseIcon}
      hideSubmit={true}
    >
      {error && <p className="modal-error">{error}</p>}

      <label>
        Name
        <input
          name="name"
          value={form.name}
          onChange={handleChange}
          placeholder="Enter your full name"
        />
      </label>

      <label>
        Email
        <input
          name="email"
          type="email"
          value={form.email}
          onChange={handleChange}
          placeholder="Enter your email address"
        />
      </label>

      <label>
        Password
        <input
          name="password"
          type="password"
          value={form.password}
          onChange={handleChange}
          placeholder="Enter your password"
        />
      </label>

      <label>
        Profile Picture
        <input
          name="avatar"
          type="text"
          value={form.avatar}
          onChange={handleChange}
          placeholder="Upload a photo or avatar URL"
        />
      </label>

      <label>
        Favorite Cuisine
        <input
          name="favoriteCuisine"
          value={form.favoriteCuisine}
          onChange={handleChange}
          placeholder="e.g., Italian, Mexican"
        />
      </label>

      <label>
        Dietary Preferences
        <input
          name="dietaryPreferences"
          value={form.dietaryPreferences}
          onChange={handleChange}
          placeholder="Specific dietary needs"
        />
      </label>

      <label>
        Preferences
        <input
          name="preferences"
          value={form.preferences}
          onChange={handleChange}
          placeholder="e.g., spicy food, desserts"
        />
      </label>

      <div className="checkbox-row">
        <input
          id="terms"
          type="checkbox"
          name="terms"
          checked={form.terms}
          onChange={handleChange}
        />
        <label htmlFor="terms" className="checkbox-text">
          I agree to the Terms of Service and Privacy Policy
        </label>
      </div>

      <div className="modal__actions modal__actions--inline">
        <button
          type="button"
          className="btn btn-primary"
          onClick={handleRegisterClick}
          disabled={loading}
        >
          {loading ? "Registering..." : "Register"}
        </button>
        <button
          type="button"
          className="btn btn-secondary"
          onClick={handleSwitchToLogin}
        >
          or Sign In
        </button>
      </div>
    </ModalWithForm>
  );
};

RegisterModal.propTypes = {
  onClose: PropTypes.func.isRequired,
  onSignUp: PropTypes.func.isRequired,
  onSwitchToLogin: PropTypes.func.isRequired,
};

export default RegisterModal;
