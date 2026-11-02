import { useState } from "react";
import {
  Link,
  NavLink,
  useLocation,
  useNavigate,
  useSearchParams,
} from "react-router-dom";

function NavbarSearch({ searchFromUrl, onSearch }) {
  const [searchTerm, setSearchTerm] = useState(searchFromUrl);

  function handleSubmit(event) {
    event.preventDefault();
    onSearch(searchTerm.trim());
  }

  return (
    <form
      className="d-flex me-lg-3 mb-3 mb-lg-0"
      role="search"
      onSubmit={handleSubmit}
    >
      <label className="visually-hidden" htmlFor="search-input">
        Search products
      </label>
      <input
        type="search"
        id="search-input"
        className="form-control"
        placeholder="Search products..."
        value={searchTerm}
        onChange={(event) => setSearchTerm(event.target.value)}
      />
    </form>
  );
}

function Navbar({ cartItemCount = 0 }) {
  const [searchParams, setSearchParams] = useSearchParams();
  const navigate = useNavigate();
  const location = useLocation();
  const searchFromUrl = searchParams.get("search") ?? "";

  function handleSearchSubmit(search) {
    if (location.pathname === "/products") {
      setSearchParams((currentParams) => {
        const nextParams = new URLSearchParams(currentParams);
        if (search) {
          nextParams.set("search", search);
        } else {
          nextParams.delete("search");
        }
        return nextParams;
      });
      return;
    }

    if (search) {
      navigate(`/products?${new URLSearchParams({ search })}`);
    }
  }

  function clearSearch() {
    setSearchParams((currentParams) => {
      const nextParams = new URLSearchParams(currentParams);
      nextParams.delete("search");
      return nextParams;
    });
  }

  return (
    <header>
      <nav className="navbar navbar-expand-lg bg-white border-bottom">
        <div className="container">
          <Link className="navbar-brand fw-bold text-primary" to="/">
            ShopNest
          </Link>
          <button
            className="navbar-toggler"
            type="button"
            data-bs-toggle="collapse"
            data-bs-target="#mainNavigation"
            aria-controls="mainNavigation"
            aria-expanded="false"
            aria-label="Toggle navigation"
          >
            <span className="navbar-toggler-icon"></span>
          </button>
          <div className="collapse navbar-collapse" id="mainNavigation">
            <ul className="navbar-nav mx-auto mb-2 mb-lg-0">
              <li className="nav-item">
                <NavLink className="nav-link" to="/" end>
                  Home
                </NavLink>
              </li>
              <li className="nav-item">
                <NavLink className="nav-link" to="/products">
                  Products
                </NavLink>
              </li>
              {/* <li className="nav-item">
                <Link className="nav-link" to="/#categories">
                  Categories
                </Link>
              </li> */}
              <li className="nav-item">
                <NavLink className="nav-link" to="/contact">
                  Contact
                </NavLink>
              </li>
            </ul>
            <NavbarSearch
              key={searchFromUrl}
              searchFromUrl={searchFromUrl}
              onSearch={handleSearchSubmit}
              onClear={clearSearch}
            />
            <NavLink
              className="btn btn-primary btn-cart position-relative"
              to="/cart"
              aria-label={`Shopping cart, ${cartItemCount} items`}
            >
              <i className="bi bi-cart"></i>
              <span className="count">{cartItemCount}</span>
            </NavLink>
          </div>
        </div>
      </nav>
    </header>
  );
}

export default Navbar;
