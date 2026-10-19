
import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import axiosInstance from "../api/axiosInstance";
import LoadingSpinner from "../components/LoadingSpinner";

function RecipeDetail() {
  const { id } = useParams();

  const [recipe, setRecipe] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    let ignore = false;

    async function fetchRecipe() {
      setLoading(true);
      setError("");
      setRecipe(null);

      try {
        const response = await axiosInstance.get(
          `/lookup.php?i=${encodeURIComponent(id)}`
        );

        if (!ignore) {
          const meal = response.data.meals?.[0];

          if (meal) {
            setRecipe(meal);
          } else {
            setError("Recipe not found.");
          }
        }
      } catch {
        if (!ignore) {
          setError("Unable to load this recipe. Please try again.");
        }
      } finally {
        if (!ignore) {
          setLoading(false);
        }
      }
    }

    fetchRecipe();

    return () => {
      ignore = true;
    };
  }, [id]);

  if (loading) {
    return <LoadingSpinner />;
  }

  if (error) {
    return (
      <main className="page-container">
        <p className="error-message">{error}</p>
        <Link to="/recipes">Back to Recipes</Link>
      </main>
    );
  }

  const ingredients = Array.from(
    { length: 20 },
    (_, index) => {
      const number = index + 1;

      return {
        ingredient: recipe[`strIngredient${number}`]?.trim(),
        measure: recipe[`strMeasure${number}`]?.trim(),
      };
    }
  ).filter((item) => item.ingredient);

  return (
    <main className="detail-container">
      <Link to="/recipes" className="back-link">
        ← Back to Recipes
      </Link>

      <div className="detail-header">
        <img
          src={recipe.strMealThumb}
          alt={recipe.strMeal}
          className="detail-image"
        />

        <div>
          <span className="eyebrow">
            {recipe.strCategory || "Recipe"}
          </span>

          <h1>{recipe.strMeal}</h1>

          <p>
            {recipe.strArea
              ? `Cuisine: ${recipe.strArea}`
              : "Discover how to prepare this dish."}
          </p>
        </div>
      </div>

      <section className="detail-section">
        <h2>Ingredients</h2>

        <ul className="ingredient-list">
          {ingredients.map((item, index) => (
            <li key={index}>
              <span>{item.ingredient}</span>
              <span>{item.measure}</span>
            </li>
          ))}
        </ul>
      </section>

      <section className="detail-section">
        <h2>Cooking Instructions</h2>

        <p className="instructions">
          {recipe.strInstructions}
        </p>
      </section>

      {recipe.strYoutube && (
        <a
          href={recipe.strYoutube}
          target="_blank"
          rel="noreferrer"
          className="primary-button"
        >
          Watch Cooking Video ↗
        </a>
      )}
    </main>
  );
}

export default RecipeDetail;
