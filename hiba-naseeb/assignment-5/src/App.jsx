
import { useState, useEffect } from "react";
import axios from "axios";
import "./App.css";

function MovieCard({ movie, onAdd, added }) {
  return (
    <div className="movie-card">
      <h3>{movie.title}</h3>
      <p>Genre: {movie.genre}</p>
      <p>Year: {movie.year}</p>
      <p>Rating: ⭐ {movie.rating}</p>

      <button disabled={added} onClick={() => onAdd(movie)}>
        {added ? "Added" : "Add to Watchlist"}
      </button>
    </div>
  );
}

function Watchlist({ movies, onRemove }) {
  return (
    <section>
      <h2>My Watchlist</h2>
      {movies.length === 0 ? (
        <p>Your watchlist is empty.</p>
      ) : (
        movies.map((movie) => (
          <div className="watch-item" key={movie.id}>
            <span>{movie.title}</span>
            <button onClick={() => onRemove(movie.id)}>Remove</button>
          </div>
        ))
      )}
    </section>
  );
}

function App() {
  const [movies, setMovies] = useState([]);
  const [watchlist, setWatchlist] = useState([]);
  const [genre, setGenre] = useState("All");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    axios
      .get("/movies.json")
      .then((response) => setMovies(response.data))
      .catch((error) => console.error("Error loading movies:", error))
      .finally(() => setLoading(false));
  }, []);

  const addMovie = (movie) => {
    setWatchlist((current) =>
      current.some((item) => item.id === movie.id)
        ? current
        : [...current, movie]
    );
  };

  const removeMovie = (id) => {
    setWatchlist((current) => current.filter((movie) => movie.id !== id));
  };

  const genres = ["All", ...new Set(movies.map((movie) => movie.genre))];

  const filteredMovies =
    genre === "All" ? movies : movies.filter((movie) => movie.genre === genre);

  return (
    <main className="app">
      <h1>🎬 Movie Watchlist</h1>

      <h2>Discover Movies</h2>

      <div className="filters">
        {genres.map((item) => (
          <button
            key={item}
            className={genre === item ? "active" : ""}
            onClick={() => setGenre(item)}
          >
            {item}
          </button>
        ))}
      </div>

      {loading ? (
        <p className="loading">Loading movies...</p>
      ) : filteredMovies.length === 0 ? (
        <p>No movies found.</p>
      ) : (
        <div className="movie-grid">
          {filteredMovies.map((movie) => (
            <MovieCard
              key={movie.id}
              movie={movie}
              onAdd={addMovie}
              added={watchlist.some((item) => item.id === movie.id)}
            />
          ))}
        </div>
      )}

      <Watchlist movies={watchlist} onRemove={removeMovie} />
    </main>
  );
}

export default App;