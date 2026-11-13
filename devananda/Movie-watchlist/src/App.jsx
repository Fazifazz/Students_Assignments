import { useState, useEffect } from 'react'
import axios from 'axios'
import MovieCard from './MovieCard'
import Watchlist from './Watchlist'
import './App.css'

function App() {
  const [movies, setMovies] = useState([])
  const [watchlist, setWatchlist] = useState([])
  const [loading, setLoading] = useState(true)
  const [selectedGenre, setSelectedGenre] = useState('All')

  useEffect(() => {
    axios
      .get('/movies.json')
      .then((response) => {
        setMovies(response.data)
      })
      .catch((error) => {
        console.log(error)
      })
      .finally(() => {
        setLoading(false)
      })
  }, [])

  const addToWatchlist = (movie) => {
    if (!watchlist.some((item) => item.id === movie.id)) {
      setWatchlist([...watchlist, movie])
    }
  }

  const removeFromWatchlist = (movieId) => {
    setWatchlist(
      watchlist.filter((movie) => movie.id !== movieId)
    )
  }

  const genres = ['All', ...new Set(movies.map((movie) => movie.genre))]

  const filteredMovies =
    selectedGenre === 'All'
      ? movies
      : movies.filter((movie) => movie.genre === selectedGenre)

  return (
    <div className="app">
      <header className="hero">
        <p className="subtitle">YOUR PERSONAL MOVIE COLLECTION</p>
        <h1>🎬 Movie Watchlist</h1>
        <p>Discover movies and save your favourites.</p>
      </header>

      {loading ? (
        <div className="loading">
          <div className="spinner"></div>
          <p>Loading movies...</p>
        </div>
      ) : (
        <>
          <section className="filter-section">
            <h2>Browse by Genre</h2>

            <div className="genre-buttons">
              {genres.map((genre) => (
                <button
                  className={selectedGenre === genre ? 'genre-btn active' : 'genre-btn'}
                  key={genre}
                  onClick={() => setSelectedGenre(genre)}
                >
                  {genre}
                </button>
              ))}
            </div>

            <p className="selected">
              Selected: <strong>{selectedGenre}</strong>
            </p>
          </section>

          <section>
            {filteredMovies.length === 0 ? (
              <p className="no-movies">No movies found</p>
            ) : (
              <div className="movie-grid">
                {filteredMovies.map((movie) => (
                  <MovieCard
                    key={movie.id}
                    title={movie.title}
                    genre={movie.genre}
                    year={movie.year}
                    rating={movie.rating}
                    poster={movie.poster}
                    onAdd={() => addToWatchlist(movie)}
                    isAdded={watchlist.some(
                      (item) => item.id === movie.id
                    )}
                  />
                ))}
              </div>
            )}
          </section>

          <Watchlist
            watchlist={watchlist}
            onRemove={removeFromWatchlist}
          />
        </>
      )}
    </div>
  )
}

export default App