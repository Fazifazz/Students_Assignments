import { useEffect, useState } from "react";
import axiosInstance from "../api/axiosInstance";

export default function useRecipes(query = "", id = null) {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!query.trim() && !id) {
      setData([]);
      setLoading(false);
      return;
    }

    async function fetchRecipes() {
      try {
        setLoading(true);
        setError(null);

        const res = id
          ? await axiosInstance.get("/lookup.php", { params: { i: id } })
          : await axiosInstance.get("/search.php", {
              params: { s: query.trim() },
            });

        setData(res.data.meals || []);
      } catch (err) {
        setError("Failed to fetch recipes");
        setData([]);
      } finally {
        setLoading(false);
      }
    }
    fetchRecipes();
  }, [query, id]);
  return { data, loading, error };
}
