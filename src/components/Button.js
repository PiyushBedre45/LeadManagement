import React from "react";

function Button({ children, variant = "primary", className = "", ...props }) {
  const variantClass = variant === "secondary" ? "btn-secondary" : variant === "danger" ? "btn-danger" : "";
  return (
    <button className={`btn ${variantClass} ${className}`.trim()} {...props}>
      {children}
    </button>
  );
}

export default Button;
