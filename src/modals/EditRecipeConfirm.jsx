import React from "react";
import ModalWithForm from "./ModalWithForm";

function EditRecipeConfirm({ item, onConfirm, onCancel }) {
  if (!item) return null;

  const handleSubmit = (e) => {
    e.preventDefault();
    onConfirm(item);
  };

  return (
    <ModalWithForm
      className="edit-recipe-confirm"
      title="Confirm Edit"
      onClose={onCancel}
      onSubmit={handleSubmit}
      submitText="Yes, Save Changes"
      secondaryText="Cancel"
    >
      <p>
        Are you sure you want to save changes to <strong>{item.title}</strong>?
      </p>

      {/* Custom button container for styling */}
      <div className="modal-buttons">
        <button type="submit" className="confirm">
          Yes, Save Changes
        </button>
        <button type="button" className="cancel" onClick={onCancel}>
          Cancel
        </button>
      </div>
    </ModalWithForm>
  );
}

export default EditRecipeConfirm;
