import React from "react";

function Badge({ type = "status", value }) {
  return <span className={`${type}-badge ${type}-${String(value).toLowerCase()}`}>{value}</span>;
}

export default Badge;
