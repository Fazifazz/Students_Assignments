import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";

function RecipeDetail() {
  const { id } = useParams();
  const [recipe, setRecipe] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    let ignore = false; 

    const fetchRecipe = async () => {
      setLoading(true);
      setError(null);
      try {
        const res = await axios.get(
          `https://www.themealdb.com/api/json/v1/1/lookup.php?i=${id}`
        );
        if (!ignore) setRecipe(res.data.meals ? res.data.meals[0] : null);
      } catch {
        if (!ignore) setError("Failed to load recipe details.");
      } finally {
        if (!ignore) setLoading(false);
      }
    };

    fetchRecipe();

    return () => {
      ignore = true; 
    };
  }, [id]);

  if (loading) return <div className="spinner"></div>;
  if (error) return <p className="error">{error}</p>;
  if (!recipe) return <p>Recipe not found.</p>;

  
  const ingredients = [];
  for (let i = 1; i <= 20; i++) {
    const ing = recipe[`strIngredient${i}`];
    const measure = recipe[`strMeasure${i}`];
    if (ing && ing.trim()) ingredients.push(`${measure} ${ing}`);
  }

  return (
    <div className="detail">
      <h1>{recipe.strMeal}</h1>
      <img src={recipe.strMealThumb} alt={recipe.strMeal} />
      <p><b>Category:</b> {recipe.strCategory} | <b>Area:</b> {recipe.strArea}</p>

      <h3>Ingredients</h3>
      <ul>
        {ingredients.map((item, i) => <li key={i}>{item}</li>)}
      </ul>

      <h3>Instructions</h3>
      <p>{recipe.strInstructions}</p>
    </div>
  );
}

export default RecipeDetail;