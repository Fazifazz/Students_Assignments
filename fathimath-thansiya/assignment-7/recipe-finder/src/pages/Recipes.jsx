import { useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";
import useRecipes from "../hooks/useRecipes";
import Spinner from "../components/Spinner";
import RecipeCard from "../components/RecipeCard";

export default function Recipes() {
  const [searchParams, setSearchParams] = useSearchParams();
  const [query, setQuery] = useState(searchParams.get("q") || "");
  const [submittedQuery, setSubmittedQuery] = useState(
    searchParams.get("q") || "chicken",
  );

  useEffect(() => {
    const q = searchParams.get("q") || "";
    setQuery(q);
    if (q) setSubmittedQuery(q || "chicken");
  }, [searchParams]);

  const { data, loading, error } = useRecipes(submittedQuery);

  const handleSubmit = (e) => {
    e.preventDefault();
    const trimmed = query.trim();
    if (!trimmed) return;
    setSubmittedQuery(trimmed);
    setSearchParams({ q: trimmed });
  };

  return (
    <div className="recipes-page">
      <header className="page-header">
        <h1>Search Recipes</h1>
        <p>Try "chicken", "pasta", "beef", or "seafood".</p>
      </header>

      <form className="search-form" onSubmit={handleSubmit} role="search">
        <label htmlFor="recipe-search" className="visually-hidden">
          Search recipes
        </label>
        <input
          id="recipe-search"
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Search for a recipe..."
          className="search-input"
          autoComplete="off"
        />
        <button
          type="submit"
          className="btn btn-primary"
          disabled={!query.trim()}
        >
          Search
        </button>
      </form>

      {loading && <Spinner label="Fetching recipes..." />}

      {error && !loading && (
        <div className="error-box" role="alert">
          <strong>Error:</strong> {error}
        </div>
      )}
      {!loading && !error && submittedQuery && data.length === 0 && (
        <div className="empty-state">
          <p>No recipes found for "{submittedQuery}".</p>
          <p>Try a different search term.</p>
        </div>
      )}
      {!loading && !error && data.length > 0 && (
        <>
          <p className="results-count">
            Showing {data.length} recipe{data.length !== 1 ? "s" : ""} for "
            {submittedQuery}"
          </p>
          <div className="recipe-grid">
            {data.map((recipe) => (
              <RecipeCard key={recipe.idMeal} recipe={recipe} />
            ))}
          </div>
          {!submittedQuery && !loading && (
            <div className="empty-state">
              <p>Enter a search term to find recipes.</p>
            </div>
          )}
        </>
      )}
    </div>
  );
}
