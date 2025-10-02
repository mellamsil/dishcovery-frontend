import { useState, useEffect, useCallback } from "react";

import RecipeCard from "../components/RecipeCard";
import RecipeDetailModal from "../modals/RecipeDetailModal";
import HeroImac from "../components/HeroImac";
import Preloader from "../components/Preloader";
import NoResults from "../components/NoResults";
import ErrorMessage from "../components/ErrorMessage";
import { fetchData, saveRecipe } from "../utils";
import "../styles/Home.css";

import spaghettiImg from "../assets/images/spaghetti.jpg";
import curryImg from "../assets/images/curry-chicken.jpg";
import saladImg from "../assets/images/caesar-salad.jpg";
import cakeImg from "../assets/images/chocolate-cake.jpg";
import grilledMeatImg from "../assets/images/grilled-meat.jpg";
import redfishImg from "../assets/images/redfish.jpg";
import shrimpImg from "../assets/images/scampi-shrimp.jpg";
import lobsterImg from "../assets/images/lobster.jpg";
import burritoImg from "../assets/images/burrito.jpg";
import steakImg from "../assets/images/steak.jpg";

// Sample mock recipes
const MOCK_RECIPES = [
  {
    _id: "1",
    title: "Spaghetti Bolognese",
    description:
      "A classic Italian-American dish with a slow-simmered meat sauce made from ground beef, tomatoes, and vegetables, served over a bed of spaghetti and finished with Parmesan cheese",
    image: spaghettiImg,
  },
  {
    _id: "2",
    title: " Curry Chicken",
    description:
      "A classic comfort dish of chicken and a blend of warm, traditional spices.",
    image: curryImg,
  },
  {
    _id: "3",
    title: "Caesar Salad",
    description:
      "A classic salad featuring crisp romaine lettuce, crunchy croutons, and shaved Parmesan cheese",
    image: saladImg,
  },
  {
    _id: "4",
    title: "Chocolate Cake",
    description:
      "A classic chocolate cake with a moist, rich crumb and a decadent, velvety chocolate buttercream frosting.",
    image: cakeImg,
  },
  {
    _id: "5",
    title: "Grilled Meat",
    description:
      "Savory grilled meat gets a zesty kick from fresh ginger, perfectly complemented by sweet, blistered tomatoes and tender, charred broccoli.",
    image: grilledMeatImg,
  },
  {
    _id: "6",
    title: "Red Fish",
    description:
      "Prized for its mild, sweet flavor and firm texture, redfish is a delicious and versatile seafood option. It can be baked, fried, or prepared blackened.",
    image: redfishImg,
  },
  {
    _id: "7",
    title: "Scampi Shrimps",
    description:
      "Scampi shrimp is an elegant and quick Italian-American dish featuring succulent shrimp bathed in a rich, buttery garlic sauce with a bright burst of lemon and white wine.",
    image: shrimpImg,
  },
  {
    _id: "8",
    title: "Lobster",
    description:
      "This easy-to-make lobster features juicy tails bathed in a rich garlic-lemon butter sauce and finished with fresh parsley",
    image: lobsterImg,
  },
  {
    _id: "9",
    title: "Burrito",
    description:
      " A warm flour tortilla loaded with savory ground beef, seasoned rice, hearty beans, and melted cheese, all rolled into a satisfying handheld meal.",
    image: burritoImg,
  },
  {
    _id: "10",
    title: "Steak",
    image: steakImg,
    ingredients: [
      "beef steak, salt, black pepper, and optionally garlic, herbs, and oil",
    ],
    instructions:
      "Season the steak with salt and pepper, sear in a hot pan or grill with oil or butter until desired doneness, then rest before serving.",
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

  useEffect(() => {
    setLoading(true);
    setError(null);

    fetchData("cookbook")
      .then((res) => {
        const data =
          Array.isArray(res.data) && res.data.length ? res.data : MOCK_RECIPES;
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

  const displayedInImac = Array.isArray(recipes) ? recipes.slice(0, 3) : [];
  const displayedRecipes = Array.isArray(recipes)
    ? recipes.slice(0, visibleCount)
    : [];

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
                className="hero__search-input"
                placeholder="Search recipes..."
                value={query}
                onChange={(e) => setQuery(e.target.value)}
              />
              <button type="submit" className="hero__search-button">
                Search
              </button>
            </form>

            <ul className="hero__features">
              <li>Browse sample recipes</li>
              <li>Save favorites into a private cookbook</li>
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
                        loading="lazy"
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
