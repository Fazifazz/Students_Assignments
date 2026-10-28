
import { useState } from "react";
import useRecipes from "../hooks/useRecipes";
import RecipeCard from "../components/RecipeCard";
import useLocalStorage from "../hooks/useLocalStorage";

function Recipes() {
    const [searchInput, setSearchInput] = useState("");
    const [query, setQuery] = useLocalStorage("recipeQuery", "");

    const { data, loading, error } = useRecipes(query);

    const handleSearch = (e) => {
        e.preventDefault();
        setQuery(searchInput);
    };

    return (
        <>
            <div className="recipe-banner">
                <div className="container">
                    <h1>Find Your Next <br />Favourite Recipe</h1>
                    <p>Search for your favourite recipes.</p>
                </div>
            </div>
            <div className="recipes-page ">

                <div className="container">
                    <form onSubmit={handleSearch} className="search-form">
                        <input
                            type="text"
                            placeholder="Search recipes..."
                            value={searchInput}
                            onChange={(e) => setSearchInput(e.target.value)}
                        />

                        <button type="submit">Search <i class="fa-solid fa-magnifying-glass"></i></button>
                    </form>

                    {loading && (
                        <div className="loading-container">
                            <div className="spinner"></div>
                            <p>Loading recipes...</p>
                        </div>
                    )}

                    {error && <p className="error-message">{error}</p>}

                    {!loading && !error && query && data.length === 0 && (
                        <p>No recipes found. Try another search.</p>
                    )}

                    {!loading && !error && data.length > 0 && (
                        <div className="recipe-grid">
                            {data.map((recipe) => (
                                <RecipeCard
                                    key={recipe.idMeal}
                                    recipe={recipe}
                                />
                            ))}
                        </div>
                    )}
                </div>
            </div>
        </>
    );
}

export default Recipes;
