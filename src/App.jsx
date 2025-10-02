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
import CurrentUserContext from "./contexts/CurrentUserContext";
import "./App.css";

const DEFAULT_AVATAR = "/src/assets/images/user-placeholder.png";

function App() {
  const [currentUser, setCurrentUser] = useState(null);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [userRecipes, setUserRecipes] = useState([]);

  const [isRegisterModalOpen, setIsRegisterModalOpen] = useState(false);
  const [isLoginModalOpen, setIsLoginModalOpen] = useState(false);

  const navigate = useNavigate();
  const location = useLocation();
  const from = location.state?.from?.pathname || "/dashboard";

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

  const handleDeleteItem = (id) => {
    setUserRecipes((prev) => prev.filter((r) => r._id !== id));
  };

  const handleSignUp = (formData) => {
    return new Promise((resolve) => {
      const newUser = {
        name: formData.name,
        email: formData.email,
        avatar: DEFAULT_AVATAR,
        bio: "",
        preferences: {
          favoriteCuisine: "",
          dietary: "",
          notifications: true,
        },
      };
      setCurrentUser(newUser);
      setIsLoggedIn(true);
      setIsRegisterModalOpen(false);
      navigate(from, { replace: true });
      resolve();
    });
  };

  const handleSignIn = (credentials) => {
    return new Promise((resolve) => {
      const loggedUser = {
        name: "User",
        email: credentials.email,
        avatar: DEFAULT_AVATAR,
        bio: "",
        preferences: {
          favoriteCuisine: "",
          dietary: "",
          notifications: true,
        },
      };
      setCurrentUser(loggedUser);
      setIsLoggedIn(true);
      setIsLoginModalOpen(false);
      navigate(from, { replace: true });
      resolve();
    });
  };

  const handleSignOut = () => {
    setCurrentUser(null);
    setIsLoggedIn(false);
    navigate("/", { replace: true });
  };

  return (
    <CurrentUserContext.Provider value={{ currentUser, setCurrentUser }}>
      <Header
        currentUser={currentUser}
        isLoggedIn={isLoggedIn}
        onSignOut={handleSignOut}
        openRegisterModal={() => setIsRegisterModalOpen(true)}
        openLoginModal={() => setIsLoginModalOpen(true)}
      />

      <main className="main-content">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route
            path="/profile"
            element={
              <PrivateRoute isLoggedIn={isLoggedIn}>
                <Profile
                  currentUser={currentUser}
                  userRecipes={userRecipes}
                  onUpdateProfile={() => {}}
                  onSignOut={handleSignOut}
                />
              </PrivateRoute>
            }
          />
          <Route
            path="/favorites"
            element={
              <PrivateRoute isLoggedIn={isLoggedIn}>
                <Favorites userRecipes={userRecipes} />
              </PrivateRoute>
            }
          />
          <Route
            path="/dashboard"
            element={
              <PrivateRoute isLoggedIn={isLoggedIn}>
                <Dashboard
                  currentUser={currentUser}
                  userRecipes={userRecipes}
                  onAddItem={handleAddItem}
                  onEditItem={handleEditItem}
                  onDeleteItem={handleDeleteItem}
                />
              </PrivateRoute>
            }
          />
          <Route path="/recipe/:id" element={<RecipeDetails />} />
          <Route path="/search" element={<SearchResults />} />
        </Routes>
      </main>

      <Footer
        currentUser={currentUser}
        isLoggedIn={isLoggedIn}
        openRegisterModal={() => setIsRegisterModalOpen(true)}
        openLoginModal={() => setIsLoginModalOpen(true)}
      />

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
    </CurrentUserContext.Provider>
  );
}

export default App;
