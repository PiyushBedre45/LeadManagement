import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import Button from "../components/Button";
import FilterBar from "../components/FilterBar";
import EmptyState from "../components/EmptyState";
import LoadingSkeleton from "../components/LoadingSkeleton";
import Pagination from "../components/Pagination";
import Table from "../components/Table";
import { useAuth } from "../context/AuthContext";
import { getLeads } from "../services/leadService";
import { getErrorMessage } from "../utils/error";

function LeadListPage() {
  const { role } = useAuth();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [leads, setLeads] = useState([]);
  const [filters, setFilters] = useState({ status: "", source: "" });
  const [pagination, setPagination] = useState({ page: 1, totalPages: 1, limit: 8 });

  useEffect(() => {
    const fetchLeads = async () => {
      setLoading(true);
      setError("");

      try {
        const data = await getLeads({
          page: pagination.page,
          limit: pagination.limit,
          status: filters.status,
          source: filters.source
        });

        setLeads(data.items || data.leads || []);
        setPagination((prev) => ({ ...prev, totalPages: data.totalPages || 1 }));
      } catch (err) {
        setError(getErrorMessage(err, "Unable to fetch leads"));
        setLeads([]);
      } finally {
        setLoading(false);
      }
    };

    fetchLeads();
  }, [pagination.page, pagination.limit, filters.status, filters.source]);

  return (
    <section>
      <div className="page-header card">
        <div>
          <h2>Leads</h2>
          <p>Track and manage all incoming leads</p>
        </div>
        <Link to="/leads/create"><Button>Create Lead</Button></Link>
      </div>

      <FilterBar
        filters={filters}
        onChange={(key, value) => {
          setPagination((prev) => ({ ...prev, page: 1 }));
          setFilters((prev) => ({ ...prev, [key]: value }));
        }}
        onReset={() => {
          setPagination((prev) => ({ ...prev, page: 1 }));
          setFilters({ status: "", source: "" });
        }}
      />

      {error && <div className="error-banner">{error}</div>}
      {loading ? (
        <LoadingSkeleton />
      ) : leads.length === 0 ? (
        <EmptyState
          title="No leads found"
          description="Try changing filters or create a new lead to get started."
        />
      ) : (
        <Table leads={leads} authRole={role} />
      )}

      <Pagination
        page={pagination.page}
        totalPages={pagination.totalPages}
        onPageChange={(nextPage) => setPagination((prev) => ({ ...prev, page: nextPage }))}
      />
    </section>
  );
}

export default LeadListPage;
