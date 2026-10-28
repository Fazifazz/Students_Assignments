import { useDispatch, useSelector } from "react-redux";
import { useMemo, useState } from "react";
import { ArrowUpDown, Filter, Heart, SlidersHorizontal } from "lucide-react";
import DestinationCard from "../components/DestinationCard";
import SearchBar from "../components/SearchBar";
import {
  clearFilters,
  setFilters,
  toggleFavourite,
} from "../features/destinations/destinationSlice";

const budgetOptions = [
  { value: "all", label: "Any budget" },
  { value: "under-100", label: "Under $100/day" },
  { value: "100-160", label: "$100–$160/day" },
  { value: "above-160", label: "$160+/day" },
];

const typeOptions = [
  { value: "all", label: "All types" },
  { value: "Beach", label: "Beach" },
  { value: "City", label: "City" },
  { value: "Nature", label: "Nature" },
  { value: "Mountain", label: "Mountain" },
];

const styleOptions = [
  { value: "all", label: "Any travel style" },
  { value: "Relaxed", label: "Relaxed" },
  { value: "Luxury", label: "Luxury" },
  { value: "Culture", label: "Culture" },
  { value: "Adventure", label: "Adventure" },
  { value: "Foodie", label: "Foodie" },
];

export default function Explore() {
  const dispatch = useDispatch();
  const destinations = useSelector((state) => state.destinations.all);
  const favourites = useSelector((state) => state.destinations.favourites);
  const filters = useSelector((state) => state.destinations.filters);

  const [page, setPage] = useState(1);
  const pageSize = 6;

  const filteredDestinations = useMemo(() => {
    const query = filters.query.trim().toLowerCase();
    const list = destinations.filter((destination) => {
      const matchesQuery =
        !query ||
        destination.name.toLowerCase().includes(query) ||
        destination.country.toLowerCase().includes(query) ||
        destination.tags.some((tag) => tag.toLowerCase().includes(query));

      const matchesBudget =
        filters.budget === "all" ||
        (filters.budget === "under-100" && destination.dailyBudget < 100) ||
        (filters.budget === "100-160" &&
          destination.dailyBudget >= 100 &&
          destination.dailyBudget <= 160) ||
        (filters.budget === "above-160" && destination.dailyBudget > 160);

      const matchesType =
        filters.type === "all" || destination.type === filters.type;
      const matchesStyle =
        filters.style === "all" || destination.travelStyle === filters.style;

      return matchesQuery && matchesBudget && matchesType && matchesStyle;
    });

    const sorted = [...list];
    sorted.sort((a, b) => {
      if (filters.sort === "cost") return a.dailyBudget - b.dailyBudget;
      return a.name.localeCompare(b.name);
    });

    return sorted;
  }, [destinations, filters]);

  const totalPages = Math.max(
    1,
    Math.ceil(filteredDestinations.length / pageSize),
  );
  const currentPageItems = filteredDestinations.slice(
    (page - 1) * pageSize,
    page * pageSize,
  );

  const handlePageChange = (nextPage) => {
    setPage(Math.min(Math.max(nextPage, 1), totalPages));
  };

  return (
    <div className="page-shell">
      <div className="container section-space">
        <div className="section-heading stacked-heading">
          <div>
            <span className="eyebrow">Explore destinations</span>
            <h1>Find your next chapter.</h1>
          </div>
          <SearchBar
            value={filters.query}
            onChange={(value) => {
              dispatch(setFilters({ query: value }));
              setPage(1);
            }}
            onSubmit={(event) => event.preventDefault()}
            placeholder="Search by place, country, vibe..."
          />
        </div>

        <div className="filter-panel">
          <div className="filter-block">
            <label htmlFor="budget-filter">Budget</label>
            <select
              id="budget-filter"
              value={filters.budget}
              onChange={(event) => {
                dispatch(setFilters({ budget: event.target.value }));
                setPage(1);
              }}
            >
              {budgetOptions.map((option) => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
          </div>

          <div className="filter-block">
            <label htmlFor="type-filter">Type</label>
            <select
              id="type-filter"
              value={filters.type}
              onChange={(event) => {
                dispatch(setFilters({ type: event.target.value }));
                setPage(1);
              }}
            >
              {typeOptions.map((option) => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
          </div>

          <div className="filter-block">
            <label htmlFor="style-filter">Style</label>
            <select
              id="style-filter"
              value={filters.style}
              onChange={(event) => {
                dispatch(setFilters({ style: event.target.value }));
                setPage(1);
              }}
            >
              {styleOptions.map((option) => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
          </div>

          <div className="filter-block">
            <label htmlFor="sort-filter">Sort</label>
            <select
              id="sort-filter"
              value={filters.sort}
              onChange={(event) => {
                dispatch(setFilters({ sort: event.target.value }));
                setPage(1);
              }}
            >
              <option value="name">Name</option>
              <option value="cost">Daily cost</option>
            </select>
          </div>

          <button
            type="button"
            className="secondary-btn clear-btn"
            onClick={() => dispatch(clearFilters())}
          >
            <SlidersHorizontal size={16} />
            Clear
          </button>
        </div>

        <div className="results-toolbar">
          <div className="results-count">
            <Filter size={16} />
            <span>
              {filteredDestinations.length} destination
              {filteredDestinations.length === 1 ? "" : "s"} found
            </span>
          </div>
          <div className="sort-badge">
            <ArrowUpDown size={14} />
            {filters.sort === "cost" ? "Cost" : "Name"}
          </div>
        </div>

        {currentPageItems.length === 0 ? (
          <div className="empty-state boxed-empty">
            <Heart size={22} />
            <h3>No destinations match your filters.</h3>
            <p>Try a wider search or reset the filters to see more ideas.</p>
            <button
              type="button"
              className="primary-btn"
              onClick={() => dispatch(clearFilters())}
            >
              Reset filters
            </button>
          </div>
        ) : (
          <>
            <div className="destination-grid">
              {currentPageItems.map((destination) => (
                <DestinationCard
                  key={destination.id}
                  destination={destination}
                  isFavourite={favourites.includes(destination.id)}
                  onToggleFavourite={(id) => dispatch(toggleFavourite(id))}
                />
              ))}
            </div>

            <div className="pagination">
              <button
                type="button"
                onClick={() => handlePageChange(page - 1)}
                disabled={page === 1}
              >
                Previous
              </button>
              <span>
                Page {page} of {totalPages}
              </span>
              <button
                type="button"
                onClick={() => handlePageChange(page + 1)}
                disabled={page >= totalPages}
              >
                Next
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
