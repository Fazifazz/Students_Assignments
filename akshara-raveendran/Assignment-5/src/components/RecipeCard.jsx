import { Heart, Clock3, ArrowUpRight } from 'lucide-react';
import { Link } from 'react-router-dom';

export default function RecipeCard({ recipe, isFavourite, onToggleFavourite }) {
  return (
    <article className="recipe-card">
      <div className="recipe-image-wrap">
        {/* Clicking the image opens this recipe's detail route. */}
        <Link to={`/recipes/${recipe.idMeal}`} aria-label={`View ${recipe.strMeal}`}>
          <img
            className="recipe-image"
            src={recipe.strMealThumb}
            alt={recipe.strMeal}
            loading="lazy"
          />
        </Link>

        {/* The heart calls the shared favourite handler from App.jsx. */}
        <button
          className={`heart-button ${isFavourite ? 'saved' : ''}`}
          onClick={() => onToggleFavourite(recipe)}
          aria-label={isFavourite ? 'Remove from favourites' : 'Save to favourites'}
          title={isFavourite ? 'Remove from favourites' : 'Save to favourites'}
        >
          <Heart size={18} fill={isFavourite ? 'currentColor' : 'none'} />
        </button>
        {recipe.strCategory && <span className="image-tag">{recipe.strCategory}</span>}
      </div>

      <div className="recipe-card-body">
        <p className="eyebrow">{recipe.strArea || 'FROM OUR KITCHEN'}</p>
        <h3><Link to={`/recipes/${recipe.idMeal}`}>{recipe.strMeal}</Link></h3>
        <div className="card-bottom">
          <span className="time-label"><Clock3 size={15} /> 30–45 min</span>
          <Link
            className="card-arrow"
            to={`/recipes/${recipe.idMeal}`}
            aria-label={`Read ${recipe.strMeal} recipe`}
          >
            <ArrowUpRight size={18} />
          </Link>
        </div>
      </div>
    </article>
  );
}
