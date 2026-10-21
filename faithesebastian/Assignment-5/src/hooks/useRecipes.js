import { useEffect, useState } from 'react'
import axios from 'axios'
import { findKeralaRecipes, KERALA_RECIPES } from '../data/keralaRecipes.js'

const API_URL = 'https://www.themealdb.com/api/json/v1/1'

export default function useRecipes(query) {
  const searchTerm = query.trim()
  const localRecipes = findKeralaRecipes(searchTerm)
  const [result, setResult] = useState({ query: null, data: [], error: null })

  useEffect(() => {
    if (!searchTerm || localRecipes.length > 0) return undefined

    const controller = new AbortController()

    async function fetchRecipes() {
      try {
        const response = await axios.get(`${API_URL}/${searchTerm ? 'search.php' : 'filter.php'}`, {
          params: searchTerm ? { s: searchTerm } : { a: 'India' },
          signal: controller.signal,
        })
        const meals = response.data.meals ?? []
        setResult({
          query: searchTerm,
          data: meals.filter((recipe) => recipe.strArea === 'India'),
          error: null,
        })
      } catch (error) {
        if (!controller.signal.aborted) {
          setResult({
            query: searchTerm,
            data: [],
            error: error instanceof Error ? error.message : 'An unexpected error occurred.',
          })
        }
      }
    }

    fetchRecipes()
    return () => controller.abort()
  }, [localRecipes.length, searchTerm])

  const isCurrentResult = result.query === searchTerm
  if (!searchTerm || localRecipes.length > 0) {
    return {
      data: localRecipes.length > 0 ? localRecipes : KERALA_RECIPES,
      loading: false,
      error: null,
      isKeralaResults: true,
    }
  }

  return {
    data: isCurrentResult ? result.data : [],
    loading: !isCurrentResult,
    error: isCurrentResult ? result.error : null,
    isKeralaResults: false,
  }
}
