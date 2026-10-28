
import useRecipes from "../hooks/useRecipes";
import RecipeCard from "../components/RecipeCard";
import { Link } from "react-router-dom";

function Home() {
    const { data, loading, error } = useRecipes("");

    if (loading) {
        return (
            <div className="loading-container">
                <div className="spinner"></div>
                <p>Loading our recipes...</p>
            </div>
        );
    }

    if (error) {
        return (
            <p className="error-message">
                {error}
            </p>
        );
    }

    const featuredRecipes = data.slice(0, 4);

    return (
        <>
            <div className="hero-banner">
                <h1>
                    Good Food <br />
                    Brings People Together
                </h1>

                <p className="text-start text-light">
                    Discover delicious recipes for every day.
                </p>
                <Link to="/recipes" className="mt-2 wishlist-button back-to-recipes-btn d-inline">
                    Explore Our Kitchen{" "}
                    <i className="fa-solid fa-arrow-right-long"></i>
                </Link>
            </div>

            <section className="featured-section">
                <div className="pt-5 pb-5 container ft-rec">
                    <h2>Featured Recipes</h2>

                    <p>
                        Explore our latest recipes, from quick snacks
                        to hearty meals and indulgent desserts.
                    </p>

                    <Link to="/recipes" className="float-end">
                        View All{" "}
                        <i className="fa-solid fa-arrow-right-long"></i>
                    </Link>
                </div>

                <div className="pt-5 container recipe-grid">
                    {featuredRecipes.map((recipe) => (
                        <RecipeCard
                            key={recipe.idMeal}
                            recipe={recipe}
                        />
                    ))}
                </div>
            </section>
        </>
    );
}

export default Home;
