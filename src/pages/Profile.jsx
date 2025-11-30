import React, { useState, useContext } from "react";
import { Link } from "react-router-dom";
import "../styles/Profile.css";
import EditProfileModal from "../modals/EditProfileModal";
import DeleteConfirm from "../modals/DeleteConfirm";
import CurrentUserContext from "../contexts/CurrentUserContext";

const DEFAULT_AVATAR = "/src/assets/images/user-placeholder.png";

const Profile = ({ userRecipes = [], onUpdateProfile, onSignOut }) => {
  const { currentUser } = useContext(CurrentUserContext);
  const [isEditProfileOpen, setIsEditProfileOpen] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);

  if (!currentUser) return <p>Loading profile...</p>;

  const { name, email, bio, avatar } = currentUser;
  const totalSubmitted = userRecipes.length;
  const totalFavorites = userRecipes.filter((r) => r.isFavorite).length;
  const recentRecipes = userRecipes.slice(0, 3);

  const handleUpdateUser = (updatedData) => {
    return onUpdateProfile(updatedData)
      .then(() => {
        setIsEditProfileOpen(false);
      })
      .catch((err) => {
        console.error("Profile update failed:", err);
      });
  };

  const handleDeleteAccount = () => {
    if (onSignOut) onSignOut();
    setShowDeleteModal(false);
  };

  const getAvatar = () => (avatar?.trim() ? avatar : DEFAULT_AVATAR);

  return (
    <div className="profile">
      <h1 className="profile__title">My Profile</h1>

      {/* User Info */}
      <div className="profile__userinfo">
        <div className="profile__avatar-wrapper">
          <img
            src={getAvatar()}
            alt={`${name}'s avatar`}
            className="profile__avatar"
          />
        </div>
        <div className="profile__details">
          <h2 className="profile__name">{name}</h2>
          <p className="profile__email">{email}</p>
          {bio && <p className="profile__bio">{bio}</p>}
          <button
            className="profile__btn edit-profile"
            onClick={() => setIsEditProfileOpen(true)}
          >
            Edit Profile
          </button>
        </div>
      </div>

      {/* Account Settings */}
      <div className="profile__section profile__settings">
        <h3>Account Settings</h3>
        <div className="profile__settings-actions">
          <button
            className="profile__btn danger-btn"
            onClick={() => setShowDeleteModal(true)}
          >
            Delete Account
          </button>
        </div>
      </div>

      {/* Activity */}
      <div className="profile__section">
        <h3>Activity</h3>
        <div className="profile__activity-stats">
          <p>
            Recipes Submitted:{" "}
            <span className="stat-count">{totalSubmitted}</span>
          </p>
          <p>
            Recipes Liked: <span className="stat-count">{totalFavorites}</span>
          </p>
        </div>
        <div className="profile__recent">
          <h4>Recent Recipes:</h4>
          {recentRecipes.length > 0 ? (
            <ul className="recent-recipes-list">
              {recentRecipes.map((r) => (
                <li key={r._id || r.id} className="recent-recipe-card">
                  <p>{r.title}</p>
                </li>
              ))}
            </ul>
          ) : (
            <p className="no-recipes">No recent recipes yet</p>
          )}
        </div>
      </div>

      {/* Dashboard Link */}
      <div className="profile__section">
        <Link to="/dashboard" className="profile__btn dashboard-link">
          Go to Dashboard
        </Link>
      </div>

      {/* Modals */}
      {isEditProfileOpen && (
        <EditProfileModal
          isOpen={isEditProfileOpen}
          onClose={() => setIsEditProfileOpen(false)}
          onUpdateUser={handleUpdateUser}
        />
      )}

      {showDeleteModal && (
        <DeleteConfirm
          itemName="account"
          onClose={() => setShowDeleteModal(false)}
          onDelete={handleDeleteAccount}
          onSignOut={onSignOut}
        />
      )}
    </div>
  );
};

export default Profile;
