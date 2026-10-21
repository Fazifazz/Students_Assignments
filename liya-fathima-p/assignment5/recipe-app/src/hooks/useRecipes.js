import { useState, useEffect } from "react";
import axios from "axios";

function useRecipes(query) {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!query) return; // don't fetch on empty query

    let ignore = false; // prevents updating state from an old request

    const fetchRecipes = async () => {
      setLoading(true);
      setError(null);
      try {
        const res = await axios.get(
          `https://www.themealdb.com/api/json/v1/1/search.php?s=${query}`
        );
        if (!ignore) setData(res.data.meals || []); // API returns null when nothing found
      } catch  {
        if (!ignore) {
          setError("Failed to fetch recipes. Please try again.");
          setData([]);
        }
      } finally {
        if (!ignore) setLoading(false);
      }
    };

    fetchRecipes();

    return () => {
      ignore = true; // cleanup when query changes or component unmounts
    };
  }, [query]);

  return { data, loading, error };
}

export default useRecipes;