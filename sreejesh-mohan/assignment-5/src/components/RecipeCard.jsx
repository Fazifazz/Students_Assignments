// src/components/RecipeCard.jsx
import React from 'react';
import { Link } from 'react-router-dom';
import { Heart, Globe, ArrowRight, Bookmark } from 'lucide-react';
import { useFavourites } from '../context/FavouritesContext';

export default function RecipeCard({ recipe }) {
  const { isFavourite, toggleFavourite } = useFavourites();

  if (!recipe) return null;

  const { idMeal, strMeal, strCategory, strArea, strMealThumb } = recipe;
  const favourited = isFavourite(idMeal);

  const handleFavouriteClick = (e) => {
    e.preventDefault();
    e.stopPropagation();
    toggleFavourite(recipe);
  };

  return (
    <article className="recipe-card" id={`recipe-${idMeal}`}>
      <div className="recipe-card__media">
        <Link to={`/recipes/${idMeal}`} aria-label={`View details for ${strMeal}`}>
          <img
            src={strMealThumb || 'https://via.placeholder.com/400x300?text=No+Image'}
            alt={strMeal}
            loading="lazy"
            className="recipe-card__img"
          />
        </Link>

        {/* Favourites Toggle Button (SVG Icon) */}
        <button
          type="button"
          onClick={handleFavouriteClick}
          className={`favourite-btn ${favourited ? 'favourite-btn--active' : ''}`}
          aria-label={favourited ? `Remove ${strMeal} from favourites` : `Save ${strMeal} to favourites`}
          title={favourited ? 'Remove from Favourites' : 'Save to Favourites'}
        >
          <Heart
            size={18}
            fill={favourited ? '#be3a4e' : 'none'}
            color={favourited ? '#be3a4e' : '#48524b'}
            strokeWidth={2}
          />
        </button>

        {/* Category Pill */}
        {strCategory && (
          <span className="recipe-card__category-badge">
            {strCategory}
          </span>
        )}
      </div>

      <div className="recipe-card__body">
        {strArea && (
          <span className="recipe-card__origin">
            <Globe size={13} className="origin-icon" />
            <span>{strArea} Cuisine</span>
          </span>
        )}

        <h3 className="recipe-card__title">
          <Link to={`/recipes/${idMeal}`} title={strMeal}>
            {strMeal}
          </Link>
        </h3>

        <div className="recipe-card__actions">
          <Link to={`/recipes/${idMeal}`} className="btn btn-primary btn-sm">
            <span>View Recipe</span>
            <ArrowRight size={14} />
          </Link>
          <button
            type="button"
            onClick={handleFavouriteClick}
            className={`btn btn-outline btn-sm ${favourited ? 'btn-fav-active' : ''}`}
          >
            <Bookmark
              size={14}
              fill={favourited ? 'currentColor' : 'none'}
            />
            <span>{favourited ? 'Saved' : 'Save'}</span>
          </button>
        </div>
      </div>
    </article>
  );
}
