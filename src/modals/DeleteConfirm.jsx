import React, { useState, useEffect } from "react";
import ModalWithForm from "./ModalWithForm";
import { deleteRecipe } from "../utils/api";

function DeleteConfirm({ item, itemName, onDelete, onClose, onSignOut }) {
  const [deleting, setDeleting] = useState(false);
  const token = localStorage.getItem("authToken");

  function handleSubmit(e) {
    e.preventDefault();
    setDeleting(true);

    if (item && item._id) {
      deleteRecipe(item._id, token)
        .then(function () {
          if (onDelete) onDelete(item._id);
          onClose();
        })
        .catch(function (err) {
          console.error("Failed to delete recipe:", err && err.message);
        })
        .finally(function () {
          setDeleting(false);
        });
    } else {
      // For deleting account or generic delete case
      if (onDelete) {
        onDelete();
      } else if (onSignOut) {
        onSignOut();
      }
      onClose();
      setDeleting(false);
    }
  }

  // ESC key closes modal
  useEffect(
    function () {
      function handleEsc(e) {
        if (e.key === "Escape") onClose();
      }

      document.addEventListener("keydown", handleEsc);
      return function () {
        document.removeEventListener("keydown", handleEsc);
      };
    },
    [onClose],
  );

  return (
    <ModalWithForm
      title={"Delete " + (itemName || "Item")}
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
