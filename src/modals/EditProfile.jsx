import React from "react";
import "./modal.css"; // reuse the shared modal styles

function EditProfile({ onClose }) {
  return (
    <div className="modal-overlay">
      <div className="modal">
        <h2>Edit Profile</h2>
        <form>
          <label>
            Name:
            <input type="text" name="name" />
          </label>
          <label>
            Email:
            <input type="email" name="email" />
          </label>
          <button type="submit" className="btn-primary">
            Save Changes
          </button>
        </form>
        <button onClick={onClose} className="btn-cancel">
          Close
        </button>
      </div>
    </div>
  );
}

export default EditProfile;
