import React, { useState, useRef, useEffect } from "react";
import PropTypes from "prop-types";
import "../styles/modal.css";
import CloseIcon from "../assets/icons/close.svg";
import ModalWithForm from "./ModalWithForm";

const LoginModal = ({ onClose, onSignIn, onSwitchToRegister }) => {
  const [form, setForm] = useState({ email: "", password: "" });
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);
  const modalRef = useRef(null);

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
      hideSubmit={true}
    >
      {error && (
        <p className="modal-error" aria-live="polite">
          {error}
        </p>
      )}

      <label>
        Email
        <input
          type="email"
          name="email"
          value={form.email}
          onChange={handleChange}
          placeholder="Enter your email"
          required
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
          required
          minLength="8"
        />
      </label>

      <div className="modal__actions modal__actions--inline">
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

LoginModal.propTypes = {
  onClose: PropTypes.func.isRequired,
  onSignIn: PropTypes.func.isRequired,
  onSwitchToRegister: PropTypes.func.isRequired,
};

export default LoginModal;
