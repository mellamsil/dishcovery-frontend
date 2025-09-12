import React, { useState, useContext } from "react";
import { CurrentUserContext } from "../contexts/CurrentUserContext";
import "./Profile.css";

const Profile = () => {
  const { currentUser, signout } = useContext(CurrentUserContext);
  const [name, setName] = useState(currentUser?.name || "");
  const [email, setEmail] = useState(currentUser?.email || "");

  if (!currentUser) {
    return <p>Please sign in to view your profile.</p>;
  }

  const handleUpdate = (e) => {
    e.preventDefault();
    alert(`Profile updated (demo): Name: ${name}, Email: ${email}`);
  };

  return (
    <div className="profile container">
      <h1>Profile & Cookbook</h1>

      <section className="cookbook">
        <h2>My Cookbook (demo)</h2>
        <p>Saved recipes will appear here in Stage 2.</p>
      </section>

      <form onSubmit={handleUpdate} className="profile-form">
        <label>
          Name
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="input"
          />
        </label>
        <label>
          Email
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="input"
          />
        </label>

        <div style={{ marginTop: "1rem" }}>
          <button type="submit" className="btn btn-primary">
            Update Profile
          </button>
          <button
            type="button"
            className="btn btn-secondary"
            onClick={signout}
            style={{ marginLeft: "1rem" }}
          >
            Sign Out
          </button>
        </div>
      </form>
    </div>
  );
};

export default Profile;
