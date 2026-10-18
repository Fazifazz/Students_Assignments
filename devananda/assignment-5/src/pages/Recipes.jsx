import { useState } from 'react'
import { useSearchParams } from 'react-router-dom'
import useRecipes from '../hooks/useRecipes'
import RecipeCard from '../components/RecipeCard'

function Recipes({ favourites, onToggleFavourite }) {
  const [searchParams, setSearchParams] = useSearchParams()
  const query = searchParams.get('q') || ''
  const [searchTerm, setSearchTerm] = useState(query)

  const { data, loading, error } = useRecipes(query)

  function handleSubmit(event) {
    event.preventDefault()
    const value = searchTerm.trim()

    if (value) {
      setSearchParams({ q: value })
    }
  }

  return (
    <main className="page-container">
      <section className="page-heading">
        <span className="eyebrow">EXPLORE & COOK</span>
        <h1>Discover Recipes</h1>
        <p>Search for a meal and find your next favourite dish.</p>
      </section>

      <form className="search-form page-search" onSubmit={handleSubmit}>
        <input
          type="text"
          value={searchTerm}
          onChange={(event) => setSearchTerm(event.target.value)}
          placeholder="Enter a recipe name..."
          aria-label="Search recipes"
        />
        <button type="submit">Search →</button>
      </form>

      {loading && (
        <div className="status-message">
          <div className="spinner" />
          <p>Finding delicious recipes...</p>
        </div>
      )}

      {error && <p className="error-message">{error}</p>}

      {!loading && !error && query && data.length === 0 && (
        <p className="status-message">
          No recipes found for "{query}". Try another name.
        </p>
      )}

      {!loading && !error && !query && (
        <p className="status-message">
          Enter a recipe name above to get started.
        </p>
      )}

      {!loading && data.length > 0 && (
        <>
          <h2 className="results-title">
            Results for "{query}" ({data.length})
          </h2>

          <div className="recipe-grid">
            {data.map((recipe) => (
              <RecipeCard
                key={recipe.idMeal}
                recipe={recipe}
                favourites={favourites}
                onToggleFavourite={onToggleFavourite}
              />
            ))}
          </div>
        </>
      )}
    </main>
  )
}

export default Recipes