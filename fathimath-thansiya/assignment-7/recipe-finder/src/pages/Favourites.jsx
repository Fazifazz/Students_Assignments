import { useContext } from "react";
import { Link } from "react-router-dom";
import { FavouritesContext } from "../context/FavouritesContext.jsx";
import RecipeCard from "../components/RecipeCard.jsx";

export default function Favourites() {
  const { favourites, removeFavourite } = useContext(FavouritesContext);

  return (
    <div className="favourites-page">
      <header className="page-header">
        <h1>Your Favourites</h1>
        <p>
          {favourites.length === 0
            ? "You have not saved any recipes yet."
            : `You have ${favourites.length} saved recipe${
                favourites.length !== 1 ? "s" : ""
              }.`}
        </p>
      </header>

      {favourites.length === 0 ? (
        <div className="empty-state">
          <span className="empty-icon">🍽️</span>
          <p>Browse recipes and tap the star to save them here.</p>
          <Link to="/recipes" className="btn btn-primary">
            Find Recipes
          </Link>
        </div>
      ) : (
        <>
          <div className="fav-actions">
            <button
              type="button"
              className="btn btn-secondary"
              onClick={() => {
                if (window.confirm("Remove all favourites?")) {
                  favourites.forEach((r) => removeFavourite(r.idMeal));
                }
              }}
            >
              Clear All
            </button>
          </div>
          <div className="recipe-grid">
            {favourites.map((recipe) => (
              <RecipeCard key={recipe.idMeal} recipe={recipe} />
            ))}
          </div>
        </>
      )}
    </div>
  );
}
