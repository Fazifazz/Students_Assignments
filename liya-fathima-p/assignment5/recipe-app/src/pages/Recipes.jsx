import { useState } from "react";
import useRecipes from "../hooks/useRecipes";
import RecipeCard from "../components/RecipeCard";

function Recipes({ favourites, toggleFavourite }) {
  const [input, setInput] = useState("");   
  const [query, setQuery] = useState("");   
  const { data, loading, error } = useRecipes(query);

  const handleSubmit = (e) => {
    e.preventDefault();
    setQuery(input.trim());
  };

  return (
    <div>
      <h1>Search Recipes</h1>

      <form onSubmit={handleSubmit}>
        <input
          type="text"
          placeholder="e.g. chicken, pasta, cake"
          value={input}
          onChange={(e) => setInput(e.target.value)}
        />
        <button type="submit">Search</button>
      </form>

      {loading && <div className="spinner"></div>}
      {error && <p className="error">{error}</p>}
      {!loading && !error && query && data.length === 0 && <p>No recipes found.</p>}

      <div className="grid">
        {data.map((recipe) => (
          <RecipeCard
            key={recipe.idMeal}
            recipe={recipe}
            isFav={favourites.some((f) => f.idMeal === recipe.idMeal)}
            toggleFavourite={toggleFavourite}
          />
        ))}
      </div>
    </div>
  );
}

export default Recipes;