import { useState, useEffect, useCallback } from "react";
import RecipeCard from "../components/RecipeCard";
import HeroImac from "../components/HeroImac";
import Preloader from "../components/Preloader";
import NoResults from "../components/NoResults";
import ErrorMessage from "../components/ErrorMessage";
import { getRecipes, searchRecipes } from "../utils/api";
import "../styles/Home.css";

function Home({ onRecipeClick }) {
  const [query, setQuery] = useState("");
  const [recipes, setRecipes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [visibleCount, setVisibleCount] = useState(3);

  const token = localStorage.getItem("authToken");

  // Load top Spoonacular recipes
  const loadRecipes = useCallback(() => {
    setLoading(true);
    setError(null);

    getRecipes(token)
      .then((data) => {
        // data is already formatted from backend
        console.log("Recipes loaded:", data);
        setRecipes(data);
      })
      .catch((err) => {
        console.error("Error fetching recipes:", err);
        setError("Failed to load recipes. Please try again later.");
        setRecipes([]);
      })
      .finally(() => setLoading(false));
  }, [token]);

  // Search Spoonacular recipes
  const doSearch = useCallback(
    (q = query) => {
      const searchTerm = q.trim();
      if (!searchTerm) {
        loadRecipes();
        return;
      }

      setLoading(true);
      setError(null);

      searchRecipes(token, searchTerm)
        .then((data) => setRecipes(data))
        .catch(() => setError("Search failed. Please try again."))
        .finally(() => setLoading(false));
    },
    [query, loadRecipes, token]
  );

  useEffect(() => {
    loadRecipes();
  }, [loadRecipes]);

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

            <ul className="hero__features">
              <li>Browse real recipes</li>
              <li>Save favorites into your private cookbook</li>
              <li>Edit or delete recipes as you like</li>
            </ul>
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
                      key={recipe._id}
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
                          {recipe.description.slice(0, 80) + "..."}
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
                  key={recipe._id}
                  recipe={recipe}
                  onOpen={() => onRecipeClick(recipe)}
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
    </main>
  );
}

export default Home;
