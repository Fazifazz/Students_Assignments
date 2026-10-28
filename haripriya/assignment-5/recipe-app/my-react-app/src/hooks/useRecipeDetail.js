
import { useEffect, useState } from "react";
import axiosInstance from "../api/axiosInstance";

export default function useRecipeDetail(id) {
    const [recipe, setRecipe] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    useEffect(() => {
        if (!id) {
            setRecipe(null);
            setLoading(false);
            setError("Recipe ID is missing.");
            return;
        }

        const fetchRecipe = async () => {
            setLoading(true);
            setError("");
            setRecipe(null);

            try {
                const response = await axiosInstance.get(
                    "/lookup.php",
                    {
                        params: { i: id },
                    }
                );

                const meals = response.data.meals;

                if (!meals || meals.length === 0) {
                    setError("Recipe not found.");
                    return;
                }

                setRecipe(meals[0]);
            } catch (err) {
                setError("Unable to load recipe details.");
            } finally {
                setLoading(false);
            }
        };

        fetchRecipe();
    }, [id]);

    return { recipe, loading, error };
}
