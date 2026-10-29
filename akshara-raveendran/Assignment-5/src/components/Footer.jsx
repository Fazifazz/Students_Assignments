

import {
  Instagram,
  Facebook,
  Youtube,
  Mail,
  MapPin,
  Phone,
  Heart,
} from 'lucide-react';

export default function Footer() {
  return (
    <footer className="site-footer">
      <div className="footer-container">

        {/* Brand and description */}
        <div className="footer-about">
          <h2 className="footer-brand">
            recipe<span>haven</span>
          </h2>

          <p>
            A little inspiration for your everyday table.
            Discover delicious recipes and bring happiness
            to your kitchen.
          </p>

          <div className="footer-socials">
            <a
              href="https://www.instagram.com/"
              target="_blank"
              rel="noreferrer"
              aria-label="Instagram"
            >
              <Instagram size={19} />
            </a>

            <a
              href="https://www.facebook.com/"
              target="_blank"
              rel="noreferrer"
              aria-label="Facebook"
            >
              <Facebook size={19} />
            </a>

            <a
              href="https://www.youtube.com/"
              target="_blank"
              rel="noreferrer"
              aria-label="YouTube"
            >
              <Youtube size={19} />
            </a>
          </div>
        </div>

        {/* Quick links */}
        <div className="footer-links">
          <h3>Quick Links</h3>
          <a href="/">Home</a>
          <a href="/recipes">Recipes</a>
          <a href="/favourites">Favourites</a>
        </div>

        {/* Contact information */}
        <div className="footer-contact">
          <h3>Contact Us</h3>

          <p>
            <MapPin size={17} />
            <span>
              RecipeHaven Kitchen
              <br />
              Kerala, India
            </span>
          </p>

          <p>
            <Mail size={17} />
            <a href="mailto:hello@recipehaven.com">
              hello@recipehaven.com
            </a>
          </p>

          <p>
            <Phone size={17} />
            <a href="tel:+919846315899">
              +91 9846315899
            </a>
          </p>
        </div>

      </div>

      {/* Copyright */}
      <div className="footer-bottom">
        <p>
          Made with <Heart size={14} className="footer-heart" />
          {' '}for home cooks
        </p>

        <p>
          © {new Date().getFullYear()} RecipeHaven.
          All rights reserved.
        </p>
      </div>
    </footer>
  );
}
