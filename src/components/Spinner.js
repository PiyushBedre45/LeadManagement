import React from "react";
import "../styles/spinner.css";

function Spinner({ message = "Loading..." }) {
  return (
    <div className="spinner-wrap">
      <div className="spinner" />
      <p>{message}</p>
    </div>
  );
}

export default Spinner;
