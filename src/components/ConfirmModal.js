import React from "react";
import Button from "./Button";

function ConfirmModal({ open, title, message, onConfirm, onCancel, confirmLabel = "Confirm" }) {
  if (!open) return null;

  return (
    <div className="modal-overlay" role="presentation">
      <div className="modal-card" role="dialog" aria-modal="true" aria-label={title}>
        <h3>{title}</h3>
        <p>{message}</p>
        <div className="modal-actions">
          <Button variant="secondary" onClick={onCancel}>Cancel</Button>
          <Button variant="danger" onClick={onConfirm}>{confirmLabel}</Button>
        </div>
      </div>
    </div>
  );
}

export default ConfirmModal;
