import React, { useCallback, useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import Badge from "../components/Badge";
import Button from "../components/Button";
import ConfirmModal from "../components/ConfirmModal";
import Spinner from "../components/Spinner";
import { useAuth } from "../context/AuthContext";
import { convertLead, deleteLead, getLeadById } from "../services/leadService";
import { getErrorMessage } from "../utils/error";

function LeadDetailPage({ setToast }) {
  const { id } = useParams();
  const navigate = useNavigate();
  const { role } = useAuth();
  const [lead, setLead] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [busyAction, setBusyAction] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);

  const canConvert = role === "SalesManager" || role === "Admin";

  const fetchLead = useCallback(async () => {
    setLoading(true);
    setError("");
    try {
      const data = await getLeadById(id);
      setLead(data);
    } catch (err) {
      setError(getErrorMessage(err, "Unable to load lead details"));
    } finally {
      setLoading(false);
    }
  }, [id]);

  useEffect(() => {
    fetchLead();
  }, [fetchLead]);

  const isConverted = lead?.status === "Converted";

  const handleConvert = async () => {
    setBusyAction(true);
    try {
      await convertLead(id);
      setToast({ show: true, type: "success", message: "Lead converted" });
      fetchLead();
    } catch (err) {
      setToast({ show: true, type: "error", message: getErrorMessage(err, "Unable to convert lead") });
    } finally {
      setBusyAction(false);
    }
  };

  const handleDelete = async () => {
    setBusyAction(true);
    try {
      await deleteLead(id);
      setToast({ show: true, type: "success", message: "Lead deleted" });
      navigate("/leads");
    } catch (err) {
      setToast({ show: true, type: "error", message: getErrorMessage(err, "Unable to delete lead") });
    } finally {
      setBusyAction(false);
      setShowDeleteConfirm(false);
    }
  };

  if (loading) return <Spinner message="Loading lead detail..." />;
  if (error) return <div className="error-banner">{error}</div>;
  if (!lead) return null;

  return (
    <section className="card detail-card">
      <div className="page-header">
        <div>
          <h2>{lead.name}</h2>
          <p>{lead.position} at {lead.company}</p>
        </div>
        <div className="action-row">
          <Link to={isConverted ? "#" : `/leads/edit/${id}`} className={`btn ${isConverted ? "btn-disabled" : ""}`}>Edit</Link>
          {canConvert && <Button onClick={handleConvert} disabled={isConverted || busyAction}>Convert</Button>}
          {canConvert && (
            <Button variant="danger" onClick={() => setShowDeleteConfirm(true)} disabled={isConverted || busyAction}>
              Delete
            </Button>
          )}
        </div>
      </div>

      <div className="detail-grid">
        <div><strong>Email:</strong> {lead.email}</div>
        <div><strong>Phone:</strong> {lead.phone}</div>
        <div><strong>Status:</strong> <Badge type="status" value={lead.status} /></div>
        <div><strong>Source:</strong> {lead.source}</div>
        <div><strong>Priority:</strong> <Badge type="priority" value={lead.priority} /></div>
      </div>

      {isConverted && <p className="info-note">Converted leads are read-only.</p>}

      <ConfirmModal
        open={showDeleteConfirm}
        title="Delete this lead?"
        message="This action cannot be undone. The lead record will be removed permanently."
        confirmLabel={busyAction ? "Deleting..." : "Delete Lead"}
        onCancel={() => setShowDeleteConfirm(false)}
        onConfirm={handleDelete}
      />
    </section>
  );
}

export default LeadDetailPage;
