import React, { useState, useEffect, useContext } from "react";
import { Link } from "react-router-dom";
import ModalWithForm from "../modals/ModalWithForm";
import "../styles/Profile.css";
import { CurrentUserContext } from "../contexts/CurrentUserContext";

const Profile = ({ userRecipes = [] }) => {
  const { currentUser } = useContext(CurrentUserContext);

  const [avatar, setAvatar] = useState(
    currentUser?.avatar || "/src/assets/images/placeholder.png"
  );
  const [name, setName] = useState(currentUser?.name || "Anonymous User");
  const [email, setEmail] = useState(
    currentUser?.email || "noemail@example.com"
  );
  const [bio, setBio] = useState(currentUser?.bio || "");
  const [preferences, setPreferences] = useState({
    favoriteCuisine: currentUser?.preferences?.favoriteCuisine || "Italian",
    dietary: currentUser?.preferences?.dietary || "Vegan",
    notifications: currentUser?.preferences?.notifications ?? true,
  });

  const [showEditModal, setShowEditModal] = useState(false);
  const [showEmailModal, setShowEmailModal] = useState(false);
  const [showPasswordModal, setShowPasswordModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [editingPreferences, setEditingPreferences] = useState(false);

  const [newEmail, setNewEmail] = useState("");
  const [confirmEmail, setConfirmEmail] = useState("");
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const totalSubmitted = userRecipes.length;
  const totalFavorites = userRecipes.filter((r) => r.isFavorite).length;
  const recentRecipes = userRecipes.slice(0, 3);

  const handleAvatarChange = (e) => {
    const file = e.target.files[0];
    if (file) setAvatar(URL.createObjectURL(file));
  };

  const handleSaveProfile = (updatedInfo) => {
    setName(updatedInfo.name);
    setEmail(updatedInfo.email);
    setBio(updatedInfo.bio);
    setAvatar(updatedInfo.avatar);
    setPreferences(updatedInfo.preferences);
    setShowEditModal(false);
    // TODO: Backend integration
  };

  // Keep modals closable via Escape key
  useEffect(() => {
    const handleEsc = (e) => {
      if (e.key === "Escape") {
        setShowEditModal(false);
        setShowEmailModal(false);
        setShowPasswordModal(false);
        setShowDeleteModal(false);
      }
    };
    if (
      showEditModal ||
      showEmailModal ||
      showPasswordModal ||
      showDeleteModal
    ) {
      window.addEventListener("keydown", handleEsc);
    }
    return () => window.removeEventListener("keydown", handleEsc);
  }, [showEditModal, showEmailModal, showPasswordModal, showDeleteModal]);

  return (
    <div className="profile">
      <h1 className="profile__title">My Profile</h1>

      {/* User Info */}
      <div className="profile__userinfo">
        <div className="profile__avatar-wrapper">
          <img
            src={avatar}
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
            className="profile__btn"
            onClick={() => setShowEmailModal(true)}
          >
            Update Email
          </button>
          <button
            className="profile__btn"
            onClick={() => setShowPasswordModal(true)}
          >
            Change Password
          </button>
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
            <p>Favorite Cuisine: {preferences.favoriteCuisine}</p>
            <p>Dietary: {preferences.dietary}</p>
            <p>Notifications: {preferences.notifications ? "On" : "Off"}</p>
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
                value={preferences.favoriteCuisine}
                onChange={(e) =>
                  setPreferences((prev) => ({
                    ...prev,
                    favoriteCuisine: e.target.value,
                  }))
                }
              />
            </label>
            <label>
              Dietary:
              <input
                type="text"
                value={preferences.dietary}
                onChange={(e) =>
                  setPreferences((prev) => ({
                    ...prev,
                    dietary: e.target.value,
                  }))
                }
              />
            </label>
            <label>
              Notifications:
              <select
                value={preferences.notifications ? "On" : "Off"}
                onChange={(e) =>
                  setPreferences((prev) => ({
                    ...prev,
                    notifications: e.target.value === "On",
                  }))
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
      {/* ...Modals remain unchanged, just use current state variables */}
    </div>
  );
};

export default Profile;

// import React, { useState, useEffect } from "react";
// import { Link } from "react-router-dom";
// import ModalWithForm from "../modals/ModalWithForm";
// import "../styles/Profile.css";

// const Profile = ({ currentUser, userRecipes = [] }) => {
//   const [avatar, setAvatar] = useState(
//     currentUser?.avatar || "/src/assets/images/placeholder.png"
//   );
//   const [name, setName] = useState(currentUser?.name || "Anonymous User");
//   const [email, setEmail] = useState(
//     currentUser?.email || "noemail@example.com"
//   );
//   const [bio, setBio] = useState(currentUser?.bio || "");
//   const [preferences, setPreferences] = useState({
//     favoriteCuisine: currentUser?.preferences?.favoriteCuisine || "Italian",
//     dietary: currentUser?.preferences?.dietary || "Vegan",
//     notifications: currentUser?.preferences?.notifications ?? true,
//   });

//   const [showEditModal, setShowEditModal] = useState(false);
//   const [showEmailModal, setShowEmailModal] = useState(false);
//   const [showPasswordModal, setShowPasswordModal] = useState(false);
//   const [showDeleteModal, setShowDeleteModal] = useState(false);
//   const [editingPreferences, setEditingPreferences] = useState(false);

//   const [newEmail, setNewEmail] = useState("");
//   const [confirmEmail, setConfirmEmail] = useState("");
//   const [currentPassword, setCurrentPassword] = useState("");
//   const [newPassword, setNewPassword] = useState("");
//   const [confirmPassword, setConfirmPassword] = useState("");

//   const totalSubmitted = userRecipes.length;
//   const totalFavorites = userRecipes.filter((r) => r.isFavorite).length;
//   const recentRecipes = userRecipes.slice(0, 3);

//   const handleAvatarChange = (e) => {
//     const file = e.target.files[0];
//     if (file) setAvatar(URL.createObjectURL(file));
//   };

//   const handleSaveProfile = (updatedInfo) => {
//     setName(updatedInfo.name);
//     setEmail(updatedInfo.email);
//     setBio(updatedInfo.bio);
//     setAvatar(updatedInfo.avatar);
//     setPreferences(updatedInfo.preferences);
//     setShowEditModal(false);
//     // TODO: Backend integration
//   };

//   useEffect(() => {
//     const handleEsc = (e) => {
//       if (e.key === "Escape") {
//         setShowEditModal(false);
//         setShowEmailModal(false);
//         setShowPasswordModal(false);
//         setShowDeleteModal(false);
//       }
//     };
//     if (
//       showEditModal ||
//       showEmailModal ||
//       showPasswordModal ||
//       showDeleteModal
//     ) {
//       window.addEventListener("keydown", handleEsc);
//     }
//     return () => window.removeEventListener("keydown", handleEsc);
//   }, [showEditModal, showEmailModal, showPasswordModal, showDeleteModal]);

//   return (
//     <div className="profile">
//       <h1 className="profile__title">My Profile</h1>

//       {/* User Info */}
//       <div className="profile__userinfo">
//         <div className="profile__avatar-wrapper">
//           <img
//             src={avatar}
//             alt={`${name}'s avatar`}
//             className="profile__avatar"
//           />
//         </div>
//         <div className="profile__details">
//           <h2 className="profile__name">{name}</h2>
//           <p className="profile__email">{email}</p>
//           {bio && <p className="profile__bio">{bio}</p>}
//           <button
//             className="profile__btn edit-profile"
//             onClick={() => setShowEditModal(true)}
//           >
//             Edit Profile
//           </button>
//         </div>
//       </div>

//       {/* Account Settings */}
//       <div className="profile__section profile__settings">
//         <h3>Account Settings</h3>
//         <div className="profile__settings-actions">
//           <button
//             className="profile__btn"
//             onClick={() => setShowEmailModal(true)}
//           >
//             Update Email
//           </button>
//           <button
//             className="profile__btn"
//             onClick={() => setShowPasswordModal(true)}
//           >
//             Change Password
//           </button>
//           <button
//             className="profile__btn danger-btn"
//             onClick={() => setShowDeleteModal(true)}
//           >
//             Delete Account
//           </button>
//         </div>
//       </div>

//       {/* Preferences */}
//       <div className="profile__section">
//         <h3>Preferences</h3>
//         {!editingPreferences ? (
//           <div className="profile__preferences-view">
//             <p>Favorite Cuisine: {preferences.favoriteCuisine}</p>
//             <p>Dietary: {preferences.dietary}</p>
//             <p>Notifications: {preferences.notifications ? "On" : "Off"}</p>
//             <button
//               className="profile__btn edit-profile"
//               onClick={() => setEditingPreferences(true)}
//             >
//               Edit Preferences
//             </button>
//           </div>
//         ) : (
//           <div className="profile__preferences-edit">
//             <label>
//               Favorite Cuisine:
//               <input
//                 type="text"
//                 value={preferences.favoriteCuisine}
//                 onChange={(e) =>
//                   setPreferences((prev) => ({
//                     ...prev,
//                     favoriteCuisine: e.target.value,
//                   }))
//                 }
//               />
//             </label>
//             <label>
//               Dietary:
//               <input
//                 type="text"
//                 value={preferences.dietary}
//                 onChange={(e) =>
//                   setPreferences((prev) => ({
//                     ...prev,
//                     dietary: e.target.value,
//                   }))
//                 }
//               />
//             </label>
//             <label>
//               Notifications:
//               <select
//                 value={preferences.notifications ? "On" : "Off"}
//                 onChange={(e) =>
//                   setPreferences((prev) => ({
//                     ...prev,
//                     notifications: e.target.value === "On",
//                   }))
//                 }
//               >
//                 <option value="On">On</option>
//                 <option value="Off">Off</option>
//               </select>
//             </label>
//             <div className="profile__preferences-actions">
//               <button
//                 className="profile__btn save-btn"
//                 onClick={() => setEditingPreferences(false)}
//               >
//                 Save
//               </button>
//               <button
//                 className="profile__btn cancel-btn"
//                 onClick={() => setEditingPreferences(false)}
//               >
//                 Cancel
//               </button>
//             </div>
//           </div>
//         )}
//       </div>

//       {/* Activity */}
//       <div className="profile__section">
//         <h3>Activity</h3>
//         <div className="profile__activity-stats">
//           <p>
//             Recipes Submitted:{" "}
//             <span className="stat-count">{totalSubmitted}</span>
//           </p>
//           <p>
//             Recipes Liked: <span className="stat-count">{totalFavorites}</span>
//           </p>
//         </div>

//         <div className="profile__recent">
//           <h4>Recent Recipes:</h4>
//           {recentRecipes.length > 0 ? (
//             <ul className="recent-recipes-list">
//               {recentRecipes.map((r) => (
//                 <li key={r._id || r.id} className="recent-recipe-card">
//                   <p>{r.title}</p>
//                 </li>
//               ))}
//             </ul>
//           ) : (
//             <p className="no-recipes">No recent recipes yet</p>
//           )}
//         </div>
//       </div>

//       {/* Achievements */}
//       <div className="profile__section profile__achievements">
//         <h3>Achievements</h3>
//         <div className="profile__badges">
//           {totalSubmitted >= 5 && (
//             <div className="badge">
//               <img src="/src/assets/icons/chef-hat.svg" alt="Chef Badge" />
//               <p>5+ Recipes Added</p>
//             </div>
//           )}
//           {totalFavorites >= 10 && (
//             <div className="badge">
//               <img src="/src/assets/icons/star.svg" alt="Favorite Badge" />
//               <p>10+ Favorites</p>
//             </div>
//           )}
//           {totalSubmitted >= 1 && (
//             <div className="badge">
//               <img src="/src/assets/icons/fire.svg" alt="Streak Badge" />
//               <p>Weekly Streak</p>
//             </div>
//           )}
//         </div>
//       </div>

//       {/* Dashboard Link */}
//       <div className="profile__section">
//         <Link to="/dashboard" className="profile__btn dashboard-link">
//           Go to Dashboard
//         </Link>
//       </div>

//       {/* Modals */}
//       {showEditModal && (
//         <ModalWithForm
//           title="Edit Profile"
//           onClose={() => setShowEditModal(false)}
//           closeIcon="/src/assets/icons/close.svg"
//           onSubmit={(e) => {
//             e.preventDefault();
//             handleSaveProfile({ name, email, bio, avatar, preferences });
//           }}
//           secondaryText="Cancel"
//           secondaryAction={() => setShowEditModal(false)}
//         >
//           <label>
//             Avatar:
//             <input type="file" accept="image/*" onChange={handleAvatarChange} />
//           </label>
//           {avatar && (
//             <img
//               src={avatar}
//               alt="Preview"
//               className="profile__avatar-preview"
//             />
//           )}
//           <label>
//             Name:
//             <input
//               type="text"
//               value={name}
//               onChange={(e) => setName(e.target.value)}
//               required
//             />
//           </label>
//           <label>
//             Bio:
//             <textarea value={bio} onChange={(e) => setBio(e.target.value)} />
//           </label>
//           <label>
//             Favorite Cuisine:
//             <input
//               type="text"
//               value={preferences.favoriteCuisine}
//               onChange={(e) =>
//                 setPreferences((prev) => ({
//                   ...prev,
//                   favoriteCuisine: e.target.value,
//                 }))
//               }
//             />
//           </label>
//           <label>
//             Dietary:
//             <input
//               type="text"
//               value={preferences.dietary}
//               onChange={(e) =>
//                 setPreferences((prev) => ({ ...prev, dietary: e.target.value }))
//               }
//             />
//           </label>
//           <label>
//             Notifications:
//             <select
//               value={preferences.notifications ? "On" : "Off"}
//               onChange={(e) =>
//                 setPreferences((prev) => ({
//                   ...prev,
//                   notifications: e.target.value === "On",
//                 }))
//               }
//             >
//               <option value="On">On</option>
//               <option value="Off">Off</option>
//             </select>
//           </label>
//         </ModalWithForm>
//       )}

//       {showEmailModal && (
//         <ModalWithForm
//           title="Update Email"
//           buttonText="Save"
//           onClose={() => setShowEmailModal(false)}
//           closeIcon="/src/assets/icons/close.svg"
//           onSubmit={(e) => {
//             e.preventDefault();
//             if (newEmail !== confirmEmail) {
//               alert("Emails do not match!");
//               return;
//             }
//             console.log("Email updated:", newEmail);
//             setShowEmailModal(false);
//             setNewEmail("");
//             setConfirmEmail("");
//           }}
//           secondaryText="Cancel"
//           secondaryAction={() => setShowEmailModal(false)}
//         >
//           <label>
//             New Email:
//             <input
//               type="email"
//               value={newEmail}
//               onChange={(e) => setNewEmail(e.target.value)}
//               required
//             />
//           </label>
//           <label>
//             Confirm Email:
//             <input
//               type="email"
//               value={confirmEmail}
//               onChange={(e) => setConfirmEmail(e.target.value)}
//               required
//             />
//           </label>
//         </ModalWithForm>
//       )}

//       {showPasswordModal && (
//         <ModalWithForm
//           title="Change Password"
//           buttonText="Save"
//           onClose={() => setShowPasswordModal(false)}
//           closeIcon="/src/assets/icons/close.svg"
//           onSubmit={(e) => {
//             e.preventDefault();
//             if (newPassword.length < 8) {
//               alert("Password must be at least 8 characters long");
//               return;
//             }
//             if (newPassword !== confirmPassword) {
//               alert("Passwords do not match!");
//               return;
//             }
//             console.log("Password changed!");
//             setShowPasswordModal(false);
//             setCurrentPassword("");
//             setNewPassword("");
//             setConfirmPassword("");
//           }}
//           secondaryText="Cancel"
//           secondaryAction={() => setShowPasswordModal(false)}
//         >
//           <label>
//             Current Password:
//             <input
//               type="password"
//               value={currentPassword}
//               onChange={(e) => setCurrentPassword(e.target.value)}
//               required
//             />
//           </label>
//           <label>
//             New Password:
//             <input
//               type="password"
//               value={newPassword}
//               onChange={(e) => setNewPassword(e.target.value)}
//               required
//             />
//           </label>
//           <label>
//             Confirm Password:
//             <input
//               type="password"
//               value={confirmPassword}
//               onChange={(e) => setConfirmPassword(e.target.value)}
//               required
//             />
//           </label>
//         </ModalWithForm>
//       )}

//       {showDeleteModal && (
//         <ModalWithForm
//           title="Delete Account"
//           buttonText="Close"
//           onClose={() => setShowDeleteModal(false)}
//           closeIcon="/src/assets/icons/close.svg"
//           onSubmit={(e) => {
//             e.preventDefault();
//             setShowDeleteModal(false);
//           }}
//         >
//           <p>The account deletion feature is not available yet.</p>
//         </ModalWithForm>
//       )}
//     </div>
//   );
// };

// export default Profile;
