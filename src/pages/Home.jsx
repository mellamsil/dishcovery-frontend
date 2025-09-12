import React, { useState, useEffect, useCallback } from "react";
import HeroComputer from "../components/HeroComputer";
import RecipeCard from "../components/RecipeCard";
import RecipeDetailModal from "../modals/RecipeDetailModal";
import { searchRecipes } from "../utils/api";
import "./Home.css";

function Home() {
  const [query, setQuery] = useState("chicken pasta");
  const [recipes, setRecipes] = useState([]);
  const [loading, setLoading] = useState(false);
  const [selectedRecipe, setSelectedRecipe] = useState(null);
  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState(null);
  const [notification, setNotification] = useState("");

  // Wrap doSearch in useCallback
  const doSearch = useCallback(
    (q = query) => {
      setLoading(true);
      setError(null);
      searchRecipes(q)
        .then((list) => setRecipes(list || []))
        .catch(() => setError("Could not fetch recipes. Please try again."))
        .finally(() => setLoading(false));
    },
    [query] // dependency array
  );

  // Initial load
  useEffect(() => {
    doSearch();
  }, [doSearch]);

  const handleSave = (recipe) => {
    setIsSaving(true);
    setTimeout(() => {
      setIsSaving(false);
      setNotification(`Saved "${recipe.title}" to your cookbook (demo).`);
      setTimeout(() => setNotification(""), 2000);
    }, 900);
  };

  return (
    <main className="home">
      {/* Hero Section */}
      <section className="hero">
        <div className="hero__left">
          <h1 className="hero__headline">
            Find recipes you actually want to cook
          </h1>
          <p className="hero__sub">
            Dishcovery helps you search, save, and organize your favorite
            recipes from Spoonacular.
          </p>

          <form
            className="hero__search"
            onSubmit={(e) => {
              e.preventDefault();
              doSearch(query);
            }}
            role="search"
            aria-label="Search recipes"
          >
            <input
              className="hero__search-input"
              type="text"
              placeholder="Try: chicken pasta, vegan tacos, keto dessert..."
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              aria-label="Search recipes by keyword"
            />
            <button className="hero__search-button" type="submit">
              Search
            </button>
          </form>

          <ul className="hero__features">
            <li>Search Spoonacular for recipes</li>
            <li>Save favorites into a private cookbook</li>
            <li>Sign up and keep your own collection</li>
          </ul>
        </div>

        <div className="hero__right">
          <HeroComputer
            recipes={recipes.slice(0, 3)}
            onOpen={(recipe) => setSelectedRecipe(recipe)}
          />
        </div>
      </section>

      {/* Search Results Section */}
      <section className="home__results">
        <h2 className="home__results-title">Search Results</h2>

        {loading && (
          <div className="home__loading" role="status">
            Loading recipes...
          </div>
        )}

        {error && (
          <div className="home__error" role="alert">
            {error}
          </div>
        )}

        <div className="home__recipe-list">
          {recipes.length > 0
            ? recipes.map((recipe) => (
                <RecipeCard
                  key={recipe.id}
                  recipe={recipe}
                  onOpen={() => setSelectedRecipe(recipe)}
                  onSave={handleSave}
                />
              ))
            : !loading && <p className="home__no-results">No recipes found.</p>}
        </div>
      </section>

      {/* Recipe Detail Modal */}
      <RecipeDetailModal
        recipe={selectedRecipe}
        isSaving={isSaving}
        onClose={() => setSelectedRecipe(null)}
        onSave={handleSave}
      />

      {/* Notification */}
      {notification && (
        <div className="home__notification" role="status">
          {notification}
        </div>
      )}
    </main>
  );
}

export default Home;
