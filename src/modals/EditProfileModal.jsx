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

  const [avatarFile, setAvatarFile] = useState(null);
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
    setAvatarFile(null);
  }, [currentUser]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm(function (prev) {
      return Object.assign({}, prev, { [name]: value });
    });
  };

  const handleFileChange = function (e) {
    var file = e.target.files[0];
    if (file) {
      setAvatarFile(file);
      setForm(function (prev) {
        return Object.assign({}, prev, { avatar: "" });
      });
    }
  };

  const handleSubmit = function (e) {
    e.preventDefault();
    setError(null);

    if (!form.name.trim()) return setError("Name cannot be empty.");

    if (form.newEmail || form.confirmEmail) {
      if (form.newEmail !== form.confirmEmail) {
        return setError("New email and confirmation do not match.");
      }
    }

    var passwordUpdate = null;
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

    // Use Promise instead of async/await
    onUpdate({
      name: form.name,
      avatar: form.avatar,
      avatarFile: avatarFile,
      email: form.email,
      newEmail: form.newEmail || undefined,
      passwordUpdate: passwordUpdate,
    })
      .then(function () {
        setLoading(false);
        onClose();
      })
      .catch(function (err) {
        setLoading(false);
        setError(err && err.message ? err.message : "Failed to save profile.");
      });
  };

  return (
    <ModalWithForm
      title="Edit Profile"
      onClose={onClose}
      onSubmit={handleSubmit}
      submitText={loading ? "Saving..." : "Save Changes"}
      secondaryText="Cancel"
      secondaryAction={onClose}
      isLoading={loading}
      isDirty={true}
      closeIcon={closeIcon}
    >
      {error && (
        <p className="modal__error" aria-live="polite">
          {error}
        </p>
      )}

      <label className="modal__label" htmlFor="profile-name">
        Name:
        <input
          id="profile-name"
          name="name"
          type="text"
          className="modal__input"
          value={form.name}
          onChange={handleChange}
          placeholder="Enter your full name"
          disabled={loading}
        />
      </label>

      <label className="modal__label" htmlFor="profile-avatar">
        Avatar URL:
        <input
          id="profile-avatar"
          name="avatar"
          type="text"
          className="modal__input"
          value={avatarFile ? "" : form.avatar}
          onChange={handleChange}
          placeholder="Enter avatar URL"
          disabled={!!avatarFile || loading}
        />
      </label>

      <label className="modal__label" htmlFor="profile-avatar-file">
        Or Upload a Picture:
        <input
          id="profile-avatar-file"
          type="file"
          className="modal__input"
          accept="image/*"
          onChange={handleFileChange}
          disabled={loading}
        />
      </label>

      <hr className="modal__divider" />

      <label className="modal__label" htmlFor="profile-new-email">
        New Email:
        <input
          id="profile-new-email"
          name="newEmail"
          type="email"
          className="modal__input"
          value={form.newEmail}
          onChange={handleChange}
          placeholder="Enter new email"
          disabled={loading}
        />
      </label>

      <label className="modal__label" htmlFor="profile-confirm-email">
        Confirm Email:
        <input
          id="profile-confirm-email"
          name="confirmEmail"
          type="email"
          className="modal__input"
          value={form.confirmEmail}
          onChange={handleChange}
          placeholder="Confirm new email"
          disabled={loading}
        />
      </label>

      <hr className="modal__divider" />

      <label className="modal__label" htmlFor="profile-current-password">
        Current Password:
        <input
          id="profile-current-password"
          name="currentPassword"
          type="password"
          className="modal__input"
          value={form.currentPassword}
          onChange={handleChange}
          placeholder="Current password"
          disabled={loading}
        />
      </label>

      <label className="modal__label" htmlFor="profile-new-password">
        New Password:
        <input
          id="profile-new-password"
          name="newPassword"
          type="password"
          className="modal__input"
          value={form.newPassword}
          onChange={handleChange}
          placeholder="New password"
          disabled={loading}
        />
      </label>

      <label className="modal__label" htmlFor="profile-confirm-password">
        Confirm Password:
        <input
          id="profile-confirm-password"
          name="confirmPassword"
          type="password"
          className="modal__input"
          value={form.confirmPassword}
          onChange={handleChange}
          placeholder="Confirm new password"
          disabled={loading}
        />
      </label>
    </ModalWithForm>
  );
}

export default EditProfileModal;
