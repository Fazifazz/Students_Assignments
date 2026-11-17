function Watchlist({ watchlist, onRemove }) {
  return (
    <section className="watchlist">
      <div className="watchlist-title">
        <h2>❤️ My Watchlist</h2>
        <span>{watchlist.length} movie{watchlist.length !== 1 ? 's' : ''}</span>
      </div>

      {watchlist.length === 0 ? (
        <p className="empty">Your watchlist is empty.</p>
      ) : (
        <div className="watchlist-grid">
          {watchlist.map((movie) => (
            <div className="watchlist-card" key={movie.id}>
              <div>
                <h3>{movie.title}</h3>
                <p>
                  {movie.genre} • {movie.year} • ⭐ {movie.rating}
                </p>
              </div>

              <button
                className="remove-btn"
                onClick={() => onRemove(movie.id)}
              >
                Remove
              </button>
            </div>
          ))}
        </div>
      )}
    </section>
  )
}

export default Watchlist