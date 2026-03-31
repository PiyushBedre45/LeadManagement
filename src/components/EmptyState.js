import React from "react";
import { Link } from "react-router-dom";
import Button from "./Button";

function EmptyState({ title, description, ctaLabel = "Create Lead", ctaTo = "/leads/create" }) {
  return (
    <div className="card empty-state">
      <div className="empty-icon">+</div>
      <h3>{title}</h3>
      <p>{description}</p>
      <Link to={ctaTo}>
        <Button>{ctaLabel}</Button>
      </Link>
    </div>
  );
}

export default EmptyState;
