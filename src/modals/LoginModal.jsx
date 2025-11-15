import React, { useState, useEffect, useRef } from "react";
import PropTypes from "prop-types";
import "../styles/modal.css";
import CloseIcon from "../assets/icons/close.svg";
import ModalWithForm from "./ModalWithForm";

const LoginModal = function ({
  onClose,
  onSignIn,
  onSwitchToRegister,
  onRequireRegister,
}) {
  const [form, setForm] = useState({ email: "", password: "" });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const modalRef = useRef(null);

  // Focus first input on open
  useEffect(function () {
    const focusable = modalRef.current?.querySelectorAll("input, button");
    if (focusable?.length) focusable[0].focus();
  }, []);

  // Close modal on ESC
  useEffect(
    function () {
      const handleEsc = function (e) {
        if (e.key === "Escape") onClose();
      };
      document.addEventListener("keydown", handleEsc);
      return function () {
        document.removeEventListener("keydown", handleEsc);
      };
    },
    [onClose]
  );

  const handleChange = function (e) {
    const { name, value } = e.target;
    setForm(function (prev) {
      return { ...prev, [name]: value };
    });
    setError("");
  };

  const validateForm = function () {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!form.email.trim() || !emailRegex.test(form.email)) {
      return "Please enter a valid email address.";
    }
    if (!form.password || form.password.length < 8) {
      return "Password must be at least 8 characters long.";
    }
    return null;
  };

  const handleSubmit = function (e) {
    e.preventDefault();

    const validationError = validateForm();
    if (validationError) {
      setError(validationError);
      return;
    }

    setLoading(true);
    setError("");

    // Call onSignIn (returns a Promise)
    onSignIn(form)
      .then(function (res) {
        const token = localStorage.getItem("authToken");

        // If login fails due to unregistered email, trigger register modal
        if (
          res &&
          res.message &&
          (res.message.includes("User not found") ||
            res.message.includes("Incorrect password"))
        ) {
          if (onRequireRegister) onRequireRegister(form.email);
          setError(
            "No account found. Please register to save recipes to your cookbook."
          );
          setLoading(false);
          return;
        }

        if (!token) {
          setError("Login succeeded but no token was stored.");
          setLoading(false);
          return;
        }

        // Successful login
        onClose();
      })
      .catch(function (err) {
        console.error("Login failed:", err);
        setError(
          err?.message || "Login failed. Please check your credentials."
        );
      })
      .finally(function () {
        setLoading(false);
      });
  };

  const isFormValid = form.email.trim() !== "" && form.password.trim() !== "";

  return (
    <ModalWithForm
      title="Login"
      onClose={onClose}
      onSubmit={handleSubmit}
      ref={modalRef}
      closeIcon={CloseIcon}
      hideSubmit={true}
    >
      {error && <p className="modal-error">{error}</p>}

      <label htmlFor="email">
        Email
        <input
          id="email"
          type="email"
          name="email"
          value={form.email}
          onChange={handleChange}
          placeholder="Enter your email"
          autoComplete="username"
          required
        />
      </label>

      <label htmlFor="password">
        Password
        <input
          id="password"
          type="password"
          name="password"
          value={form.password}
          onChange={handleChange}
          placeholder="Enter your password"
          autoComplete="current-password"
          required
        />
      </label>

      <div className="modal__actions modal__actions--inline">
        <button
          type="submit"
          className={`btn ${isFormValid ? "btn-blue" : "btn-grey"}`}
          disabled={loading || !isFormValid}
        >
          {loading ? "Signing In…" : "Login"}
        </button>

        <button
          type="button"
          className="btn btn-secondary"
          onClick={onSwitchToRegister}
          disabled={loading}
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
  onRequireRegister: PropTypes.func,
};

export default LoginModal;
