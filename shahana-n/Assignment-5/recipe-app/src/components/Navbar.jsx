
import { NavLink } from 'react-router-dom';
import { Search, Heart, Utensils, Menu, X } from 'lucide-react';
import { useState } from 'react';
import './Navbar.css';

export default function Navbar() {
  const [menuOpen, setMenuOpen] = useState(false);

  function closeMenu() {
    setMenuOpen(false);
  }

  return (
    <nav className="navbar">
      <NavLink to="/" className="logo" onClick={closeMenu}>
      <img src="/images/logo-icon.png" alt="Flavorly" />
      <span>Flavorly</span>
     </NavLink>

      <button
        className="Hamburger"
        onClick={() => setMenuOpen(!menuOpen)}
        aria-label={menuOpen ? 'Close menu' : 'Open menu'}
        aria-expanded={menuOpen}
      >
        {menuOpen ? <X /> : <Menu />}
      </button>

      <div className={`nav-link ${menuOpen ? 'nav-link-open' : ''}`}>
        <NavLink
          to="/"
          end
          onClick={closeMenu}
          className={({ isActive }) =>
            isActive ? 'navlink navlink-active' : 'navlink'
          }
        >
          Home
        </NavLink>

        <NavLink
          to="/recipes"
          onClick={closeMenu}
          className={({ isActive }) =>
            isActive ? 'navlink navlink-active' : 'navlink'
          }
        >
          Recipes
        </NavLink>

        <NavLink
          to="/favourites"
          onClick={closeMenu}
          className={({ isActive }) =>
            isActive ? 'navlink navlink-active' : 'navlink'
          }
        >
          <Heart size={16} /> Favourites
        </NavLink>
      </div>

      <NavLink
        to="/recipes"
        className="nav-search"
        aria-label="Search recipes"
      >
        <Search />
      </NavLink>
    </nav>
  );
}
