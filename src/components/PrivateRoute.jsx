import React from "react";
import { Navigate, useLocation } from "react-router-dom";

const PrivateRoute = ({ isLoggedIn, children }) => {
  const location = useLocation();

  if (!isLoggedIn) {
    // Redirect to homepage if not logged in
    return <Navigate to="/" state={{ from: location }} replace />;
  }

  return children;
};

export default PrivateRoute;
