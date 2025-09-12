import React from "react";
import "./modal.css";

function AddItem({ onClose }) {
  return (
    <div className="modal-overlay">
      <div className="modal">
        <h2>Add Item</h2>
        <form>
          <label>
            Title:
            <input type="text" name="title" />
          </label>
          <label>
            Description:
            <textarea name="description"></textarea>
          </label>
          <button type="submit" className="btn-primary">
            Add Item
          </button>
        </form>
        <button onClick={onClose} className="btn-cancel">
          Close
        </button>
      </div>
    </div>
  );
}

export default AddItem;
