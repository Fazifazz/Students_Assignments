
import { useState } from 'react';
import useRecipes from '../Hooks/useRecipe';
import RecipeCard from '../components/RecipeCard';
import './Recipe.css';

function Recipes({
  favourites,
  addToFavourites,
  removeFromFavourites
}) {
  const [search, setSearch] = useState('');
  const [query, setQuery] = useState('');

  const { data, loading, error } = useRecipes(query);

  function handleSubmit(e) {
    e.preventDefault();
    setQuery(search.trim());
  }

  return (
    <div className="recipes-page">
      <h1>Explore Recipes</h1>
      <p>Find your next favourite meal!</p>

      <form className="recipe-search" onSubmit={handleSubmit}>
        <input
          type="text"
          placeholder="Search recipes..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />

        <button type="submit">Search</button>
      </form>

      {loading && (
        <div className="loading">
          <div className="spinner"></div>
          <p>Loading recipes...</p>
        </div>
      )}

      {error && <p className="error">{error}</p>}

      {!loading && !error && data.length === 0 && (
        <p>No recipes found. Try another search!</p>
      )}

      {!loading && !error && data.length > 0 && (
        <div className="recipe-grid">
          {data.map(recipe => (
        <RecipeCard
        key={recipe.idMeal}
        recipe={recipe}
        addToFavourites={addToFavourites}
        removeFromFavourites={removeFromFavourites}
        isFavourite={favourites.some(item => item.idMeal === recipe.idMeal)}
        showDelete={true}
       />
       ))}
        </div>
      )}
    </div>
  );
}

export default Recipes;
