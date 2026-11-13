function MovieCard({ title, genre, year, rating, poster, onAdd, isAdded }) {
  return (
    <div className="movie-card">
      <img src={poster} alt={title} className="movie-poster" />

      <h2>{title}</h2>

      <p className="genre">#{genre}</p>

      <div className="movie-info">
        <span>📅 {year}</span>
        <span>⭐ {rating}</span>
      </div>

      <button
        className={isAdded ? 'add-btn added' : 'add-btn'}
        type="button"
        onClick={onAdd}
        disabled={isAdded}
      >
        {isAdded ? '✓ Added' : '+ Add to Watchlist'}
      </button>
    </div>
  )
}

export default MovieCard