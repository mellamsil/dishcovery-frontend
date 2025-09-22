import React, { createContext, useState, useContext } from "react";

// Named export for context
export const CurrentUserContext = createContext();

// Provider
export const CurrentUserProvider = ({ children }) => {
  const [currentUser, setCurrentUser] = useState(null);
  const [token, setToken] = useState(null);

  // Mock in-memory "database" of users
  const [usersDB, setUsersDB] = useState([]);

  // --- Signup ---
  const signup = (formData) =>
    new Promise((resolve, reject) => {
      setTimeout(() => {
        const existingUser = usersDB.find((u) => u.email === formData.email);
        if (existingUser) return reject(new Error("Email already registered"));

        const newUser = { ...formData, id: Date.now().toString() };
        setUsersDB((prev) => [...prev, newUser]); // save in mock DB
        setCurrentUser(newUser);
        setToken("mock-token");
        resolve(newUser);
      }, 600);
    });

  // --- Signin ---
  const signin = ({ email, password }) =>
    new Promise((resolve, reject) => {
      setTimeout(() => {
        const foundUser = usersDB.find((u) => u.email === email);
        if (!foundUser) return reject(new Error("User not found"));
        setCurrentUser(foundUser); // preserve avatar & name
        setToken("mock-token");
        resolve(foundUser);
      }, 600);
    });

  // --- Signout ---
  const signout = () => {
    setCurrentUser(null);
    setToken(null);
  };

  // --- Update user ---
  const updateUser = (updatedData) =>
    new Promise((resolve) => {
      setCurrentUser((prev) => {
        const updatedUser = { ...prev, ...updatedData };
        // Also update in "DB"
        setUsersDB((prevDB) =>
          prevDB.map((u) => (u.id === updatedUser.id ? updatedUser : u))
        );
        return updatedUser;
      });
      resolve(updatedData);
    });

  return (
    <CurrentUserContext.Provider
      value={{ currentUser, token, signup, signin, signout, updateUser }}
    >
      {children}
    </CurrentUserContext.Provider>
  );
};

// Hook to consume the context
export const useAuth = () => useContext(CurrentUserContext);
