import React, { useState, useContext } from "react";
import { Link } from "react-router-dom";
import "../styles/Profile.css";
import EditProfileModal from "../modals/EditProfileModal";
import DeleteConfirm from "../modals/DeleteConfirm";
import { CurrentUserContext } from "../contexts/CurrentUserContext";

const DEFAULT_AVATAR = "/src/assets/images/placeholder.png";

const Profile = ({ userRecipes = [], onUpdateProfile, onSignOut }) => {
  const { currentUser } = useContext(CurrentUserContext);
  const [editingPreferences, setEditingPreferences] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);

  if (!currentUser) return <p>Loading profile...</p>;

  const { name, email, bio, avatar, preferences } = currentUser;

  const totalSubmitted = userRecipes.length;
  const totalFavorites = userRecipes.filter((r) => r.isFavorite).length;
  const recentRecipes = userRecipes.slice(0, 3);

  const handleSaveProfile = async (updatedInfo) => {
    try {
      if (onUpdateProfile) {
        await onUpdateProfile(updatedInfo);
      }
      setShowEditModal(false);
    } catch (err) {
      console.error("Failed to save profile:", err);
      alert(err.message || "Failed to update profile");
    }
  };

  const handleDeleteAccount = () => {
    if (onSignOut) onSignOut();
    setShowDeleteModal(false);
  };

  const getAvatar = () => (avatar?.trim() !== "" ? avatar : DEFAULT_AVATAR);

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
            onClick={() => setShowEditModal(true)}
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

      {/* Preferences */}
      <div className="profile__section">
        <h3>Preferences</h3>
        {!editingPreferences ? (
          <div className="profile__preferences-view">
            <p>Favorite Cuisine: {preferences?.favoriteCuisine || "N/A"}</p>
            <p>Dietary: {preferences?.dietary || "N/A"}</p>
            <p>Notifications: {preferences?.notifications ? "On" : "Off"}</p>
            <button
              className="profile__btn edit-profile"
              onClick={() => setEditingPreferences(true)}
            >
              Edit Preferences
            </button>
          </div>
        ) : (
          <div className="profile__preferences-edit">
            <label>
              Favorite Cuisine:
              <input
                type="text"
                value={preferences?.favoriteCuisine || ""}
                onChange={(e) =>
                  handleSaveProfile({
                    ...currentUser,
                    preferences: {
                      ...preferences,
                      favoriteCuisine: e.target.value,
                    },
                  })
                }
              />
            </label>
            <label>
              Dietary:
              <input
                type="text"
                value={preferences?.dietary || ""}
                onChange={(e) =>
                  handleSaveProfile({
                    ...currentUser,
                    preferences: { ...preferences, dietary: e.target.value },
                  })
                }
              />
            </label>
            <label>
              Notifications:
              <select
                value={preferences?.notifications ? "On" : "Off"}
                onChange={(e) =>
                  handleSaveProfile({
                    ...currentUser,
                    preferences: {
                      ...preferences,
                      notifications: e.target.value === "On",
                    },
                  })
                }
              >
                <option value="On">On</option>
                <option value="Off">Off</option>
              </select>
            </label>
            <div className="profile__preferences-actions">
              <button
                className="profile__btn save-btn"
                onClick={() => setEditingPreferences(false)}
              >
                Save
              </button>
              <button
                className="profile__btn cancel-btn"
                onClick={() => setEditingPreferences(false)}
              >
                Cancel
              </button>
            </div>
          </div>
        )}
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

      {/* Achievements */}
      <div className="profile__section profile__achievements">
        <h3>Achievements</h3>
        <div className="profile__badges">
          {totalSubmitted >= 5 && (
            <div className="badge">
              <img src="/src/assets/icons/chef-hat.svg" alt="Chef Badge" />
              <p>5+ Recipes Added</p>
            </div>
          )}
          {totalFavorites >= 10 && (
            <div className="badge">
              <img src="/src/assets/icons/star.svg" alt="Favorite Badge" />
              <p>10+ Favorites</p>
            </div>
          )}
          {totalSubmitted >= 1 && (
            <div className="badge">
              <img src="/src/assets/icons/fire.svg" alt="Streak Badge" />
              <p>Weekly Streak</p>
            </div>
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
      {showEditModal && (
        <EditProfileModal
          currentUser={currentUser}
          onClose={() => setShowEditModal(false)}
          onUpdate={handleSaveProfile}
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
