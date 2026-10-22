import { Link } from 'react-router-dom';
import useRecipes from '../Hooks/useRecipe';
import RecipeCard from '../components/RecipeCard';
import './Home.css';

function Home({
  favourites,
  addToFavourites,
  removeFromFavourites
}) {
  const { data, loading, error } = useRecipes('');

  return (
    <div className="home-page">
      {/* Hero section */}
      <section className="home-hero">
        <div className="hero-content">
          <p className="hero-label">WELCOME TO FLAVORLY</p>

          <h1>
            Discover Delicious
            <br />
            Recipes for Every Day
          </h1>

          <p className="hero-description">
            Explore new flavours, find your favourite meals,
            and bring happiness to your kitchen.
          </p>

          <Link to="/recipes" className="hero-button">
            Explore Recipes →
          </Link>
        </div>
      </section>

      {/* Popular recipes */}
      <section className="popular-recipes">
        <h2>Explore Recipes</h2>

        <p className="section-description">
          Find your next favourite meal!
        </p>

        {loading && (
          <div className="loading">
            <div className="spinner"></div>
            <p>Loading recipes...</p>
          </div>
        )}

        {error && <p className="error">{error}</p>}

        {!loading && !error && data.length === 0 && (
          <p>No recipes found.</p>
        )}

        {!loading && !error && data.length > 0 && (
          <div className="recipe-grid">
            {data.slice(0, 6).map((recipe) => (
              <RecipeCard
                key={recipe.idMeal}
                recipe={recipe}
                addToFavourites={addToFavourites}
                removeFromFavourites={removeFromFavourites}
                isFavourite={favourites.some(
                  (item) => item.idMeal === recipe.idMeal
                )}
                showDelete={true}
              />
            ))}
          </div>
        )}

        <Link to="/recipes" className="view-all-button">
          View All Recipes →
        </Link>
      </section>
    </div>
  );
}

export default Home;
