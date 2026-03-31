import React from "react";
import { Link } from "react-router-dom";
import "../styles/table.css";

function LeadTable({ leads, authRole }) {
  return (
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
              const converted = lead.status === "Converted";
              const canEdit = !converted;

              return (
                <tr key={lead.id || lead._id}>
                  <td>{lead.name}</td>
                  <td>{lead.email}</td>
                  <td>
                    <span className={`status-badge status-${lead.status?.toLowerCase()}`}>{lead.status}</span>
                  </td>
                  <td>{lead.source}</td>
                  <td>
                    <span className={`priority-badge priority-${lead.priority?.toLowerCase()}`}>
                      {lead.priority}
                    </span>
                  </td>
                  <td className="actions-cell">
                    <Link className="btn btn-small" to={`/leads/${lead.id || lead._id}`}>
                      View
                    </Link>
                    <Link
                      className={`btn btn-small ${!canEdit ? "btn-disabled" : ""}`}
                      to={canEdit ? `/leads/edit/${lead.id || lead._id}` : "#"}
                      onClick={(e) => !canEdit && e.preventDefault()}
                    >
                      Edit
                    </Link>
                    {authRole !== "SalesRep" && (
                      <span className="role-action-chip">Can Convert</span>
                    )}
                  </td>
                </tr>
              );
            })
          )}
        </tbody>
      </table>
    </div>
  );
}

export default LeadTable;
