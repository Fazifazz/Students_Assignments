import React from 'react';
import { NavLink, Outlet, Link } from 'react-router-dom';

// Admin / Manager Portal Layout with Nested Routes & Outlet (Session 33)
export default function AdminLayout() {
  return (
    <div className="container-fluid py-4">
      <div className="row g-4">
        {/* Admin Sidebar */}
        <aside className="col-lg-3 col-md-4">
          <div className="card shadow-sm border-0 sticky-top" style={{ top: '80px' }}>
            <div className="card-header bg-dark text-white py-3">
              <h5 className="mb-0 fw-bold d-flex align-items-center gap-2">
                🛡️ Fleet Admin Portal
              </h5>
              <small className="text-secondary">Manager Operations & Tracking</small>
            </div>
            <div className="list-group list-group-flush">
              <NavLink
                to="/admin"
                end
                className={({ isActive }) =>
                  `list-group-item list-group-item-action d-flex align-items-center gap-2 py-3 ${
                    isActive ? 'active bg-warning text-dark fw-bold border-warning' : ''
                  }`
                }
              >
                📊 Dashboard & Fleet Overview
              </NavLink>

              <NavLink
                to="/admin/rentals"
                className={({ isActive }) =>
                  `list-group-item list-group-item-action d-flex align-items-center gap-2 py-3 ${
                    isActive ? 'active bg-warning text-dark fw-bold border-warning' : ''
                  }`
                }
              >
                📋 Active Lease & Rental Tracker
              </NavLink>

              <NavLink
                to="/admin/add-equipment"
                className={({ isActive }) =>
                  `list-group-item list-group-item-action d-flex align-items-center gap-2 py-3 ${
                    isActive ? 'active bg-warning text-dark fw-bold border-warning' : ''
                  }`
                }
              >
                ➕ Register New Equipment
              </NavLink>
            </div>
            <div className="card-footer bg-light p-3">
              <Link to="/" className="btn btn-outline-secondary w-100 btn-sm">
                ← Switch to Customer Portal
              </Link>
            </div>
          </div>
        </aside>

        {/* Dynamic Nested Content swapped via <Outlet /> (Session 33) */}
        <main className="col-lg-9 col-md-8">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
