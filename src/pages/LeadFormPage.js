import React, { useEffect, useMemo, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import Button from "../components/Button";
import Input from "../components/Input";
import Spinner from "../components/Spinner";
import { createLead, getLeadById, updateLead } from "../services/leadService";
import { getErrorMessage } from "../utils/error";
import { getAllowedTransitions, isValidTransition } from "../utils/leadLifecycle";
import "../styles/form.css";

const initialForm = {
  name: "",
  email: "",
  phone: "",
  company: "",
  position: "",
  status: "New",
  source: "Website",
  priority: "Medium"
};

function LeadFormPage({ mode, setToast }) {
  const navigate = useNavigate();
  const { id } = useParams();
  const isEdit = mode === "edit";
  const [form, setForm] = useState(initialForm);
  const [originalStatus, setOriginalStatus] = useState("New");
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(isEdit);
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    if (!isEdit || !id) return;

    const fetchLead = async () => {
      try {
        const data = await getLeadById(id);
        const next = { ...initialForm, ...data };
        setForm(next);
        setOriginalStatus(next.status || "New");
      } catch (err) {
        setToast({ show: true, type: "error", message: getErrorMessage(err, "Failed to load lead") });
        navigate("/leads");
      } finally {
        setLoading(false);
      }
    };

    fetchLead();
  }, [id, isEdit, navigate, setToast]);

  const statusOptions = useMemo(() => (isEdit ? getAllowedTransitions(originalStatus) : ["New"]), [isEdit, originalStatus]);
  const title = useMemo(() => (isEdit ? "Edit Lead" : "Create Lead"), [isEdit]);

  const validate = () => {
    const nextErrors = {};
    if (!form.name.trim()) nextErrors.name = "Name is required";
    if (!form.email.trim()) nextErrors.email = "Email is required";
    if (form.email && !/^\S+@\S+\.\S+$/.test(form.email)) nextErrors.email = "Invalid email format";
    if (!form.phone.trim()) nextErrors.phone = "Phone is required";
    if (!form.company.trim()) nextErrors.company = "Company is required";
    if (!form.position.trim()) nextErrors.position = "Position is required";
    if (isEdit && !isValidTransition(originalStatus, form.status)) {
      nextErrors.status = `Invalid status transition from ${originalStatus} to ${form.status}`;
    }
    setErrors(nextErrors);
    return Object.keys(nextErrors).length === 0;
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validate()) return;
    setSubmitting(true);

    try {
      if (isEdit) {
        await updateLead(id, form);
        setToast({ show: true, type: "success", message: "Lead updated successfully" });
      } else {
        await createLead(form);
        setToast({ show: true, type: "success", message: "Lead created successfully" });
      }
      navigate("/leads");
    } catch (err) {
      const message = getErrorMessage(err, "Save failed");
      setErrors((prev) => ({ ...prev, api: message }));
      setToast({ show: true, type: "error", message });
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) return <Spinner message="Loading lead..." />;

  return (
    <section className="card">
      <h2>{title}</h2>
      {errors.api && <div className="error-banner">{errors.api}</div>}

      <form className="form-grid" onSubmit={handleSubmit}>
        <Input id="name" name="name" label="Name" value={form.name} onChange={handleChange} error={errors.name} />
        <Input id="email" name="email" label="Email" value={form.email} onChange={handleChange} error={errors.email} />
        <Input id="phone" name="phone" label="Phone" value={form.phone} onChange={handleChange} error={errors.phone} />
        <Input id="company" name="company" label="Company" value={form.company} onChange={handleChange} error={errors.company} />
        <Input id="position" name="position" label="Position" value={form.position} onChange={handleChange} error={errors.position} />

        <Input
          as="select"
          id="status"
          name="status"
          label="Status"
          value={form.status}
          onChange={handleChange}
          options={statusOptions}
          error={errors.status}
          disabled={originalStatus === "Converted"}
        />

        <Input
          as="select"
          id="source"
          name="source"
          label="Source"
          value={form.source}
          onChange={handleChange}
          options={["Website", "Referral", "ColdCall", "Event", "Partner"]}
        />

        <Input
          as="select"
          id="priority"
          name="priority"
          label="Priority"
          value={form.priority}
          onChange={handleChange}
          options={["High", "Medium", "Low"]}
        />

        <div className="form-actions">
          <Button type="submit" disabled={submitting || originalStatus === "Converted"}>
            {submitting ? "Saving..." : isEdit ? "Update Lead" : "Create Lead"}
          </Button>
          <Button variant="secondary" type="button" onClick={() => navigate("/leads")}>Cancel</Button>
        </div>
      </form>
    </section>
  );
}

export default LeadFormPage;
