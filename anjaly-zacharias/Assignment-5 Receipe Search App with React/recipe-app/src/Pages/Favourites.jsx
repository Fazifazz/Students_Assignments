
import RecipeCard from "../components/RecipeCard";
import { Link } from "react-router-dom";

function Favourites({
  favourites,
  onToggleFavourite,
}) {
  return (
    <main className="page-container">
      <div className="page-heading">
        <span className="eyebrow">YOUR PERSONAL COLLECTION</span>
        <h1>My Favourites ♥</h1>
        <p>Recipes you have saved for another day.</p>
      </div>

      {favourites.length === 0 ? (
        <div className="empty-state">
          <h2>No favourites yet</h2>
          <p>Save a recipe to see it in your collection.</p>
          <Link to="/recipes" className="primary-button">
            Discover Recipes
          </Link>
        </div>
      ) : (
        <div className="recipe-grid">
          {favourites.map((recipe) => (
            <RecipeCard
              key={recipe.idMeal}
              recipe={recipe}
              isFavourite={true}
              onToggleFavourite={onToggleFavourite}
            />
          ))}
        </div>
      )}
    </main>
  );
}

export default Favourites;
