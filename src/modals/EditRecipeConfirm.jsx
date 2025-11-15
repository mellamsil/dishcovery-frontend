import React, { useState, useEffect } from "react";
import ModalWithForm from "./ModalWithForm";
import { updateRecipe } from "../utils/api.js";

function EditRecipeConfirm({ item, onConfirm, onCancel }) {
  const [title, setTitle] = useState("");
  const [image, setImage] = useState("");
  const [description, setDescription] = useState("");
  const [instructions, setInstructions] = useState("");
  const [notes, setNotes] = useState("");
  const [saving, setSaving] = useState(false);

  useEffect(
    function () {
      if (item) {
        setTitle(item.title || "");
        setImage(item.image || "");
        setDescription(item.description || "");
        setInstructions(item.instructions || "");
        setNotes(item.notes || "");
      }
    },
    [item]
  );

  function handleSubmit(e) {
    e.preventDefault();
    if (!item || !item._id) return;

    setSaving(true);

    const updatedData = {
      title: title.trim(),
      image: image.trim(),
      description: description.trim(),
      instructions: instructions.trim(),
      notes: notes.trim(),
    };

    updateRecipe(item._id, updatedData)
      .then(function (updatedRecipe) {
        onConfirm(updatedRecipe);
        onCancel();
      })
      .catch(function (err) {
        console.error("Error updating recipe:", err);
        alert(err.message || "Failed to update recipe");
      })
      .finally(function () {
        setSaving(false);
      });
  }

  if (!item) return null;

  return (
    <ModalWithForm
      title="Edit Recipe"
      onClose={onCancel}
      onSubmit={handleSubmit}
      closeIcon="/src/assets/icons/close.svg"
      isLoading={saving}
      submitText={saving ? "Saving..." : "Save Changes"}
      secondaryText="Cancel"
      secondaryAction={onCancel}
    >
      <>
        <label>
          Title:
          <input
            type="text"
            value={title}
            onChange={function (e) {
              setTitle(e.target.value);
            }}
            required
            disabled={saving}
          />
        </label>

        <label>
          Image URL:
          <input
            type="url"
            value={image}
            onChange={function (e) {
              setImage(e.target.value);
            }}
            disabled={saving}
          />
        </label>

        <label>
          Description:
          <textarea
            value={description}
            onChange={function (e) {
              setDescription(e.target.value);
            }}
            disabled={saving}
          />
        </label>

        <label>
          Instructions:
          <textarea
            value={instructions}
            onChange={function (e) {
              setInstructions(e.target.value);
            }}
            disabled={saving}
          />
        </label>

        <label>
          Notes:
          <textarea
            value={notes}
            onChange={function (e) {
              setNotes(e.target.value);
            }}
            disabled={saving}
          />
        </label>
      </>
    </ModalWithForm>
  );
}

export default EditRecipeConfirm;
