import React, { useState, useMemo, useCallback } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { useFetch } from '../hooks/useFetch';
import { useDebounce } from '../hooks/useDebounce';
import EquipmentCard from '../components/EquipmentCard';
import AIAssistantWidget from '../components/AIAssistantWidget';

export default function Home({ onAddToCart, cartItems }) {
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();

  const currentCategory = searchParams.get('category') || 'All';
  const currentStatus = searchParams.get('status') || 'All';
  const initialSearch = searchParams.get('search') || '';

  const [searchInput, setSearchInput] = useState(initialSearch);
  const [aiFilterId, setAiFilterId] = useState(null);
  const debouncedSearch = useDebounce(searchInput, 400);

  const { data: equipmentList, loading, error } = useFetch('/equipment', []);

  const handleCategoryChange = (cat) => {
    setAiFilterId(null);
    const nextParams = new URLSearchParams(searchParams);
    if (cat === 'All') nextParams.delete('category');
    else nextParams.set('category', cat);
    setSearchParams(nextParams);
  };

  const handleStatusChange = (st) => {
    setAiFilterId(null);
    const nextParams = new URLSearchParams(searchParams);
    if (st === 'All') nextParams.delete('status');
    else nextParams.set('status', st);
    setSearchParams(nextParams);
  };

  const categories = useMemo(() => {
    if (!equipmentList) return ['All'];
    return ['All', ...new Set(equipmentList.map(item => item.category))];
  }, [equipmentList]);

  const filteredEquipment = useMemo(() => {
    if (!equipmentList) return [];
    return equipmentList.filter(item => {
      if (aiFilterId && item.id !== aiFilterId) {
        return false;
      }
      const matchSearch = debouncedSearch
        ? item.name.toLowerCase().includes(debouncedSearch.toLowerCase()) ||
          item.description.toLowerCase().includes(debouncedSearch.toLowerCase())
        : true;
      const matchCat = currentCategory === 'All' || item.category.toLowerCase() === currentCategory.toLowerCase();
      const matchStatus = currentStatus === 'All' || item.status.toLowerCase() === currentStatus.toLowerCase();
      return matchSearch && matchCat && matchStatus;
    });
  }, [equipmentList, debouncedSearch, currentCategory, currentStatus, aiFilterId]);

  const handleRent = useCallback((item) => {
    onAddToCart(item);
  }, [onAddToCart]);

  const handleClearAllFilters = () => {
    setSearchInput('');
    setAiFilterId(null);
    setSearchParams({});
  };

  return (
    <div className="container py-4">
      {/* Friendly, Clean Hero Section */}
      <div className="clean-hero-card p-4 p-md-5 mb-4 text-center">
        <span className="badge bg-warning text-dark px-3 py-2 fw-bold text-uppercase mb-2">
          🛠️ EquipTrack • Online Tool Rentals
        </span>
        <h1 className="hero-main-title fw-bold text-dark mb-2">
          Rent Tools & Machinery for Any Job
        </h1>
        <p className="hero-subtitle text-muted mx-auto mb-4" style={{ maxWidth: '650px' }}>
          Select high-quality power tools, generators, and construction machinery at low daily rates. Pick your rental days and book online instantly.
        </p>

        {/* 3 Step Badges */}
        <div className="d-flex flex-wrap justify-content-center gap-3">
          <div className="step-pill">
            <span className="step-number">1</span> Choose Equipment
          </div>
          <div className="step-pill">
            <span className="step-number">2</span> Select Rental Days
          </div>
          <div className="step-pill">
            <span className="step-number">3</span> Instant Booking Confirmation
          </div>
        </div>
      </div>

      {/* AI Assistant Widget */}
      <AIAssistantWidget
        onSelectRecommended={(id) => navigate(`/equipment/${id}`)}
        onFilterPreset={(equipmentId) => {
          setAiFilterId(equipmentId);
        }}
        equipmentList={equipmentList || []}
        onAddToCart={onAddToCart}
        cartItems={cartItems}
      />

      {/* Active AI Filter Indicator */}
      {aiFilterId && (
        <div className="alert alert-warning border-warning d-flex justify-content-between align-items-center py-2 px-3 mb-3 shadow-sm rounded-3">
          <span className="small">
            ✨ <strong>AI Preset Applied:</strong> Showing the recommended tool matching your selected job below.
          </span>
          <button
            type="button"
            className="btn btn-sm btn-dark px-3"
            onClick={() => setAiFilterId(null)}
          >
            Show Full Catalog ✕
          </button>
        </div>
      )}

      {/* Filter and Search Bar */}
      <div className="card shadow-sm border-0 mb-4 p-3 bg-white">
        <div className="row g-3 align-items-center">
          {/* Search Box */}
          <div className="col-lg-6 col-md-12">
            <div className="input-group">
              <span className="input-group-text bg-white border-end-0 text-muted">🔍</span>
              <input
                type="text"
                className="form-control border-start-0 ps-0"
                placeholder="Search tools by name (e.g. Drill, Paint Sprayer, Generator)..."
                value={searchInput}
                onChange={(e) => {
                  setAiFilterId(null);
                  setSearchInput(e.target.value);
                }}
              />
              {searchInput && (
                <button
                  className="btn btn-outline-secondary border-start-0"
                  type="button"
                  onClick={() => setSearchInput('')}
                >
                  ✕
                </button>
              )}
            </div>
          </div>

          {/* Category Dropdown */}
          <div className="col-lg-3 col-md-6 col-6">
            <select
              className="form-select"
              value={currentCategory}
              onChange={(e) => handleCategoryChange(e.target.value)}
            >
              {categories.map(cat => (
                <option key={cat} value={cat}>
                  {cat === 'All' ? '📂 All Categories' : cat}
                </option>
              ))}
            </select>
          </div>

          {/* Status Dropdown */}
          <div className="col-lg-3 col-md-6 col-6">
            <select
              className="form-select"
              value={currentStatus}
              onChange={(e) => handleStatusChange(e.target.value)}
            >
              <option value="All">All Items</option>
              <option value="Available">🟢 Available Only</option>
              <option value="Rented">🔴 Out on Rent</option>
            </select>
          </div>
        </div>

        {/* Quick Category Chips */}
        <div className="d-flex flex-wrap gap-2 mt-3 pt-2 border-top">
          <span className="small text-muted align-self-center me-1">Categories:</span>
          {categories.map(cat => (
            <button
              key={cat}
              type="button"
              onClick={() => handleCategoryChange(cat)}
              className={`btn btn-sm ${
                currentCategory === cat ? 'btn-dark fw-bold' : 'btn-outline-secondary'
              }`}
              style={{ fontSize: '0.8rem', borderRadius: '20px' }}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      {/* Loading & Error States */}
      {loading && (
        <div className="text-center py-5">
          <div className="spinner-border text-warning" role="status" />
          <p className="mt-2 text-muted small">Loading equipment catalog...</p>
        </div>
      )}

      {error && (
        <div className="alert alert-danger" role="alert">
          {error}
        </div>
      )}

      {/* Results Header */}
      {!loading && !error && (
        <>
          <div className="d-flex justify-content-between align-items-center mb-3">
            <span className="text-muted small">
              Showing <strong>{filteredEquipment.length}</strong> items
            </span>
            {(currentCategory !== 'All' || currentStatus !== 'All' || searchInput || aiFilterId) && (
              <button
                className="btn btn-link btn-sm text-danger text-decoration-none p-0 fw-semibold"
                onClick={handleClearAllFilters}
              >
                Reset all filters ✕
              </button>
            )}
          </div>

          {/* Equipment Cards Grid */}
          {filteredEquipment.length === 0 ? (
            <div className="card shadow-sm border-0 text-center py-5 p-4 bg-white">
              <h5>No tools match your search</h5>
              <p className="text-muted small mb-3">
                Try searching for something else or reset your filters.
              </p>
              <div>
                <button
                  className="btn btn-warning btn-sm fw-bold px-4 text-dark"
                  onClick={handleClearAllFilters}
                >
                  Show All Tools
                </button>
              </div>
            </div>
          ) : (
            <div className="row g-4">
              {filteredEquipment.map(item => (
                <EquipmentCard
                  key={item.id}
                  item={item}
                  onRent={handleRent}
                  isAdded={cartItems.some(c => c.id === item.id)}
                />
              ))}
            </div>
          )}
        </>
      )}
    </div>
  );
}
