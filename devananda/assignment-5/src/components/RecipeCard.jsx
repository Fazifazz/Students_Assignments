import { Link } from 'react-router-dom'

function RecipeCard({ recipe, favourites, onToggleFavourite }) {
  const isFavourite = favourites.some(
    (item) => item.idMeal === recipe.idMeal
  )

  return (
    <article className="recipe-card">
      <Link
        to={`/recipe/${recipe.idMeal}`}
        className="recipe-image-link"
      >
        <img
          src={recipe.strMealThumb}
          alt={recipe.strMeal}
          className="recipe-image"
        />
      </Link>

      <div className="recipe-card-content">
        <h3>{recipe.strMeal}</h3>

        <p>{recipe.strArea || 'Delicious recipe'}</p>

        <Link
          to={`/recipe/${recipe.idMeal}`}
          className="details-link"
        >
          View Recipe →
        </Link>

        <button
          className={`favourite-button ${
            isFavourite ? 'saved' : ''
          }`}
          onClick={() => onToggleFavourite(recipe)}
        >
          {isFavourite ? '♥ Saved' : '♡ Save to Favourites'}
        </button>
      </div>
    </article>
  )
}

export default RecipeCard