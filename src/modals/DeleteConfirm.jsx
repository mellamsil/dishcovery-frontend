import React, { useState, useEffect } from "react";
import ModalWithForm from "./ModalWithForm";

function DeleteConfirm({ item, itemName, onDelete, onClose, onSignOut }) {
  const [deleting, setDeleting] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setDeleting(true);

    try {
      await new Promise((resolve) => setTimeout(resolve, 600));

      if (item) {
        onDelete(item._id);
      } else {
        onDelete();
        if (onSignOut) onSignOut();
      }
      onClose();
    } finally {
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
