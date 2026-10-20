import { useContext } from "react";
import { NavLink } from "react-router-dom";
import { FavouritesContext } from "../context/FavouritesContext";

export default function Navbar() {
  const { favourites } = useContext(FavouritesContext);

  return (
    <nav className="navbar">
      <div className="navbar-inner">
        <NavLink to="/" className="navbar-brand">
          <span className="brand-icon">🍳</span>
          <span className="brand-text">
            Recipe <span className="brand-accent">Finder</span>
          </span>
        </NavLink>

        <ul className="nav-links">
          <li>
            <NavLink to="/" end className="nav-link">
              Home
            </NavLink>
          </li>

          <li>
            <NavLink to="/recipes" className="nav-link">
              Recipes
            </NavLink>
          </li>

          <li>
            <NavLink
              to="/favourites"
              className={({ isActive }) =>
                isActive ? "nav-link active" : "nav-link"
              }
            >
              Favourites
              {favourites.length > 0 && (
                <span className="fav-badge">{favourites.length}</span>
              )}
            </NavLink>
          </li>
        </ul>
      </div>
    </nav>
  );
}
