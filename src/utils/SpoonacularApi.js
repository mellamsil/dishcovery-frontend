const filterRecipes = (recipes) =>
  (recipes || []).filter(
    (recipe) => recipe.image && recipe.title !== "Cajun Chicken Pasta"
  );

// Search recipes by query and optional diet
export function searchRecipes(query, diet = "") {
  const API_KEY = import.meta.env.VITE_SPOONACULAR_KEY;
  let url = `https://api.spoonacular.com/recipes/complexSearch?query=${encodeURIComponent(
    query
  )}&number=12&apiKey=${API_KEY}`;
  if (diet) url += `&diet=${encodeURIComponent(diet)}`;

  return fetch(url)
    .then((res) => {
      if (!res.ok) throw new Error("Failed to fetch recipes");
      return res.json();
    })
    .then((data) => filterRecipes(data.results))
    .catch((err) => {
      console.error("searchRecipes error:", err.message);
      return [];
    });
}

// Search recipes by ingredients
export function searchByIngredients(ingredients) {
  const API_KEY = import.meta.env.VITE_SPOONACULAR_KEY;
  const url = `https://api.spoonacular.com/recipes/findByIngredients?ingredients=${encodeURIComponent(
    ingredients
  )}&number=12&apiKey=${API_KEY}`;

  return fetch(url)
    .then((res) => {
      if (!res.ok) throw new Error("Failed to fetch recipes");
      return res.json();
    })
    .then((data) => filterRecipes(data))
    .catch((err) => {
      console.error("searchByIngredients error:", err.message);
      return [];
    });
}
