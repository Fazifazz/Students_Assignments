
function MovieCard({ title, genre, year, rating, onAdd, isAdded }) {
  return (
    <article className="movie-card">
      <span className="movie-genre">{genre}</span>

      <h2>{title}</h2>

      <p>Released in {year}</p>
      <p>★ &nbsp;{rating} <span className="rating-label">/ 10</span></p>

      <button onClick={onAdd} disabled={isAdded}>
        {isAdded ? "✓  In your watchlist" : "+  Add to watchlist"}
      </button>
    </article>
  );
}

export default MovieCard;
