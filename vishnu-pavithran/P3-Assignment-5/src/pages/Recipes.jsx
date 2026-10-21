import { useState } from "react";
import useRecipes from "../hooks/useRecipes";
import RecipeCard from "../components/RecipeCard";
import Loader from "../components/Loader";

export default function Recipes({ favourites, onSave }) {
  const [search, setSearch] = useState("");
  const [submittedQuery, setSubmittedQuery] = useState("chicken");

  const { data, loading, error } = useRecipes(submittedQuery);

  function handleSubmit(e) {
    e.preventDefault();

    const query = search.trim();
    console.log(query);

    if (query) {
      setSubmittedQuery(query);
    }
  }

  return (
    <main className="container section">
      <p className="eyebrow">EXPLORE OUR COLLECTION</p>
      <h1>Find Your Recipe</h1>

      <form className="search-form" onSubmit={handleSubmit}>
        <input
          type="text"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Search recipes..."
          aria-label="Search recipes"
        />

        <button className="primary-btn" type="submit">
          Search
        </button>
      </form>
      <p style={{ marginTop: 0, paddingLeft: 5, color: "#999" }}>
        Search by recipe name, such as chicken, pasta or curry.
      </p>

      {loading && <Loader />}
      {error && <p className="error">{error}</p>}

      {!loading && !error && data.length === 0 && (
        <div className="error">
          <p>No recipes found. Try another search.</p>
        </div>
      )}

      <div className="recipe-grid">
        {data.map((recipe) => (
          <RecipeCard
            key={recipe.idMeal}
            recipe={recipe}
            onSave={onSave}
            isFavourite={favourites.some(
              (item) => item.idMeal === recipe.idMeal,
            )}
          />
        ))}
      </div>
    </main>
  );
}
