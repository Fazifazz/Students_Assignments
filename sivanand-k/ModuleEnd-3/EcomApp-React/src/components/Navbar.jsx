
import { NavLink } from "react-router-dom";
import { useCart } from "../context/CartContext";

function Navbar() {
  const { cartItems } = useCart();

  const totalItems = cartItems.reduce(
    (total, item) => total + item.quantity,
    0
  );

  return (
    <>
      {/* Top Navigation */}

      <nav className="navbar">

        <NavLink to="/" className="logo">
          ShopNest
        </NavLink>

        <div className="nav-links">
          <NavLink to="/" end>Home</NavLink>
          <NavLink to="/products">Products</NavLink>

          <NavLink to="/cart" className="cart-nav-link">
            Cart
            <span className="cart-count">{totalItems}</span>
          </NavLink>

          <NavLink to="/contact">Contact</NavLink>
        </div>

        {/* Mobile Cart Shortcut */}

        <NavLink to="/cart" className="mobile-cart-shortcut">
          🛒
          <span>{totalItems}</span>
        </NavLink>

      </nav>

      {/* Mobile Bottom Navigation */}

      <nav className="mobile-bottom-nav">

        <NavLink to="/" end>
          <span className="mobile-nav-icon">⌂</span>
          <span>Home</span>
        </NavLink>

        <NavLink to="/products">
          <span className="mobile-nav-icon">▦</span>
          <span>Shop</span>
        </NavLink>

        <NavLink to="/cart">
          <span className="mobile-nav-icon">🛒</span>
          <span>Cart</span>
          {totalItems > 0 && (
            <span className="mobile-cart-badge">{totalItems}</span>
          )}
        </NavLink>

        <NavLink to="/contact">
          <span className="mobile-nav-icon">♙</span>
          <span>Contact</span>
        </NavLink>

      </nav>
    </>
  );
}

export default Navbar;
