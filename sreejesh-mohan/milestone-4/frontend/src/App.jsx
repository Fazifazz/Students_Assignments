import React from 'react';
import { Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';
import Home from './pages/Home';
import EquipmentDetail from './pages/EquipmentDetail';
import AddEquipment from './pages/AddEquipment';
import ActiveRentals from './pages/ActiveRentals';
import BookingCart from './pages/BookingCart';
import NotFound from './pages/NotFound';
import AdminLayout from './pages/admin/AdminLayout';
import AdminDashboard from './pages/admin/AdminDashboard';
import { rentalCartReducer, cartInitialState, CART_ACTIONS } from './reducers/rentalCartReducer';
import { useReducer, useEffect } from 'react';

export default function App() {
  const [cart, dispatch] = useReducer(rentalCartReducer, cartInitialState, () => {
    try {
      const saved = localStorage.getItem('equiptrack_cart');
      return saved ? JSON.parse(saved) : cartInitialState;
    } catch {
      return cartInitialState;
    }
  });

  useEffect(() => {
    localStorage.setItem('equiptrack_cart', JSON.stringify(cart));
  }, [cart]);

  function handleAddToCart(item) {
    dispatch({ type: CART_ACTIONS.ADD_ITEM, payload: item });
  }

  return (
    <div className="d-flex flex-column min-vh-100 bg-page">
      <Navbar cartCount={cart.items.length} />

      <main className="flex-grow-1">
        <Routes>
          <Route
            path="/"
            element={<Home onAddToCart={handleAddToCart} cartItems={cart.items} />}
          />
          <Route
            path="/equipment/:id"
            element={<EquipmentDetail onAddToCart={handleAddToCart} isAdded={false} />}
          />
          <Route
            path="/booking-cart"
            element={<BookingCart cart={cart} dispatch={dispatch} />}
          />
          <Route path="/my-orders" element={<ActiveRentals />} />

          <Route path="/admin" element={<AdminLayout />}>
            <Route index element={<AdminDashboard />} />
            <Route path="rentals" element={<ActiveRentals />} />
            <Route path="add-equipment" element={<AddEquipment />} />
          </Route>

          <Route path="*" element={<NotFound />} />
        </Routes>
      </main>

      {/* Professional, Clean Website Footer */}
      <footer className="site-footer bg-dark text-white pt-5 pb-4 mt-5">
        <div className="container">
          <div className="row g-4">
            <div className="col-lg-5 col-md-6">
              <h5 className="fw-bold text-warning d-flex align-items-center gap-2 mb-2">
                🛠️ EquipTrack
              </h5>
              <p className="text-secondary small mb-3">
                Online tool & machinery rental platform. Easily rent industrial tools, power equipment, and generators with transparent daily pricing and verified availability.
              </p>
              <div className="d-flex gap-2">
                <span className="badge bg-secondary">Verified Equipment</span>
                <span className="badge bg-secondary">Daily Rental Plans</span>
              </div>
            </div>

            <div className="col-lg-3 col-md-6 col-6">
              <h6 className="fw-bold text-white mb-3">Quick Navigation</h6>
              <ul className="list-unstyled small text-secondary">
                <li className="mb-2">
                  <a href="/" className="text-secondary text-decoration-none">
                    🏠 Home / Browse Tools
                  </a>
                </li>
                <li className="mb-2">
                  <a href="/my-orders" className="text-secondary text-decoration-none">
                    📋 My Bookings
                  </a>
                </li>
                <li className="mb-2">
                  <a href="/booking-cart" className="text-secondary text-decoration-none">
                    🛒 Rental Cart
                  </a>
                </li>
                <li className="mb-2">
                  <a href="/admin" className="text-warning text-decoration-none">
                    ⚙️ Staff / Admin Portal
                  </a>
                </li>
              </ul>
            </div>

            <div className="col-lg-4 col-md-6">
              <h6 className="fw-bold text-white mb-3">Customer Support & Hub</h6>
              <p className="small text-secondary mb-1">📍 Central Warehouse & Dispatch Hub</p>
              <p className="small text-secondary mb-1">📞 Customer Helpline: +91 98765 43210</p>
              <p className="small text-secondary mb-2">✉️ support@equiptrack.com</p>
              <span className="badge bg-success-subtle text-success border border-success-subtle px-2 py-1">
                ● 24/7 Rental & Dispatch Support
              </span>
            </div>
          </div>

          <hr className="my-4 border-secondary opacity-25" />

          <div className="d-flex flex-column flex-sm-row justify-content-between align-items-center small text-secondary">
            <p className="mb-0">
              © {new Date().getFullYear()} EquipTrack Rentals Inc. All rights reserved.
            </p>
            <div className="d-flex gap-3 mt-2 mt-sm-0">
              <span className="text-secondary">Privacy Policy</span>
              <span>•</span>
              <span className="text-secondary">Terms of Service</span>
              <span>•</span>
              <span className="text-secondary">Equipment Insurance</span>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
