import React from "react";
import RecipeList from "../components/RecipeList";

const SearchResults = () => {
  // Later you can add query params (useLocation) to fetch by keyword
  return (
    <main className="search-results">
      <h1>Search Results</h1>
      <RecipeList />
    </main>
  );
};

export default SearchResults;
