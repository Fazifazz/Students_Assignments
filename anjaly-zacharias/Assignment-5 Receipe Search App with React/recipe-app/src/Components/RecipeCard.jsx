
import { Link } from "react-router-dom";

function RecipeCard({
  recipe,
  isFavourite,
  onToggleFavourite,
}) {
  return (
    <article className="recipe-card">
      <Link
        to={`/recipes/${recipe.idMeal}`}
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

        <p>{recipe.strCategory || "Delicious recipe"}</p>

        <div className="card-actions">
          <Link
            to={`/recipes/${recipe.idMeal}`}
            className="details-link"
          >
            View Recipe
          </Link>

          <button
            type="button"
            className="favourite-button"
            onClick={() => onToggleFavourite(recipe)}
          >
            {isFavourite ? "♥ Saved" : "♡ Save"}
          </button>
        </div>
      </div>
    </article>
  );
}

export default RecipeCard;
