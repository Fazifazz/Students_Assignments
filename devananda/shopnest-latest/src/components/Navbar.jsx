import { Link, NavLink, useNavigate } from 'react-router-dom';
import { useCart } from '../context/CartContext.jsx';
import { useState } from 'react';

export default function Navbar() {
const { cartCount } = useCart();
const [search, setSearch] = useState('');
const navigate = useNavigate();

function handleSearch(event) {
event.preventDefault();

if (search.trim()) {
  navigate(`/products?search=${encodeURIComponent(search.trim())}`);
  setSearch('');
}


}

return (
  <header className="site-header">
    <nav className="navbar">

      <div className="nav-top">
        <Link to="/" className="brand">
          <img src="/assets/shopnest%20logo.jpg" alt="ShopNest Logo" />
          <span>ShopNest</span>
        </Link>

        <div className="nav-links">
          <NavLink to="/">Home</NavLink>
          <NavLink to="/products">Products</NavLink>
          <NavLink to="/favorites">❤️ Favorites</NavLink>
          <NavLink to="/categories">Categories</NavLink>
          <NavLink to="/contact">Contact</NavLink>
        </div>

        <Link to="/cart" className="cart-link">
          🛒 {cartCount > 0 && cartCount}
        </Link>
      </div>

      <div className="nav-search-row">
        <form className="nav-search" onSubmit={handleSearch}>
          <input
            type="search"
            placeholder="Search products..."
            value={search}
            onChange={(event) => setSearch(event.target.value)}
          />
          <button type="submit">Search</button>
        </form>
      </div>

    </nav>
  </header>
);
}
