import api from "./api";

const MOCK_LEADS_KEY = "mock_leads_db";

const seedLeads = [
  {
    id: "1",
    name: "John Carter",
    email: "john.carter@example.com",
    phone: "+1-202-555-0171",
    company: "Acme Corp",
    position: "CTO",
    status: "New",
    source: "Website",
    priority: "High",
    assignedTo: "Aman"
  },
  {
    id: "2",
    name: "Neha Sharma",
    email: "neha.sharma@example.com",
    phone: "+91-9876543210",
    company: "Nova Solutions",
    position: "Product Manager",
    status: "Contacted",
    source: "Referral",
    priority: "Medium",
    assignedTo: "Riya"
  },
  {
    id: "3",
    name: "Michael Brown",
    email: "michael.brown@example.com",
    phone: "+1-303-555-0114",
    company: "BlueOrbit",
    position: "Head of Sales",
    status: "Qualified",
    source: "Event",
    priority: "Low",
    assignedTo: "Aman"
  }
];

const shouldUseMock = (error) => !error?.response;

const readMockLeads = () => {
  const raw = localStorage.getItem(MOCK_LEADS_KEY);
  if (!raw) {
    localStorage.setItem(MOCK_LEADS_KEY, JSON.stringify(seedLeads));
    return [...seedLeads];
  }
  try {
    return JSON.parse(raw);
  } catch {
    localStorage.setItem(MOCK_LEADS_KEY, JSON.stringify(seedLeads));
    return [...seedLeads];
  }
};

const writeMockLeads = (leads) => {
  localStorage.setItem(MOCK_LEADS_KEY, JSON.stringify(leads));
};

const paginate = (items, page = 1, limit = 8) => {
  const p = Number(page) || 1;
  const l = Number(limit) || 8;
  const start = (p - 1) * l;
  const chunk = items.slice(start, start + l);
  return {
    items: chunk,
    totalPages: Math.max(1, Math.ceil(items.length / l))
  };
};

export const loginUser = async (credentials) => {
  const { data } = await api.post("/auth/login", credentials);
  return data;
};

export const getLeads = async (params = {}) => {
  try {
    const { data } = await api.get("/leads", { params });
    return data;
  } catch (error) {
    if (!shouldUseMock(error)) throw error;

    const db = readMockLeads();
    const filtered = db.filter((lead) => {
      const statusOk = !params.status || lead.status === params.status;
      const sourceOk = !params.source || lead.source === params.source;
      return statusOk && sourceOk;
    });
    return paginate(filtered, params.page, params.limit);
  }
};

export const getLeadById = async (id) => {
  try {
    const { data } = await api.get(`/leads/${id}`);
    return data;
  } catch (error) {
    if (!shouldUseMock(error)) throw error;
    const found = readMockLeads().find((lead) => String(lead.id) === String(id));
    if (!found) throw new Error("Lead not found");
    return found;
  }
};

export const createLead = async (payload) => {
  try {
    const { data } = await api.post("/leads", payload);
    return data;
  } catch (error) {
    if (!shouldUseMock(error)) throw error;

    const db = readMockLeads();
    const duplicate = db.some(
      (lead) => String(lead.email).toLowerCase() === String(payload.email).toLowerCase()
    );
    if (duplicate) {
      const duplicateError = new Error("A lead with this email already exists");
      duplicateError.response = { data: { message: "A lead with this email already exists" } };
      throw duplicateError;
    }

    const newLead = { ...payload, id: Date.now().toString() };
    db.unshift(newLead);
    writeMockLeads(db);
    return newLead;
  }
};

export const updateLead = async (id, payload) => {
  try {
    const { data } = await api.put(`/leads/${id}`, payload);
    return data;
  } catch (error) {
    if (!shouldUseMock(error)) throw error;

    const db = readMockLeads();
    const index = db.findIndex((lead) => String(lead.id) === String(id));
    if (index === -1) throw new Error("Lead not found");
    db[index] = { ...db[index], ...payload };
    writeMockLeads(db);
    return db[index];
  }
};

export const deleteLead = async (id) => {
  try {
    const { data } = await api.delete(`/leads/${id}`);
    return data;
  } catch (error) {
    if (!shouldUseMock(error)) throw error;

    const db = readMockLeads().filter((lead) => String(lead.id) !== String(id));
    writeMockLeads(db);
    return { success: true };
  }
};

export const convertLead = async (id) => {
  try {
    const { data } = await api.patch(`/leads/${id}/convert`);
    return data;
  } catch (error) {
    if (!shouldUseMock(error)) throw error;

    const db = readMockLeads();
    const index = db.findIndex((lead) => String(lead.id) === String(id));
    if (index === -1) throw new Error("Lead not found");
    db[index] = { ...db[index], status: "Converted" };
    writeMockLeads(db);
    return db[index];
  }
};

export const getLeadAnalytics = async () => {
  try {
    const { data } = await api.get("/leads/analytics/summary");
    return data;
  } catch (error) {
    if (!shouldUseMock(error)) throw error;

    const db = readMockLeads();
    const statusCounts = db.reduce((acc, lead) => {
      acc[lead.status] = (acc[lead.status] || 0) + 1;
      return acc;
    }, {});
    const sourceCounts = db.reduce((acc, lead) => {
      acc[lead.source] = (acc[lead.source] || 0) + 1;
      return acc;
    }, {});
    const salesRepCounts = db.reduce((acc, lead) => {
      const rep = lead.assignedTo || "Unassigned";
      acc[rep] = (acc[rep] || 0) + 1;
      return acc;
    }, {});
    const converted = statusCounts.Converted || 0;

    return {
      statusCounts,
      sourceCounts,
      salesRepCounts,
      conversionRate: db.length ? (converted / db.length) * 100 : 0
    };
  }
};
