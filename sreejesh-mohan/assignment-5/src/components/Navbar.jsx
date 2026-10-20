// src/components/Navbar.jsx
// Navigation bar with route highlighting and responsive drawer
import React, { useState } from 'react';
import { NavLink, Link } from 'react-router-dom';
import { CookingPot, Bookmark, BookOpen, Home as HomeIcon, Menu, X } from 'lucide-react';
import { useFavourites } from '../context/FavouritesContext';

export default function Navbar() {
  const { favouritesCount } = useFavourites();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const toggleMobileMenu = () => setMobileMenuOpen((prev) => !prev);
  const closeMobileMenu = () => setMobileMenuOpen(false);

  return (
    <header className="navbar-header">
      <div className="navbar-container">
        {/* Brand Logo Link: Adukkala */}
        <Link to="/" className="navbar-brand" onClick={closeMobileMenu}>
          <span className="brand-icon">
            <CookingPot size={26} strokeWidth={2.2} />
          </span>
          <div className="brand-text">
            <span className="brand-title">
              Aduk<span className="brand-accent">kala</span>
            </span>
            <span className="brand-subtitle">Authentic Kerala Kitchen</span>
          </div>
        </Link>

        {/* Mobile Menu Hamburger */}
        <button
          type="button"
          className="mobile-toggle-btn"
          onClick={toggleMobileMenu}
          aria-label={mobileMenuOpen ? 'Close menu' : 'Open menu'}
          aria-expanded={mobileMenuOpen}
        >
          {mobileMenuOpen ? <X size={20} /> : <Menu size={20} />}
        </button>

        {/* Navigation Links with Active Highlighting */}
        <nav className={`navbar-nav ${mobileMenuOpen ? 'nav-open' : ''}`}>
          <NavLink
            to="/"
            end
            onClick={closeMobileMenu}
            className={({ isActive }) =>
              `nav-link ${isActive ? 'nav-link--active' : ''}`
            }
          >
            <HomeIcon size={16} className="nav-link-icon" />
            <span>Home</span>
          </NavLink>

          <NavLink
            to="/recipes"
            onClick={closeMobileMenu}
            className={({ isActive }) =>
              `nav-link ${isActive ? 'nav-link--active' : ''}`
            }
          >
            <BookOpen size={16} className="nav-link-icon" />
            <span>Recipes</span>
          </NavLink>

          <NavLink
            to="/favourites"
            onClick={closeMobileMenu}
            className={({ isActive }) =>
              `nav-link ${isActive ? 'nav-link--active' : ''}`
            }
          >
            <Bookmark size={16} className="nav-link-icon" />
            <span>Favourites</span>
            {favouritesCount > 0 && (
              <span className="nav-badge" aria-label={`${favouritesCount} favourite recipes`}>
                {favouritesCount}
              </span>
            )}
          </NavLink>
        </nav>
      </div>
    </header>
  );
}
