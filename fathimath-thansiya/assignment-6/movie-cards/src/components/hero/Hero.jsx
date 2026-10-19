import "./Hero.css";

export default function Hero({ movie }) {
  if (!movie) return null;

  const { title, year, rating, genre, poster } = movie;
  const backdrop = movie.backdrop || poster;

  return (
    <section className="hero" id="top" aria-label={`Featured: ${title}`}>
      <div
        className="hero__backdrop"
        style={backdrop ? { backgroundImage: `url(${backdrop})` } : undefined}
      />
      <div className="hero__gradient" aria-hidden="true" />

      <div className="hero__content">
        <h1 className="hero__title">{title}</h1>
        <div className="hero__meta">
          <span className="hero__year">{year}</span>
          <span className="hero__genre">{genre}</span>
          <span className="hero__rating-badge">{rating.toFixed(1)}</span>
        </div>
        <div className="hero__actions">
          <button type="button" className="hero__btn hero__btn--watch">
            <svg
              viewBox="0 0 24 24"
              width="22"
              height="22"
              role="presentation"
              focusable="false"
              aria-hidden="true"
            >
              <path fill="currentColor" d="M8 5v14l11-7z" />
            </svg>
            <span>Watch Now</span>
          </button>
        </div>
      </div>
    </section>
  );
}
