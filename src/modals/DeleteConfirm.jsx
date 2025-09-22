import React, { useState } from "react";
import ModalWithForm from "./ModalWithForm";

function DeleteConfirm({ item, onDelete, onCancel }) {
  const [deleting, setDeleting] = useState(false);

  if (!item) return null;

  // --- Mock deleteRecipe function ---
  const deleteRecipe = (id) => {
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve({ success: true, deletedId: id });
      }, 600); // simulate network delay
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setDeleting(true);

    deleteRecipe(item._id).then((res) => {
      setDeleting(false);
      if (res.success) {
        onDelete(res.deletedId); // pass deleted ID back to Profile
      }
    });
  };

  return (
    <ModalWithForm
      title="Delete Item"
      onClose={onCancel}
      onSubmit={handleSubmit}
      submitText={deleting ? "Deleting..." : "Yes, Delete"}
      secondaryText="Cancel"
      disabled={deleting}
    >
      <p>
        Are you sure you want to delete this item <strong>{item.title}</strong>{" "}
        from your cookbook?
      </p>
    </ModalWithForm>
  );
}

export default DeleteConfirm;
