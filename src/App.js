import React, { useState } from "react";
import { Navigate, Route, Routes } from "react-router-dom";
import Layout from "./components/Layout";
import PrivateRoute from "./components/PrivateRoute";
import Toast from "./components/Toast";
import { useAuth } from "./context/AuthContext";
import AnalyticsPage from "./pages/AnalyticsPage";
import LeadDetailPage from "./pages/LeadDetailPage";
import LeadFormPage from "./pages/LeadFormPage";
import LeadListPage from "./pages/LeadListPage";
import LoginPage from "./pages/LoginPage";

function App() {
  const { token } = useAuth();
  const [toast, setToast] = useState({ show: false, type: "success", message: "" });

  return (
    <>
      <Routes>
        <Route path="/login" element={token ? <Navigate to="/leads" replace /> : <LoginPage setToast={setToast} />} />
        <Route
          path="/*"
          element={
            <PrivateRoute>
              <Layout>
                <Routes>
                  <Route path="/" element={<Navigate to="/leads" replace />} />
                  <Route path="/leads" element={<LeadListPage />} />
                  <Route path="/leads/create" element={<LeadFormPage mode="create" setToast={setToast} />} />
                  <Route path="/leads/edit/:id" element={<LeadFormPage mode="edit" setToast={setToast} />} />
                  <Route path="/leads/:id" element={<LeadDetailPage setToast={setToast} />} />
                  <Route path="/analytics" element={<AnalyticsPage />} />
                  <Route path="*" element={<Navigate to="/leads" replace />} />
                </Routes>
              </Layout>
            </PrivateRoute>
          }
        />
      </Routes>

      <Toast
        show={toast.show}
        type={toast.type}
        message={toast.message}
        onClose={() => setToast((prev) => ({ ...prev, show: false }))}
      />
    </>
  );
}

export default App;
