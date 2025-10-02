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

  const [file, setFile] = useState(null);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);
  const modalRef = useRef(null);

  useEffect(() => {
    const focusable = modalRef.current?.querySelectorAll(
      "input, button, textarea, a[href]"
    );
    if (focusable?.length) focusable[0].focus();
  }, []);

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

  const handleFileChange = (e) => {
    const uploadedFile = e.target.files[0];
    if (uploadedFile) {
      setFile(uploadedFile);
      setForm((prev) => ({ ...prev, avatar: uploadedFile }));
    }
  };

  const validateForm = () => {
    if (!form.name.trim() || form.name.length < 2 || form.name.length > 30)
      return "Name must be between 2 and 30 characters.";

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!form.email.trim() || !emailRegex.test(form.email))
      return "Please enter a valid email address.";

    if (!form.password || form.password.length < 8)
      return "Password must be at least 8 characters.";

    if (
      !form.avatar ||
      (typeof form.avatar === "string" && !form.avatar.trim())
    )
      return "Profile picture or avatar URL is required.";

    if (!form.terms) return "You must agree to the Terms and Privacy Policy.";

    return null;
  };

  // Add a helper to calculate form completion
  const getCompletionPercent = () => {
    let filled = 0;
    Object.entries(form).forEach(([key, val]) => {
      if (key === "terms") {
        if (val) filled += 1;
      } else if (val) filled += 1;
    });
    return Math.round((filled / 8) * 100);
  };

  const handleRegisterClick = () => {
    setError(null);

    const validationError = validateForm();
    if (validationError) return setError(validationError);

    setLoading(true);

    // Pass file + form data to parent onSignUp
    onSignUp({ ...form, avatarFile: file })
      .catch((err) => setError(err?.message || "Registration failed"))
      .finally(() => setLoading(false));
  };

  const handleSwitchToLogin = () => {
    if (onSwitchToLogin && typeof onSwitchToLogin === "function") {
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
        Profile Picture (URL)
        <input
          name="avatar"
          type="text"
          value={typeof form.avatar === "string" ? form.avatar : ""}
          onChange={handleChange}
          placeholder="Paste an image link"
        />
      </label>

      <label>
        Or Upload a Picture
        <input type="file" accept="image/*" onChange={handleFileChange} />
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

      {/* Register + Sign In buttons */}
      <div className="modal__actions modal__actions--inline">
        <button
          type="button"
          className="btn btn-primary modal__btn-register"
          onClick={handleRegisterClick}
          disabled={loading}
          data-completion={getCompletionPercent()}
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

export default RegisterModal;
