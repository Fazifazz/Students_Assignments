
import { Link } from "react-router-dom";
import { useCart } from "../context/CartContext";

function Navbar() {
  const { cartCount } = useCart();

  return (
    <header>
      <nav className="navbar navbar-expand-lg navbar-dark">
        <div className="container-fluid px-4">

          <Link className="navbar-brand" to="/">
            ShopNest
          </Link>

          <button
            className="navbar-toggler"
            type="button"
            data-bs-toggle="collapse"
            data-bs-target="#navMenu"
            aria-controls="navMenu"
            aria-expanded="false"
            aria-label="Toggle navigation"
          >
            <span className="navbar-toggler-icon"></span>
          </button>

          <div className="collapse navbar-collapse" id="navMenu">

            <ul className="navbar-nav mx-auto mb-2 mb-lg-0 gap-lg-4 text-center">
              <li className="nav-item">
                <Link className="nav-link" to="/">Home</Link>
              </li>

              <li className="nav-item">
                <Link className="nav-link" to="/products">Products</Link>
              </li>

              <li className="nav-item">
                <Link className="nav-link" to="/contact">Contact</Link>
              </li>
            </ul>

            <div className="nav-actions">
              <Link
                to="/cart"
                className="icon-circle cart-button"
                aria-label="Open cart"
              >
                <i className="bi bi-cart3"></i>
                <span className="cart-badge">{cartCount}</span>
              </Link>
            </div>

          </div>
        </div>
      </nav>
    </header>
  );
}

export default Navbar;
