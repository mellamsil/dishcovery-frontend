import { useContext, useEffect, useState } from "react";
import CurrentUserContext from "../contexts/CurrentUserContext";
import ModalWithForm from "./ModalWithForm";
import closeIcon from "../assets/icons/close.svg";
import { updateProfile } from "../utils/api";

function EditProfileModal({ isOpen, onClose }) {
  const { currentUser, setCurrentUser } = useContext(CurrentUserContext);

  const [name, setName] = useState("");
  const [avatar, setAvatar] = useState("");
  const [email, setEmail] = useState("");
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  // Prefill modal fields from current user when opened
  useEffect(() => {
    if (currentUser && isOpen) {
      setName(currentUser.name || "");
      setAvatar(currentUser.avatar || "");
      setEmail(currentUser.email || "");
      setCurrentPassword("");
      setNewPassword("");
      setConfirmPassword("");
      setError(null);
    }
  }, [currentUser, isOpen]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);

    if (!name.trim()) return setError("Name cannot be empty.");
    if (!email.trim()) return setError("Email cannot be empty.");

    const updates = {};
    if (name.trim() !== currentUser.name) updates.name = name.trim();
    if (avatar.trim() !== currentUser.avatar) updates.avatar = avatar.trim();
    if (email.trim() !== currentUser.email) updates.email = email.trim();

    // Handle password change
    if (currentPassword || newPassword || confirmPassword) {
      if (!currentPassword)
        return setError("Please enter your current password to change it.");
      if (newPassword !== confirmPassword)
        return setError("New password and confirmation do not match.");
      if (newPassword.length < 6)
        return setError("New password must be at least 6 characters.");
      updates.currentPassword = currentPassword;
      updates.newPassword = newPassword;
    }

    if (Object.keys(updates).length === 0) {
      setError("No changes detected.");
      return;
    }

    setIsLoading(true);
    try {
      const updatedUser = await updateProfile(updates);
      if (updatedUser) {
        setCurrentUser(updatedUser);
        onClose();
      }
    } catch (err) {
      setError(err?.message || "Failed to update profile.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <ModalWithForm
      title="Edit Profile"
      isOpen={isOpen}
      onClose={onClose}
      onSubmit={handleSubmit}
      submitText={isLoading ? "Saving..." : "Save Changes"}
      secondaryText="Cancel"
      secondaryAction={onClose}
      isLoading={isLoading}
      closeIcon={closeIcon}
    >
      {error && (
        <p className="modal__error" aria-live="polite">
          {error}
        </p>
      )}

      {/* Name */}
      <div className="modal__form-group">
        <label htmlFor="profile-name" className="modal__label">
          Name:
        </label>
        <input
          id="profile-name"
          type="text"
          className="modal__input"
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="Enter your name"
          disabled={isLoading}
          required
        />
      </div>

      {/* Avatar */}
      <div className="modal__form-group">
        <label htmlFor="profile-avatar" className="modal__label">
          Avatar URL:
        </label>
        <input
          id="profile-avatar"
          type="url"
          className="modal__input"
          value={avatar}
          onChange={(e) => setAvatar(e.target.value)}
          placeholder="Enter avatar URL"
          disabled={isLoading}
        />
      </div>

      {/* Email */}
      <div className="modal__form-group">
        <label htmlFor="profile-email" className="modal__label">
          Email:
        </label>
        <input
          id="profile-email"
          type="email"
          className="modal__input"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="Enter your email"
          disabled={isLoading}
          required
        />
      </div>

      <hr className="modal__divider" />

      {/* Password Section */}
      <div className="modal__form-group">
        <label htmlFor="current-password" className="modal__label">
          Current Password:
        </label>
        <input
          id="current-password"
          type="password"
          className="modal__input"
          value={currentPassword}
          onChange={(e) => setCurrentPassword(e.target.value)}
          placeholder="Enter current password"
          disabled={isLoading}
          autoComplete="current-password"
        />
      </div>

      <div className="modal__form-group">
        <label htmlFor="new-password" className="modal__label">
          New Password:
        </label>
        <input
          id="new-password"
          type="password"
          className="modal__input"
          value={newPassword}
          onChange={(e) => setNewPassword(e.target.value)}
          placeholder="Enter new password"
          disabled={isLoading}
          autoComplete="new-password"
        />
      </div>

      <div className="modal__form-group">
        <label htmlFor="confirm-password" className="modal__label">
          Confirm New Password:
        </label>
        <input
          id="confirm-password"
          type="password"
          className="modal__input"
          value={confirmPassword}
          onChange={(e) => setConfirmPassword(e.target.value)}
          placeholder="Confirm new password"
          disabled={isLoading}
          autoComplete="new-password"
        />
      </div>
    </ModalWithForm>
  );
}

export default EditProfileModal;
