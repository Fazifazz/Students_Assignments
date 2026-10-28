import { useParams, Link } from "react-router-dom";
import { useEffect, useState } from "react";
import axiosInstance from "../api/axiosInstance";


function RecipeDetail({ favourites = [], toggleFavourite }) {
    const { id } = useParams();

    const [recipe, setRecipe] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    useEffect(() => {
        const fetchRecipe = async () => {
            setLoading(true);
            setError("");
            setRecipe(null);

            try {
                const response = await axiosInstance.get("/lookup.php", {
                    params: { i: id },
                });

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

    if (loading) {
        return <p className="detail-status">Loading recipe...</p>;
    }

    if (error) {
        return (
            <p className="detail-status error-message">
                {error}
            </p>
        );
    }

    if (!recipe) {
        return (
            <p className="detail-status">
                Recipe not found.
            </p>
        );
    }

    const isFavourite = favourites.some(
        (item) => item.idMeal === recipe.idMeal
    );

    const handleFavouriteClick = () => {
        if (toggleFavourite) {
            toggleFavourite(recipe);
        }
    };

    const ingredients = Array.from({ length: 20 }, (_, index) => {
        const ingredient =
            recipe[`strIngredient${index + 1}`]?.trim();

        const measure =
            recipe[`strMeasure${index + 1}`]?.trim();

        if (!ingredient) return null;

        return { ingredient, measure };
    }).filter(Boolean);

    const instructions = (recipe.strInstructions || "")
        .split(/\r?\n/)
        .map((step) => step.trim())
        .filter(Boolean);

    return (
        <main className="recipe-detail-page">
            <Link to="/recipes" className="back-link">
                <span aria-hidden="true">←</span> Back to Recipes
            </Link>

            <div className="recipe-detail-card">
                <div className="recipe-detail-top">
                    <div className="detail-image-wrapper">
                        <img
                            src={recipe.strMealThumb}
                            alt={recipe.strMeal}
                            className="detail-image"
                        />


                    </div>

                    <div className="recipe-info">
                        <h1>{recipe.strMeal}</h1>

                        <div className="recipe-meta">
                            <span>◷ &nbsp;Recipe details</span>
                            <span>
                                ♧ &nbsp;{recipe.strArea || "World cuisine"}
                            </span>
                        </div>

                        <p className="recipe-description">
                            A delicious {recipe.strMeal.toLowerCase()},
                            perfect for enjoying a homemade meal.
                        </p>

                        <h2>Ingredients</h2>

                        <ul className="ingredients-list">
                            {ingredients.map((item, index) => (
                                <li key={`${item.ingredient}-${index}`}>
                                    {item.measure
                                        ? `${item.measure} `
                                        : ""}
                                    {item.ingredient}
                                </li>
                            ))}
                        </ul>



                        {recipe.strYoutube && (
                            <a
                                href={recipe.strYoutube}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="wishlist-button back-to-recipes-btn d-inline"
                            >
                                Watch Recipe Video
                            </a>
                        )}
                    </div>
                </div>

                <section className="instructions-section">
                    <h2>Instructions</h2>

                    {instructions.length > 0 ? (
                        <ul className="instructions-list">
                            {instructions.map((step, index) => (
                                <li key={index}>
                                    {/* <span className="step-number">
                                        {index + 1}
                                    </span> */}
                                    <span className="step-text">
                                        {step}
                                    </span>
                                </li>
                            ))}
                        </ul>
                    ) : (
                        <p>Instructions are not available.</p>
                    )}
                </section>
            </div>
        </main>
    );
}

export default RecipeDetail;