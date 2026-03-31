import React from "react";
import { Link, NavLink } from "react-router-dom";
import Button from "./Button";
import { useAuth } from "../context/AuthContext";
import "../styles/layout.css";

function Layout({ children }) {
  const { user, role, logout } = useAuth();

  const handleLogout = () => {
    logout();
  };

  return (
    <div className="app-shell">
      <aside className="sidebar">
        <Link className="brand" to="/leads">LeadManager</Link>
        <nav className="nav-links">
          <NavLink to="/leads">
            <span className="nav-icon">L</span>
            <span>Leads</span>
          </NavLink>
          <NavLink to="/leads/create">
            <span className="nav-icon">C</span>
            <span>Create Lead</span>
          </NavLink>
          <NavLink to="/analytics">
            <span className="nav-icon">A</span>
            <span>Analytics</span>
          </NavLink>
        </nav>
      </aside>

      <div className="main-area">
        <header className="topbar">
          <div className="topbar-user">
            <div className="avatar">{(user?.name || "U").charAt(0).toUpperCase()}</div>
            <div>
              <p className="welcome">Welcome, {user?.name || "User"}</p>
              <span className="role-chip">{role}</span>
            </div>
          </div>
          <Button variant="danger" className="logout-btn" onClick={handleLogout}>Logout</Button>
        </header>

        <main className="content">{children}</main>
      </div>
    </div>
  );
}

export default Layout;
