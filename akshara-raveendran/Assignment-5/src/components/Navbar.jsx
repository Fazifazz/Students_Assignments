import { ChefHat, Heart, House, Search } from 'lucide-react';
import { NavLink, Link } from 'react-router-dom';

export default function Navbar({ favouriteCount }) {
  return (
    <header className="site-header">
      <div className="nav-wrap">
        <Link to="/" className="brand" aria-label="Recipe Haven home">
          <span className="brand-icon"><ChefHat size={22} strokeWidth={2.2} /></span>
          <span>recipe<span className="brand-accent">haven</span><small>GOOD FOOD, GOOD MOOD</small></span>
        </Link>
        <nav className="main-nav" aria-label="Main navigation">
          <NavLink to="/" end className={({ isActive }) => isActive ? 'nav-link active' : 'nav-link'}><House size={16} /> Home</NavLink>
          <NavLink to="/recipes" className={({ isActive }) => isActive ? 'nav-link active' : 'nav-link'}><Search size={16} /> Recipes</NavLink>
          <NavLink to="/favourites" className={({ isActive }) => isActive ? 'nav-link active' : 'nav-link'}><Heart size={16} /> Favourites <span className="nav-count">{favouriteCount}</span></NavLink>
        </nav>
      </div>
    </header>
  );
}
