import React from "react";
import "../styles/skeleton.css";

function LoadingSkeleton({ rows = 5 }) {
  return (
    <div className="card skeleton-card">
      <div className="skeleton-line skeleton-title" />
      <div className="skeleton-line" />
      <div className="skeleton-line" />
      <div className="skeleton-line" />
      {Array.from({ length: rows }).map((_, idx) => (
        <div key={idx} className="skeleton-row">
          <span className="skeleton-chip" />
          <span className="skeleton-line" />
          <span className="skeleton-chip" />
          <span className="skeleton-chip" />
        </div>
      ))}
    </div>
  );
}

export default LoadingSkeleton;
