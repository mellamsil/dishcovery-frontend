import React from "react";
import "./modal.css";

function DeleteConfirm({ item, onDelete, onCancel }) {
  return (
    <div className="modal-overlay">
      <div className="modal">
        <h2>Confirm Deletion</h2>
        <p>Are you sure you want to delete "{item.title}"?</p>
        <div
          style={{
            display: "flex",
            justifyContent: "space-around",
            marginTop: "1rem",
          }}
        >
          <button className="btn-delete" onClick={onDelete}>
            Delete
          </button>
          <button className="btn-cancel" onClick={onCancel}>
            Cancel
          </button>
        </div>
      </div>
    </div>
  );
}

export default DeleteConfirm;
