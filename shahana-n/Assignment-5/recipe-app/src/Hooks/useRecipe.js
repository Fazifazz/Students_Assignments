import { useState, useEffect } from 'react';
import axios from 'axios';

function useRecipes(query) {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    async function fetchRecipes() {
      try {
        setLoading(true);
        setError(null);

        const response = await axios.get(
          `https://www.themealdb.com/api/json/v1/1/search.php?s=${encodeURIComponent(query)}`
        );

        setData(response.data.meals || []);
      } catch (err) {
        setError(err?.message ||'Failed to fetch recipes. Please try again.');
        setData([]);
      } finally {
        setLoading(false);
      }
    }

    fetchRecipes();
  }, [query]);

  return { data, loading, error };
}

export default useRecipes;