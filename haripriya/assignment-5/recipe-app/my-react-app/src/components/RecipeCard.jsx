
import { useNavigate } from "react-router-dom";
import { useFavourites } from "../context/FavouritesContext";

function RecipeCard({ recipe }) {
    const navigate = useNavigate();

    // Get shared favourites data from Context
    const { favourites, toggleFavourite } = useFavourites();

    // Check whether this recipe is already a favourite
    const isFavourite = favourites.some(
        (item) => item.idMeal === recipe.idMeal
    );

    const handleViewRecipe = () => {
        navigate(`/recipes/${recipe.idMeal}`);
    };

    const handleFavouriteClick = (event) => {
        event.preventDefault();
        event.stopPropagation();

        if (!recipe || !recipe.idMeal) {
            return;
        }

        toggleFavourite(recipe);
    };

    return (
        <article
            className="recipe-card"
            onClick={handleViewRecipe}
        >
            <div className="recipe-image-wrapper">
                <img
                    src={recipe.strMealThumb}
                    alt={recipe.strMeal}
                    className="recipe-image"
                />

                <button
                    type="button"
                    className="wishlist-button mt-2"
                    aria-label={
                        isFavourite
                            ? "Remove from favourites"
                            : "Add to favourites"
                    }
                    onClick={handleFavouriteClick}
                >
                    <i

                        className={
                            isFavourite
                                ? "fa-solid fa-heart"
                                : "fa-regular fa-heart"
                        }
                    />
                </button>
            </div>

            <div className="recipe-card-content">
                <h3>{recipe.strCategory}</h3>
                <h2>{recipe.strMeal}</h2>
                <span>{recipe.strArea || "World Cuisine"}</span>

                <br />

                <button
                    type="button"
                    className="wishlist-button"
                    onClick={handleFavouriteClick}
                >
                    {isFavourite
                        ? "Remove from Favourites"
                        : "Save to Favourites"}

                    <i
                        className={
                            isFavourite
                                ? "fa-solid fa-heart"
                                : "fa-regular fa-heart"
                        }
                    />
                </button>
            </div>
        </article>
    );
}

export default RecipeCard;
