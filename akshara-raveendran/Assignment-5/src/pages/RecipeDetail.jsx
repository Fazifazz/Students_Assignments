import { useEffect, useState } from 'react';
import axios from 'axios';
import { Link, useParams } from 'react-router-dom';
import {
  ArrowLeft,
  Clock3,
  Heart,
  MapPin,
  Users,
  UtensilsCrossed,
} from 'lucide-react';
import {
  findLocalRecipe,
  getLocalImageForRecipe,
} from '../data/southIndianRecipes.js';

export default function RecipeDetail({ favourites, onToggleFavourite }) {
  // useParams reads the recipe ID from a URL such as /recipes/si-chicken-curry.
  const { id } = useParams();
  const [recipe, setRecipe] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    let cancelled = false;

    async function fetchRecipeDetails() {
      setLoading(true);
      setError(null);
      setRecipe(null);

      // Our curated South Indian dishes have full instructions stored locally.
      const localRecipe = findLocalRecipe(id);
      if (localRecipe) {
        setRecipe(localRecipe);
        setLoading(false);
        return;
      }

      // For recipes returned by the public API, request full details by ID.
      try {
        const response = await axios.get(
          'https://www.themealdb.com/api/json/v1/1/lookup.php',
          {
            params: { i: id },
            timeout: 12000,
          }
        );

        if (!cancelled) {
          const meal = response.data.meals?.[0];
          if (meal) {
            // Use a local image asset so the app's displayed images stay in its folder.
            setRecipe({ ...meal, strMealThumb: getLocalImageForRecipe(meal) });
          } else {
            setError('We could not find that recipe. Try browsing the recipe collection.');
          }
        }
      } catch {
        if (!cancelled) {
          setError('Could not load this recipe. Check your internet connection and try again.');
        }
      } finally {
        if (!cancelled) setLoading(false);
      }
    }

    fetchRecipeDetails();
    return () => {
      cancelled = true;
    };
  }, [id]);

  if (loading) {
    return (
      <main className="page-shell">
        <div className="loading-state detail-loading">
          <span className="spinner" />
          <p>Preparing your recipe…</p>
        </div>
      </main>
    );
  }

  if (error || !recipe) {
    return (
      <main className="page-shell">
        <div className="error-state">
          <h2>Recipe unavailable</h2>
          <p>{error || 'This recipe could not be found.'}</p>
          <Link to="/recipes" className="button button-primary">
            Browse recipes
          </Link>
        </div>
      </main>
    );
  }

  // TheMealDB stores ingredients and measures in numbered fields.
  const ingredients = Array.from({ length: 20 }, (_, index) => ({
    ingredient: recipe[`strIngredient${index + 1}`]?.trim(),
    measure: recipe[`strMeasure${index + 1}`]?.trim(),
  })).filter((item) => item.ingredient);

  const isFavourite = favourites.some((item) => item.idMeal === recipe.idMeal);
  const instructions = (recipe.strInstructions || '')
    .split(/\r?\n/)
    .map((step) => step.trim())
    .filter(Boolean);

  return (
    <main className="page-shell detail-shell">
      <Link to="/recipes" className="back-link">
        <ArrowLeft size={16} /> Back to recipes
      </Link>

      <section className="detail-hero">
        <div className="detail-photo">
          <img src={recipe.strMealThumb} alt={recipe.strMeal} />
        </div>

        <div className="detail-copy">
          <span className="eyebrow">
            {recipe.strArea || 'FROM OUR KITCHEN'} · {recipe.strCategory || 'RECIPE'}
          </span>
          <h1>{recipe.strMeal}</h1>
          <p className="detail-lead">
            {recipe.strDescription || 'A delicious dish to bring a little more joy to your table. Gather your ingredients and let’s get cooking.'}
          </p>

          <div className="detail-meta">
            <span><Clock3 size={17} /> Home-cook friendly</span>
            <span><Users size={17} /> Home servings</span>
            <span><MapPin size={17} /> {recipe.strArea || 'South Indian kitchen'}</span>
          </div>

          <button
            className={`button ${isFavourite ? 'button-saved' : 'button-primary'}`}
            onClick={() => onToggleFavourite(recipe)}
          >
            <Heart size={17} fill={isFavourite ? 'currentColor' : 'none'} />
            {isFavourite ? 'Saved to favourites' : 'Save to favourites'}
          </button>
        </div>
      </section>

      <section className="detail-content">
        <div className="ingredients-panel">
          <span className="eyebrow">LET'S GET PREPPED</span>
          <h2><UtensilsCrossed size={22} /> Ingredients</h2>
          <p className="muted-text">Everything you'll need for this dish.</p>

          <ul className="ingredient-list">
            {ingredients.map((item, index) => (
              <li key={`${item.ingredient}-${index}`}>
                <span className="ingredient-dot" />
                <span>{item.ingredient}</span>
                <strong>{item.measure}</strong>
              </li>
            ))}
          </ul>
        </div>

        <div className="instructions-panel">
          <span className="eyebrow">STEP BY STEP</span>
          <h2>How to make it</h2>
          <p className="muted-text">Take it one step at a time. You've got this!</p>

          <div className="instruction-list">
            {(instructions.length
              ? instructions
              : ['Follow the recipe instructions and cook until ready.']
            ).map((step, index) => (
              <div className="instruction-step" key={index}>
                <span className="step-number">{String(index + 1).padStart(2, '0')}</span>
                <p>{step}</p>
              </div>
            ))}
          </div>

          {recipe.strYoutube && (
            <a className="text-link video-link" href={recipe.strYoutube} target="_blank" rel="noreferrer">
              Watch the video tutorial ↗
            </a>
          )}
        </div>
      </section>
    </main>
  );
}
