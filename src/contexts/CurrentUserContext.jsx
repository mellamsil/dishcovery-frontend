import React, { createContext, useEffect, useState } from "react";
import { getCurrentUser } from "../utils/api";

const CurrentUserContext = createContext();

const CurrentUserProvider = ({ children }) => {
  const [currentUser, setCurrentUser] = useState(null);
  const [token, setToken] = useState(localStorage.getItem("jwt") || null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // const token = localStorage.getItem("jwt");
    if (!token) {
      setLoading(false);
      return;
    }

    getCurrentUser(token)
      .then((userData) => setCurrentUser(userData))
      .catch((error) => {
        console.error("Invalid token:", error);
        localStorage.removeItem("jwt");
        setCurrentUser(null);
        setToken(null);
      })
      .finally(() => setLoading(false));
  }, [token]);

  const signin = (newToken, userData) => {
    localStorage.setItem("jwt", newToken);
    setToken(newToken);
    setCurrentUser(userData);
  };

  const signout = () => {
    localStorage.removeItem("jwt");
    setToken(null);
    setCurrentUser(null);
  };

  return (
    <CurrentUserContext.Provider
      value={{ currentUser, token, signin, signout, loading }}
    >
      {children}
    </CurrentUserContext.Provider>
  );
};

export { CurrentUserProvider, CurrentUserContext };
