import React, { useState, useEffect, useRef } from "react";
import "../styles/modal.css";
import CloseIcon from "../assets/icons/close.svg";
import ModalWithForm from "./ModalWithForm";

const RegisterModal = function ({
  onClose,
  onSignUp,
  onSwitchToLogin,
  onPostRegister,
}) {
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

  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const modalRef = useRef(null);

  useEffect(function () {
    const focusable = modalRef.current?.querySelectorAll("input, button");
    if (focusable?.length) focusable[0].focus();
  }, []);

  const handleChange = function (e) {
    const { name, value, type, checked } = e.target;
    setForm(function (prev) {
      return { ...prev, [name]: type === "checkbox" ? checked : value };
    });
    setError("");
  };

  const isFormComplete = function () {
    return (
      form.name && form.email && form.password && form.avatar && form.terms
    );
  };

  const normalizeDietaryPreferences = function (raw) {
    if (!raw) return [];
    let parsed = [];
    try {
      parsed = JSON.parse(raw);
      if (Array.isArray(parsed)) return parsed.map(String);
    } catch (err) {
      // invalid JSON, fallback to comma-separated
      console.warn("Invalid dietaryPreferences JSON:", err);
    }
    return raw
      .split(",")
      .map(function (s) {
        return s.trim();
      })
      .filter(Boolean);
  };

  const normalizePreferences = function (raw) {
    if (!raw) return {};
    try {
      const parsed = JSON.parse(raw);
      if (parsed && typeof parsed === "object" && !Array.isArray(parsed))
        return parsed;
    } catch (err) {
      // invalid JSON, fallback to comma list
      console.warn("Invalid preferences JSON:", err);
    }
    const list = raw
      .split(",")
      .map(function (s) {
        return s.trim();
      })
      .filter(Boolean);
    return { notes: list };
  };

  const handleRegister = function (e) {
    e.preventDefault();

    if (!isFormComplete()) {
      setError("All required fields must be filled and Terms accepted.");
      return;
    }

    setLoading(true);
    setError("");

    const payload = {
      name: form.name.trim(),
      email: form.email.trim(),
      password: form.password,
      avatar: form.avatar.trim(),
      favoriteCuisine: form.favoriteCuisine.trim() || null,
      dietaryPreferences: normalizeDietaryPreferences(form.dietaryPreferences),
      preferences: normalizePreferences(form.preferences),
    };

    onSignUp(payload)
      .then(function (res) {
        if (onPostRegister) onPostRegister(res);
        onClose();
      })
      .catch(function (err) {
        console.error("Registration failed:", err);

        const backendMessage =
          (err &&
            err.data &&
            err.data.validation &&
            err.data.validation.body &&
            err.data.validation.body.message) ||
          (err && err.data && err.data.message) ||
          err?.message ||
          "Sign-up failed. Please try again later.";

        setError(backendMessage);
      })
      .finally(function () {
        setLoading(false);
      });
  };

  return (
    <ModalWithForm
      title="Sign Up"
      onClose={onClose}
      ref={modalRef}
      closeIcon={CloseIcon}
      onSubmit={handleRegister}
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
          type="email"
          name="email"
          value={form.email}
          onChange={handleChange}
          placeholder="Enter your email"
        />
      </label>

      <label>
        Password
        <input
          type="password"
          name="password"
          value={form.password}
          onChange={handleChange}
          placeholder="Enter your password"
        />
      </label>

      <label>
        Avatar URL
        <input
          name="avatar"
          value={form.avatar}
          onChange={handleChange}
          placeholder="Enter your avatar URL"
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
          placeholder='Comma-separated or JSON array (e.g., "vegan, gluten-free")'
        />
      </label>

      <label>
        Preferences
        <input
          name="preferences"
          value={form.preferences}
          onChange={handleChange}
          placeholder='JSON object or comma list (e.g., {"theme":"dark"} or "spicy, desserts")'
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
        <label htmlFor="terms">
          I agree to the Terms of Service and Privacy Policy
        </label>
      </div>

      <div className="modal__actions">
        <button
          type="submit"
          className={`btn ${isFormComplete() ? "btn-blue" : "btn-grey"}`}
          disabled={loading || !isFormComplete()}
        >
          {loading ? "Registering..." : "Sign Up"}
        </button>
        <button
          type="button"
          className="btn btn-secondary"
          onClick={onSwitchToLogin}
        >
          or Login
        </button>
      </div>
    </ModalWithForm>
  );
};

export default RegisterModal;
