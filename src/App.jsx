import React, { useState } from "react";
import { Route, Routes } from "react-router-dom";
import Header from "./components/Header";
import Footer from "./components/Footer";
import Home from "./pages/Home";
import Signup from "./pages/Signup";
import Signin from "./pages/Signin";
import Profile from "./pages/Profile";
import Favorites from "./pages/Favorites";
import Dashboard from "./pages/Dashboard";
import PrivateRoute from "./components/PrivateRoute";
import RecipeDetails from "./pages/RecipeDetails";
import SearchResults from "./pages/SearchResults";
import "./App.css";

function App() {
  const [currentUser] = useState(null);
  const [userRecipes, setUserRecipes] = useState([]);

  // --- Auth Modal State ---
  const [isRegisterOpen, setIsRegisterOpen] = useState(false);
  const [isLoginOpen, setIsLoginOpen] = useState(false);

  // --- Handlers ---
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

  // --- Auth Modal Handlers ---
  const openRegister = () => {
    setIsRegisterOpen(true);
    setIsLoginOpen(false);
  };

  const openLogin = () => {
    setIsLoginOpen(true);
    setIsRegisterOpen(false);
  };

  const closeModals = () => {
    setIsRegisterOpen(false);
    setIsLoginOpen(false);
  };

  return (
    <>
      <Header onOpenRegister={openRegister} onOpenLogin={openLogin} />

      <main className="main-content">
        <Routes>
          {/* Public Routes */}
          <Route path="/" element={<Home />} />
          <Route path="/signup" element={<Signup />} />
          <Route path="/signin" element={<Signin />} />
          <Route path="/recipe/:id" element={<RecipeDetails />} />
          <Route path="/search" element={<SearchResults />} />

          {/* Private Routes */}
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
        </Routes>
      </main>

      <Footer />

      {/* --- Auth Modals --- */}
      {isRegisterOpen && (
        <Signup onClose={closeModals} onSwitchToLogin={openLogin} />
      )}
      {isLoginOpen && (
        <Signin onClose={closeModals} onSwitchToRegister={openRegister} />
      )}
    </>
  );
}

export default App;
