import { useEffect, useState } from "react";
import api from "../api/axiosInstance";

export default function useRecipes(query) {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    const controller = new AbortController();

    async function fetchRecipes() {
      if (!query.trim()) {
        setData([]);
        setLoading(false);
        setError("");
        return;
      }

      try {
        setLoading(true);
        setError("");

        const response = await api.get(`/search.php?s=${query}`, {
          signal: controller.signal,
        });

        setData(response.data.meals || []);
      } catch (err) {
        if (err.code !== "ERR_CANCELED") {
          setError("Unable to load recipes. Please try again.");
          setData([]);
        }
      } finally {
        if (!controller.signal.aborted) {
          setLoading(false);
        }
      }
    }

    fetchRecipes();

    return () => controller.abort();
  }, [query]);

  return { data, loading, error };
}
