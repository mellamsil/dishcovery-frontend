import React, { useState, useEffect } from "react";
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
import RecipeDetailModal from "./modals/RecipeDetailModal";
import AddItem from "./modals/AddItem";
import CurrentUserContext from "./contexts/CurrentUserContext";
import {
  createRecipe,
  signin,
  signup,
  getCurrentUser,
  updateProfile,
} from "./utils/api.js";
import "./App.css";

const DEFAULT_AVATAR = "/src/assets/images/user-placeholder.png";

function App() {
  const [currentUser, setCurrentUser] = useState(null);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [userRecipes, setUserRecipes] = useState([]);
  const [selectedRecipe, setSelectedRecipe] = useState(null);
  const [isSaving, setIsSaving] = useState(false);
  const [pendingRecipe, setPendingRecipe] = useState(null);
  const [isRegisterModalOpen, setIsRegisterModalOpen] = useState(false);
  const [isLoginModalOpen, setIsLoginModalOpen] = useState(false);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);

  const navigate = useNavigate();
  const location = useLocation();
  const from = location.state?.from?.pathname || "/dashboard";

  // Load current user on mount
  useEffect(() => {
    const savedUser = JSON.parse(localStorage.getItem("currentUser"));
    const token = localStorage.getItem("authToken");

    if (savedUser && token) {
      console.log(" Found existing user and token on load");
      setCurrentUser(savedUser);
      setIsLoggedIn(true);
    }
  }, []);

  // Persist user recipes to localStorage
  const getUserRecipesKey = (user) => "recipes_" + (user?.email || "guest");

  useEffect(() => {
    if (currentUser) {
      localStorage.setItem(
        getUserRecipesKey(currentUser),
        JSON.stringify(userRecipes),
      );
    }
  }, [userRecipes, currentUser]);

  // Login & registration flow
  const finishLoginFlow = (user, token) => {
    if (!token) {
      console.warn("finishLoginFlow called without a valid token");
      return;
    }

    localStorage.setItem("authToken", token);
    localStorage.setItem("currentUser", JSON.stringify(user));

    setCurrentUser(user);
    setIsLoggedIn(true);

    const savedRecipes = localStorage.getItem(getUserRecipesKey(user));
    setUserRecipes(savedRecipes ? JSON.parse(savedRecipes) : []);

    if (pendingRecipe) {
      handleSaveToCookbook(pendingRecipe);
      setPendingRecipe(null);
    }

    console.log("Login flow complete for:", user.email);
    navigate(from, { replace: true });
  };

  const handleSignUp = async (formData) => {
    try {
      const response = await signup(formData);
      const token =
        response.token ||
        response.accessToken ||
        response.jwt ||
        response.authToken ||
        response.data?.token;

      if (response.user && token) {
        finishLoginFlow(response.user, token);
      } else if (token) {
        const user = await getCurrentUser();
        finishLoginFlow(user, token);
      } else {
        alert("Unexpected server response — no token returned.");
      }
    } catch (err) {
      console.error("Registration failed:", err);
      alert("Sign-up failed. Please check your input or try again later.");
    }
  };

  const handleSignIn = async (credentials) => {
    try {
      const response = await signin(credentials);

      // Extract token from possible backend variations
      const token =
        response.token ||
        response.accessToken ||
        response.jwt ||
        response.authToken ||
        response.data?.token;

      if (!token) {
        console.error("No token in signin response:", response);
        alert("Login failed — no token returned by server.");
        return;
      }

      localStorage.setItem("authToken", token);

      // If backend returned user info directly, use it. Otherwise fetch it.
      const user = response.user || (await getCurrentUser());

      if (!user) {
        console.warn(" No user info available after login");
        return;
      }

      finishLoginFlow(user, token);
    } catch (err) {
      console.error("Login failed:", err);
      alert("Invalid credentials or server error. Please try again.");
    }
  };

  const handleSignOut = () => {
    console.log("Signing out...");
    setCurrentUser(null);
    setIsLoggedIn(false);
    setPendingRecipe(null);
    setUserRecipes([]);
    localStorage.removeItem("currentUser");
    localStorage.removeItem("authToken");
    navigate("/", { replace: true });
  };

  // Backend-based profile update
  const handleUpdateUser = async (updateData) => {
    try {
      const token = localStorage.getItem("authToken");
      if (!token) throw new Error("User not logged in");

      const updatedUser = await updateProfile(updateData, token);
      setCurrentUser(updatedUser);
      localStorage.setItem("currentUser", JSON.stringify(updatedUser));
      return updatedUser;
    } catch (err) {
      console.error("Profile update failed:", err);
      throw err;
    }
  };

  // Recipes
  const handleAddItem = (newItem) => {
    const token = localStorage.getItem("authToken");
    if (!token) {
      console.error("Authorization required. User must log in.");
      return;
    }

    createRecipe(newItem, token)
      .then((savedRecipe) => setUserRecipes((prev) => prev.concat(savedRecipe)))
      .catch((err) => console.error("Failed to save recipe:", err));
  };

  const handleEditItem = (updatedItem) =>
    setUserRecipes((prev) =>
      prev.map((r) => (r._id === updatedItem._id ? updatedItem : r)),
    );

  const handleDeleteItem = (id) =>
    setUserRecipes((prev) => prev.filter((r) => r._id !== id));

  const handleSaveToCookbook = (recipe) => {
    setIsSaving(true);
    return new Promise((resolve) => {
      setTimeout(() => {
        handleAddItem(recipe);
        setIsSaving(false);
        setSelectedRecipe(null);
        resolve();
      }, 800);
    });
  };

  const handleRequireAuth = (recipe) => {
    setPendingRecipe(recipe);
    setSelectedRecipe(null);
    setIsLoginModalOpen(true);
  };

  const resetSaving = () => setIsSaving(false);

  return (
    <CurrentUserContext.Provider
      value={{ currentUser, isLoggedIn, setCurrentUser }}
    >
      <Header
        currentUser={currentUser}
        isLoggedIn={isLoggedIn}
        onSignOut={handleSignOut}
        openRegisterModal={() => setIsRegisterModalOpen(true)}
        openLoginModal={() => setIsLoginModalOpen(true)}
      />

      <main className="main-content">
        <Routes>
          <Route
            path="/"
            element={<Home onRecipeClick={setSelectedRecipe} />}
          />
          <Route
            path="/profile"
            element={
              <PrivateRoute isLoggedIn={isLoggedIn}>
                <Profile
                  currentUser={currentUser}
                  userRecipes={userRecipes}
                  onUpdateProfile={handleUpdateUser}
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
                  openAddModal={() => setIsAddModalOpen(true)}
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
          isOpen={isRegisterModalOpen}
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
          isOpen={isLoginModalOpen}
          onClose={() => setIsLoginModalOpen(false)}
          onSignIn={handleSignIn}
          onSwitchToRegister={() => {
            setIsLoginModalOpen(false);
            setIsRegisterModalOpen(true);
          }}
        />
      )}

      {selectedRecipe && (
        <RecipeDetailModal
          recipe={selectedRecipe}
          isSaving={isSaving}
          onClose={() => setSelectedRecipe(null)}
          onSave={handleSaveToCookbook}
          onRequireAuth={handleRequireAuth}
          resetSaving={resetSaving}
        />
      )}

      {isAddModalOpen && (
        <AddItem
          onClose={() => setIsAddModalOpen(false)}
          onAdd={(savedRecipe) => {
            // handleAddItem(savedRecipe);
            setUserRecipes((prev) => prev.concat(savedRecipe));
            setIsAddModalOpen(false);
          }}
        />
      )}
    </CurrentUserContext.Provider>
  );
}

export default App;
