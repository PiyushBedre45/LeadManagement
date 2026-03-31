import React from "react";
import { Navigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { isTokenExpired } from "../utils/auth";

function PrivateRoute({ children }) {
  const { token, logout } = useAuth();
  if (!token || isTokenExpired(token)) {
    logout();
    return <Navigate to="/login" replace />;
  }
  return children;
}

export default PrivateRoute;
