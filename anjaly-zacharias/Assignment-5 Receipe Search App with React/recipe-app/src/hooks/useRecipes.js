
import { useEffect, useState } from "react";
import axiosInstance from "../api/axiosInstance";

function useRecipes(query) {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    if (!query.trim()) {
      setData([]);
      setError("");
      setLoading(false);
      return;
    }

    let ignore = false;

    async function fetchRecipes() {
      setLoading(true);
      setError("");

      try {
        const response = await axiosInstance.get(
          `/search.php?s=${encodeURIComponent(query.trim())}`
        );

        if (!ignore) {
          setData(response.data.meals || []);
        }
      } catch {
        if (!ignore) {
          setError("Unable to load recipes. Please try again.");
          setData([]);
        }
      } finally {
        if (!ignore) {
          setLoading(false);
        }
      }
    }

    fetchRecipes();

    return () => {
      ignore = true;
    };
  }, [query]);

  return { data, loading, error };
}

export default useRecipes;
