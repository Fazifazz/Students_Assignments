import React from 'react';
import { Link, NavLink, useLocation } from 'react-router-dom';

export default function Navbar({ cartCount = 0 }) {
  const location = useLocation();
  const isAdmin = location.pathname.startsWith('/admin');

  return (
    <header className="header-nav shadow-sm sticky-top">
      <div className="container d-flex align-items-center justify-content-between py-2">
        {/* Brand */}
        <Link to="/" className="text-decoration-none d-flex align-items-center gap-2">
          <div className="brand-logo">🛠️</div>
          <div>
            <span className="brand-title">Equip<span className="text-amber">Track</span></span>
            <span className="brand-badge">TOOL RENTALS</span>
          </div>
        </Link>

        {/* Navigation Links */}
        <nav className="d-flex align-items-center gap-2">
          {!isAdmin ? (
            <>
              <NavLink
                to="/"
                end
                className={({ isActive }) => `nav-pill-link ${isActive ? 'active' : ''}`}
              >
                🏠 Browse Tools
              </NavLink>
              <NavLink
                to="/my-orders"
                className={({ isActive }) => `nav-pill-link ${isActive ? 'active' : ''}`}
              >
                📋 My Bookings
              </NavLink>
            </>
          ) : (
            <>
              <NavLink
                to="/admin"
                end
                className={({ isActive }) => `nav-pill-link ${isActive ? 'active' : ''}`}
              >
                📊 Dashboard
              </NavLink>
              <NavLink
                to="/admin/rentals"
                className={({ isActive }) => `nav-pill-link ${isActive ? 'active' : ''}`}
              >
                📋 All Rentals
              </NavLink>
              <NavLink
                to="/admin/add-equipment"
                className={({ isActive }) => `nav-pill-link ${isActive ? 'active' : ''}`}
              >
                ➕ Add New Tool
              </NavLink>
            </>
          )}
        </nav>

        {/* Action Buttons */}
        <div className="d-flex align-items-center gap-2">
          {!isAdmin ? (
            <>
              <Link to="/booking-cart" className="cart-pill-btn text-decoration-none">
                <span>🛒 Rental Cart</span>
                {cartCount > 0 ? (
                  <span className="cart-count">{cartCount}</span>
                ) : (
                  <span className="cart-count zero">0</span>
                )}
              </Link>
              <Link to="/admin" className="portal-switch-btn text-decoration-none">
                ⚙️ Admin Portal →
              </Link>
            </>
          ) : (
            <Link to="/" className="portal-switch-btn active text-decoration-none">
              ← Customer View
            </Link>
          )}
        </div>
      </div>
    </header>
  );
}
