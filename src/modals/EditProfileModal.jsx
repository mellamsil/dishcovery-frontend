import React, { useState, useEffect } from "react";
import ModalWithForm from "./ModalWithForm";
import closeIcon from "../assets/icons/close.svg";

function EditProfileModal({ currentUser, onClose, onUpdate }) {
  const [form, setForm] = useState({
    name: currentUser?.name || "",
    avatar: currentUser?.avatar || "",
    email: currentUser?.email || "",
    newEmail: "",
    confirmEmail: "",
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  });

  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    setForm({
      name: currentUser?.name || "",
      avatar: currentUser?.avatar || "",
      email: currentUser?.email || "",
      newEmail: "",
      confirmEmail: "",
      currentPassword: "",
      newPassword: "",
      confirmPassword: "",
    });
  }, [currentUser]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);

    if (!form.name.trim()) return setError("Name cannot be empty.");

    // Validate new email
    if (form.newEmail || form.confirmEmail) {
      if (form.newEmail !== form.confirmEmail)
        return setError("New email and confirmation do not match.");
    }

    // Validate password change
    let passwordUpdate = null;
    if (form.newPassword || form.confirmPassword) {
      if (!form.currentPassword)
        return setError("Current password is required to change password.");
      if (form.newPassword !== form.confirmPassword)
        return setError("New password and confirmation do not match.");

      passwordUpdate = {
        currentPassword: form.currentPassword,
        newPassword: form.newPassword,
      };
    }

    setLoading(true);
    try {
      await onUpdate({
        name: form.name,
        avatar: form.avatar,
        email: form.email,
        newEmail: form.newEmail || undefined,
        passwordUpdate,
      });
      onClose();
    } catch (err) {
      setError(err.message || "Failed to save profile.");
    } finally {
      setLoading(false);
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
      secondaryAction={onClose}
      isLoading={loading}
      isDirty={true}
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
        Avatar URL
        <input
          name="avatar"
          value={form.avatar}
          onChange={handleChange}
          placeholder="Enter avatar URL"
        />
      </label>

      <hr />

      <label>
        New Email
        <input
          name="newEmail"
          type="email"
          value={form.newEmail}
          onChange={handleChange}
          placeholder="Enter new email"
        />
      </label>

      <label>
        Confirm Email
        <input
          name="confirmEmail"
          type="email"
          value={form.confirmEmail}
          onChange={handleChange}
          placeholder="Confirm new email"
        />
      </label>

      <hr />

      <label>
        Current Password
        <input
          name="currentPassword"
          type="password"
          value={form.currentPassword}
          onChange={handleChange}
          placeholder="Current password"
        />
      </label>

      <label>
        New Password
        <input
          name="newPassword"
          type="password"
          value={form.newPassword}
          onChange={handleChange}
          placeholder="New password"
        />
      </label>

      <label>
        Confirm Password
        <input
          name="confirmPassword"
          type="password"
          value={form.confirmPassword}
          onChange={handleChange}
          placeholder="Confirm new password"
        />
      </label>
    </ModalWithForm>
  );
}

export default EditProfileModal;
