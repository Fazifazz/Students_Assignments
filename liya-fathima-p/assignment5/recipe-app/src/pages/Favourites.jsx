import RecipeCard from "../components/RecipeCard";

function Favourites({ favourites, toggleFavourite }) {
  return (
    <div>
      <h1>My Favourites</h1>
      {favourites.length === 0 && <p>No favourites yet. Go save some recipes!</p>}
      <div className="grid">
        {favourites.map((recipe) => (
          <RecipeCard
            key={recipe.idMeal}
            recipe={recipe}
            isFav={true}
            toggleFavourite={toggleFavourite}
          />
        ))}
      </div>
    </div>
  );
}

export default Favourites;