import React from "react";
import "./ItemCard.css";

function ItemCard({ item, onClick }) {
  return (
    <article className="item-card" onClick={onClick} tabIndex={0}>
      <img src={item.image} alt={item.title} className="item-card__image" />
      <div className="item-card__content">
        <h3 className="item-card__title">{item.title}</h3>
        <p className="item-card__description">{item.description || ""}</p>
      </div>
    </article>
  );
}

export default ItemCard;
