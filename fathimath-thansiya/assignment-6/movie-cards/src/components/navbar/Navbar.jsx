import { useEffect, useState } from "react";
import "./Navbar.css";

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 30);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <header className={`navbar${scrolled ? " navbar--scrolled" : ""}`}>
      <div className="navbar__inner">
        <a className="navbar__brand" href="#top" aria-label="Cineverse home">
          <span className="navbar__mark" aria-hidden="true">
            <svg viewBox="0 0 32 32" width="28" height="28" role="presentation">
              <rect
                x="2"
                y="2"
                width="28"
                height="28"
                rx="6"
                fill="currentColor"
              />
              <path d="M13 11.2v9.6l8-4.8z" fill="#0d0f14" />
            </svg>
          </span>
          <span className="navbar__logo">CINEVERSE</span>
        </a>

        <nav className="navbar__nav" aria-label="Primary">
          <a className="navbar__link navbar__link--active" href="#top">
            Home
          </a>
          <a className="navbar__link" href="#catalog">
            Movies
          </a>
          <a className="navbar__link" href="#watchlist">
            Watchlist
          </a>
        </nav>
      </div>
    </header>
  );
}
