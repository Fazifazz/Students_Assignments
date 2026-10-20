// src/pages/RecipeDetail.jsx
// Detailed recipe view using useParams to read the recipe ID and Axios for fetching
import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import {
  ArrowLeft,
  ChevronRight,
  Globe,
  Utensils,
  Clock,
  ChefHat,
  Heart,
  ExternalLink,
  ListChecks,
  FileText,
  PlayCircle,
} from 'lucide-react';
import api from '../api/axiosInstance';
import { useFavourites } from '../context/FavouritesContext';
import LoadingSpinner from '../components/LoadingSpinner';
import ErrorMessage from '../components/ErrorMessage';

export default function RecipeDetail() {
  // Extract dynamic recipe ID from route parameters
  const { id } = useParams();
  const navigate = useNavigate();
  const { isFavourite, toggleFavourite } = useFavourites();

  const [recipe, setRecipe] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  // Interactive checklist of ingredients
  const [checkedIngredients, setCheckedIngredients] = useState({});

  useEffect(() => {
    let isCancelled = false;

    async function fetchRecipeDetail() {
      setLoading(true);
      setError(null);

      try {
        // TheMealDB lookup endpoint: /lookup.php?i={id}
        const response = await api.get('/lookup.php', {
          params: { i: id },
        });

        if (isCancelled) return;

        const meals = response.data?.meals;
        if (meals && meals.length > 0) {
          setRecipe(meals[0]);
        } else {
          setError(`Recipe with ID "${id}" was not found.`);
        }
      } catch (err) {
        if (isCancelled) return;
        if (err.response) {
          setError(`Server error (${err.response.status}): Failed to load recipe details.`);
        } else if (err.request) {
          setError('Network error: Unable to reach recipe server. Please check your connection.');
        } else {
          setError(err.message || 'An unexpected error occurred.');
        }
      } finally {
        if (!isCancelled) {
          setLoading(false);
        }
      }
    }

    fetchRecipeDetail();

    return () => {
      isCancelled = true;
    };
  }, [id]);

  // Extract ingredients and measurements into an array of objects
  const ingredients = [];
  if (recipe) {
    for (let i = 1; i <= 20; i++) {
      const ingredient = recipe[`strIngredient${i}`];
      const measure = recipe[`strMeasure${i}`];
      if (ingredient && ingredient.trim()) {
        ingredients.push({
          name: ingredient.trim(),
          measure: measure ? measure.trim() : '',
        });
      }
    }
  }

  // Toggle ingredient checkbox in interactive checklist
  const handleToggleIngredient = (index) => {
    setCheckedIngredients((prev) => ({
      ...prev,
      [index]: !prev[index],
    }));
  };

  // Convert YouTube watch URL to embed URL
  const getEmbedYoutubeUrl = (url) => {
    if (!url) return null;
    const match = url.match(/(?:youtu\.be\/|youtube\.com\/(?:embed\/|v\/|watch\?v=|watch\?.+&v=))([\w-]{11})/);
    return match ? `https://www.youtube.com/embed/${match[1]}` : null;
  };

  if (loading) {
    return (
      <div className="page-recipe-detail">
        <LoadingSpinner message="Fetching recipe preparation guide..." />
      </div>
    );
  }

  if (error || !recipe) {
    return (
      <div className="page-recipe-detail">
        <div className="detail-error-container">
          <ErrorMessage message={error || 'Recipe not found.'} />
          <div className="error-actions">
            <button type="button" onClick={() => navigate(-1)} className="btn btn-secondary">
              <ArrowLeft size={16} />
              <span>Return</span>
            </button>
            <Link to="/recipes" className="btn btn-primary">
              Browse Recipes
            </Link>
          </div>
        </div>
      </div>
    );
  }

  const {
    idMeal,
    strMeal,
    strCategory,
    strArea,
    strInstructions,
    strMealThumb,
    strTags,
    strYoutube,
    strSource,
  } = recipe;

  const favourited = isFavourite(idMeal);
  const embedUrl = getEmbedYoutubeUrl(strYoutube);
  const tagList = strTags ? strTags.split(',').map((t) => t.trim()).filter(Boolean) : [];

  // Parse instructions into paragraphs or numbered steps
  const instructionSteps = strInstructions
    ? strInstructions
        .split(/\r?\n/)
        .map((s) => s.trim())
        .filter((s) => s.length > 0)
    : [];

  return (
    <article className="page-recipe-detail" id={`recipe-detail-${idMeal}`}>
      {/* Top Navigation Bar */}
      <div className="detail-top-nav">
        <button
          type="button"
          onClick={() => navigate(-1)}
          className="btn btn-secondary back-btn"
          aria-label="Go back to previous page"
        >
          <ArrowLeft size={16} />
          <span>Return</span>
        </button>
        <div className="detail-breadcrumbs">
          <Link to="/">Home</Link>
          <ChevronRight size={14} className="crumb-separator" />
          <Link to="/recipes">Recipes</Link>
          <ChevronRight size={14} className="crumb-separator" />
          <span className="current-crumb">{strMeal}</span>
        </div>
      </div>

      {/* Hero Header */}
      <header className="detail-hero">
        <div className="detail-hero-media">
          <img src={strMealThumb} alt={strMeal} className="detail-hero-img" />
        </div>

        <div className="detail-hero-content">
          <div className="detail-badges">
            {strCategory && <span className="badge badge-category">{strCategory}</span>}
            {strArea && (
              <span className="badge badge-area">
                <Globe size={12} className="badge-icon" />
                <span>{strArea} Tradition</span>
              </span>
            )}
          </div>

          <h1 className="detail-title">{strMeal}</h1>

          {tagList.length > 0 && (
            <div className="detail-tags">
              {tagList.map((tag) => (
                <span key={tag} className="tag-item">#{tag}</span>
              ))}
            </div>
          )}

          {/* Quick Metrics */}
          <div className="detail-metrics">
            <div className="metric-box">
              <span className="metric-icon">
                <Utensils size={20} strokeWidth={1.8} />
              </span>
              <div>
                <strong>{ingredients.length} items</strong>
                <p>Mise en place</p>
              </div>
            </div>
            <div className="metric-box">
              <span className="metric-icon">
                <Clock size={20} strokeWidth={1.8} />
              </span>
              <div>
                <strong>35-45 min</strong>
                <p>Preparation</p>
              </div>
            </div>
            <div className="metric-box">
              <span className="metric-icon">
                <ChefHat size={20} strokeWidth={1.8} />
              </span>
              <div>
                <strong>Artisan</strong>
                <p>Skill Level</p>
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="detail-actions">
            <button
              type="button"
              onClick={() => toggleFavourite(recipe)}
              className={`btn btn-lg ${favourited ? 'btn-fav-active' : 'btn-primary'}`}
            >
              <Heart
                size={18}
                fill={favourited ? 'currentColor' : 'none'}
              />
              <span>{favourited ? 'Saved in Journal' : 'Save to Journal'}</span>
            </button>
            {strSource && (
              <a
                href={strSource}
                target="_blank"
                rel="noopener noreferrer"
                className="btn btn-outline btn-lg"
              >
                <span>Culinary Source</span>
                <ExternalLink size={15} />
              </a>
            )}
          </div>
        </div>
      </header>

      {/* Main Recipe Body (Ingredients + Instructions) */}
      <div className="detail-body-grid">
        {/* Ingredients Checklist Sidebar */}
        <aside className="detail-ingredients-sidebar">
          <div className="sidebar-header">
            <h2 className="sidebar-title">
              <ListChecks size={20} className="section-title-icon" />
              <span>Mise en Place ({ingredients.length})</span>
            </h2>
            <span className="sidebar-hint">Check off ingredients as you prepare</span>
          </div>

          <ul className="ingredients-list">
            {ingredients.map((item, idx) => (
              <li
                key={`${item.name}-${idx}`}
                className={`ingredient-item ${checkedIngredients[idx] ? 'ingredient-item--checked' : ''}`}
                onClick={() => handleToggleIngredient(idx)}
              >
                <input
                  type="checkbox"
                  id={`ingredient-${idx}`}
                  checked={!!checkedIngredients[idx]}
                  onChange={() => {}}
                  className="ingredient-checkbox"
                />
                <span className="ingredient-label">
                  <span className="ingredient-name">{item.name}</span>
                  {item.measure && (
                    <span className="ingredient-measure">{item.measure}</span>
                  )}
                </span>
              </li>
            ))}
          </ul>
        </aside>

        {/* Instructions Content */}
        <section className="detail-instructions-section">
          <h2 className="section-title">
            <FileText size={20} className="section-title-icon" />
            <span>Method & Preparation</span>
          </h2>

          <div className="instructions-container">
            {instructionSteps.map((step, idx) => (
              <div key={idx} className="instruction-step">
                <span className="step-number">{idx + 1}</span>
                <p className="step-text">{step}</p>
              </div>
            ))}
          </div>

          {/* Video Tutorial if available */}
          {embedUrl && (
            <div className="video-section">
              <h3 className="video-section-title">
                <PlayCircle size={20} className="section-title-icon" />
                <span>Chef Masterclass</span>
              </h3>
              <div className="video-responsive-wrapper">
                <iframe
                  src={embedUrl}
                  title={`Cooking masterclass for ${strMeal}`}
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                  allowFullScreen
                  className="video-iframe"
                ></iframe>
              </div>
            </div>
          )}
        </section>
      </div>
    </article>
  );
}
