import React, { useState, useEffect, useRef } from "react";
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

  // Focus first input on mount
  useEffect(() => {
    const focusable = modalRef.current?.querySelectorAll(
      "input, button, textarea, a[href]"
    );
    if (focusable?.length) focusable[0].focus();
  }, []);

  // Close modal on Escape key
  useEffect(() => {
    const handleEsc = (e) => e.key === "Escape" && onClose();
    document.addEventListener("keydown", handleEsc);
    return () => document.removeEventListener("keydown", handleEsc);
  }, [onClose]);

  // Handle input changes
  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setForm((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  // Validate form
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

  // Handle form submission
  const handleSubmit = (e) => {
    e.preventDefault();
    setError(null);

    const validationError = validateForm();
    if (validationError) return setError(validationError);

    if (!onSignUp || typeof onSignUp !== "function") {
      setError("Sign up function is not available.");
      return;
    }

    setLoading(true);
    onSignUp(form)
      .then(() => onClose())
      .catch((err) => setError(err?.message || "Registration failed"))
      .finally(() => setLoading(false));
  };

  // Progress for dynamic button styling
  const getCompletion = () => {
    const requiredFields = ["name", "email", "password", "avatar"];
    let filled = requiredFields.filter(
      (field) => form[field]?.trim() !== ""
    ).length;
    if (form.terms) filled++;
    return Math.floor((filled / (requiredFields.length + 1)) * 100);
  };

  const completion = getCompletion();
  const buttonClass =
    completion >= 100
      ? "btn-complete"
      : completion >= 75
      ? "btn-progress-3"
      : completion >= 50
      ? "btn-progress-2"
      : completion >= 25
      ? "btn-progress-1"
      : "btn-progress-0";

  return (
    <ModalWithForm
      title="Register"
      onSubmit={handleSubmit}
      onClose={onClose}
      ref={modalRef}
      closeIcon={CloseIcon}
      submitText={loading ? "Registering..." : "Register"}
      secondaryText="or Sign In"
      secondaryAction={onSwitchToLogin}
      isLoading={loading}
      submitClassName={buttonClass}
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
    </ModalWithForm>
  );
};

export default RegisterModal;
