// src/components/Footer.jsx
import React from 'react';
import { Link } from 'react-router-dom';
import { CookingPot } from 'lucide-react';

export default function Footer() {
  return (
    <footer className="app-footer">
      <div className="footer-container">
        <div className="footer-brand-col">
          <Link to="/" className="footer-brand">
            <span className="brand-icon">
              <CookingPot size={22} strokeWidth={2.2} />
            </span>
            <span className="brand-title">Aduk<span className="brand-accent">kala</span></span>
          </Link>
          <p className="footer-tagline">
            An artisan culinary platform celebrating authentic Kerala gastronomy—from Malabar
            coastal delicacies to traditional Onam Sadya preparations.
          </p>
        </div>

        <div className="footer-links-col">
          <h4 className="footer-heading">Explore</h4>
          <ul className="footer-nav">
            <li><Link to="/">Home</Link></li>
            <li><Link to="/recipes">Recipe Archive</Link></li>
            <li><Link to="/favourites">Saved Journal</Link></li>
          </ul>
        </div>

        <div className="footer-meta-col">
          <h4 className="footer-heading">Culinary Resources</h4>
          <p className="footer-meta-text">Mise en Place & Kitchen Standards</p>
          <p className="footer-meta-text">Seasonal Preparation Guides</p>
        </div>
      </div>
      <div className="footer-bottom">
        <p>© {new Date().getFullYear()} Adukkala. All rights reserved. Cultivating authentic culinary excellence.</p>
      </div>
    </footer>
  );
}
