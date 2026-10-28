
import { Link } from "react-router-dom";
import { useFavourites } from "../context/FavouritesContext";
import RecipeCard from "../components/RecipeCard";

function Favourites() {
    const { favourites } = useFavourites();

    return (
        <>
            <div className="recipe-banner">
                <div className="container">
                    <h1>Your Favourite Recipes</h1>
                    <p>
                        All your saved recipes will appear here.
                    </p>
                </div>
            </div>
            <div className="recipes-page">
                <div className="container ">




                    {favourites.length === 0 ? (
                        <div className="empty-favourites mt-3">
                            <p className="mb-2">
                                You haven't saved any favourite recipes yet.
                            </p>



                            <Link to="/recipes" className="wishlist-button back-to-recipes-btn d-inline">
                                <i className="fa-solid fa-arrow-left"></i>&nbsp;
                                Go Back to Recipes
                            </Link>
                        </div>
                    ) : (
                        <div className="recipe-grid">
                            {favourites.map((recipe) => (
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

export default Favourites;
