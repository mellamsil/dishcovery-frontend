import React, { useContext } from "react";
import { Navigate, useLocation } from "react-router-dom";
import { CurrentUserContext } from "../contexts/CurrentUserContext";

const PrivateRoute = ({ children }) => {
  const { currentUser, loading } = useContext(CurrentUserContext);
  const location = useLocation();

  if (loading) {
    return <p>Loading...</p>;
  }

  if (!currentUser) {
    // Redirect to homepage instead of /signin
    return <Navigate to="/" state={{ from: location }} replace />;
  }

  return children;
};

export default PrivateRoute;
