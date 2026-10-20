import { useParams, Link } from "react-router-dom";
import { useContext } from "react";
import useRecipes from "../hooks/useRecipes.js";
import Spinner from "../components/Spinner.jsx";
import { FavouritesContext } from "../context/FavouritesContext.jsx";

function extractIngredients(meal) {
  if (!meal) return [];
  const items = [];
  for (let i = 1; i <= 20; i += 1) {
    const name = meal[`strIngredient${i}`];
    const measure = meal[`strMeasure${i}`];
    if (name && name.trim()) {
      items.push({ name: name.trim(), measure: (measure || "").trim() });
    }
  }
  return items;
}

function formatInstructions(text) {
  if (!text) return [];
  return text
    .split(/\r?\n/)
    .map((s) => s.trim())
    .filter(Boolean);
}

export default function RecipeDetail() {
  const { id } = useParams();
  const { addFavourite, removeFavourite, isFavourite } =
    useContext(FavouritesContext);
  const { data, loading, error } = useRecipes("", id);

  if (loading) return <Spinner label="Loading recipe details..." />;

  if (error) {
    return (
      <div className="error-box" role="alert">
        <strong>Error:</strong> {error}
        <p>
          <Link to="/recipes" className="btn btn-secondary">
            Back to recipes
          </Link>
        </p>
      </div>
    );
  }

  const meal = data[0];
  if (!meal) {
    return (
      <div className="empty-state">
        <h2>Recipe not found</h2>
        <p>The recipe you're looking for doesn't exist.</p>
        <Link to="/recipes" className="btn btn-primary">
          Back to recipes
        </Link>
      </div>
    );
  }

  const ingredients = extractIngredients(meal);
  const steps = formatInstructions(meal.strInstructions);
  const fav = isFavourite(meal.idMeal);

  const handleFavToggle = () => {
    if (fav) removeFavourite(meal.idMeal);
    else addFavourite(meal);
  };

  return (
    <article className="recipe-detail">
      <Link to="/recipes" className="back-link">
        ← Back to recipes
      </Link>

      <header className="detail-header">
        <img
          src={meal.strMealThumb}
          alt={meal.strMeal}
          className="detail-image"
        />
        <div className="detail-info">
          <h1>{meal.strMeal}</h1>
          <div className="detail-meta">
            {meal.strCategory && (
              <span className="badge">{meal.strCategory}</span>
            )}
            {meal.strArea && (
              <span className="badge badge-area">{meal.strArea}</span>
            )}
            {meal.strTags &&
              meal.strTags.split(",").map((t) => (
                <span key={t} className="badge badge-tag">
                  {t.trim()}
                </span>
              ))}
          </div>
          <button
            type="button"
            onClick={handleFavToggle}
            className={fav ? "fav-btn fav-btn-active" : "fav-btn"}
          >
            {fav ? "★ Saved to Favourites" : "☆ Save to Favourites"}
          </button>
          {meal.strYoutube && (
            <a
              href={meal.strYoutube}
              target="_blank"
              rel="noopener noreferrer"
              className="btn btn-secondary"
            >
              Watch on YouTube
            </a>
          )}
          {meal.strSource && (
            <a
              href={meal.strSource}
              target="_blank"
              rel="noopener noreferrer"
              className="btn btn-secondary"
            >
              Original Source
            </a>
          )}
        </div>
      </header>

      <section className="detail-section">
        <h2>Ingredients</h2>
        <ul className="ingredients-list">
          {ingredients.map((ing, idx) => (
            <li key={idx}>
              <strong>{ing.measure}</strong> {ing.name}
            </li>
          ))}
        </ul>
      </section>

      <section className="detail-section">
        <h2>Instructions</h2>
        <ol className="instructions-list">
          {steps.map((step, idx) => (
            <li key={idx}>{step}</li>
          ))}
        </ol>
      </section>
    </article>
  );
}
