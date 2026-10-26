import { useRef, useState } from "react";
import { Link, NavLink, useLocation, useNavigate } from "react-router-dom";
import { useCart } from "../context/CartContext.jsx";

const categories = [
  "Electronics",
  "Clothing",
  "Footwear",
  "Books",
  "Accessories",
  "Home",
  "Deals",
  "New Arrivals",
  "Offers",
];

export default function Navbar() {
  const [search, setSearch] = useState("");
  const [loginStatus, setLoginStatus] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const loginDialog = useRef(null);
  const navigate = useNavigate();
  const location = useLocation();
  const { itemCount } = useCart();

  function submitSearch(event) {
    event.preventDefault();
    const query = search.trim();
    navigate(query ? `/products?search=${encodeURIComponent(query)}` : "/products");
  }

  function updateSearch(value) {
    setSearch(value);
    const query = value.trim();
    navigate(
      query ? `/products?search=${encodeURIComponent(query)}` : "/products",
      { replace: true },
    );
  }

  function submitLogin(event) {
    event.preventDefault();
    setLoginStatus(
      "Sign-in isn’t connected yet. Your details were not sent or saved.",
    );
  }

  return (
    <header className="top-navbar">
      <div className="container nav-wrapper">
        <Link className="logo" to="/" aria-label="ShopNest home">
          <span className="brand-main">
            Shop<span>Nest</span>
          </span>
          <small className="tagline">Explore Plus</small>
        </Link>

        <form className="search-box" role="search" onSubmit={submitSearch}>
          <input
            type="search"
            value={search}
            onChange={(event) => updateSearch(event.target.value)}
            placeholder="Search products and categories"
            aria-label="Search products"
          />
          <button className="search-btn" type="submit" aria-label="Search">
            <i className="bi bi-search" aria-hidden="true" />
          </button>
        </form>

        <button
          className="login-btn"
          type="button"
          aria-haspopup="dialog"
          aria-label="Open login"
          onClick={() => {
            setLoginStatus("");
            setShowPassword(false);
            loginDialog.current?.showModal();
          }}
        >
          <i className="bi bi-person" aria-hidden="true" />
          <span>Login</span>
        </button>

        <div className="nav-actions">
          <Link className="cart-link" to="/cart" aria-label={`Cart, ${itemCount} items`}>
            <i className="bi bi-cart3" aria-hidden="true" />
            {itemCount > 0 && <span className="cart-count">{itemCount}</span>}
          </Link>
        </div>
      </div>
      <nav className="category-nav container" aria-label="Shop by category">
        <NavLink
          to="/products"
          end
          className={() =>
            new URLSearchParams(location.search).has("category")
              ? undefined
              : "active"
          }
        >
          All
        </NavLink>
        {categories.map((category) => (
          <NavLink
            key={category}
            to={`/products?category=${encodeURIComponent(category)}`}
            className={() =>
              new URLSearchParams(location.search).get("category") === category
                ? "active"
                : undefined
            }
          >
            {category}
          </NavLink>
        ))}
      </nav>
      <dialog
        className="login-panel"
        ref={loginDialog}
        onClick={(event) => {
          if (event.target === event.currentTarget) {
            event.currentTarget.close();
          }
        }}
      >
        <div className="login-header">
          <h2>
            <i className="bi bi-person-circle" aria-hidden="true" /> Login
          </h2>
          <button
            className="login-close"
            type="button"
            aria-label="Close login dialog"
            onClick={() => loginDialog.current?.close()}
          >
            &times;
          </button>
        </div>
        <form className="login-content login-form" onSubmit={submitLogin}>
          <p className="login-intro">Welcome back! Sign in to your ShopNest account.</p>
          <label htmlFor="shopnest-login-email">Email address</label>
          <input
            id="shopnest-login-email"
            name="email"
            type="email"
            autoComplete="email"
            placeholder="you@example.com"
            required
            maxLength={254}
          />

          <label htmlFor="shopnest-login-password">Password</label>
          <div className="login-password-field">
            <input
              id="shopnest-login-password"
              name="password"
              type={showPassword ? "text" : "password"}
              autoComplete="current-password"
              placeholder="Enter your password"
              required
              minLength={8}
            />
            <button
              className="password-visibility"
              type="button"
              onClick={() => setShowPassword((visible) => !visible)}
              aria-label={showPassword ? "Hide password" : "Show password"}
              aria-pressed={showPassword}
            >
              <i
                className={`bi ${showPassword ? "bi-eye-slash" : "bi-eye"}`}
                aria-hidden="true"
              />
            </button>
          </div>

          <button className="button button-primary login-submit" type="submit">
            <i className="bi bi-box-arrow-in-right" aria-hidden="true" />
            Sign in
          </button>
          <p className="login-status" role="status" aria-live="polite">
            {loginStatus}
          </p>
        </form>
      </dialog>
    </header>
  );
}
