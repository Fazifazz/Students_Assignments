import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import Loader from "../components/Loader";
import api from "../api/axiosInstance";

export default function RecipeDetail({ favourites, onSave }) {
  const { id } = useParams();

  const [recipe, setRecipe] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const controller = new AbortController();

    async function fetchRecipe() {
      try {
        setLoading(true);
        setError("");
        setRecipe(null);

        const response = await api.get(`/lookup.php?i=${id}`);

        const result = response.data.meals?.[0];

        if (!result) {
          setError("Recipe not found.");
          return;
        }

        setRecipe(result);
      } catch (err) {
        if (err.code !== "ERR_CANCELED") {
          setError("Unable to load this recipe.");
        }
      } finally {
        if (!controller.signal.aborted) {
          setLoading(false);
        }
      }
    }

    fetchRecipe();

    return () => controller.abort();
  }, [id]);

  if (loading) return <Loader />;

  if (error) {
    return (
      <main className="container section">
        <p className="error">{error}</p>
        <Link to="/recipes">Back to Recipes</Link>
      </main>
    );
  }

  if (!recipe) return null;

  const ingredients = Array.from({ length: 20 }, (_, index) => ({
    ingredient: recipe[`strIngredient${index + 1}`],
    measure: recipe[`strMeasure${index + 1}`],
  })).filter((item) => item.ingredient?.trim());

  const isFavourite = favourites.some((item) => item.idMeal === recipe.idMeal);

  return (
    <main className="container section">
      <Link to="/recipes" className="back-link">
        ← Back to Recipes
      </Link>

      <div className="detail-layout">
        <div>
          <img
            className="detail-image"
            src={recipe.strMealThumb}
            alt={recipe.strMeal}
          />
        </div>

        <div className="detail-content">
          <p className="eyebrow">
            {recipe.strCategory || "Recipe"}
            {recipe.strArea ? ` · ${recipe.strArea}` : ""}
          </p>

          <h1>{recipe.strMeal}</h1>

          <button
            className={isFavourite ? "btn-remove-fav" : "btn-add-fav"}
            onClick={() => onSave(recipe)}
          >
            {isFavourite ? "Remove Favourites" : "Save to Favourites"}
          </button>

          <h2>Ingredients</h2>

          <ul className="ingredients-list">
            {ingredients.map((item, index) => (
              <li key={index}>
                <span>{item.ingredient}</span>
                <span>{item.measure}</span>
              </li>
            ))}
          </ul>

          <h2>Instructions</h2>
          <p className="instructions">{recipe.strInstructions}</p>
        </div>
      </div>
    </main>
  );
}
