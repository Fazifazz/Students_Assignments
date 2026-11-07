import React from 'react';
import {
  Search,
  X,
  SlidersHorizontal,
  Tag,
  Star,
  Check,
  RotateCcw,
  PackageCheck,
  Percent,
} from 'lucide-react';

const PRICE_RANGES = [
  { id: 'all', label: 'All Prices' },
  { id: 'under-2000', label: 'Under ₹2,000' },
  { id: '2000-10000', label: '₹2,000 - ₹10,000' },
  { id: '10000-40000', label: '₹10,000 - ₹40,000' },
  { id: 'above-40000', label: 'Above ₹40,000' },
];

export default function CategoryFilter({
  activeCategory,
  onClearCategory,
  searchTerm,
  onSearchChange,
  sortBy,
  onSortChange,
  priceRange,
  onPriceRangeChange,
  selectedBrand,
  onBrandChange,
  availableBrands = [],
  minRating,
  onRatingChange,
  onSaleOnly,
  onSaleToggle,
  inStockOnly,
  inStockToggle,
  onResetAll,
  totalResults,
}) {
  const isAnyFilterActive =
    (activeCategory && activeCategory !== 'All') ||
    priceRange !== 'all' ||
    selectedBrand !== 'all' ||
    minRating > 0 ||
    onSaleOnly ||
    inStockOnly ||
    searchTerm.trim() !== '';

  return (
    <div className="specific-filter-card">
      {/* Top Search & Controls Bar */}
      <div className="filter-controls-bar">
        {/* Search Input */}
        <div className="search-input-wrapper">
          <Search size={18} className="search-icon" />
          <input
            type="text"
            className="filter-search-input"
            placeholder="Search by title, brand, features or keywords..."
            value={searchTerm}
            onChange={(e) => onSearchChange(e.target.value)}
          />
          {searchTerm && (
            <button
              type="button"
              className="clear-search-btn"
              onClick={() => onSearchChange('')}
              aria-label="Clear search"
            >
              <X size={16} />
            </button>
          )}
        </div>

        {/* Brand Dropdown */}
        <div className="filter-select-wrapper">
          <Tag size={15} className="select-inner-icon" />
          <select
            className="filter-select"
            value={selectedBrand}
            onChange={(e) => onBrandChange(e.target.value)}
            aria-label="Filter by Brand"
          >
            <option value="all">All Brands</option>
            {availableBrands.map((b) => (
              <option key={b} value={b}>
                {b}
              </option>
            ))}
          </select>
        </div>

        {/* Rating Dropdown */}
        <div className="filter-select-wrapper">
          <Star size={15} className="select-inner-icon star-gold" />
          <select
            className="filter-select"
            value={minRating}
            onChange={(e) => onRatingChange(Number(e.target.value))}
            aria-label="Filter by Rating"
          >
            <option value="0">All Ratings</option>
            <option value="4.5">★ 4.5 & Above</option>
            <option value="4.8">★ 4.8 & Above</option>
          </select>
        </div>

        {/* Sort By Dropdown */}
        {onSortChange && (
          <div className="filter-select-wrapper sort-wrapper">
            <SlidersHorizontal size={15} className="select-inner-icon" />
            <select
              className="filter-select"
              value={sortBy}
              onChange={(e) => onSortChange(e.target.value)}
              aria-label="Sort products"
            >
              <option value="featured">Featured</option>
              <option value="price-low">Price: Low to High</option>
              <option value="price-high">Price: High to Low</option>
              <option value="rating">Highest Rated</option>
            </select>
          </div>
        )}
      </div>

      {/* Specific Filter Controls Row: Price Pills & Quick Toggles */}
      <div className="specific-filters-row">
        {/* Price Range Pills */}
        <div className="filter-group-wrap">
          <span className="filter-group-label">Price:</span>
          <div className="filter-pill-chips">
            {PRICE_RANGES.map((pr) => (
              <button
                key={pr.id}
                type="button"
                className={`filter-chip ${priceRange === pr.id ? 'active' : ''}`}
                onClick={() => onPriceRangeChange(pr.id)}
              >
                {pr.label}
              </button>
            ))}
          </div>
        </div>

        {/* Quick Toggles: On Sale & In Stock */}
        <div className="filter-group-wrap toggles-group">
          <span className="filter-group-label">Specifics:</span>
          <div className="filter-pill-chips">
            <button
              type="button"
              className={`filter-chip toggle-chip ${onSaleOnly ? 'active' : ''}`}
              onClick={onSaleToggle}
            >
              <Percent size={14} />
              <span>On Sale Deals</span>
              {onSaleOnly && <Check size={14} className="chip-check" />}
            </button>

            <button
              type="button"
              className={`filter-chip toggle-chip ${inStockOnly ? 'active' : ''}`}
              onClick={inStockToggle}
            >
              <PackageCheck size={14} />
              <span>In Stock Only</span>
              {inStockOnly && <Check size={14} className="chip-check" />}
            </button>
          </div>
        </div>
      </div>

      {/* Active Filter Summary Bar */}
      <div className="active-filters-summary-bar">
        <div className="active-tags-list">
          {activeCategory && activeCategory !== 'All' && (
            <span className="active-filter-badge category-badge">
              <span>Category: {activeCategory}</span>
              <button
                type="button"
                onClick={onClearCategory}
                aria-label="Clear category"
              >
                <X size={13} />
              </button>
            </span>
          )}

          {priceRange !== 'all' && (
            <span className="active-filter-badge">
              <span>Price: {PRICE_RANGES.find((p) => p.id === priceRange)?.label}</span>
              <button
                type="button"
                onClick={() => onPriceRangeChange('all')}
                aria-label="Clear price filter"
              >
                <X size={13} />
              </button>
            </span>
          )}

          {selectedBrand !== 'all' && (
            <span className="active-filter-badge">
              <span>Brand: {selectedBrand}</span>
              <button
                type="button"
                onClick={() => onBrandChange('all')}
                aria-label="Clear brand filter"
              >
                <X size={13} />
              </button>
            </span>
          )}

          {minRating > 0 && (
            <span className="active-filter-badge">
              <span>Rating: ★ {minRating}+</span>
              <button
                type="button"
                onClick={() => onRatingChange(0)}
                aria-label="Clear rating filter"
              >
                <X size={13} />
              </button>
            </span>
          )}

          {onSaleOnly && (
            <span className="active-filter-badge">
              <span>Deals Only</span>
              <button type="button" onClick={onSaleToggle} aria-label="Clear deal filter">
                <X size={13} />
              </button>
            </span>
          )}

          {inStockOnly && (
            <span className="active-filter-badge">
              <span>In Stock Only</span>
              <button
                type="button"
                onClick={inStockToggle}
                aria-label="Clear stock filter"
              >
                <X size={13} />
              </button>
            </span>
          )}

          {searchTerm && (
            <span className="active-filter-badge">
              <span>"{searchTerm}"</span>
              <button
                type="button"
                onClick={() => onSearchChange('')}
                aria-label="Clear search keyword"
              >
                <X size={13} />
              </button>
            </span>
          )}

          {isAnyFilterActive && (
            <button
              type="button"
              className="btn-clear-all-filters"
              onClick={onResetAll}
            >
              <RotateCcw size={13} />
              <span>Reset All Filters</span>
            </button>
          )}
        </div>

        {totalResults !== undefined && (
          <span className="results-counter">
            Showing <strong>{totalResults}</strong> {totalResults === 1 ? 'item' : 'items'}
          </span>
        )}
      </div>
    </div>
  );
}
