import React from "react";
import RecipeCard from "./RecipeCard";
import "./HeroComputer.css";

function HeroComputer({ recipes = [], onOpen }) {
  // Display only first 3 recipes
  const topRecipes = recipes.slice(0, 3);

  return (
    <section className="hero-computer">
      <div className="hero-computer__container">
        <h2 className="hero-computer__title">Top Recipes</h2>

        <div className="hero-computer__mockup">
          {/* Mockup computer frame */}
          <div className="computer-screen">
            {topRecipes.length === 0 ? (
              <p className="hero-computer__placeholder">Mockup Computer Here</p>
            ) : (
              <div className="hero-computer__recipe-list">
                {topRecipes.map((recipe) => (
                  <RecipeCard key={recipe.id} recipe={recipe} onOpen={onOpen} />
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}

export default HeroComputer;
