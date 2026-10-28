import { NavLink, Link } from "react-router-dom";
import { useCart } from "../context/CartContext";
import { useWishlist } from "../context/WishlistContext";

export default function Navbar() {
  const { cartCount } = useCart();
  const { wishlist } = useWishlist();
  const linkClass = ({ isActive }) => `nav-link ${isActive ? "active" : ""}`;

  return (
    <nav className="navbar navbar-expand-lg shop-navbar sticky-top">
      <div className="container">
        <Link className="navbar-brand d-flex align-items-center gap-2" to="/">
          <span className="brand-mark">S</span><span>shopnest<span className="brand-period">.</span></span>
        </Link>
        <button className="navbar-toggler border-0" type="button" data-bs-toggle="collapse" data-bs-target="#shopNav" aria-controls="shopNav" aria-expanded="false" aria-label="Toggle navigation">
          <span className="navbar-toggler-icon"></span>
        </button>
        <div className="collapse navbar-collapse" id="shopNav">
          <div className="navbar-nav mx-auto gap-lg-3">
            <NavLink to="/" end className={linkClass}>Home</NavLink>
            <NavLink to="/products" className={linkClass}>Products</NavLink>
            <NavLink to="/contact" className={linkClass}>Contact</NavLink>
          </div>
          <div className="d-flex align-items-center gap-3 nav-actions">
            <Link to="/products?view=wishlist" className="icon-link" aria-label={`Wishlist, ${wishlist.length} saved items`} title="Wishlist">
              <i className="bi bi-heart"></i>{wishlist.length > 0 && <span className="count-dot">{wishlist.length}</span>}
            </Link>
            <Link to="/cart" className="icon-link" aria-label={`Cart, ${cartCount} items`} title="Shopping cart">
              <i className="bi bi-bag"></i><span className="count-dot">{cartCount}</span>
            </Link>
          </div>
        </div>
      </div>
    </nav>
  );
}