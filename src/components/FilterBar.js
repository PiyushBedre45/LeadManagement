import React from "react";
import Button from "./Button";
import "../styles/filter.css";

function FilterBar({ filters, onChange, onReset }) {
  return (
    <div className="filter-bar card">
      <div className="field-group">
        <label htmlFor="statusFilter">Status</label>
        <select
          id="statusFilter"
          value={filters.status}
          onChange={(e) => onChange("status", e.target.value)}
        >
          <option value="">All</option>
          <option value="New">New</option>
          <option value="Contacted">Contacted</option>
          <option value="Qualified">Qualified</option>
          <option value="Unqualified">Unqualified</option>
          <option value="Converted">Converted</option>
        </select>
      </div>

      <div className="field-group">
        <label htmlFor="sourceFilter">Source</label>
        <select
          id="sourceFilter"
          value={filters.source}
          onChange={(e) => onChange("source", e.target.value)}
        >
          <option value="">All</option>
          <option value="Website">Website</option>
          <option value="Referral">Referral</option>
          <option value="ColdCall">ColdCall</option>
          <option value="Event">Event</option>
          <option value="Partner">Partner</option>
        </select>
      </div>

      <Button onClick={onReset}>Reset Filters</Button>
    </div>
  );
}

export default FilterBar;
