import { Link } from "react-router-dom";

function RecipeCard({ recipe, isFav, toggleFavourite }) {
  return (
    <div className="card">
      <Link to={`/recipes/${recipe.idMeal}`}>
        <img src={recipe.strMealThumb} alt={recipe.strMeal} />
        <h3>{recipe.strMeal}</h3>
      </Link>
      <p>{recipe.strCategory} • {recipe.strArea}</p>
      <button onClick={() => toggleFavourite(recipe)}>
        {isFav ? "❤️ Remove from Favourites" : "🤍 Save to Favourites"}
      </button>
    </div>
  );
}

export default RecipeCard;