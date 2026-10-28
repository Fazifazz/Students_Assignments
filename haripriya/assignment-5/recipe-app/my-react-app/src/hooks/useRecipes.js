import { useEffect, useState } from "react";
import axiosInstance from "../api/axiosInstance";

export default function useRecipes(query) {
    const [data, setData] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    useEffect(() => {

        const fetchRecipes = async () => {
            setLoading(true);
            setError(null);
            try {
                const response = await axiosInstance.get(
                    "/search.php",
                    {
                        params: { s: query },
                    }
                );
                setData(response.data.meals || []);
            }
            catch (err) {
                setError("Unable to load recipes. Please try again");
                setData([]);
            }
            finally {
                setLoading(false)
            }
        };
        fetchRecipes();
    }, [query]);

    return { data, loading, error }
}
