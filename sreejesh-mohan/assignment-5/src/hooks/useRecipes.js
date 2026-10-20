// src/hooks/useRecipes.js
// Custom hook that manages asynchronous recipe search state
import { useState, useEffect, useCallback } from 'react';
import api from '../api/axiosInstance';

/**
 * Custom hook to fetch recipes by query from TheMealDB API
 * @param {string} query - Search term for recipes
 * @returns {{ data: Array, loading: boolean, error: string|null, refetch: Function }}
 */
export function useRecipes(query = '') {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchRecipes = useCallback(async (searchQuery, isCancelledRef) => {
    setLoading(true);
    setError(null);

    try {
      // TheMealDB search endpoint: /search.php?s={query}
      const response = await api.get('/search.php', {
        params: { s: searchQuery.trim() }
      });

      if (isCancelledRef && isCancelledRef.current) return;

      // TheMealDB returns { meals: null } when no items match
      const meals = response.data?.meals;
      setData(meals || []);
    } catch (err) {
      if (isCancelledRef && isCancelledRef.current) return;

      // Comprehensive Axios error handling
      if (err.response) {
        setError(`Server error (${err.response.status}): Failed to load recipes.`);
      } else if (err.request) {
        setError('Network error: Unable to connect to recipe server. Please check your internet.');
      } else {
        setError(err.message || 'An unexpected error occurred while fetching recipes.');
      }
      setData([]);
    } finally {
      if (!isCancelledRef || !isCancelledRef.current) {
        setLoading(false);
      }
    }
  }, []);

  useEffect(() => {
    // Flag to prevent state updates on unmounted component
    const isCancelledRef = { current: false };

    fetchRecipes(query, isCancelledRef);

    return () => {
      isCancelledRef.current = true;
    };
  }, [query, fetchRecipes]);

  const refetch = useCallback(() => {
    const isCancelledRef = { current: false };
    fetchRecipes(query, isCancelledRef);
  }, [query, fetchRecipes]);

  return { data, loading, error, refetch };
}

export default useRecipes;
