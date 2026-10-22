
import { Link } from 'react-router-dom';
import {
  ChefHat,
  Heart,
} from 'lucide-react';
import { FaFacebook, FaYoutube, FaInstagram } from 'react-icons/fa';
import './Footer.css';

export default function Footer() {
  return (
    <footer className="footer">
      <div className="footer-content">
        <div className="footer-brand">
          <Link to="/" className="footer-logo">
            <ChefHat size={30} />
            <span>Flavorly</span>
          </Link>

          <p>
            Discover delicious recipes, explore new flavors,
            and save your favorite meals.
          </p>

          <div className="footer-socials">
            <a
              href="https://www.instagram.com/"
              target="_blank"
              rel="noreferrer"
              aria-label="Instagram"
            >
              <FaInstagram/>
            </a>

            <a
              href="https://www.facebook.com/"
              target="_blank"
              rel="noreferrer"
              aria-label="Facebook"
            >
              <FaFacebook/>
            </a>

            <a
              href="https://www.youtube.com/"
              target="_blank"
              rel="noreferrer"
              aria-label="YouTube"
            >
              <FaYoutube />
            </a>
          </div>
        </div>

        <div className="footer-links">
          <h3>Quick Links</h3>
          <Link to="/">Home</Link>
          <Link to="/recipes">Recipes</Link>
          <Link to="/favourites">Favourites</Link>
        </div>

        <div className="footer-message">
          <h3>Made with love <Heart size={18}/> </h3>
          <p>Find your flavor. Love every bite.</p>
        </div>
      </div>

      <div className="footer-bottom">
        <p>
          © {new Date().getFullYear()} Flavorly. All rights reserved.
        </p>
      </div>
    </footer>
  );
}
