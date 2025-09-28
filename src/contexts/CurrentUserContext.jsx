import { createContext, useState, useEffect } from "react";

// Create context
export const CurrentUserContext = createContext(null);

// Provider component
export const CurrentUserProvider = ({ children }) => {
  const [currentUser, setCurrentUser] = useState(null);
  const [token, setToken] = useState(null);
  const [loading, setLoading] = useState(true);

  // Restore user session from localStorage on app load
  useEffect(() => {
    const storedUser = localStorage.getItem("currentUser");
    const storedToken = localStorage.getItem("token");

    if (storedUser && storedToken) {
      setCurrentUser(JSON.parse(storedUser));
      setToken(storedToken);
    }
    setLoading(false);
  }, []);

  const signup = (formData) =>
    new Promise((resolve) => {
      const newUser = { ...formData, id: Date.now().toString() };
      setCurrentUser(newUser);
      setToken("mock-token");
      localStorage.setItem("currentUser", JSON.stringify(newUser));
      localStorage.setItem("token", "mock-token");
      resolve(newUser);
    });

  const signin = ({ email }) =>
    new Promise((resolve) => {
      const mockUser = { id: Date.now(), name: "Demo User", email };
      setCurrentUser(mockUser);
      setToken("mock-token");
      localStorage.setItem("currentUser", JSON.stringify(mockUser));
      localStorage.setItem("token", "mock-token");
      resolve(mockUser);
    });

  const signout = () => {
    setCurrentUser(null);
    setToken(null);
    localStorage.removeItem("currentUser");
    localStorage.removeItem("token");
  };

  return (
    <CurrentUserContext.Provider
      value={{ currentUser, token, signup, signin, signout, loading }}
    >
      {children}
    </CurrentUserContext.Provider>
  );
};
