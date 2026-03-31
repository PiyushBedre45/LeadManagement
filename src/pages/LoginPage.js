import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import Button from "../components/Button";
import Input from "../components/Input";
import Spinner from "../components/Spinner";
import { useAuth } from "../context/AuthContext";
import { loginUser } from "../services/leadService";
import { getErrorMessage } from "../utils/error";
import "../styles/auth.css";

const demoCredentials = {
  "admin@demo.com": { password: "admin123", name: "Admin User", role: "Admin" },
  "manager@demo.com": { password: "manager123", name: "Manager User", role: "SalesManager" },
  "sales@demo.com": { password: "sales123", name: "Sales User", role: "SalesRep" }
};

function LoginPage({ setToast }) {
  const navigate = useNavigate();
  const { login } = useAuth();
  const [form, setForm] = useState({ email: "", password: "" });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const demoUser = demoCredentials[form.email.toLowerCase()];
      if (demoUser && form.password === demoUser.password) {
        login({
          token: "demo-jwt-token",
          user: { name: demoUser.name, role: demoUser.role }
        });
        setToast({ show: true, type: "success", message: "Logged in with demo account" });
        navigate("/leads");
        return;
      }

      const response = await loginUser(form);
      const token = response.token || "demo-jwt-token";
      const user = response.user || {
        name: "Sales User",
        role: form.email.toLowerCase().includes("admin")
          ? "Admin"
          : form.email.toLowerCase().includes("manager")
            ? "SalesManager"
            : "SalesRep"
      };

      login({ token, user });
      setToast({ show: true, type: "success", message: "Login successful" });
      navigate("/leads");
    } catch (err) {
      setError(getErrorMessage(err, "Invalid credentials"));
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-page">
      <div className="auth-card card">
        <h1>Login</h1>
        <p>Sign in to manage your leads</p>
        <p className="info-note">Demo: admin@demo.com/admin123, manager@demo.com/manager123, sales@demo.com/sales123</p>

        {error && <div className="error-banner">{error}</div>}

        <form onSubmit={handleSubmit} className="form-grid">
          <Input id="email" type="email" name="email" label="Email" value={form.email} onChange={handleChange} required />
          <Input id="password" type="password" name="password" label="Password" value={form.password} onChange={handleChange} required />

          <Button type="submit" disabled={loading}>{loading ? "Logging in..." : "Login"}</Button>
        </form>

        {loading && <Spinner message="Authenticating..." />}
      </div>
    </div>
  );
}

export default LoginPage;
