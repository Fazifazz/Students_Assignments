
import { useState } from 'react';
import RecipeCard from '../components/RecipeCard';
import './Recipe.css';
import { Link } from 'react-router-dom';

function Favourites({
  favourites,
  addToFavourites,
  removeFromFavourites
}) {
  const [showConfirmation, setShowConfirmation] = useState(false);

  function handleRemoveAll() {
    favourites.forEach((recipe) => {
      removeFromFavourites(recipe.idMeal);
    });

    setShowConfirmation(false);
  }

  return (
    <div className="recipes-page">
      <div className="favourites-header">
        <h1>My Favourites ❤️</h1>

        {favourites.length > 0 && (
          <button
            type="button"
            className="remove-all-btn"
            onClick={() => setShowConfirmation(true)}
          >
            Remove All
          </button>
        )}
      </div>

      {showConfirmation && (
        <div className="confirmation-box">
          <p>Are you sure you want to remove all favourites?</p>

          <button type="button" onClick={handleRemoveAll}>
            Yes, Remove All
          </button>

          <button
            type="button"
            onClick={() => setShowConfirmation(false)}
          >
            Cancel
          </button>
        </div>
      )}

      {favourites.length === 0 ? (
  <div className="empty-favourites">
    <div className="empty-favourites-icon">🍽️</div>
    <h2>Your favourite recipes belong here!</h2>
    <p>
      Found something delicious? Save it to your favourites
      and it will be waiting for you here.
    </p>
    <Link to="/recipes" className="browse-recipes-btn">
      Explore Recipes →
    </Link>
  </div>
) : (
        <div className="recipe-grid">
          {favourites.map((recipe) => (
            <RecipeCard
              key={recipe.idMeal}
              recipe={recipe}
              addToFavourites={addToFavourites}
              removeFromFavourites={removeFromFavourites}
              isFavourite={true}
              showDelete={true}
            />
          ))}
        </div>
      )}
    </div>
  );
}

export default Favourites;
