import { Link } from "react-router-dom";
import useRecipes from "../hooks/useRecipes";
import RecipeCard from "../components/RecipeCard";
import Loader from "../components/Loader";

export default function Home({ favourites, onSave }) {
  const { data, loading, error } = useRecipes("chicken");

  const popularRecipes = data.slice(0, 8);

  return (
    <main>
      <section className="hero">
        <div>
          <p className="eyebrow">FIND YOUR NEXT FAVOURITE</p>
          <h1>Discover recipes you'll love.</h1>
          <p>
            Explore delicious recipes and find inspiration for your next meal.
          </p>
          <Link to="/recipes" className="primary-btn">
            Explore Recipes
          </Link>
        </div>
      </section>

      <section className="section">
        <div className="section-heading">
          <div>
            <p className="eyebrow">HANDPICKED FOR YOU</p>
            <h2>Popular This Week</h2>
          </div>
          <Link to="/recipes">View all →</Link>
        </div>

        {loading && <Loader />}
        {/* {error && <p className="error">{error}</p>} */}

        {error && (
          <div className="error">
            <p>{error}</p>
          </div>
        )}

        <div className="recipe-grid">
          {popularRecipes.map((recipe) => (
            <RecipeCard
              key={recipe.idMeal}
              recipe={recipe}
              onSave={onSave}
              isFavourite={favourites.some(
                (item) => item.idMeal === recipe.idMeal,
              )}
            />
          ))}
        </div>
      </section>
    </main>
  );
}
