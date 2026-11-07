import React, { useState } from 'react';
import { Link, NavLink, useLocation, useNavigate } from 'react-router-dom';
import {
  Search,
  ShoppingCart,
  Heart,
  Zap,
  Home,
  Grid,
  Phone,
} from 'lucide-react';
import { useCart } from '../context/CartContext';
import { useWishlist } from '../context/WishlistContext';
import BrandLogo from './BrandLogo';

export default function Navbar() {
  const { cartCount, notification, openCartDrawer } = useCart();
  const { wishlistCount, wishlistToast, openWishlistDrawer } = useWishlist();
  const [searchQuery, setSearchQuery] = useState('');
  const navigate = useNavigate();
  const location = useLocation();

  const queryCategory = new URLSearchParams(location.search).get('category');
  const isProductsPage = location.pathname === '/products';
  const isAllProductsActive = isProductsPage && !queryCategory;
  const isCategoryActive = (cat) =>
    isProductsPage && queryCategory?.toLowerCase() === cat.toLowerCase();

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/products?search=${encodeURIComponent(searchQuery.trim())}`);
    } else {
      navigate('/products');
    }
  };

  return (
    <>
      <header className="gromuse-navbar">
        <div className="container container-wide">
          {/* Top Bar: Brand Logo, Pill Search, Notice, Cart, Profile */}
          <div className="gromuse-nav-inner">
            {/* Left: Brand Logo (No hamburger) */}
            <div className="nav-left-group">
              <Link to="/" className="gromuse-logo" aria-label="ShopNest Home">
                <BrandLogo size={28} />
              </Link>
            </div>

            {/* Center: Wide Pill Search Bar */}
            <form onSubmit={handleSearchSubmit} className="nav-center-search">
              <input
                type="text"
                placeholder="Search for Electronics, Clothing, Footwear or Books..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pill-search-input"
              />
              <button type="submit" className="pill-search-icon-btn" aria-label="Search">
                <Search size={16} />
              </button>
            </form>

            {/* Right: Express Delivery + Wishlist + Cart Pill + User Profile */}
            <div className="nav-right-group">
              <div className="nav-flash-notice">
                <Zap size={14} className="flash-bolt-icon" />
                <span>Order now and get it within 15 mins!</span>
              </div>

              {/* Wishlist Pill */}
              <button
                type="button"
                className="nav-action-pill nav-wishlist-pill"
                onClick={openWishlistDrawer}
                aria-label="View Saved Wishlist"
                title="View Saved Wishlist"
              >
                <Heart size={17} />
                {wishlistCount > 0 && (
                  <span className="nav-pill-badge wishlist-count-badge">
                    {wishlistCount}
                  </span>
                )}
              </button>

              {/* Cart Pill (Opens Slide-over Drawer) */}
              <button
                type="button"
                className="nav-action-pill nav-cart-pill"
                onClick={openCartDrawer}
                aria-label="Open Shopping Cart"
                title="Open Shopping Cart"
              >
                <ShoppingCart size={17} />
                <span className="nav-pill-badge cart-count-badge">{cartCount}</span>
              </button>

              <div className="nav-user-avatar" title="Account Profile">
                <img
                  src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=120&auto=format&fit=crop&q=80"
                  alt="User Avatar"
                  className="avatar-photo"
                />
              </div>
            </div>
          </div>

          {/* Navigation Links directly inside Navbar Header */}
          <nav className="nav-header-links" aria-label="Primary Navigation">
            <NavLink
              to="/"
              className={({ isActive }) =>
                isActive && !isProductsPage ? 'nav-header-pill active' : 'nav-header-pill'
              }
              end
            >
              <Home size={15} />
              <span>Home</span>
            </NavLink>
            <Link
              to="/products"
              className={
                isAllProductsActive ? 'nav-header-pill active' : 'nav-header-pill'
              }
            >
              <Grid size={15} />
              <span>All Products</span>
            </Link>
            <Link
              to="/products?category=Electronics"
              className={
                isCategoryActive('Electronics')
                  ? 'nav-header-pill active'
                  : 'nav-header-pill'
              }
            >
              <span>Electronics</span>
            </Link>
            <Link
              to="/products?category=Clothing"
              className={
                isCategoryActive('Clothing')
                  ? 'nav-header-pill active'
                  : 'nav-header-pill'
              }
            >
              <span>Clothing</span>
            </Link>
            <Link
              to="/products?category=Footwear"
              className={
                isCategoryActive('Footwear')
                  ? 'nav-header-pill active'
                  : 'nav-header-pill'
              }
            >
              <span>Footwear</span>
            </Link>
            <Link
              to="/products?category=Books"
              className={
                isCategoryActive('Books')
                  ? 'nav-header-pill active'
                  : 'nav-header-pill'
              }
            >
              <span>Books</span>
            </Link>
            <NavLink
              to="/contact"
              className={({ isActive }) =>
                isActive ? 'nav-header-pill active' : 'nav-header-pill'
              }
            >
              <Phone size={15} />
              <span>Contact</span>
            </NavLink>
          </nav>
        </div>
      </header>

      {/* Floating Global Toast Notifications */}
      {notification && (
        <div className="global-toast-notification">
          <div className="toast-dot"></div>
          <span>{notification}</span>
        </div>
      )}
      {wishlistToast && (
        <div className="global-toast-notification wishlist-toast">
          <div className="toast-dot heart-dot"></div>
          <span>{wishlistToast}</span>
        </div>
      )}
    </>
  );
}
