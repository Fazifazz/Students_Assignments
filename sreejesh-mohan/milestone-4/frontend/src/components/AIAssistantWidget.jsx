import React, { useState } from 'react';

const DEFAULT_IMAGE = 'https://images.unsplash.com/photo-1504148455328-c376907d081c?auto=format&fit=crop&w=800&q=80';

export default function AIAssistantWidget({
  onSelectRecommended,
  onFilterPreset,
  equipmentList = [],
  onAddToCart,
  cartItems = []
}) {
  const [prompt, setPrompt] = useState('');
  const [loading, setLoading] = useState(false);
  const [recommendation, setRecommendation] = useState(null);
  const [activeJobIdx, setActiveJobIdx] = useState(null);

  const quickJobs = [
    { label: '🏠 Paint House / Walls', query: 'paint exterior walls and clean up railings', equipmentId: 4 },
    { label: '🔨 Demolish Floor Tiles', query: 'break floor tiles and concrete', equipmentId: 5 },
    { label: '⚡ Power Backup / Event', query: 'need electricity generator for outdoor site', equipmentId: 3 },
    { label: '🪜 Reach High Ceilings', query: 'ladder for high roof access', equipmentId: 6 },
    { label: '🔩 Drill Concrete / Mount', query: 'drill holes in concrete wall', equipmentId: 1 },
    { label: '⚙️ Cut Metal / Grinding', query: 'cut steel pipe and grind metal', equipmentId: 2 }
  ];

  function generateRecommendation(text) {
    const lower = text.toLowerCase();
    if (lower.includes('paint') || lower.includes('wall') || lower.includes('fence')) {
      return {
        toolName: 'Wagner Professional Paint Sprayer',
        advice: 'Airless high-pressure sprayer covers walls 5x faster than brushes with zero roller streaks.',
        suggestedDays: 2,
        equipmentId: 4
      };
    } else if (lower.includes('drill') || lower.includes('screw') || lower.includes('mount') || lower.includes('shelf')) {
      return {
        toolName: 'DeWalt 20V Cordless Hammer Drill',
        advice: 'High-torque cordless percussion drill ideal for masonry, brick, wood, and metal mounting.',
        suggestedDays: 1,
        equipmentId: 1
      };
    } else if (lower.includes('concrete') || lower.includes('demolish') || lower.includes('tile') || lower.includes('break')) {
      return {
        toolName: 'Makita Rotary Demolition Breaker',
        advice: 'Heavy-duty breaker with anti-vibration grip for fast tile chipping and concrete demolition.',
        suggestedDays: 3,
        equipmentId: 5
      };
    } else if (lower.includes('power') || lower.includes('electricity') || lower.includes('event') || lower.includes('generator')) {
      return {
        toolName: 'Honda 3000W Inverter Generator',
        advice: 'Quiet, clean power for job sites, outdoor events, and emergency electricity backup.',
        suggestedDays: 3,
        equipmentId: 3
      };
    } else if (lower.includes('ladder') || lower.includes('high') || lower.includes('roof') || lower.includes('ceiling')) {
      return {
        toolName: 'Werner 24ft Heavy Duty Ladder',
        advice: 'Sturdy commercial ladder with 300-lb duty rating, perfect for roof and 2nd-story repairs.',
        suggestedDays: 2,
        equipmentId: 6
      };
    } else {
      return {
        toolName: 'Bosch 7-Inch Angle Grinder',
        advice: 'Versatile heavy grinder for rust cleaning, metal cutting, and masonry scoring.',
        suggestedDays: 1,
        equipmentId: 2
      };
    }
  }

  function handleAnalyze(textToUse, directId = null) {
    const query = typeof textToUse === 'string' ? textToUse : prompt;
    if (!query.trim() && !directId) return;

    setLoading(true);
    setRecommendation(null);

    setTimeout(() => {
      const rec = generateRecommendation(query);
      if (directId) {
        rec.equipmentId = directId;
      }
      setRecommendation(rec);
      setLoading(false);

      if (onFilterPreset) {
        onFilterPreset(rec.equipmentId);
      }
    }, 300);
  }

  function handleQuickClick(job, idx) {
    setActiveJobIdx(idx);
    setPrompt(job.query);
    handleAnalyze(job.query, job.equipmentId);
  }

  // Find matching equipment object from list
  const matchedItem = recommendation
    ? equipmentList.find((item) => item.id === recommendation.equipmentId)
    : null;

  const isAdded = matchedItem && cartItems.some((c) => c.id === matchedItem.id);

  return (
    <div className="ai-advisor-box p-4 mb-4">
      <div className="d-flex flex-wrap align-items-center justify-content-between gap-2 mb-2">
        <div className="d-flex align-items-center gap-2">
          <span className="fs-5">💡</span>
          <h6 className="mb-0 fw-bold text-dark">Smart Tool Finder (AI Advisor)</h6>
        </div>
        <span className="badge bg-warning text-dark px-3 py-1 fw-bold">
          Click any preset job below
        </span>
      </div>

      <p className="text-muted small mb-3">
        Click any common job below to immediately find and display the recommended tool:
      </p>

      {/* Quick Click Preset Chips */}
      <div className="d-flex flex-wrap gap-2 mb-3">
        {quickJobs.map((job, idx) => (
          <button
            key={idx}
            type="button"
            onClick={() => handleQuickClick(job, idx)}
            className={`quick-chip-btn ${activeJobIdx === idx ? 'active-chip' : ''}`}
          >
            {job.label}
          </button>
        ))}
      </div>

      {/* Custom Task Input */}
      <form
        onSubmit={(e) => {
          e.preventDefault();
          setActiveJobIdx(null);
          handleAnalyze(prompt);
        }}
        className="d-flex gap-2"
      >
        <input
          type="text"
          className="form-control clean-input"
          placeholder="Or type custom job: e.g. 'I want to break bathroom tiles'..."
          value={prompt}
          onChange={(e) => setPrompt(e.target.value)}
          disabled={loading}
        />
        <button
          type="submit"
          className="btn btn-warning fw-bold px-4 text-dark d-flex align-items-center gap-2 text-nowrap"
          disabled={loading || !prompt.trim()}
        >
          {loading ? (
            <>
              <span className="spinner-border spinner-border-sm" role="status" />
              <span>Finding...</span>
            </>
          ) : (
            '🔍 Find Tool'
          )}
        </button>
      </form>

      {/* AI Recommendation Result Card */}
      {recommendation && !loading && (
        <div className="ai-result-card mt-3 p-3 animate-fade-in border shadow-sm rounded-3 bg-white">
          <div className="row align-items-center g-3">
            {matchedItem && (
              <div className="col-auto">
                <img
                  src={matchedItem.image || DEFAULT_IMAGE}
                  alt={matchedItem.name}
                  className="rounded border"
                  style={{ width: '80px', height: '80px', objectFit: 'cover' }}
                  onError={(e) => {
                    e.currentTarget.onerror = null;
                    e.currentTarget.src = DEFAULT_IMAGE;
                  }}
                />
              </div>
            )}

            <div className="col">
              <div className="d-flex flex-wrap justify-content-between align-items-start gap-1">
                <div>
                  <span className="badge bg-success-subtle text-success border border-success-subtle mb-1">
                    ✓ Recommended Tool Match
                  </span>
                  <h5 className="fw-bold text-dark mb-0">{recommendation.toolName}</h5>
                </div>
                {matchedItem && (
                  <div className="text-end">
                    <span className="small text-muted d-block">DAILY RENT</span>
                    <strong className="text-primary fs-5">
                      ₹{matchedItem.dailyRate.toLocaleString('en-IN')}{' '}
                      <span className="fs-6 fw-normal text-muted">/ day</span>
                    </strong>
                  </div>
                )}
              </div>

              <p className="text-secondary small mb-2 mt-1">{recommendation.advice}</p>

              <div className="d-flex flex-wrap gap-2 align-items-center">
                <span className="badge bg-warning-subtle text-dark border border-warning-subtle">
                  Suggested Duration: {recommendation.suggestedDays} Day(s)
                </span>

                {matchedItem && (
                  <>
                    <button
                      type="button"
                      onClick={() => onSelectRecommended(recommendation.equipmentId)}
                      className="btn btn-outline-dark btn-sm fw-semibold"
                    >
                      View Full Details →
                    </button>

                    {matchedItem.status === 'Available' && onAddToCart && (
                      <button
                        type="button"
                        onClick={() => onAddToCart(matchedItem)}
                        disabled={isAdded}
                        className={`btn btn-sm fw-bold ${
                          isAdded ? 'btn-success' : 'btn-warning text-dark'
                        }`}
                      >
                        {isAdded ? '✓ Added to Cart' : '+ Add to Rental Cart'}
                      </button>
                    )}
                  </>
                )}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
