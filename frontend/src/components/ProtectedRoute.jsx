import React from "react";
import { Navigate, useLocation } from "react-router-dom";
import { useSelector } from "react-redux";

// Wraps a route so it's only accessible to logged-in users.
// Unauthenticated users are redirected to /login, and returned
// to their intended page after logging in.
export default function ProtectedRoute({ children }) {
  const { user } = useSelector((state) => state.auth);
  const location = useLocation();

  if (!user) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  return children;
}
