import React, { useState, useRef, useEffect } from "react";
import "../styles/modal.css";
import CloseIcon from "../assets/icons/close.svg";
import ModalWithForm from "./ModalWithForm";

const LoginModal = ({ onClose, onSignIn, onSwitchToRegister }) => {
  const [form, setForm] = useState({ email: "", password: "" });
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

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const validateForm = () => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!form.email.trim() || !emailRegex.test(form.email)) {
      return "Please enter a valid email address.";
    }
    if (!form.password || form.password.length < 8) {
      return "Password must be at least 8 characters.";
    }
    return null;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setError(null);

    const validationError = validateForm();
    if (validationError) return setError(validationError);

    if (!onSignIn || typeof onSignIn !== "function") {
      setError("Sign in function is not available.");
      return;
    }

    setLoading(true);
    onSignIn(form)
      .then(() => onClose())
      .catch((err) => setError(err?.message || "Login failed"))
      .finally(() => setLoading(false));
  };

  // Safe wrapper for "or Register"
  const handleSwitchToRegister = () => {
    if (onSwitchToRegister && typeof onSwitchToRegister === "function") {
      onSwitchToRegister();
    } else {
      console.warn("onSwitchToRegister function is not defined in parent");
    }
  };

  return (
    <ModalWithForm
      title="Login"
      onSubmit={handleSubmit}
      onClose={onClose}
      ref={modalRef}
      closeIcon={CloseIcon}
      hideSubmit={true} // hide default submit button
    >
      {error && <p className="modal-error">{error}</p>}

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

      {/* Login + Register buttons */}
      <div className="modal__actions">
        <button
          type="button"
          className="btn btn-primary"
          onClick={handleSubmit}
          disabled={loading}
        >
          {loading ? "Signing In..." : "Login"}
        </button>
        <button
          type="button"
          className="btn btn-secondary"
          onClick={handleSwitchToRegister}
        >
          or Register
        </button>
      </div>
    </ModalWithForm>
  );
};

export default LoginModal;
