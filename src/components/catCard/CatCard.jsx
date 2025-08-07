// src/components/catCard/CatCard.jsx
import React from "react";
import "./CatCard.scss";

function CatCard({ card }) {
  return (
    <div className="catCard">
      
      <img src={card.img} alt={card.title} />
      <div className="text">
        <span className="desc">{card.desc}</span>
        <span className="title">{card.title}</span>
      </div>
    </div>
  );
}

export default CatCard;
