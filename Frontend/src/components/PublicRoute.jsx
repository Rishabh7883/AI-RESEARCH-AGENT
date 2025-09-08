import React, { useContext } from "react";
import { Navigate } from "react-router-dom";
import { UserContext } from "./userContext";

const PublicRoute = ({ children }) => {
  const { user } = useContext(UserContext);

  // If user is already logged in, redirect to /content
  if (user) {
    return <Navigate to="/content" replace />;
  }

  // Otherwise, show the login/signup page
  return children;
};

export default PublicRoute;
