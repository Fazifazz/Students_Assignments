import { Link } from "react-router-dom";

export default function RecipeCard({ recipe, onSave, isFavourite }) {
  return (
    <article className="recipe-card">
      <Link to={`/recipes/${recipe.idMeal}`}>
        <img src={recipe.strMealThumb} alt={recipe.strMeal} />

        <div className="recipe-info">
          <h3>{recipe.strMeal}</h3>
          <p>{recipe.strCategory || "Recipe"}</p>
        </div>
      </Link>

      <button
        className={isFavourite ? "btn-remove-fav" : "btn-add-fav"}
        onClick={() => onSave(recipe)}
      >
        {isFavourite ? "Remove Favourite" : "Save to Favourites"}
      </button>
    </article>
  );
}
