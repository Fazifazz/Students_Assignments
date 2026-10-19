import { useEffect, useMemo, useState } from "react";
import Watchlist from "./components/watch-list/WatchList";
import MovieCard from "./components/movie-card/MovieCard";
import Spinner from "./components/spinner/Spinner";
import Navbar from "./components/navbar/Navbar";
import Hero from "./components/hero/Hero";
import Footer from "./components/footer/Footer";
import axios from "axios";

import "./App.css";

const ALL_GENRES = [
  "All",
  "Action",
  "Comedy",
  "Drama",
  "Sci-Fi",
  "Fantasy",
  "Animation",
  "Romance",
  "Adventure",
];
const App = () => {
  const [movies, setMovies] = useState([]);
  const [watchlist, setWatchlist] = useState([]);
  const [activeGenre, setActiveGenre] = useState("All");
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  // Fetch movies from the local JSON file when the component mounts
  useEffect(() => {
    let cancelled = false;

    const fetchMovies = async () => {
      try {
        const { data } = await axios.get("/movies.json");

        if (cancelled) return;

        setMovies(Array.isArray(data) ? data : []);
        setIsLoading(false);
      } catch (err) {
        if (cancelled) return;

        setError(err.message ?? "Failed to load movies");
        setIsLoading(false);
      }
    };

    fetchMovies();

    return () => {
      cancelled = true;
    };
  }, []);

  // Create a Set of movie IDs in the watchlist for quick lookup
  const watchlistIds = new Set(watchlist.map((movie) => movie.id));

  const fromData = new Set(movies.map((movie) => movie.genre));

  // Pick the highest rated movie as the hero feature.
  const featuredMovie = useMemo(() => {
    if (movies.length === 0) return null;
    return movies.reduce((best, current) =>
      current.rating > best.rating ? current : best,
    );
  }, [movies]);

  // Create a list of available genres based on the movies fetched, excluding "All" and any genres not present in the data
  const availableGenres = [
    "All",
    ...ALL_GENRES.filter((genre) => genre !== "All" && fromData.has(genre)),
  ];

  let filteredMovies =
    activeGenre === "All"
      ? movies
      : movies.filter((movie) => movie.genre === activeGenre);

  // Exclude the hero feature from the catalog grid so it doesn't duplicate.
  if (featuredMovie) {
    filteredMovies = filteredMovies.filter(
      (movie) => movie.id !== featuredMovie.id,
    );
  }

  // Handle adding a movie to the watchlist, ensuring no duplicates are added
  const handleAdd = (movie) => {
    setWatchlist((prev) =>
      prev.some((m) => m.id === movie.id) ? prev : [...prev, movie],
    );
  };

  // Handle removing a movie from the watchlist by filtering it out based on its ID
  const handleRemove = (id) => {
    setWatchlist((prev) => prev.filter((movie) => movie.id !== id));
  };

  return (
    <div className="app">
      <Navbar />

      {isLoading && !error && <Spinner />}
      {error && !isLoading && (
        <p className="app__error" role="alert">
          Could not load movies: {error}
        </p>
      )}

      {!isLoading && !error && featuredMovie && <Hero movie={featuredMovie} />}

      <main className="app__layout" id="catalog">
        <section className="app__results">
          <div className="app__row-header">
            <h2 className="app__row-title">Trending Now</h2>
          </div>

          <nav className="app__filters" aria-label="Genre filters">
            {availableGenres.map((genre) => {
              const isActive = genre === activeGenre;
              return (
                <button
                  key={genre}
                  type="button"
                  className={`app__filter${
                    isActive ? " app__filter--active" : ""
                  }`}
                  onClick={() => setActiveGenre(genre)}
                  aria-pressed={isActive}
                >
                  {genre}
                </button>
              );
            })}
          </nav>

          {!isLoading && !error && filteredMovies.length === 0 && (
            <p className="app__empty" role="status">
              No movies found
              {activeGenre !== "All" ? ` for "${activeGenre}"` : ""}.
            </p>
          )}

          {!isLoading && !error && filteredMovies.length > 0 && (
            <div className="app__grid">
              {filteredMovies.map((movie) => (
                <MovieCard
                  key={movie.id}
                  movie={movie}
                  inWatchlist={watchlistIds.has(movie.id)}
                  onAdd={handleAdd}
                />
              ))}
            </div>
          )}
        </section>

        <aside className="app__sidebar" id="watchlist">
          <Watchlist movies={watchlist} onRemove={handleRemove} />
        </aside>
      </main>

      <Footer />
    </div>
  );
};

export default App;
