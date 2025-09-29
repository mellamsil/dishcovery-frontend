import { createContext, useState, useEffect, useMemo } from "react";

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

  // Signup
  const signup = (formData) =>
    new Promise((resolve) => {
      const newUser = { ...formData, id: Date.now().toString() };
      setCurrentUser(newUser);
      setToken("mock-token");
      localStorage.setItem("currentUser", JSON.stringify(newUser));
      localStorage.setItem("token", "mock-token");
      resolve(newUser);
    });

  // Signin
  const signin = ({ email }) =>
    new Promise((resolve) => {
      const mockUser = { id: Date.now().toString(), name: "Demo User", email };
      setCurrentUser(mockUser);
      setToken("mock-token");
      localStorage.setItem("currentUser", JSON.stringify(mockUser));
      localStorage.setItem("token", "mock-token");
      resolve(mockUser);
    });

  // Signout
  const signout = () => {
    setCurrentUser(null);
    setToken(null);
    localStorage.removeItem("currentUser");
    localStorage.removeItem("token");
  };

  // Update profile
  const updateProfile = (updatedInfo) =>
    new Promise((resolve, reject) => {
      try {
        const updatedUser = {
          ...currentUser,
          name: updatedInfo.name,
          avatar: updatedInfo.avatar,
          email: updatedInfo.newEmail || updatedInfo.email,
          preferences: updatedInfo.preferences || currentUser.preferences,
        };

        // Mock password change (no real authentication here)
        if (updatedInfo.passwordUpdate) {
          const { currentPassword, newPassword } = updatedInfo.passwordUpdate;
          console.log(
            `Mock password change: currentPassword=${currentPassword}, newPassword=${newPassword}`
          );
        }

        setCurrentUser(updatedUser);
        localStorage.setItem("currentUser", JSON.stringify(updatedUser));
        resolve(updatedUser);
      } catch (err) {
        reject(new Error("Failed to update profile."));
      }
    });

  // Memoize context value to stabilize HMR
  const contextValue = useMemo(
    () => ({
      currentUser,
      setCurrentUser,
      token,
      signup,
      signin,
      signout,
      updateProfile,
      loading,
    }),
    [currentUser, token, loading]
  );

  return (
    <CurrentUserContext.Provider value={contextValue}>
      {children}
    </CurrentUserContext.Provider>
  );
};
