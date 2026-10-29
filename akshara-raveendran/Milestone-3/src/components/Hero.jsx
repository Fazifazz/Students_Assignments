export default function Hero() {
  return (
    <section className="hero page-shell" id="discover" aria-labelledby="hero-title">
      <div className="hero-copy">
        <p className="eyebrow">
          <span className="eyebrow-dot" aria-hidden="true" />
          YOUR CITY, A LITTLE MORE INTERESTING
        </p>
        <h1 id="hero-title">
          Make room for
          <br />
          <span>something good.</span>
        </h1>
        <p className="hero-description">
          Find the little moments and big nights worth leaving home for.
          Discover experiences made for your kind of people.
        </p>
        <div className="hero-actions">
          <a className="button button--primary" href="#events">
            Find your next plan <span aria-hidden="true">↗</span>
          </a>
          <div className="social-proof" aria-label="Loved by event-goers">
            <div className="avatar-stack" aria-hidden="true">
              <span className="avatar avatar--one">J</span>
              <span className="avatar avatar--two">M</span>
              <span className="avatar avatar--three">A</span>
            </div>
            <span>
              <strong>2k+</strong> good plans made
            </span>
          </div>
        </div>
        <div className="hero-note">
          <span className="hero-note-icon" aria-hidden="true">
            ✳
          </span>
          <span>Real people. Real moments. No endless scrolling.</span>
        </div>
      </div>

      <div className="hero-art" aria-label="A concert crowd enjoying a live show">
        <img
          src="https://images.unsplash.com/photo-1459749411175-04bf5292ceea?auto=format&fit=crop&w=1200&q=90"
          alt=""
        />
        <div className="hero-image-shade" />
        <div className="floating-card floating-card--top">
          <span className="floating-icon floating-icon--pink" aria-hidden="true">
            ♫
          </span>
          <span>
            <strong>Golden Hour Sessions</strong>
            <small>            Nov 13 · San Francisco</small>
          </span>
        </div>
        <div className="floating-card floating-card--bottom">
          <span className="live-dot" aria-hidden="true" />
          <span>
            <strong>Good things are happening</strong>
            <small>Just around the corner</small>
          </span>
        </div>
        <span className="hero-sticker" aria-hidden="true">
          go
          <br />
          out!
        </span>
      </div>
    </section>
  );
}
