import { useEffect, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { Search, SlidersHorizontal } from 'lucide-react';
import { useRecipes } from '../hooks/useRecipes.js';
import RecipeGrid from '../components/RecipeGrid.jsx';

export default function Recipes({ favourites, onToggleFavourite }) {
  const [searchParams, setSearchParams] = useSearchParams();
  const initialQuery = searchParams.get('search') || '';
  const [input, setInput] = useState(initialQuery);
  const [query, setQuery] = useState(initialQuery);
  const { data, loading, error } = useRecipes(query);

  // Keep the input in sync when the search term comes from a category link.
  useEffect(() => {
    const queryFromUrl = searchParams.get('search') || '';
    setInput(queryFromUrl);
    setQuery(queryFromUrl);
  }, [searchParams]);

  function handleSubmit(event) {
    event.preventDefault();
    const cleanedQuery = input.trim();
    setQuery(cleanedQuery);
    setSearchParams(cleanedQuery ? { search: cleanedQuery } : {});
  }

  function searchPopularTerm(term) {
    setInput(term);
    setQuery(term);
    setSearchParams({ search: term });
  }

  return (
    <main className="page-shell">
      <section className="page-intro">
        <span className="eyebrow">THE RECIPE COLLECTION</span>
        <h1>South Indian dishes, <em>your way.</em></h1>
        <p>
          Search Kerala favourites and South Indian classics — chicken curry,
          karimeen mappas, prawn roast, veg kuruma and more.
        </p>
      </section>

      {/* Controlled form: React state stores what the user types. */}
      <form className="search-panel" onSubmit={handleSubmit}>
        <div className="search-input-wrap">
          <Search size={20} />
          <input
            aria-label="Search recipes"
            value={input}
            onChange={(event) => setInput(event.target.value)}
            placeholder="Try ‘karimeen mappas’, ‘prawn curry’ or ‘chilli gobi’..."
          />
          {input && (
            <button
              type="button"
              className="clear-search"
              onClick={() => {
                setInput('');
                setQuery('');
                setSearchParams({});
              }}
            >
              Clear
            </button>
          )}
        </div>
        <button className="button button-primary search-submit" type="submit">
          Search recipes <span aria-hidden="true">→</span>
        </button>
      </form>

      <div className="results-heading">
        <div>
          <span className="eyebrow">FRESH INSPIRATION</span>
          <h2>{query ? `Results for “${query.trim()}”` : 'Start with a craving'}</h2>
        </div>
        <span className="results-count">
          <SlidersHorizontal size={15} />
          {loading ? 'Searching…' : `${data.length} recipes`}
        </span>
      </div>

      {!query && !loading && (
        <div className="search-hints">
          <span>Popular searches:</span>
          {['Chicken', 'Seafood', 'Vegetarian', 'Karimeen Mappas', 'Prawns', 'Gobi'].map((term) => (
            <button key={term} onClick={() => searchPopularTerm(term)}>
              {term}
            </button>
          ))}
        </div>
      )}

      {loading ? (
        <div className="loading-state">
          <span className="spinner" />
          <p>Finding delicious recipes for you…</p>
        </div>
      ) : (
        <>
          {error && (
            <div className="error-state inline-error">
              <h3>Recipe service unavailable</h3>
              <p>{error}</p>
              <button
                className="button button-primary"
                onClick={() => setQuery((current) => `${current} `)}
              >
                Try again
              </button>
            </div>
          )}

          {data.length ? (
            <RecipeGrid
              recipes={data.slice(0, 6)}
              favourites={favourites}
              onToggleFavourite={onToggleFavourite}
            />
          ) : (
            !error && (
              <div className="empty-results">
                <h3>No recipes found</h3>
                <p>Try chicken, prawns, karimeen, veg kuruma or chilli gobi.</p>
              </div>
            )
          )}
        </>
      )}
    </main>
  );
}
