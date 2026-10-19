
import { NavLink } from "react-router-dom";

function Navbar({ favouritesCount }) {
  return (
    <nav className="navbar">
      <NavLink to="/" className="brand">
        RecipeNest
      </NavLink>

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
          Favourites ({favouritesCount})
        </NavLink>
      </div>
    </nav>
  );
}

export default Navbar;
