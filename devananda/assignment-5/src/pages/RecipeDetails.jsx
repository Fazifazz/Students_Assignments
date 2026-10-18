import { useEffect, useState } from 'react'
import axios from 'axios'
import { Link, useParams } from 'react-router-dom'
import { API_URL } from '../hooks/useRecipes'

function RecipeDetails() {
  const { id } = useParams()
  const [recipe, setRecipe] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    const controller = new AbortController()

    async function fetchDetails() {
      setLoading(true)
      setError('')
      setRecipe(null)

      try {
        const response = await axios.get(
          `${API_URL}/lookup.php?i=${encodeURIComponent(id)}`,
          { signal: controller.signal }
        )

        const meal = response.data.meals?.[0]

        if (!meal) {
          setError('Recipe not found.')
        } else {
          setRecipe(meal)
        }
      } catch (err) {
        if (err.code !== 'ERR_CANCELED') {
          setError('Could not load recipe details. Please try again.')
        }
      } finally {
        if (!controller.signal.aborted) setLoading(false)
      }
    }

    fetchDetails()
    return () => controller.abort()
  }, [id])

  if (loading) {
    return <p className="status-message">Loading recipe details...</p>
  }

  if (error) {
    return (
      <main className="page-container">
        <p className="error-message">{error}</p>
        <Link to="/recipes?q=chicken" className="details-link">
          Back to Recipes
        </Link>
      </main>
    )
  }

  const ingredients = Array.from({ length: 20 }, (_, index) => {
    const number = index + 1

    return {
      ingredient: recipe[`strIngredient${number}`]?.trim(),
      measure: recipe[`strMeasure${number}`]?.trim(),
    }
  }).filter((item) => item.ingredient)

  return (
    <main className="page-container detail-page">
      <Link to="/recipes?q=chicken" className="back-link">
        ← Back to Recipes
      </Link>

      <div className="detail-layout">
        <img
          className="detail-image"
          src={recipe.strMealThumb}
          alt={recipe.strMeal}
        />

        <div className="detail-content">
          <span className="eyebrow">
            {recipe.strArea || 'WORLD CUISINE'}
          </span>

          <h1>{recipe.strMeal}</h1>

          <p className="detail-category">
            {recipe.strCategory || 'Recipe'}
          </p>

          <h2>Ingredients</h2>
          <ul className="ingredient-list">
            {ingredients.map((item, index) => (
              <li key={`${item.ingredient}-${index}`}>
                <span>{item.ingredient}</span>
                <span>{item.measure}</span>
              </li>
            ))}
          </ul>

          <h2>Instructions</h2>
          <p className="instructions">
            {recipe.strInstructions || 'No instructions available.'}
          </p>

          {recipe.strYoutube && (
            <a
              className="details-link"
              href={recipe.strYoutube}
              target="_blank"
              rel="noreferrer"
            >
              Watch Cooking Video ↗
            </a>
          )}
        </div>
      </div>
    </main>
  )
}

export default RecipeDetails