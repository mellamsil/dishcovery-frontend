import React from "react";
import "../styles/ItemCard.css";

function ItemCard({ item, onClick, onDeleteClick }) {
  // fallback values for mock/demo mode
  const fallbackImage = "https://via.placeholder.com/150?text=Recipe";
  const title = item?.title || "Untitled Recipe";
  const description = item?.description || "No description available.";
  const instructions = item?.instructions || "";
  const notes = item?.notes || "";

  return (
    <article
      className="item-card"
      onClick={onClick ? onClick : undefined}
      tabIndex={0}
    >
      <img
        src={item?.image || fallbackImage}
        alt={title}
        className="item-card__image"
      />

      <div className="item-card__content">
        <h3 className="item-card__title">{title}</h3>
        <p className="item-card__description">{description}</p>

        {instructions && (
          <p className="item-card__instructions">
            <strong>Instructions:</strong> {instructions}
          </p>
        )}

        {notes && (
          <p className="item-card__notes">
            <strong>Notes:</strong> {notes}
          </p>
        )}
      </div>

      {onDeleteClick && (
        <button
          className="btn-delete"
          onClick={(e) => {
            e.stopPropagation();
            onDeleteClick(item);
          }}
        >
          Delete
        </button>
      )}
    </article>
  );
}

export default ItemCard;
