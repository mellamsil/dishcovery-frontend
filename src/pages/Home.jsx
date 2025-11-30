import { useState, useEffect, useCallback } from "react";
import RecipeCard from "../components/RecipeCard";
import HeroImac from "../components/HeroImac";
import Preloader from "../components/Preloader";
import NoResults from "../components/NoResults";
import ErrorMessage from "../components/ErrorMessage";
import {
  getSpoonacularRecipes,
  searchSpoonacularRecipes,
  createRecipe,
} from "../utils/api";
import "../styles/Home.css";

function Home({ onRecipeClick }) {
  const MAX_RECIPES = 30;

  const [query, setQuery] = useState("");
  const [recipes, setRecipes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [visibleCount, setVisibleCount] = useState(3);

  // Load top Spoonacular recipes
  const loadRecipes = useCallback(() => {
    setLoading(true);
    setError(null);

    getSpoonacularRecipes(MAX_RECIPES)
      .then((data) => {
        setRecipes(data.slice(0, MAX_RECIPES));
      })
      .catch((err) => {
        console.error("Error fetching recipes:", err);
        setError("Failed to load recipes. Please try again later.");
        setRecipes([]);
      })
      .finally(() => setLoading(false));
  }, []);

  // Search Spoonacular recipes
  const doSearch = useCallback(
    (q) => {
      const searchTerm = (q || query).trim();
      if (!searchTerm) {
        loadRecipes();
        return;
      }

      setLoading(true);
      setError(null);

      searchSpoonacularRecipes(searchTerm, MAX_RECIPES)
        .then((data) => setRecipes(data.slice(0, MAX_RECIPES)))
        .catch((err) => {
          console.error("Search failed:", err);
          setError("Search failed. Please try again.");
          setRecipes([]);
        })
        .finally(() => setLoading(false));
    },
    [query, loadRecipes],
  );

  // Load recipes on mount
  useEffect(() => {
    loadRecipes();
  }, [loadRecipes]);

  // Handle saving recipe to cookbook
  const handleSaveRecipe = (recipe) => {
    const token = localStorage.getItem("authToken");
    if (!token) {
      alert("You must be logged in to save a recipe.");
      return;
    }

    createRecipe(recipe)
      .then(() => alert("Recipe saved to your cookbook!"))
      .catch((err) => {
        console.error("Failed to save recipe:", err);
        alert("Failed to save recipe. Please try again.");
      });
  };

  const displayedInImac = recipes.slice(0, 3);
  const displayedRecipes = recipes.slice(0, visibleCount);

  return (
    <main className="home">
      <section className="hero">
        <div className="hero__left">
          <div className="hero__left-title">
            <h1>Welcome to Dishcovery!</h1>
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
          </div>
        </div>

        <div className="hero__right">
          <div className="hero__right-title">
            <h2>Top Recipes</h2>
          </div>
          <div className="hero__right-content">
            <HeroImac>
              {loading ? (
                <Preloader text="Loading recipes..." />
              ) : error ? (
                <ErrorMessage message={error} />
              ) : displayedInImac.length === 0 ? (
                <p>No recipes yet</p>
              ) : (
                <ul className="imac-recipe-list">
                  {displayedInImac.map((recipe) => (
                    <li
                      key={recipe.id || recipe._id}
                      className="imac-recipe-item"
                      onClick={() => onRecipeClick(recipe)}
                    >
                      <img
                        src={recipe.image}
                        alt={recipe.title}
                        className="imac-recipe-image"
                        loading="lazy"
                      />
                      <div className="imac-recipe-info">
                        <h3 className="imac-recipe-title">{recipe.title}</h3>
                        <p className="imac-recipe-desc">
                          {(recipe.description || "")
                            .slice(0, 80)
                            .concat("...")}
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

      <section className="home__results">
        <h2 className="home__results-title">Search Results</h2>

        {loading && <Preloader text="Loading recipes..." />}
        {error && <ErrorMessage message={error} />}

        <div className="home__recipe-list">
          {!loading && !error && recipes.length > 0 ? (
            <>
              {displayedRecipes.map((recipe) => (
                <RecipeCard
                  key={recipe.id || recipe._id}
                  recipe={recipe}
                  onOpen={() => onRecipeClick(recipe)}
                  showSaveButton={false}
                  onSave={() => handleSaveRecipe(recipe)}
                />
              ))}

              {visibleCount < recipes.length && visibleCount < MAX_RECIPES && (
                <button
                  className="home__show-more"
                  onClick={() =>
                    setVisibleCount(Math.min(visibleCount + 3, MAX_RECIPES))
                  }
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
    </main>
  );
}

export default Home;
