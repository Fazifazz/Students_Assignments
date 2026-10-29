
import { useEffect, useState } from 'react';
import axios from 'axios';
import { searchLocalRecipes } from '../data/southIndianRecipes.js';

// Custom hook: fetches recipes and tracks loading/errors.
export function useRecipes(query) {
  const [data, setData] = useState(() =>
    searchLocalRecipes(query || '')
  );
  const [loading, setLoading] = useState(
    Boolean(query?.trim())
  );
  const [error, setError] = useState(null);

  useEffect(() => {
    const cleanedQuery = query?.trim() || '';
    const localMatches = searchLocalRecipes(cleanedQuery);

    // With no search term, show the curated recipe collection.
    if (!cleanedQuery) {
      setData(searchLocalRecipes(''));
      setLoading(false);
      setError(null);
      return undefined;
    }

    let cancelled = false;

    // Show matching curated dishes immediately.
    setData(localMatches);

    async function fetchRecipes() {
      setLoading(true);
      setError(null);

      try {
        const response = await axios.get(
          'https://www.themealdb.com/api/json/v1/1/search.php',
          {
            params: { s: cleanedQuery },
            timeout: 12000,
          }
        );

        const apiMeals = response.data.meals || [];

        if (!cancelled) {
          if (localMatches.length > 0) {
            // Prefer our curated recipes and their matching local images.
            setData(localMatches);
          } else {
            // Fall back to API recipes with their own original images.
            setData(apiMeals);
          }
        }
      } catch (err) {
        if (!cancelled) {
          // Keep local matches available if the API fails.
          setData(localMatches);

          setError(
            err.response
              ? `The recipe service returned an error (${err.response.status}).`
              : 'Could not connect to the recipe service. Check your internet connection and try again.'
          );
        }
      } finally {
        if (!cancelled) {
          setLoading(false);
        }
      }
    }

    fetchRecipes();

    // Prevent an old request from updating state after a new search.
    return () => {
      cancelled = true;
    };
  }, [query]);

  return { data, loading, error };
}
