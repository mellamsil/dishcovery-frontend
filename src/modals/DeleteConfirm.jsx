import React, { useState, useEffect } from "react";
import ModalWithForm from "./ModalWithForm";
import { deleteRecipe } from "../utils/api.js";

function DeleteConfirm({ item, itemName, onDelete, onClose, onSignOut }) {
  const [deleting, setDeleting] = useState(false);
  const token = localStorage.getItem("token");

  const handleSubmit = (e) => {
    e.preventDefault();
    setDeleting(true);

    if (item) {
      // Call backend to delete
      deleteRecipe(item._id, token)
        .then(() => {
          onDelete(item._id);
          onClose();
        })
        .catch((err) => console.error("Failed to delete recipe:", err.message))
        .finally(() => setDeleting(false));
    } else {
      // Generic delete or sign-out
      if (onDelete) onDelete();
      if (onSignOut) onSignOut();
      onClose();
      setDeleting(false);
    }
  };

  // ESC key to close modal
  useEffect(() => {
    const handleEsc = (e) => {
      if (e.key === "Escape") {
        onClose();
      }
    };
    document.addEventListener("keydown", handleEsc);
    return () => document.removeEventListener("keydown", handleEsc);
  }, [onClose]);

  return (
    <ModalWithForm
      title={`Delete ${itemName || "Item"}`}
      onClose={onClose}
      onSubmit={handleSubmit}
      submitText={deleting ? "Deleting..." : "Yes, Delete"}
      secondaryText="Cancel"
      secondaryAction={onClose}
      closeIcon="/src/assets/icons/close.svg"
      isLoading={deleting}
    >
      <p style={{ marginBottom: "10px" }}>
        <span style={{ color: "#e74c3c", fontWeight: "bold" }}>Warning: </span>
        <span style={{ color: "#000" }}>
          Are you sure you want to delete{" "}
          <strong>{item ? item.title : itemName}</strong>? This action cannot be
          undone.
        </span>
      </p>
    </ModalWithForm>
  );
}

export default DeleteConfirm;
