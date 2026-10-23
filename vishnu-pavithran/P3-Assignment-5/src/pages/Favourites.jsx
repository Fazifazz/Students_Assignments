import { Link } from "react-router-dom";
import RecipeCard from "../components/RecipeCard";

export default function Favourites({ favourites, onSave }) {
  return (
    <main className="container section">
      <p className="eyebrow">YOUR PERSONAL COLLECTION</p>
      <h1>My Favourites</h1>

      {favourites.length === 0 ? (
        <div className="empty-state">
          <h2>No favourites yet</h2>
          <p>Save recipes you love and find them here.</p>
          <Link to="/recipes" className="primary-btn">
            Explore Recipes
          </Link>
        </div>
      ) : (
        <>
          <p>{favourites.length} saved recipes</p>

          <div className="recipe-grid">
            {favourites.map((recipe) => (
              <RecipeCard
                key={recipe.idMeal}
                recipe={recipe}
                onSave={onSave}
                isFavourite={true}
              />
            ))}
          </div>
        </>
      )}
    </main>
  );
}
