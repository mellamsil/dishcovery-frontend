import React, { useContext } from "react";
import { Navigate } from "react-router-dom";
import { CurrentUserContext } from "../contexts/CurrentUserContext";

const PrivateRoute = ({ children }) => {
  const { currentUser } = useContext(CurrentUserContext);

  if (!currentUser) {
    return <Navigate to="/signin" replace />;
  }

  return children;
};

export default PrivateRoute;
