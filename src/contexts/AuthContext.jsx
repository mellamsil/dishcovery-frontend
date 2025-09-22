import React, { createContext, useState } from "react";

export const CurrentUserContext = createContext();

export const CurrentUserProvider = ({ children }) => {
  const [currentUser, setCurrentUser] = useState(null);

  // --- MOCK SIGNUP ---
  const signup = (formData) => {
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        if (formData.email === "fail@test.com") {
          reject(new Error("Mock signup failed"));
        } else {
          const mockUser = {
            id: Date.now(),
            name: formData.name,
            email: formData.email,
          };
          setCurrentUser(mockUser);
          resolve(mockUser);
        }
      }, 500);
    });
  };

  // --- MOCK SIGNIN ---
  const signin = (formData) => {
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        // accept any credentials except a specific "bad" one
        if (formData.email === "bad@test.com") {
          reject(new Error("Mock signin failed"));
        } else {
          const mockUser = {
            id: Date.now(),
            name: "Demo User",
            email: formData.email,
          };
          setCurrentUser(mockUser);
          resolve(mockUser);
        }
      }, 500);
    });
  };

  // --- MOCK SIGNOUT ---
  const signout = () => {
    return new Promise((resolve) => {
      setTimeout(() => {
        setCurrentUser(null);
        resolve();
      }, 200);
    });
  };

  return (
    <CurrentUserContext.Provider
      value={{ currentUser, signup, signin, signout }}
    >
      {children}
    </CurrentUserContext.Provider>
  );
};

// xxxxxxxxxx REAL BACKEND CODE

// import React, { createContext, useState, useContext } from "react";

// const AuthContext = createContext();

// export const AuthProvider = ({ children }) => {
//   const [user, setUser] = useState(null);

//   // Sign up
//   const signup = (userData) => {
//     return fetch("http://localhost:5000/auth/signup", {
//       method: "POST",
//       headers: { "Content-Type": "application/json" },
//       body: JSON.stringify(userData),
//     })
//       .then((res) => {
//         if (!res.ok)
//           return res.text().then((txt) => {
//             throw new Error(txt);
//           });
//         return res.json();
//       })
//       .then((data) => {
//         setUser(data.user);
//         localStorage.setItem("token", data.token);
//         return data.user;
//       });
//   };

//   // Sign in
//   const signin = ({ email, password }) => {
//     return fetch("http://localhost:5000/auth/signin", {
//       method: "POST",
//       headers: { "Content-Type": "application/json" },
//       body: JSON.stringify({ email, password }),
//     })
//       .then((res) => {
//         if (!res.ok)
//           return res.text().then((txt) => {
//             throw new Error(txt);
//           });
//         return res.json();
//       })
//       .then((data) => {
//         setUser(data.user);
//         localStorage.setItem("token", data.token);
//         return data.user;
//       });
//   };

//   // Sign out
//   const signout = () => {
//     setUser(null);
//     localStorage.removeItem("token");
//   };

//   const updateUser = (updatedData) => {
//     setUser((prev) => ({ ...prev, ...updatedData }));
//   };

//   return (
//     <AuthContext.Provider value={{ user, signup, signin, signout, updateUser }}>
//       {children}
//     </AuthContext.Provider>
//   );
// };

// export const useAuth = () => useContext(AuthContext);
