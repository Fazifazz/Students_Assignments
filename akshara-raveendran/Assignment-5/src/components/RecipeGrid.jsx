import { ChefHat } from 'lucide-react';
import RecipeCard from './RecipeCard.jsx';

export default function RecipeGrid({ recipes, favourites, onToggleFavourite }) {
  if (!recipes.length) {
    return (
      <div className="empty-state">
        <span className="empty-icon"><ChefHat size={28} /></span>
        <h3>No recipes found just yet</h3>
        <p>Try another dish name, such as chicken, prawns, karimeen or kuruma.</p>
      </div>
    );
  }

  return (
    <div className="recipe-grid">
      {recipes.map((recipe) => (
        <RecipeCard
          key={recipe.idMeal}
          recipe={recipe}
          isFavourite={favourites.some((item) => item.idMeal === recipe.idMeal)}
          onToggleFavourite={onToggleFavourite}
        />
      ))}
    </div>
  );
}
