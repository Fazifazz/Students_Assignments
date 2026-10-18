import { useEffect, useState } from 'react'
import axios from 'axios'

const API_URL = 'https://www.themealdb.com/api/json/v1/1'

export default function useRecipes(query = '') {
  const [data, setData] = useState([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  useEffect(() => {
    if (!query.trim()) {
      setData([])
      setLoading(false)
      setError('')
      return
    }

    const controller = new AbortController()

    async function fetchRecipes() {
      setLoading(true)
      setError('')

      try {
        const response = await axios.get(
          `${API_URL}/search.php?s=${encodeURIComponent(query)}`,
          { signal: controller.signal }
        )

        setData(response.data.meals || [])
      } catch (err) {
        if (err.code !== 'ERR_CANCELED') {
          setError('Recipes load cheyyan pattiyilla. Try again.')
        }
      } finally {
        if (!controller.signal.aborted) setLoading(false)
      }
    }

    fetchRecipes()
    return () => controller.abort()
  }, [query])

  return { data, loading, error }
}

export { API_URL }