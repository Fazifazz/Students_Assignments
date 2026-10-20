// src/pages/Favourites.jsx
// Persistent Favourites Page connected to shared FavouritesContext
import React, { useState, useMemo } from 'react';
import { Link } from 'react-router-dom';
import { Search, X, Trash2, BookmarkCheck, ArrowRight, RotateCcw } from 'lucide-react';
import { useFavourites } from '../context/FavouritesContext';
import RecipeCard from '../components/RecipeCard';

export default function Favourites() {
  const { favourites, favouritesCount, clearFavourites } = useFavourites();
  const [filterText, setFilterText] = useState('');

  // Filter saved favourites by name or category
  const filteredFavourites = useMemo(() => {
    if (!filterText.trim()) return favourites;
    const term = filterText.toLowerCase().trim();
    return favourites.filter(
      (m) =>
        m.strMeal?.toLowerCase().includes(term) ||
        m.strCategory?.toLowerCase().includes(term) ||
        m.strArea?.toLowerCase().includes(term)
    );
  }, [favourites, filterText]);

  return (
    <div className="page-favourites">
      {/* Header Banner */}
      <section className="favourites-header">
        <div className="favourites-header-content">
          <div className="favourites-title-group">
            <h1 className="favourites-title">
              Personal Recipe Journal <span className="title-count-pill">{favouritesCount}</span>
            </h1>
            <p className="favourites-subtitle">
              Your curated collection of bookmarked dishes. Persisted seamlessly across sessions.
            </p>
          </div>

          {favouritesCount > 0 && (
            <div className="favourites-header-actions">
              <button
                type="button"
                onClick={() => {
                  if (window.confirm('Clear all saved recipes from your journal?')) {
                    clearFavourites();
                  }
                }}
                className="btn btn-secondary btn-sm"
              >
                <Trash2 size={14} />
                <span>Clear All ({favouritesCount})</span>
              </button>
            </div>
          )}
        </div>

        {/* Filter within favourites when user has multiple items */}
        {favouritesCount > 1 && (
          <div className="favourites-search-bar">
            <Search size={16} className="search-icon" />
            <input
              type="text"
              value={filterText}
              onChange={(e) => setFilterText(e.target.value)}
              placeholder="Search your journal by dish name or cuisine..."
              className="fav-filter-input"
            />
            {filterText && (
              <button
                type="button"
                onClick={() => setFilterText('')}
                className="search-clear-btn"
                aria-label="Clear filter"
              >
                <X size={14} />
              </button>
            )}
          </div>
        )}
      </section>

      {/* Main Content */}
      <section className="favourites-content">
        {favouritesCount === 0 ? (
          <div className="empty-favourites">
            <div className="empty-heart-icon">
              <BookmarkCheck size={52} strokeWidth={1.5} className="empty-svg-icon" />
            </div>
            <h2 className="empty-title">Your Culinary Journal is Empty</h2>
            <p className="empty-desc">
              You haven't bookmarked any recipes yet. Browse our culinary archive,
              tap the bookmark icon on recipes you'd love to cook, and they will be preserved here.
            </p>
            <Link to="/recipes" className="btn btn-primary btn-lg">
              <span>Explore Recipe Archive</span>
              <ArrowRight size={16} />
            </Link>
          </div>
        ) : filteredFavourites.length === 0 ? (
          <div className="empty-state">
            <div className="empty-state-icon">
              <Search size={40} strokeWidth={1.5} className="empty-svg-icon" />
            </div>
            <h3>No matching recipes</h3>
            <p>None of your {favouritesCount} saved recipes match "{filterText}".</p>
            <button
              type="button"
              className="btn btn-secondary"
              onClick={() => setFilterText('')}
            >
              <RotateCcw size={14} />
              <span>Show All Saved Recipes</span>
            </button>
          </div>
        ) : (
          <div className="recipes-grid">
            {filteredFavourites.map((recipe) => (
              <RecipeCard key={recipe.idMeal} recipe={recipe} />
            ))}
          </div>
        )}
      </section>
    </div>
  );
}
