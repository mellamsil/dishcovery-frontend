import React, { useState, useEffect, useCallback } from "react";
import RecipeCard from "../components/RecipeCard";
import RecipeDetailModal from "../modals/RecipeDetailModal";
import HeroImac from "../components/HeroImac";
import Preloader from "../components/Preloader";
import NoResults from "../components/NoResults";
import ErrorMessage from "../components/ErrorMessage";
import { fetchData, saveRecipe } from "../utils";
import "../styles/Home.css";

// Sample mock recipes for home page
const MOCK_RECIPES = [
  {
    _id: "1",
    title: "Spaghetti Bolognese",
    description: "Classic Italian pasta with rich meat sauce.",
    image: "https://via.placeholder.com/150?text=Spaghetti",
  },
  {
    _id: "2",
    title: "Chicken Curry",
    description: "A spicy and creamy curry for every occasion.",
    image: "https://via.placeholder.com/150?text=Curry",
  },
  {
    _id: "3",
    title: "Caesar Salad",
    description: "Fresh greens with a tangy Caesar dressing.",
    image: "https://via.placeholder.com/150?text=Salad",
  },
  {
    _id: "4",
    title: "Chocolate Cake",
    description: "Decadent chocolate cake for dessert lovers.",
    image: "https://via.placeholder.com/150?text=Cake",
  },
];

function Home() {
  const [query, setQuery] = useState("");
  const [recipes, setRecipes] = useState([]);
  const [selectedRecipe, setSelectedRecipe] = useState(null);
  const [isSaving, setIsSaving] = useState(false);
  const [notification, setNotification] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [visibleCount, setVisibleCount] = useState(3);

  // Local search (filter cached recipes)
  const doSearch = useCallback(
    (q = query) => {
      const stored = localStorage.getItem("recipes");
      const allRecipes = stored ? JSON.parse(stored) : MOCK_RECIPES;
      if (!q) {
        setRecipes(allRecipes);
      } else {
        const filtered = allRecipes.filter((r) =>
          r.title.toLowerCase().includes(q.toLowerCase())
        );
        setRecipes(filtered);
      }
    },
    [query]
  );

  // Fetch recipes or fallback to mock data
  useEffect(() => {
    setLoading(true);
    setError(null);

    fetchData("cookbook")
      .then((res) => {
        const data = res.data?.length ? res.data : MOCK_RECIPES;
        setRecipes(data);
        setVisibleCount(3);
        localStorage.setItem("recipes", JSON.stringify(data));
      })
      .catch(() => {
        setError(null);
        setRecipes(MOCK_RECIPES);
      })
      .finally(() => setLoading(false));
  }, []);

  // Save recipe
  const handleSave = (recipe) => {
    setIsSaving(true);
    saveRecipe(recipe).then((res) => {
      setIsSaving(false);
      if (res && res.success) {
        setNotification(`Saved "${recipe.title}" to your cookbook.`);
        setTimeout(() => setNotification(""), 2000);
        setRecipes((prev) => [...prev, recipe]);
      }
    });
  };

  // Recipes to show inside the iMac screen
  const displayedInImac = recipes.slice(0, 3);

  // Recipes to show in search results grid
  const displayedRecipes = recipes.slice(0, visibleCount);

  return (
    <main className="home">
      {/* Hero Section */}
      <section className="hero">
        {/* Left Column */}
        <div className="hero__left">
          <div className="hero__left-title">
            <h2>Welcome to Dishcovery!</h2>
          </div>
          <div className="hero__left-content">
            <p>
              Welcome to Dishcovery, the place where you can find your next
              culinary adventure! We are so glad you are here. Get ready to
              explore our wide collection of recipes, from quick and simple
              meals for busy weeknights to exciting new dishes for special
              occasions. Our mission is to help you discover new flavors and
              make cooking fun, easy, and delicious. So, what are you waiting
              for? Start your journey and discover your next favorite recipe
              today!
            </p>

            <form
              className="hero__search"
              onSubmit={(e) => {
                e.preventDefault();
                doSearch(query);
              }}
            >
              <input
                type="text"
                placeholder="Search recipes..."
                value={query}
                onChange={(e) => setQuery(e.target.value)}
              />
              <button type="submit">Search</button>
            </form>

            <ul className="hero__features">
              <li>Browse sample recipes</li>
              <li>Save favorites into a private cookbook</li>
              <li>Edit or delete recipes as you like</li>
            </ul>
          </div>
        </div>

        {/* Right Column */}
        <div className="hero__right">
          <div className="hero__right-title">
            <h2>Top Recipes</h2>
          </div>
          <div className="hero__right-content">
            <HeroImac>
              {loading ? (
                <Preloader text="Loading recipes..." />
              ) : displayedInImac.length === 0 ? (
                <p>No recipes yet</p>
              ) : (
                <ul className="imac-recipe-list">
                  {displayedInImac.map((recipe) => (
                    <li
                      key={recipe._id}
                      className="imac-recipe-item"
                      onClick={() => setSelectedRecipe(recipe)}
                    >
                      <img
                        src={recipe.image}
                        alt={recipe.title}
                        className="imac-recipe-image"
                      />
                      <div className="imac-recipe-info">
                        <h3 className="imac-recipe-title">{recipe.title}</h3>
                        <p className="imac-recipe-desc">
                          {recipe.description
                            ? recipe.description.slice(0, 80) + "..."
                            : "No description available."}
                        </p>
                      </div>
                    </li>
                  ))}
                </ul>
              )}
            </HeroImac>
          </div>
        </div>
      </section>

      {/* Search Results */}
      <section className="home__results">
        <h2 className="home__results-title">Search Results</h2>

        {loading && <Preloader text="Loading recipes..." />}
        {error && <ErrorMessage message={error} />}

        <div className="home__recipe-list">
          {!loading && !error && recipes.length > 0 ? (
            <>
              {displayedRecipes.map((recipe) => (
                <RecipeCard
                  key={recipe._id}
                  recipe={recipe}
                  onOpen={() => setSelectedRecipe(recipe)}
                  onSave={handleSave}
                />
              ))}

              {visibleCount < recipes.length && (
                <button
                  className="home__show-more"
                  onClick={() => setVisibleCount((prev) => prev + 3)}
                >
                  Show more
                </button>
              )}
            </>
          ) : (
            !loading && !error && <NoResults />
          )}
        </div>
      </section>

      {/* Recipe Modal */}
      <RecipeDetailModal
        recipe={selectedRecipe}
        isSaving={isSaving}
        onClose={() => setSelectedRecipe(null)}
        onSave={handleSave}
      />

      {/* Notification */}
      {notification && <div className="home__notification">{notification}</div>}
    </main>
  );
}

export default Home;
