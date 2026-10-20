// src/components/SearchBar.jsx
// Controlled search form component with real-time text synchronization
import React, { useState } from 'react';
import { Search, X } from 'lucide-react';

const KERALA_SEARCH_TAGS = [
  'Indian Snacks',
  'Parippu Vada',
  'Samosa',
  'Pani Puri',
  'Biryani',
  'Kachori',
  'Banana Chips',
  'Fish Curry',
  'Appam',
  'Unniyappam',
  'Kai Murukku',
  'Avial',
];

export default function SearchBar({ initialQuery = '', onSearch }) {
  const [searchTerm, setSearchTerm] = useState(initialQuery);

  const handleSubmit = (e) => {
    e.preventDefault();
    onSearch(searchTerm.trim());
  };

  const handleClear = () => {
    setSearchTerm('');
    onSearch('');
  };

  const handleTagClick = (tag) => {
    setSearchTerm(tag);
    onSearch(tag);
  };

  return (
    <div className="search-section">
      <form onSubmit={handleSubmit} className="search-form" role="search">
        <div className="search-input-wrapper">
          <Search size={18} className="search-icon" />
          <input
            type="text"
            id="recipe-search-input"
            name="recipe-query"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Search Kerala dishes & Indian snacks (e.g. Samosa, Parippu Vada, Biryani, Meen Curry)..."
            className="search-input"
            autoComplete="off"
          />
          {searchTerm && (
            <button
              type="button"
              onClick={handleClear}
              className="search-clear-btn"
              aria-label="Clear search text"
              title="Clear"
            >
              <X size={14} />
            </button>
          )}
        </div>
        <button type="submit" className="btn btn-primary search-submit-btn">
          <span>Find Recipes</span>
        </button>
      </form>

      {/* Quick Search Suggestions */}
      <div className="quick-tags">
        <span className="quick-tags-label">Kerala Specialties:</span>
        <div className="quick-tags-list">
          {KERALA_SEARCH_TAGS.map((tag) => (
            <button
              key={tag}
              type="button"
              className={`tag-chip ${searchTerm.toLowerCase() === tag.toLowerCase() ? 'tag-chip--active' : ''}`}
              onClick={() => handleTagClick(tag)}
            >
              {tag}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
