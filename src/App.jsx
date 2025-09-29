import React, { useState } from "react";
import { Route, Routes, useNavigate, useLocation } from "react-router-dom";
import Header from "./components/Header";
import Footer from "./components/Footer";
import Home from "./pages/Home";
import Profile from "./pages/Profile";
import Favorites from "./pages/Favorites";
import Dashboard from "./pages/Dashboard";
import RecipeDetails from "./pages/RecipeDetails";
import SearchResults from "./pages/SearchResults";
import PrivateRoute from "./components/PrivateRoute";
import RegisterModal from "./modals/RegisterModal";
import LoginModal from "./modals/LoginModal";
import "./App.css";

function App() {
  const [currentUser, setCurrentUser] = useState(null);
  const [userRecipes, setUserRecipes] = useState([]);

  // --- Modal state ---
  const [isRegisterModalOpen, setIsRegisterModalOpen] = useState(false);
  const [isLoginModalOpen, setIsLoginModalOpen] = useState(false);

  const navigate = useNavigate();
  const location = useLocation();
  const from = location.state?.from?.pathname || "/dashboard";

  // --- Handlers for user actions ---
  const handleAddItem = (newItem) => {
    setUserRecipes((prev) => [
      ...prev,
      { ...newItem, _id: Date.now().toString() },
    ]);
  };

  const handleEditItem = (updatedItem) => {
    setUserRecipes((prev) =>
      prev.map((r) => (r._id === updatedItem._id ? updatedItem : r))
    );
  };

  // Dummy signup/signin functions (replace with actual API/context calls)
  const handleSignUp = (formData) => {
    return new Promise((resolve) => {
      setCurrentUser({ name: formData.name, email: formData.email });
      setIsRegisterModalOpen(false);
      navigate(from, { replace: true });
      resolve();
    });
  };

  const handleSignIn = (credentials) => {
    return new Promise((resolve) => {
      setCurrentUser({ email: credentials.email });
      setIsLoginModalOpen(false);
      navigate(from, { replace: true });
      resolve();
    });
  };

  return (
    <>
      <Header
        openRegisterModal={() => setIsRegisterModalOpen(true)}
        openLoginModal={() => setIsLoginModalOpen(true)}
      />

      <main className="main-content">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route
            path="/profile"
            element={
              <PrivateRoute>
                <Profile currentUser={currentUser} />
              </PrivateRoute>
            }
          />
          <Route
            path="/favorites"
            element={
              <PrivateRoute>
                <Favorites userRecipes={userRecipes} />
              </PrivateRoute>
            }
          />
          <Route
            path="/dashboard"
            element={
              <PrivateRoute>
                <Dashboard
                  currentUser={currentUser}
                  userRecipes={userRecipes}
                  onAddItem={handleAddItem}
                  onEditItem={handleEditItem}
                />
              </PrivateRoute>
            }
          />
          <Route path="/recipe/:id" element={<RecipeDetails />} />
          <Route path="/search" element={<SearchResults />} />
        </Routes>
      </main>

      {/* Updated Footer with props for modals */}
      <Footer
        currentUser={currentUser}
        openRegisterModal={() => setIsRegisterModalOpen(true)}
        openLoginModal={() => setIsLoginModalOpen(true)}
      />

      {/* --- Modals --- */}
      {isRegisterModalOpen && (
        <RegisterModal
          onClose={() => setIsRegisterModalOpen(false)}
          onSignUp={handleSignUp}
          onSwitchToLogin={() => {
            setIsRegisterModalOpen(false);
            setIsLoginModalOpen(true);
          }}
        />
      )}

      {isLoginModalOpen && (
        <LoginModal
          onClose={() => setIsLoginModalOpen(false)}
          onSignIn={handleSignIn}
          onSwitchToRegister={() => {
            setIsLoginModalOpen(false);
            setIsRegisterModalOpen(true);
          }}
        />
      )}
    </>
  );
}

export default App;

// import React, { useState } from "react";
// import { Route, Routes } from "react-router-dom";
// import Header from "./components/Header";
// import Footer from "./components/Footer";
// import Home from "./pages/Home";
// import Signup from "./pages/Signup";
// import Signin from "./pages/Signin";
// import Profile from "./pages/Profile";
// import Favorites from "./pages/Favorites";
// import Dashboard from "./pages/Dashboard";
// import PrivateRoute from "./components/PrivateRoute";
// import RecipeDetails from "./pages/RecipeDetails";
// import SearchResults from "./pages/SearchResults";
// import "./App.css";

// function App() {
//   const [currentUser] = useState(null);

//   const [userRecipes, setUserRecipes] = useState([]);

//   // --- Handlers ---
//   const handleAddItem = (newItem) => {
//     setUserRecipes((prev) => [
//       ...prev,
//       { ...newItem, _id: Date.now().toString() },
//     ]);
//   };

//   const handleEditItem = (updatedItem) => {
//     setUserRecipes((prev) =>
//       prev.map((r) => (r._id === updatedItem._id ? updatedItem : r))
//     );
//   };

//   return (
//     <>
//       <Header />
//       <main className="main-content">
//         <Routes>
//           {/* Public Routes */}
//           <Route path="/" element={<Home />} />
//           <Route path="/signup" element={<Signup />} />
//           <Route path="/signin" element={<Signin />} />
//           <Route path="/recipe/:id" element={<RecipeDetails />} />
//           <Route path="/search" element={<SearchResults />} />

//           {/* Private Routes */}
//           <Route
//             path="/profile"
//             element={
//               <PrivateRoute>
//                 <Profile currentUser={currentUser} />
//               </PrivateRoute>
//             }
//           />
//           <Route
//             path="/favorites"
//             element={
//               <PrivateRoute>
//                 <Favorites userRecipes={userRecipes} />
//               </PrivateRoute>
//             }
//           />
//           <Route
//             path="/dashboard"
//             element={
//               <PrivateRoute>
//                 <Dashboard
//                   currentUser={currentUser}
//                   userRecipes={userRecipes}
//                   onAddItem={handleAddItem}
//                   onEditItem={handleEditItem}
//                 />
//               </PrivateRoute>
//             }
//           />
//         </Routes>
//       </main>
//       <Footer />
//     </>
//   );
// }

// export default App;
