import { NavLink } from "react-router-dom";

export default function Navbar({ favourites }) {
  return (
    <header className="header">
      <nav className="navbar">
        <div className="container">
          <div>
            <NavLink to="/" className="brand">
              <img src="./src/assets/tastebite-logo.png" />
            </NavLink>
          </div>
          <div className="nav-links">
            <NavLink
              to="/"
              end
              className={({ isActive }) =>
                isActive ? "nav-link active" : "nav-link"
              }
            >
              Home
            </NavLink>

            <NavLink
              to="/recipes"
              className={({ isActive }) =>
                isActive ? "nav-link active" : "nav-link"
              }
            >
              Recipes
            </NavLink>

            <NavLink
              to="/favourites"
              className={({ isActive }) =>
                isActive ? "nav-link active" : "nav-link"
              }
            >
              Favourites
              {favourites.length === 0 ? "" : ` (${favourites.length})`}
            </NavLink>
          </div>
        </div>
      </nav>
    </header>
  );
}
