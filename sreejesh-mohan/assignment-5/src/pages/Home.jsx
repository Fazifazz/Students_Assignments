// src/pages/Home.jsx
import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
  Sparkles,
  Search,
  ArrowRight,
  Bookmark,
  Scale,
  PlayCircle,
  Fish,
  Flame,
  UtensilsCrossed,
  Salad,
  Cookie,
  Coffee,
} from 'lucide-react';

const FEATURED_KERALA_CATEGORIES = [
  { name: 'Indian Snacks', Icon: Cookie, desc: 'Parippu Vada, Samosas, Pani Puri, Unniyappam, Kachori, Murukku' },
  { name: 'Seafood', Icon: Fish, desc: 'Meen Curry, Karimeen Pollichathu, Chemmeen' },
  { name: 'Chicken', Icon: Flame, desc: 'Malabar Biryani, Nadan Kozhi Curry' },
  { name: 'Beef', Icon: UtensilsCrossed, desc: 'Malabar Parotta & Kerala Beef Roast' },
  { name: 'Breakfast', Icon: Coffee, desc: 'Appam with Stew, Puttu & Kadala' },
  { name: 'Vegetarian', Icon: Salad, desc: 'Sadya Avial, Erissery, Sambar' },
];

export default function Home() {
  const [quickQuery, setQuickQuery] = useState('');
  const navigate = useNavigate();

  const handleQuickSearch = (e) => {
    e.preventDefault();
    if (quickQuery.trim()) {
      navigate(`/recipes?q=${encodeURIComponent(quickQuery.trim())}`);
    } else {
      navigate('/recipes');
    }
  };

  return (
    <div className="page-home">
      {/* Hero Section */}
      <section className="hero-banner">
        <div className="hero-content">
          <span className="hero-badge">
            <Sparkles size={14} className="hero-badge-icon" />
            <span>God's Own Kitchen • Heirloom Kerala & Indian Recipes</span>
          </span>
          <h1 className="hero-title">
            Authentic Flavors of <span className="hero-highlight">Kerala & Indian Cuisine</span>
          </h1>
          <p className="hero-subtitle">
            Experience the rich culinary heritage of Kerala and authentic Indian snacks. From fragrant Thalassery Biryani and fiery
            Kottayam Fish Curry to crispy Parippu Vadas, golden Samosas, flaky Kachoris, and Onam Sadya delicacies.
          </p>

          {/* Quick Hero Search Form */}
          <form onSubmit={handleQuickSearch} className="hero-search-form">
            <div className="hero-search-input-wrap">
              <Search size={18} className="hero-search-icon" />
              <input
                type="text"
                value={quickQuery}
                onChange={(e) => setQuickQuery(e.target.value)}
                placeholder="Search Kerala dishes & Indian snacks..."
                className="hero-search-input"
              />
            </div>
            <button type="submit" className="btn btn-primary hero-search-btn">
              <span>Search Recipes</span>
            </button>
          </form>

          <div className="hero-cta-group">
            <Link to="/recipes" className="btn btn-primary btn-lg">
              <span>Explore Kerala Recipes</span>
              <ArrowRight size={16} />
            </Link>
            <Link to="/favourites" className="btn btn-secondary btn-lg">
              <Bookmark size={16} />
              <span>Saved Journal</span>
            </Link>
          </div>
        </div>
      </section>

      {/* Highlights / Features Grid */}
      <section className="features-section">
        <div className="section-header">
          <span className="section-badge">Culinary Heritage</span>
          <h2 className="section-title">The Kerala Kitchen Tradition</h2>
          <p className="section-subtitle">Rooted in coastal spices, fresh coconut, and time-tested methods.</p>
        </div>

        <div className="features-grid">
          <div className="feature-card">
            <div className="feature-icon-wrapper">
              <Search size={28} className="feature-svg-icon" />
            </div>
            <h3 className="feature-card-title">Authentic Recipe Vault</h3>
            <p className="feature-card-desc">
              Every dish is sourced from real Kerala culinary traditions—from Malabar coastal specials to Central Travancore curries.
            </p>
          </div>

          <div className="feature-card">
            <div className="feature-icon-wrapper">
              <Scale size={28} className="feature-svg-icon" />
            </div>
            <h3 className="feature-card-title">Exact Mise en Place</h3>
            <p className="feature-card-desc">
              Detailed measurements for indigenous ingredients like Kudampuli, Kaima rice, thenga kothu, and Tellicherry pepper.
            </p>
          </div>

          <div className="feature-card">
            <div className="feature-icon-wrapper">
              <PlayCircle size={28} className="feature-svg-icon" />
            </div>
            <h3 className="feature-card-title">Chef Video Guides</h3>
            <p className="feature-card-desc">
              Follow along with step-by-step masterclasses demonstrating authentic techniques like dum cooking and banana leaf wrapping.
            </p>
          </div>

          <div className="feature-card">
            <div className="feature-icon-wrapper">
              <Bookmark size={28} className="feature-svg-icon" />
            </div>
            <h3 className="feature-card-title">Personal Cookbook</h3>
            <p className="feature-card-desc">
              Bookmark your favourite family dishes with one tap. Persistent storage ensures your collection is always ready.
            </p>
          </div>
        </div>
      </section>

      {/* Popular Categories */}
      <section className="categories-section">
        <div className="section-header">
          <span className="section-badge">Kerala Specialties</span>
          <h2 className="section-title">Explore by Culinary Category</h2>
          <p className="section-subtitle">Discover the distinctive flavors of South Indian Kerala dining.</p>
        </div>

        <div className="category-cards-grid">
          {FEATURED_KERALA_CATEGORIES.map(({ name, Icon, desc }) => (
            <Link
              key={name}
              to={`/recipes?q=${encodeURIComponent(name)}`}
              className="category-card"
            >
              <div className="category-icon-box">
                <Icon size={28} strokeWidth={1.8} className="category-svg-icon" />
              </div>
              <h3 className="category-name">{name}</h3>
              <p className="category-desc">{desc}</p>
              <span className="category-link-text">
                <span>Browse {name}</span>
                <ArrowRight size={13} />
              </span>
            </Link>
          ))}
        </div>
      </section>

      {/* CTA Box */}
      <section className="cta-banner">
        <div className="cta-banner-content">
          <h2>Ready to Cook Authentic Kerala Dishes?</h2>
          <p>From quick weekend breakfasts to lavish feast dishes, master the flavors of God's Own Country.</p>
          <Link to="/recipes" className="btn btn-primary btn-lg">
            <span>Explore All Kerala Recipes</span>
            <ArrowRight size={16} />
          </Link>
        </div>
      </section>
    </div>
  );
}
