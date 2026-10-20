import { useContext } from "react";
import { Link } from "react-router-dom";
import { FavouritesContext } from "../context/FavouritesContext";

export default function RecipeCard({ recipe }) {
  const { addFavourite, removeFavourite, isFavourite } =
    useContext(FavouritesContext);

  const fav = isFavourite(recipe.idMeal);

  const handleFavClick = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (fav) removeFavourite(recipe.idMeal);
    else addFavourite(recipe);
  };

  return (
    <article className="recipe-card">
      <Link to={`/recipes/${recipe.idMeal}`} className="card-link">
        <div className="card-image-wrap">
          <img
            src={recipe.strMealThumb}
            alt={recipe.strMeal}
            className="card-image"
            loading="lazy"
          />
        </div>
        <div className="card-body">
          <h3 className="card-title">{recipe.strMeal}</h3>
          {recipe.strCategory && (
            <p className="card-meta">
              <span className="badge">{recipe.strCategory}</span>
              {recipe.strArea && (
                <span className="badge badge-area">{recipe.strArea}</span>
              )}
            </p>
          )}
        </div>
      </Link>
      <button
        type="button"
        onClick={handleFavClick}
        className={fav ? "fav-btn fav-btn-active" : "fav-btn"}
      >
        {fav ? "★ Saved" : "☆ Save"}
      </button>
    </article>
  );
}
