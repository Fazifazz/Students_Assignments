
import { Link } from "react-router-dom";
import { Heart, ArrowUpRight } from "lucide-react";

function RecipeCard({ recipe, isFav, toggleFavourite }) {
  return (
    <article className="recipe-card">
      <div className="recipe-image-wrap">
        <Link
          to={`/recipes/${recipe.idMeal}`}
          className="recipe-image-link"
        >
          <img
            src={recipe.strMealThumb}
            alt={recipe.strMeal}
            loading="lazy"
          />
        </Link>

        <button
          type="button"
          className={`favourite-btn ${isFav ? "active" : ""}`}
          onClick={() => toggleFavourite(recipe)}
          aria-label={
            isFav ? "Remove from favourites" : "Add to favourites"
          }
          title={isFav ? "Remove from favourites" : "Add to favourites"}
        >
          <Heart size={19} fill={isFav ? "currentColor" : "none"} />
        </button>

        {recipe.strCategory && (
          <span className="recipe-badge">{recipe.strCategory}</span>
        )}
      </div>

      <div className="recipe-card-content">
        <p className="recipe-area">{recipe.strArea || "World cuisine"}</p>

        <Link
          to={`/recipes/${recipe.idMeal}`}
          className="recipe-title-link"
        >
          <h3>{recipe.strMeal}</h3>
        </Link>

        <Link
          to={`/recipes/${recipe.idMeal}`}
          className="recipe-view-link"
        >
          View recipe <ArrowUpRight size={17} />
        </Link>
      </div>
    </article>
  );
}

export default RecipeCard;
