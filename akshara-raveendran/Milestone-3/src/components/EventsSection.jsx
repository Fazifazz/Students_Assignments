import { useState } from "react";
import EventCard from "./EventCard.jsx";
import EventImage from "./EventImage.jsx";

const categories = ["All", "Music", "Technology", "Workshop", "Sports"];

const categoryIcons = {
  All: (
    <>
      <rect x="2" y="2" width="4.5" height="4.5" rx="1" />
      <rect x="9.5" y="2" width="4.5" height="4.5" rx="1" />
      <rect x="2" y="9.5" width="4.5" height="4.5" rx="1" />
      <rect x="9.5" y="9.5" width="4.5" height="4.5" rx="1" />
    </>
  ),
  Music: (
    <>
      <path d="M9.5 11V3l4-1v8" />
      <ellipse cx="7.2" cy="11.5" rx="2.3" ry="1.6" />
      <ellipse cx="11.2" cy="10.5" rx="2.3" ry="1.6" />
    </>
  ),
  Technology: (
    <>
      <rect x="2" y="2.5" width="12" height="8.5" rx="1.2" />
      <path d="M5.5 13.5h5M8 11v2.5" />
    </>
  ),
  Workshop: (
    <>
      <path d="m3 11.5 7.8-7.8 2.5 2.5L5.5 14H3z" />
      <path d="m9.3 5.2 2.5 2.5M3 14h10" />
    </>
  ),
  Sports: (
    <>
      <circle cx="8" cy="8" r="6" />
      <path d="M4 3.5c2.3 1.2 3.2 2.7 3.1 4.7-.1 2.1-1.2 3.6-3.2 4.4M12 3.5c-2.3 1.2-3.2 2.7-3.1 4.7.1 2.1 1.2 3.6 3.2 4.4" />
    </>
  ),
};

export default function EventsSection({
  events,
  selectedCategory,
  onCategoryChange,
  onBookEvent,
  onViewDetails,
}) {
  const [searchQuery, setSearchQuery] = useState("");

  const normalizedQuery = searchQuery.trim().toLowerCase();
  const filteredEvents = events.filter((event) => {
    const matchesName = event.name.toLowerCase().includes(normalizedQuery);
    const matchesCategory =
      selectedCategory === "All" || event.category === selectedCategory;

    return matchesName && matchesCategory;
  });
  const featuredVisuals = [
    events.find((event) => event.category === "Music"),
    events.find((event) => event.name === "The Sunday Table"),
    events.find((event) => event.name === "Rooftop Rally"),
  ]
    .filter(Boolean);

  function clearFilters() {
    setSearchQuery("");
    onCategoryChange("All");
  }

  return (
    <section
      className="events-section discovery-section page-shell"
      id="events"
      aria-labelledby="events-title"
    >
      <div className="section-heading">
        <div className="section-heading-copy">
          <p className="eyebrow">A FEW GOOD PLANS</p>
          <h2 id="events-title">
            Coming up <span>near you</span>
          </h2>
          <p className="events-tagline">Find something worth leaving home for.</p>
        </div>
        <div className="events-heading-art" aria-hidden="true">
          {featuredVisuals.map((event, index) => (
            <div className={`events-photo-card events-photo-card--${index + 1}`} key={event.id}>
              <EventImage
                src={event.image}
                alt=""
                className="events-photo"
                loading="lazy"
              />
              <span className="events-photo-caption">{event.category}</span>
            </div>
          ))}
          <span className="events-count-badge">{events.length} handpicked events</span>
        </div>
      </div>

      <div className="event-controls">
        <div className="event-search-row">
          <div className="search-field">
            <label className="visually-hidden" htmlFor="event-search">
              Search events by name
            </label>
            <svg
              aria-hidden="true"
              viewBox="0 0 20 20"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <circle cx="8.8" cy="8.8" r="5.8" stroke="currentColor" strokeWidth="1.6" />
              <path d="m13.2 13.2 4 4" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" />
            </svg>
            <input
              id="event-search"
              type="search"
              value={searchQuery}
              onChange={(event) => setSearchQuery(event.target.value)}
              placeholder="Search concerts, workshops, sports..."
            />
          </div>
        </div>

        <div className="category-filters" role="group" aria-label="Filter events by category">
          <span className="filter-label">Explore by</span>
          {categories.map((category) => (
            <button
              className={`filter-chip${selectedCategory === category ? " filter-chip--active" : ""}`}
              key={category}
              type="button"
              aria-pressed={selectedCategory === category}
              onClick={() => onCategoryChange(category)}
            >
              <svg
                className="filter-chip-icon"
                viewBox="0 0 16 16"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.35"
                strokeLinecap="round"
                strokeLinejoin="round"
                aria-hidden="true"
              >
                {categoryIcons[category]}
              </svg>
              <span>{category}</span>
              {selectedCategory === category && (
                <span className="filter-chip-check" aria-hidden="true">
                  ✓
                </span>
              )}
            </button>
          ))}
        </div>
      </div>

      <p className="results-status" role="status" aria-live="polite">
        <span className="results-status-dot" aria-hidden="true" />
        <span>
          <strong>{filteredEvents.length}</strong>{" "}
          {filteredEvents.length === 1 ? "event" : "events"} to explore
        </span>
      </p>

      {filteredEvents.length > 0 ? (
        <div className="event-grid">
          {filteredEvents.map((event) => (
            <EventCard
              key={event.id}
              event={event}
              onBook={onBookEvent}
              onViewDetails={onViewDetails}
            />
          ))}
        </div>
      ) : (
        <div className="empty-results">
          <span className="empty-results-icon" aria-hidden="true">
            ✳
          </span>
          <h3>No events found</h3>
          <p>Try another name or choose a different category.</p>
          <button className="clear-filters" type="button" onClick={clearFilters}>
            Clear search and filters
          </button>
        </div>
      )}

    </section>
  );
}
