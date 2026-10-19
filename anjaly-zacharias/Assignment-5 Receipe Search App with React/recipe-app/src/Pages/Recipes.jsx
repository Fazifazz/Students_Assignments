
import { useState } from "react";
import useRecipes from "../hooks/useRecipes";
import RecipeCard from "../components/RecipeCard";
import LoadingSpinner from "../components/LoadingSpinner";

function Recipes({
  favourites,
  onToggleFavourite,
}) {
  const [searchInput, setSearchInput] = useState("");
  const [query, setQuery] = useState("");

  const { data, loading, error } = useRecipes(query);

  function handleSubmit(event) {
    event.preventDefault();
    setQuery(searchInput.trim());
  }

  return (
    <main className="page-container">
      <div className="page-heading">
        <span className="eyebrow">FIND YOUR NEXT MEAL</span>
        <h1>Explore Recipes</h1>
        <p>Search by recipe name, such as chicken, pasta, or cake.</p>
      </div>

      <form className="search-form" onSubmit={handleSubmit}>
        <input
          type="text"
          value={searchInput}
          onChange={(event) =>
            setSearchInput(event.target.value)
          }
          placeholder="What would you like to cook?"
          aria-label="Search recipes"
        />

        <button type="submit" className="primary-button">
          Search
        </button>
      </form>

      {loading && <LoadingSpinner />}

      {error && <p className="error-message">{error}</p>}

      {!loading && !error && query && data.length === 0 && (
        <p className="empty-message">
          No recipes found. Try another search.
        </p>
      )}

      {!loading && !error && data.length > 0 && (
        <div className="recipe-grid">
          {data.map((recipe) => (
            <RecipeCard
              key={recipe.idMeal}
              recipe={recipe}
              isFavourite={favourites.some(
                (item) => item.idMeal === recipe.idMeal
              )}
              onToggleFavourite={onToggleFavourite}
            />
          ))}
        </div>
      )}

      {!query && (
        <p className="empty-message">
          Enter a recipe name and click Search to get started.
        </p>
      )}
    </main>
  );
}

export default Recipes;
