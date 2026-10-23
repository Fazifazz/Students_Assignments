
import { useEffect, useState } from 'react';
import { useParams, useNavigate, useLocation } from 'react-router-dom';
import axios from 'axios';
import './RecipeDetails.css';

function RecipeDetail({ favourites, addToFavourites }) {
  const { id } = useParams();
  const navigate = useNavigate();
  const location = useLocation();

  const [recipe, setRecipe] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    async function fetchRecipe() {
      try {
        setLoading(true);
        setError(null);
        setRecipe(null);

        const response = await axios.get(
          `https://www.themealdb.com/api/json/v1/1/lookup.php?i=${id}`
        );

        const meal = response.data.meals?.[0];

        if (!meal) {
          setError('Recipe not found.');
          return;
        }

        setRecipe(meal);
      } catch (err) {
        setError(err?.message || 'Failed to fetch recipe details.');
      } finally {
        setLoading(false);
      }
    }

    fetchRecipe();
  }, [id]);

  function handleGoBack() {
    if (location.key !== 'default') {
      navigate(-1);
    } else {
      navigate('/recipes');
    }
  }

  if (loading) return <p>Loading recipe details...</p>;
  if (error) return <p className="error">{error}</p>;
  if (!recipe) return <p>Recipe not found.</p>;

  const ingredients = [];

  for (let i = 1; i <= 20; i++) {
    const ingredient = recipe[`strIngredient${i}`]?.trim();
    const measure = recipe[`strMeasure${i}`]?.trim();

    if (ingredient) {
      ingredients.push(`${measure || ''} ${ingredient}`.trim());
    }
  }

  const isFavourite = favourites.some(
    (item) => item.idMeal === recipe.idMeal
  );

  return (
    <div className="recipe-detail">
      <button
        type="button"
        className="back-btn"
        onClick={handleGoBack}
      >
        ← Go Back
      </button>

      <h1>{recipe.strMeal}</h1>

      <img
        src={recipe.strMealThumb}
        alt={recipe.strMeal}
        className="detail-image"
      />

      <p>
        <strong>Category:</strong> {recipe.strCategory}
      </p>

      <p>
        <strong>Cuisine:</strong> {recipe.strArea}
      </p>

      <button
        type="button"
        onClick={() => addToFavourites(recipe)}
        disabled={isFavourite}
      >
        {isFavourite ? 'Saved ❤️' : 'Save to Favourites ♡'}
      </button>

      <h2>Ingredients</h2>
      <ul>
        {ingredients.map((ingredient, index) => (
          <li key={index}>{ingredient}</li>
        ))}
      </ul>

      <h2>Instructions</h2>
      <p className="instructions">{recipe.strInstructions}</p>

      {recipe.strYoutube && (
        <a
          className="recipe-video"
          href={recipe.strYoutube}
          target="_blank"
          rel="noreferrer"
        >
          ▶ Watch Recipe Video
        </a>
      )}
    </div>
  );
}

export default RecipeDetail;
