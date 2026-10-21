import { useEffect, useState } from 'react'
import axios from 'axios'
import { findKeralaRecipeById } from '../data/keralaRecipes.js'

const API_URL = 'https://www.themealdb.com/api/json/v1/1'

export default function useRecipe(id) {
  const localRecipe = findKeralaRecipeById(id)
  const [result, setResult] = useState({ id: null, data: null, error: null })

  useEffect(() => {
    if (!id || localRecipe) return undefined

    const controller = new AbortController()

    async function fetchRecipe() {
      try {
        const response = await axios.get(`${API_URL}/lookup.php`, {
          params: { i: id },
          signal: controller.signal,
        })
        setResult({
          id,
          data: response.data.meals?.[0] ?? null,
          error: null,
        })
      } catch (error) {
        if (!controller.signal.aborted) {
          setResult({
            id,
            data: null,
            error: error instanceof Error ? error.message : 'An unexpected error occurred.',
          })
        }
      }
    }

    fetchRecipe()
    return () => controller.abort()
  }, [id, localRecipe])

  if (localRecipe) return { data: localRecipe, loading: false, error: null }
  const isCurrentResult = result.id === id
  return {
    data: isCurrentResult ? result.data : null,
    loading: Boolean(id) && !isCurrentResult,
    error: isCurrentResult ? result.error : null,
  }
}
