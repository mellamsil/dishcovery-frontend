import React, { useState, useEffect } from "react";
import ModalWithForm from "./ModalWithForm";

function DeleteConfirm({ item, onDelete, onCancel }) {
  const [deleting, setDeleting] = useState(false);

  // --- Mock deleteRecipe function ---
  const deleteRecipe = (id) => {
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve({ success: true, deletedId: id });
      }, 600);
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setDeleting(true);

    deleteRecipe(item._id).then((res) => {
      setDeleting(false);
      if (res.success) {
        onDelete(res.deletedId);
      }
    });
  };

  // useEffect is safe now
  useEffect(() => {
    const handleEsc = (e) => {
      if (e.key === "Escape") {
        onCancel();
      }
    };
    document.addEventListener("keydown", handleEsc);
    return () => document.removeEventListener("keydown", handleEsc);
  }, [onCancel]);

  // Early return inside render
  if (!item) return null;

  return (
    <ModalWithForm
      title="Delete Recipe"
      onClose={onCancel}
      onSubmit={handleSubmit}
      submitText={deleting ? "Deleting..." : "Yes, Delete"}
      secondaryText="Cancel"
      secondaryAction={onCancel}
      closeIcon="/src/assets/icons/close.svg"
      isLoading={deleting}
    >
      <p style={{ marginBottom: "10px" }}>
        <span style={{ color: "#e74c3c", fontWeight: "bold" }}>Warning: </span>
        <span style={{ color: "#000" }}>
          Are you sure you want to delete <strong>{item.title}</strong> from
          your cookbook? This action cannot be undone.
        </span>
      </p>
    </ModalWithForm>
  );
}

export default DeleteConfirm;
