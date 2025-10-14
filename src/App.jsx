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
import RecipeDetailModal from "./modals/RecipeDetailModal";
import CurrentUserContext from "./contexts/CurrentUserContext";
import "./App.css";

const DEFAULT_AVATAR = "/src/assets/images/user-placeholder.png";

function App() {
  const [currentUser, setCurrentUser] = useState(null);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [userRecipes, setUserRecipes] = useState([]);

  // --- modal / recipe states ---
  const [selectedRecipe, setSelectedRecipe] = useState(null);
  const [isSaving, setIsSaving] = useState(false);
  const [pendingRecipe, setPendingRecipe] = useState(null); // holds recipe if auth required

  const [isRegisterModalOpen, setIsRegisterModalOpen] = useState(false);
  const [isLoginModalOpen, setIsLoginModalOpen] = useState(false);

  const navigate = useNavigate();
  const location = useLocation();
  const from = location.state?.from?.pathname || "/dashboard";

  // --- cookbook handlers ---
  const handleSaveToCookbook = (recipe) => {
    setIsSaving(true);
    return new Promise((resolve) => {
      setTimeout(() => {
        setUserRecipes((prev) => [
          ...prev,
          { ...recipe, _id: Date.now().toString() },
        ]);
        setIsSaving(false);
        setSelectedRecipe(null); // close modal
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

  // --- profile/favorites/dashboard logic ---
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

  // --- auth handlers ---
  const finishLoginFlow = (user) => {
    setCurrentUser(user);
    setIsLoggedIn(true);

    // if a recipe was waiting to be saved, save it now
    if (pendingRecipe) {
      handleSaveToCookbook(pendingRecipe);
      setPendingRecipe(null);
    }

    navigate(from, { replace: true });
  };

  const handleSignUp = (formData) => {
    return new Promise((resolve) => {
      const newUser = {
        id: Date.now().toString(),
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
      setIsRegisterModalOpen(false);
      finishLoginFlow(newUser);
      resolve();
    });
  };

  const handleSignIn = (credentials) => {
    return new Promise((resolve) => {
      const loggedUser = {
        id: Date.now().toString(),
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
      setIsLoginModalOpen(false);
      finishLoginFlow(loggedUser);
      resolve();
    });
  };

  const handleSignOut = () => {
    setCurrentUser(null);
    setIsLoggedIn(false);
    setPendingRecipe(null);
    navigate("/", { replace: true });
  };

  return (
    <CurrentUserContext.Provider value={{ currentUser, isLoggedIn }}>
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

      {/* Recipe modal */}
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
    </CurrentUserContext.Provider>
  );
}

export default App;

// ADDED SELECTEDRECIPE AND ISSAVING STATE TO THE ABOVE

// import React, { useState } from "react";
// import { Route, Routes, useNavigate, useLocation } from "react-router-dom";
// import Header from "./components/Header";
// import Footer from "./components/Footer";
// import Home from "./pages/Home";
// import Profile from "./pages/Profile";
// import Favorites from "./pages/Favorites";
// import Dashboard from "./pages/Dashboard";
// import RecipeDetails from "./pages/RecipeDetails";
// import SearchResults from "./pages/SearchResults";
// import PrivateRoute from "./components/PrivateRoute";
// import RegisterModal from "./modals/RegisterModal";
// import LoginModal from "./modals/LoginModal";
// import CurrentUserContext from "./contexts/CurrentUserContext";
// import "./App.css";

// const DEFAULT_AVATAR = "/src/assets/images/user-placeholder.png";

// function App() {
//   const [currentUser, setCurrentUser] = useState(null);
//   const [isLoggedIn, setIsLoggedIn] = useState(false);
//   const [userRecipes, setUserRecipes] = useState([]);

//   const [isRegisterModalOpen, setIsRegisterModalOpen] = useState(false);
//   const [isLoginModalOpen, setIsLoginModalOpen] = useState(false);

//   const navigate = useNavigate();
//   const location = useLocation();
//   const from = location.state?.from?.pathname || "/dashboard";

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

//   const handleDeleteItem = (id) => {
//     setUserRecipes((prev) => prev.filter((r) => r._id !== id));
//   };

//   const handleSignUp = (formData) => {
//     return new Promise((resolve) => {
//       const newUser = {
//         name: formData.name,
//         email: formData.email,
//         avatar: DEFAULT_AVATAR,
//         bio: "",
//         preferences: {
//           favoriteCuisine: "",
//           dietary: "",
//           notifications: true,
//         },
//       };
//       setCurrentUser(newUser);
//       setIsLoggedIn(true);
//       setIsRegisterModalOpen(false);
//       navigate(from, { replace: true });
//       resolve();
//     });
//   };

//   const handleSignIn = (credentials) => {
//     return new Promise((resolve) => {
//       const loggedUser = {
//         name: "User",
//         email: credentials.email,
//         avatar: DEFAULT_AVATAR,
//         bio: "",
//         preferences: {
//           favoriteCuisine: "",
//           dietary: "",
//           notifications: true,
//         },
//       };
//       setCurrentUser(loggedUser);
//       setIsLoggedIn(true);
//       setIsLoginModalOpen(false);
//       navigate(from, { replace: true });
//       resolve();
//     });
//   };

//   const handleSignOut = () => {
//     setCurrentUser(null);
//     setIsLoggedIn(false);
//     navigate("/", { replace: true });
//   };

//   return (
//     <CurrentUserContext.Provider value={{ currentUser, setCurrentUser }}>
//       <Header
//         currentUser={currentUser}
//         isLoggedIn={isLoggedIn}
//         onSignOut={handleSignOut}
//         openRegisterModal={() => setIsRegisterModalOpen(true)}
//         openLoginModal={() => setIsLoginModalOpen(true)}
//       />

//       <main className="main-content">
//         <Routes>
//           <Route path="/" element={<Home />} />
//           <Route
//             path="/profile"
//             element={
//               <PrivateRoute isLoggedIn={isLoggedIn}>
//                 <Profile
//                   currentUser={currentUser}
//                   userRecipes={userRecipes}
//                   onUpdateProfile={() => {}}
//                   onSignOut={handleSignOut}
//                 />
//               </PrivateRoute>
//             }
//           />
//           <Route
//             path="/favorites"
//             element={
//               <PrivateRoute isLoggedIn={isLoggedIn}>
//                 <Favorites userRecipes={userRecipes} />
//               </PrivateRoute>
//             }
//           />
//           <Route
//             path="/dashboard"
//             element={
//               <PrivateRoute isLoggedIn={isLoggedIn}>
//                 <Dashboard
//                   currentUser={currentUser}
//                   userRecipes={userRecipes}
//                   onAddItem={handleAddItem}
//                   onEditItem={handleEditItem}
//                   onDeleteItem={handleDeleteItem}
//                 />
//               </PrivateRoute>
//             }
//           />
//           <Route path="/recipe/:id" element={<RecipeDetails />} />
//           <Route path="/search" element={<SearchResults />} />
//         </Routes>
//       </main>

//       <Footer
//         currentUser={currentUser}
//         isLoggedIn={isLoggedIn}
//         openRegisterModal={() => setIsRegisterModalOpen(true)}
//         openLoginModal={() => setIsLoginModalOpen(true)}
//       />

//       {isRegisterModalOpen && (
//         <RegisterModal
//           onClose={() => setIsRegisterModalOpen(false)}
//           onSignUp={handleSignUp}
//           onSwitchToLogin={() => {
//             setIsRegisterModalOpen(false);
//             setIsLoginModalOpen(true);
//           }}
//         />
//       )}

//       {isLoginModalOpen && (
//         <LoginModal
//           onClose={() => setIsLoginModalOpen(false)}
//           onSignIn={handleSignIn}
//           onSwitchToRegister={() => {
//             setIsLoginModalOpen(false);
//             setIsRegisterModalOpen(true);
//           }}
//         />
//       )}
//     </CurrentUserContext.Provider>
//   );
// }

// export default App;
