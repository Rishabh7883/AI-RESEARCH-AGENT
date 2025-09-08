import React, { useContext, useEffect } from "react";
import { Navigate, useLocation } from "react-router-dom";
import { UserContext } from "./userContext";

const ProtectedRoute = ({ children }) => {
  const { user } = useContext(UserContext);
  const location = useLocation();

  // Effect to handle back-button / browser caching issue
  useEffect(() => {
    if (!user) {
      // If user is logged out, redirect to login immediately
      window.location.replace("/login"); // forces page reload
    }
  }, [user]);

  // Prevent rendering content if user is not logged in
  if (!user) return null;

  return children;
};

export default ProtectedRoute;
