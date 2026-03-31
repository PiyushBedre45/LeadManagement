import React from "react";
import { Link } from "react-router-dom";
import Badge from "./Badge";
import "../styles/table.css";

function Table({ leads, authRole }) {
  return (
    <div className="table-outer">
      <div className="table-wrapper">
        <table className="lead-table">
          <thead>
            <tr>
              <th>Name</th>
              <th>Email</th>
              <th>Status</th>
              <th>Source</th>
              <th>Priority</th>
              <th>Actions</th>
            </tr>
          </thead>

          <tbody>
            {leads.length === 0 ? (
              <tr>
                <td className="empty-cell" colSpan="6">
                  No leads found.
                </td>
              </tr>
            ) : (
              leads.map((lead) => {
                const id = lead.id || lead._id;
                const converted = lead.status === "Converted";

                return (
                  <tr key={id}>
                    <td data-label="Name" className="lead-name-cell">
                      {lead.name}
                    </td>

                    <td data-label="Email" className="lead-email-cell">
                      {lead.email}
                    </td>

                    <td data-label="Status">
                      <Badge type="status" value={lead.status} />
                    </td>

                    <td data-label="Source">{lead.source}</td>

                    <td data-label="Priority">
                      <Badge type="priority" value={lead.priority} />
                    </td>

                    <td data-label="Actions" className="actions-cell">
                      <div className="action-buttons">
                        <Link
                          className="btn btn-primary btn-small"
                          to={`/leads/${id}`}
                        >
                          View
                        </Link>

                        <Link
                          className={`btn btn-secondary btn-small ${
                            converted ? "btn-disabled" : ""
                          }`}
                          to={converted ? "#" : `/leads/edit/${id}`}
                        >
                          Edit
                        </Link>
                      </div>

                      {authRole !== "SalesRep" && (
                        <span className="role-action-chip">
                          Can Convert
                        </span>
                      )}
                    </td>
                  </tr>
                );
              })
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default Table;