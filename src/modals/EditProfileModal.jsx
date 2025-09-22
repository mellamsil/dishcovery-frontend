import React, { useState, useEffect } from "react";
import ModalWithForm from "./ModalWithForm";
import closeIcon from "../assets/icons/close.svg"; // make sure path is correct

function EditProfileModal({ user, onClose, onSave }) {
  const [form, setForm] = useState({
    name: user?.name || "",
    email: user?.email || "",
    avatar: user?.avatar || "",
  });

  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);
  const [isDirty, setIsDirty] = useState(false);

  // Update form when user changes
  useEffect(() => {
    setForm({
      name: user?.name || "",
      email: user?.email || "",
      avatar: user?.avatar || "",
    });
    setIsDirty(false); // reset dirty state when user changes
  }, [user]);

  // Close modal on Escape key
  useEffect(() => {
    function handleKeyDown(e) {
      if (e.key === "Escape") {
        onClose();
      }
    }

    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, [onClose]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
    setIsDirty(true); // mark form as modified
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setError(null);

    if (!form.name.trim()) return setError("Name cannot be empty.");
    if (!form.email.trim()) return setError("Email cannot be empty.");

    setLoading(true);
    const saveResult = onSave(form);

    if (saveResult && saveResult.then) {
      saveResult
        .then(() => {
          setLoading(false);
          onClose();
        })
        .catch((err) => {
          setLoading(false);
          setError(err.message || "Failed to save profile.");
        });
    } else {
      setLoading(false);
      onClose();
    }
  };

  return (
    <ModalWithForm
      title={
        <div className="modal-header">
          <span>Edit Profile</span>
          <button
            type="button"
            className="modal-close-button"
            onClick={onClose}
            aria-label="Close"
          >
            <img src={closeIcon} alt="Close" />
          </button>
        </div>
      }
      onClose={onClose}
      onSubmit={handleSubmit}
      submitText={loading ? "Saving..." : "Save Changes"}
      secondaryText="Cancel"
      secondaryAction={onClose} // ensures Cancel button calls onClose
      isLoading={loading}
      isDirty={isDirty}
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
        Avatar URL
        <input
          name="avatar"
          value={form.avatar}
          onChange={handleChange}
          placeholder="Enter avatar URL"
        />
      </label>
    </ModalWithForm>
  );
}

export default EditProfileModal;
