import React, { useEffect } from "react";
import "../styles/toast.css";

function Toast({ show, type = "success", message, onClose }) {
  useEffect(() => {
    if (!show) return;
    const timer = setTimeout(() => onClose(), 2500);
    return () => clearTimeout(timer);
  }, [show, onClose]);

  if (!show) return null;

  return (
    <div className={`toast toast-${type}`} role="alert">
      <span>{message}</span>
      <button onClick={onClose}>x</button>
    </div>
  );
}

export default Toast;
