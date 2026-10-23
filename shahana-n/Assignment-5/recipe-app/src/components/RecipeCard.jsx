import { Link } from 'react-router-dom';

function RecipeCard({
  recipe,
  addToFavourites,
  removeFromFavourites,
  isFavourite,
  showDelete = false
}) {
  return (
    <div className="recipe-card">
      <Link
        to={`/recipes/${recipe.idMeal}`}
        className="recipe-card-link"
      >
        <img
          src={recipe.strMealThumb}
          alt={recipe.strMeal}
        />

        <div className="recipe-card-content">
          <h3>{recipe.strMeal}</h3>
          <p>{recipe.strCategory || 'Meal'}</p>
          <p>{recipe.strArea || 'Various cuisines'}</p>
        </div>
      </Link>

      <div className="recipe-card-actions">
        {/* Add to Favourites / Saved button */}
        <button
          type="button"
          className="save-btn"
          onClick={() => {
            if (isFavourite) {
              removeFromFavourites(recipe.idMeal);
            } else {
              addToFavourites(recipe);
            }
          }}
            disabled={isFavourite}
        >
          {isFavourite
            ? 'Saved ❤️'
            : 'Add to Favourites ♡'}
        </button>

        {/* Show delete icon only when saved */}
        {isFavourite && showDelete && (
          <button
            type="button"
            className="delete-favourite-btn"
            onClick={() =>
              removeFromFavourites(recipe.idMeal)
            }
            title="Remove from favourites"
            aria-label={`Remove ${recipe.strMeal} from favourites`}
          >
            🗑️
          </button>
        )}
      </div>
    </div>
  );
}

export default RecipeCard;
