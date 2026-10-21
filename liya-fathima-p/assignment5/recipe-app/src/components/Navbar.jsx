import { NavLink } from "react-router-dom";

function Navbar({ count }) {
  return (
    <nav className="navbar">
      <h2> RecipeApp</h2>
      <div>
        <NavLink to="/" end>Home</NavLink>
        <NavLink to="/recipes">Recipes</NavLink>
        <NavLink to="/favourites">Favourites ({count})</NavLink>
      </div>
    </nav>
  );
}

export default Navbar;