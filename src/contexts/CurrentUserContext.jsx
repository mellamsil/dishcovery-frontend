import React, { createContext, useState, useContext, useEffect } from "react";

export const CurrentUserContext = createContext();

export const CurrentUserProvider = ({ children }) => {
  const [currentUser, setCurrentUser] = useState(null);
  const [token, setToken] = useState(null);
  const [usersDB, setUsersDB] = useState([]);
  const [loading, setLoading] = useState(true); // NEW

  // --- Restore session from localStorage ---
  useEffect(() => {
    const storedUser = localStorage.getItem("currentUser");
    const storedToken = localStorage.getItem("token");

    if (storedUser && storedToken) {
      setCurrentUser(JSON.parse(storedUser));
      setToken(storedToken);
    }

    setLoading(false); // finished checking
  }, []);

  // --- Signup ---
  const signup = (formData) =>
    new Promise((resolve, reject) => {
      setTimeout(() => {
        const existingUser = usersDB.find((u) => u.email === formData.email);
        if (existingUser) return reject(new Error("Email already registered"));

        const newUser = { ...formData, id: Date.now().toString() };
        setUsersDB((prev) => [...prev, newUser]);
        setCurrentUser(newUser);
        setToken("mock-token");

        // persist
        localStorage.setItem("currentUser", JSON.stringify(newUser));
        localStorage.setItem("token", "mock-token");

        resolve(newUser);
      }, 600);
    });

  // --- Signin ---
  const signin = ({ email, password }) =>
    new Promise((resolve, reject) => {
      setTimeout(() => {
        const foundUser = usersDB.find((u) => u.email === email);
        if (!foundUser) return reject(new Error("User not found"));

        setCurrentUser(foundUser);
        setToken("mock-token");

        // persist
        localStorage.setItem("currentUser", JSON.stringify(foundUser));
        localStorage.setItem("token", "mock-token");

        resolve(foundUser);
      }, 600);
    });

  // --- Signout ---
  const signout = () => {
    setCurrentUser(null);
    setToken(null);
    localStorage.removeItem("currentUser");
    localStorage.removeItem("token");
  };

  // --- Update user ---
  const updateUser = (updatedData) =>
    new Promise((resolve) => {
      setCurrentUser((prev) => {
        const updatedUser = { ...prev, ...updatedData };
        setUsersDB((prevDB) =>
          prevDB.map((u) => (u.id === updatedUser.id ? updatedUser : u))
        );

        // persist
        localStorage.setItem("currentUser", JSON.stringify(updatedUser));

        return updatedUser;
      });
      resolve(updatedData);
    });

  return (
    <CurrentUserContext.Provider
      value={{
        currentUser,
        token,
        signup,
        signin,
        signout,
        updateUser,
        loading,
      }}
    >
      {children}
    </CurrentUserContext.Provider>
  );
};

export const useAuth = () => useContext(CurrentUserContext);
