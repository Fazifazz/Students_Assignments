// src/pages/Recipes.jsx
// Main Recipe Search Page utilizing controlled search form and useRecipes custom hook
import React, { useState, useEffect, useMemo } from 'react';
import { useSearchParams } from 'react-router-dom';
import { SearchX, RotateCcw } from 'lucide-react';
import useRecipes from '../hooks/useRecipes';
import RecipeCard from '../components/RecipeCard';
import SearchBar from '../components/SearchBar';
import LoadingSpinner from '../components/LoadingSpinner';
import ErrorMessage from '../components/ErrorMessage';

const CATEGORY_FILTERS = ['All', 'Indian Snacks', 'Breakfast', 'Seafood', 'Chicken', 'Beef', 'Vegetarian', 'Dessert'];

export default function Recipes() {
  const [searchParams, setSearchParams] = useSearchParams();
  const urlQuery = searchParams.get('q') || '';

  // Active query passed to useRecipes hook
  const [query, setQuery] = useState(urlQuery);
  // Category filter state
  const [selectedCategory, setSelectedCategory] = useState('All');
  // Sort order state: 'default', 'az', 'za'
  const [sortOrder, setSortOrder] = useState('default');

  // Synchronize state when URL query param changes
  useEffect(() => {
    if (urlQuery !== query) {
      setQuery(urlQuery);
    }
  }, [urlQuery]);

  // Invoke required custom hook useRecipes(query) -> returns { data, loading, error }
  const { data: recipes, loading, error, refetch } = useRecipes(query);

  // Handle search submission from controlled form
  const handleSearch = (newQuery) => {
    setQuery(newQuery);
    if (newQuery) {
      setSearchParams({ q: newQuery });
    } else {
      setSearchParams({});
    }
    setSelectedCategory('All');
  };

  // Filter and sort the retrieved recipes
  const filteredRecipes = useMemo(() => {
    if (!recipes) return [];

    let list = [...recipes];

    // Filter by Category if not 'All'
    if (selectedCategory !== 'All') {
      const sel = selectedCategory.toLowerCase();
      list = list.filter((meal) => {
        const cat = (meal.strCategory || '').toLowerCase();
        if (sel === 'indian snacks' || sel === 'snacks') {
          return cat === 'indian snacks' || cat === 'snacks';
        }
        return cat === sel;
      });
    }

    // Sort
    if (sortOrder === 'az') {
      list.sort((a, b) => a.strMeal.localeCompare(b.strMeal));
    } else if (sortOrder === 'za') {
      list.sort((a, b) => b.strMeal.localeCompare(a.strMeal));
    }

    return list;
  }, [recipes, selectedCategory, sortOrder]);

  return (
    <div className="page-recipes">
      {/* Header Banner */}
      <section className="recipes-header">
        <h1 className="recipes-title">Kerala & Indian Recipe Vault</h1>
        <p className="recipes-subtitle">
          Search traditional Kerala heirloom dishes and crisp Indian snacks. Select any recipe for measured ingredients, step-by-step methods, and chef guides.
        </p>

        {/* Controlled Search Form */}
        <SearchBar initialQuery={query} onSearch={handleSearch} />
      </section>

      {/* Main Content Area */}
      <section className="recipes-content-section">
        {/* Filter and Control Bar */}
        <div className="filter-sort-bar">
          {/* Category Filter Pills */}
          <div className="category-pill-group" role="tablist" aria-label="Category Filters">
            {CATEGORY_FILTERS.map((cat) => (
              <button
                key={cat}
                type="button"
                className={`category-pill ${selectedCategory === cat ? 'category-pill--active' : ''}`}
                onClick={() => setSelectedCategory(cat)}
              >
                {cat}
              </button>
            ))}
          </div>

          {/* Sort Dropdown */}
          <div className="sort-wrapper">
            <label htmlFor="recipe-sort-select" className="sort-label">Order by:</label>
            <select
              id="recipe-sort-select"
              value={sortOrder}
              onChange={(e) => setSortOrder(e.target.value)}
              className="sort-select"
            >
              <option value="default">Relevance / Default</option>
              <option value="az">Alphabetical: A to Z</option>
              <option value="za">Alphabetical: Z to A</option>
            </select>
          </div>
        </div>

        {/* Status Messages / Loading Spinner / Error Handling */}
        {loading && (
          <LoadingSpinner message={query ? `Filtering archive for "${query}"...` : 'Fetching curated recipes...'} />
        )}

        {!loading && error && (
          <ErrorMessage message={error} onRetry={refetch} />
        )}

        {/* Results Presentation */}
        {!loading && !error && (
          <>
            <div className="results-info">
              <span className="results-count">
                Presenting <strong>{filteredRecipes.length}</strong> {filteredRecipes.length === 1 ? 'recipe' : 'recipes'}
                {query ? ` for "${query}"` : ''}
                {selectedCategory !== 'All' ? ` in ${selectedCategory}` : ''}
              </span>
            </div>

            {filteredRecipes.length > 0 ? (
              <div className="recipes-grid">
                {filteredRecipes.map((recipe) => (
                  <RecipeCard key={recipe.idMeal} recipe={recipe} />
                ))}
              </div>
            ) : (
              <div className="empty-state">
                <div className="empty-state-icon">
                  <SearchX size={44} strokeWidth={1.5} className="empty-svg-icon" />
                </div>
                <h3>No culinary records found</h3>
                <p>
                  No recipes matched your search criteria
                  {query ? ` ("${query}")` : ''}
                  {selectedCategory !== 'All' ? ` in category "${selectedCategory}"` : ''}.
                </p>
                <button
                  type="button"
                  className="btn btn-primary"
                  onClick={() => {
                    handleSearch('');
                    setSelectedCategory('All');
                  }}
                >
                  <RotateCcw size={14} />
                  <span>Clear Filters</span>
                </button>
              </div>
            )}
          </>
        )}
      </section>
    </div>
  );
}
