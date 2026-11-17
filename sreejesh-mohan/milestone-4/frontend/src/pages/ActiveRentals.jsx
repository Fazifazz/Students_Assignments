import React, { useState } from 'react';
import { useLocation, Link } from 'react-router-dom';
import { useFetch } from '../hooks/useFetch';
import api from '../api/axiosInstance';

export default function ActiveRentals() {
  const location = useLocation();
  const isAdmin = location.pathname.startsWith('/admin');

  const { data: rentals, loading, error, setData: setRentals } = useFetch('/rentals', []);
  const [actionLoading, setActionLoading] = useState(null);

  // Return equipment handler (Admin-only action)
  async function handleReturn(rentalId) {
    if (!window.confirm('Confirm that this tool has been physically inspected and returned to warehouse inventory?')) {
      return;
    }

    setActionLoading(rentalId);
    try {
      const res = await api.put(`/rentals/${rentalId}/return`);
      // Update UI state
      setRentals(prev =>
        prev.map(r => (r.id === rentalId ? { ...r, status: 'Returned', returnedAt: res.data.data.returnedAt } : r))
      );
    } catch (err) {
      alert(err.response?.data?.message || 'Failed to process return');
    } finally {
      setActionLoading(null);
    }
  }

  return (
    <div className="container py-5">
      {/* Dynamic Header based on Role */}
      <div className="d-flex flex-wrap justify-content-between align-items-center mb-4 gap-3">
        <div>
          <span className={`badge ${isAdmin ? 'bg-danger' : 'bg-primary'} mb-2`}>
            {isAdmin ? '🛡️ Admin Operations Portal' : '👤 Customer Portal'}
          </span>
          <h2 className="fw-bold mb-1">
            {isAdmin ? 'Warehouse Fleet Rental Tracker' : 'My Rental Orders & Bookings'}
          </h2>
          <p className="text-muted small mb-0">
            {isAdmin
              ? 'Master inventory tracker: Audit all customer rentals and verify returned machinery.'
              : 'Track your rented tools, rental dates, duration, and receipt status.'}
          </p>
        </div>

        <div className="d-flex align-items-center gap-2">
          <span className="badge bg-light text-dark border px-3 py-2 fs-6">
            Total Orders: {rentals ? rentals.length : 0}
          </span>
          {!isAdmin && (
            <Link to="/" className="btn btn-warning btn-sm fw-bold text-dark px-3">
              + Rent Another Tool
            </Link>
          )}
        </div>
      </div>

      {loading && (
        <div className="text-center py-5">
          <div className="spinner-border text-warning" role="status" />
          <p className="mt-2 text-muted small">Loading rental records...</p>
        </div>
      )}

      {error && (
        <div className="alert alert-danger" role="alert">
          {error}
        </div>
      )}

      {!loading && !error && rentals && (
        <div className="card shadow-sm border-0 rounded-3 overflow-hidden">
          <div className="table-responsive">
            <table className="table table-hover align-middle mb-0">
              <thead className="table-dark">
                <tr>
                  <th>Order #</th>
                  <th>Equipment Item</th>
                  {isAdmin && <th>Customer Info</th>}
                  <th>Start Date</th>
                  <th>Rental Duration</th>
                  <th>Total Cost</th>
                  <th>Rental Status</th>
                  <th>{isAdmin ? 'Admin Action' : 'Return Status'}</th>
                </tr>
              </thead>
              <tbody>
                {rentals.length === 0 ? (
                  <tr>
                    <td colSpan={isAdmin ? 8 : 7} className="text-center py-5 text-muted">
                      <h5>No rental bookings found</h5>
                      <p className="small mb-3">You haven't rented any tools yet.</p>
                      <Link to="/" className="btn btn-warning btn-sm fw-bold text-dark">
                        Browse Equipment Catalog
                      </Link>
                    </td>
                  </tr>
                ) : (
                  rentals.map(rental => {
                    const isActive = rental.status === 'Active';
                    return (
                      <tr key={rental.id}>
                        {/* Order ID */}
                        <td>
                          <span className="badge bg-light text-secondary border">
                            #{rental.id}
                          </span>
                        </td>

                        {/* Equipment Name */}
                        <td>
                          <strong className="text-dark d-block">{rental.equipmentName}</strong>
                          <small className="text-muted">Serial ID: {rental.equipmentId || 'EQ-0' + rental.id}</small>
                        </td>

                        {/* Customer Info (Admin Only) */}
                        {isAdmin && (
                          <td>
                            <div className="fw-semibold text-dark">{rental.customerName}</div>
                            <small className="text-muted d-block">{rental.customerPhone || 'N/A'}</small>
                            <small className="text-secondary">{rental.customerEmail || 'No email'}</small>
                          </td>
                        )}

                        {/* Start Date */}
                        <td>
                          <span className="small text-dark fw-medium">
                            {rental.startDate || 'Immediate'}
                          </span>
                        </td>

                        {/* Duration */}
                        <td>
                          <span className="badge bg-light text-dark border">
                            ⏱️ {rental.rentalDays} Day(s)
                          </span>
                        </td>

                        {/* Cost */}
                        <td>
                          <strong className="text-success fs-6">
                            ₹{rental.totalCost.toLocaleString('en-IN')}
                          </strong>
                        </td>

                        {/* Status */}
                        <td>
                          <span
                            className={`badge ${
                              isActive
                                ? 'bg-warning-subtle text-warning-emphasis border border-warning-subtle'
                                : 'bg-success-subtle text-success border border-success-subtle'
                            } px-2 py-1`}
                          >
                            {isActive ? '● Currently on Rent' : '✓ Returned & Restocked'}
                          </span>
                        </td>

                        {/* Action Column */}
                        <td>
                          {isAdmin ? (
                            // Admin can mark as returned to restore inventory
                            isActive ? (
                              <button
                                onClick={() => handleReturn(rental.id)}
                                disabled={actionLoading === rental.id}
                                className="btn btn-sm btn-outline-success fw-semibold"
                                title="Click when customer returns the tool to depot"
                              >
                                {actionLoading === rental.id ? (
                                  <>
                                    <span className="spinner-border spinner-border-sm me-1" />
                                    Updating...
                                  </>
                                ) : (
                                  'Mark Returned'
                                )}
                              </button>
                            ) : (
                              <span className="badge bg-secondary-subtle text-secondary small">
                                Inventory Restocked
                              </span>
                            )
                          ) : (
                            // Customer only sees return status (customers cannot restock inventory)
                            isActive ? (
                              <span className="small text-muted d-block">
                                In your possession
                              </span>
                            ) : (
                              <span className="small text-success fw-semibold">
                                ✓ Return Complete
                              </span>
                            )
                          )}
                        </td>
                      </tr>
                    );
                  })
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}
