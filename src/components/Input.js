import React from "react";

function Input({ id, label, error, as = "input", options = [], ...props }) {
  const InputTag = as;

  return (
    <div className="field-group">
      {label && <label htmlFor={id}>{label}</label>}
      {as === "select" ? (
        <InputTag id={id} {...props}>
          {options.map((option) => (
            <option key={option} value={option}>
              {option}
            </option>
          ))}
        </InputTag>
      ) : (
        <InputTag id={id} {...props} />
      )}
      {error && <small className="field-error">{error}</small>}
    </div>
  );
}

export default Input;
