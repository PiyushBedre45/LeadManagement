import React, { useEffect, useMemo, useState } from "react";
import Spinner from "../components/Spinner";
import { getLeadAnalytics, getLeads } from "../services/leadService";
import { getErrorMessage } from "../utils/error";
import "../styles/analytics.css";

function normalizeCounts(list, key) {
  return list.reduce((acc, item) => {
    const bucket = item[key] || "Unknown";
    acc[bucket] = (acc[bucket] || 0) + 1;
    return acc;
  }, {});
}

function BarChart({ title, data }) {
  const entries = Object.entries(data);
  const max = Math.max(...entries.map(([, value]) => value), 1);

  return (
    <div className="card chart-card">
      <h3>{title}</h3>
      <div className="bar-list">
        {entries.map(([label, value]) => (
          <div key={label} className="bar-item">
            <span className="bar-label">{label}</span>
            <div className="bar-track">
              <div
                className="bar-fill"
                style={{ width: `${(value / max) * 100}%` }}
              />
            </div>
            <span className="bar-value">{value}</span>
          </div>
        ))}
      </div>
    </div>
  );
}

function StatCard({ title, value }) {
  return (
    <div className="stat-card">
      <p>{title}</p>
      <h2>{value}</h2>
    </div>
  );
}

function AnalyticsPage() {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [statusCounts, setStatusCounts] = useState({});
  const [sourceCounts, setSourceCounts] = useState({});
  const [salesRepCounts, setSalesRepCounts] = useState({});
  const [conversionRate, setConversionRate] = useState(0);

  useEffect(() => {
    const fetchAnalytics = async () => {
      try {
        const analytics = await getLeadAnalytics();

        if (analytics?.statusCounts) {
          setStatusCounts(analytics.statusCounts);
          setSourceCounts(analytics.sourceCounts);
          setSalesRepCounts(analytics.salesRepCounts);
          setConversionRate(analytics.conversionRate || 0);
        } else {
          const fallback = await getLeads({ page: 1, limit: 1000 });
          const allLeads = fallback.items || [];

          const byStatus = normalizeCounts(allLeads, "status");
          const bySource = normalizeCounts(allLeads, "source");
          const byRep = normalizeCounts(allLeads, "assignedTo");

          const converted = byStatus.Converted || 0;
          const rate = allLeads.length
            ? (converted / allLeads.length) * 100
            : 0;

          setStatusCounts(byStatus);
          setSourceCounts(bySource);
          setSalesRepCounts(byRep);
          setConversionRate(rate);
        }
      } catch (err) {
        setError(getErrorMessage(err));
      } finally {
        setLoading(false);
      }
    };

    fetchAnalytics();
  }, []);

  const formattedRate = useMemo(
    () => `${conversionRate.toFixed(1)}%`,
    [conversionRate]
  );

  const totalLeads = Object.values(statusCounts).reduce((a, b) => a + b, 0);

  if (loading) return <Spinner />;

  return (
    <section className="analytics-container">
      {/* Header */}
      <div className="page-header card">
        <h2>Analytics Dashboard</h2>
        <p>Insights of leads performance</p>
      </div>

      {error && <div className="error-banner">{error}</div>}

      {/* KPI Cards */}
      <div className="stats-grid">
        <StatCard title="Total Leads" value={totalLeads} />
        <StatCard title="Conversion Rate" value={formattedRate} />
        <StatCard title="Sources" value={Object.keys(sourceCounts).length} />
        <StatCard title="Sales Reps" value={Object.keys(salesRepCounts).length} />
      </div>

      {/* Charts */}
      <div className="analytics-grid">
        <BarChart title="Leads by Status" data={statusCounts} />
        <BarChart title="Leads by Source" data={sourceCounts} />
        {Object.keys(salesRepCounts).length > 0 && (
          <BarChart title="Leads by SalesRep" data={salesRepCounts} />
        )}
      </div>
    </section>
  );
}

export default AnalyticsPage;