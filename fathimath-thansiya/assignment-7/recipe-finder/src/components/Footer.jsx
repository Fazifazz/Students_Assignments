import { Link } from "react-router-dom";

export default function Footer() {
  const year = new Date().getFullYear();
  return (
    <footer className="footer">
      <div className="footer-inner">
        <div className="footer-brand">
          <span className="footer-logo">🍳</span>
          <div>
            <h3>Recipe Finder</h3>
            <p>Discover, cook, and save your favourite meals.</p>
          </div>
        </div>

        <div className="footer-cols">
          <div className="footer-col">
            <h4>Explore</h4>
            <ul>
              <li>
                <Link to="/">Home</Link>
              </li>
              <li>
                <Link to="/recipes">Recipes</Link>
              </li>
              <li>
                <Link to="/favourites">Favourites</Link>
              </li>
            </ul>
          </div>

          <div className="footer-col">
            <h4>Categories</h4>
            <ul>
              <li>
                <Link to="/recipes?q=chicken">Chicken</Link>
              </li>
              <li>
                <Link to="/recipes?q=beef">Beef</Link>
              </li>
              <li>
                <Link to="/recipes?q=pasta">Pasta</Link>
              </li>
              <li>
                <Link to="/recipes?q=dessert">Dessert</Link>
              </li>
            </ul>
          </div>

          <div className="footer-col">
            <h4>About</h4>
            <p className="footer-text">
              Powered by{" "}
              <a
                href="https://www.themealdb.com/"
                target="_blank"
                rel="noopener noreferrer"
              >
                TheMealDB
              </a>
              . Built with React, React Router and Axios.
            </p>
            <div className="socials" aria-label="social links">
              <a
                href="#"
                aria-label="Twitter"
                onClick={(e) => e.preventDefault()}
              >
                𝕏
              </a>
              <a
                href="#"
                aria-label="Instagram"
                onClick={(e) => e.preventDefault()}
              >
                📷
              </a>
              <a
                href="#"
                aria-label="GitHub"
                onClick={(e) => e.preventDefault()}
              >
                🐙
              </a>
            </div>
          </div>
        </div>
      </div>

      <div className="footer-bottom">
        <p>© {year} Recipe Finder. All rights reserved.</p>
        <p>Made with ❤️ for food lovers.</p>
      </div>
    </footer>
  );
}
