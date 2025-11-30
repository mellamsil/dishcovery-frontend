import { useState } from "react";
import { searchRecipes, searchByIngredients } from "../utils/SpoonacularApi";
import "../styles/SearchForm.css";

function SearchForm({ onResults }) {
  const [query, setQuery] = useState("");
  const [diet, setDiet] = useState("");
  const [ingredients, setIngredients] = useState("");
  const [mode, setMode] = useState("keyword");

  const handleSubmit = (e) => {
    e.preventDefault();

    if (mode === "ingredients" && ingredients.trim()) {
      searchByIngredients(ingredients.trim()).then((data) => onResults(data));
    } else if (query.trim()) {
      searchRecipes(query.trim(), diet).then((data) => onResults(data));
    }
  };

  return (
    <form onSubmit={handleSubmit} className="search-form">
      {/* Radio buttons */}
      <div className="search-mode">
        <label>
          <input
            type="radio"
            name="mode"
            value="keyword"
            checked={mode === "keyword"}
            onChange={() => setMode("keyword")}
          />
          Search by keyword
        </label>
        <label>
          <input
            type="radio"
            name="mode"
            value="ingredients"
            checked={mode === "ingredients"}
            onChange={() => setMode("ingredients")}
          />
          Search by ingredients
        </label>
      </div>

      {/* Input fields */}
      <div className="search-fields">
        {mode === "keyword" ? (
          <>
            <input
              type="text"
              placeholder="Search recipes (e.g., pasta, curry)"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              className="search-input"
            />
            <select
              value={diet}
              onChange={(e) => setDiet(e.target.value)}
              className="search-select"
            >
              <option value="">All Diets</option>
              <option value="vegan">Vegan</option>
              <option value="vegetarian">Vegetarian</option>
              <option value="keto">Keto</option>
              <option value="paleo">Paleo</option>
              <option value="gluten free">Gluten Free</option>
            </select>
          </>
        ) : (
          <input
            type="text"
            placeholder="Enter ingredients (e.g., chicken, rice)"
            value={ingredients}
            onChange={(e) => setIngredients(e.target.value)}
            className="search-input"
          />
        )}

        <button type="submit" className="search-button">
          Search
        </button>
      </div>
    </form>
  );
}

export default SearchForm;
